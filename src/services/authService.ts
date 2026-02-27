import { supabase } from './supabaseConfig';
import { User, Role } from '../types/models';
import { api, setTokens, clearTokens, registerLogoutCallback } from './apiClient';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Alert } from 'react-native';
import { EnrollmentService } from './enrollmentService';
import { notificationManager } from './notificationManager';
import BiometricService from './biometricService';

const mapBackendRole = (roles: string[], hasStudentProfile: boolean = false, hasStaffProfile: boolean = false): Role => {
    if (roles.includes('admin')) return 'admin';
    if (roles.includes('accounts') || roles.includes('accountant')) return 'accountant';

    // Strict Profile Check
    // Only return 'staff', 'teacher', or 'driver' if they actually have a staff profile
    if (hasStaffProfile) {
        if (roles.includes('driver')) return 'driver';
        if (roles.includes('teacher')) return 'teacher';
        if (roles.includes('staff')) return 'staff';
    }

    // Only return 'student' if they explicitly have a student profile
    if (hasStudentProfile) return 'student';

    // Fallback for users with no profile (will be caught by AuthGuard)
    console.warn(`[mapBackendRole] Access Denied. Roles: ${roles}, HasStudent: ${hasStudentProfile}, HasStaff: ${hasStaffProfile}`);
    Alert.alert("Access Denied", "You do not have a valid role assigned. Please contact support.");
    throw new Error('NO_ACCESS');
};

const USER_CACHE_KEY = 'user_profile_cache';

// Module-level guard to prevent auth listeners from reviving a dead session during logout
let isLoggingOut = false;

export const listenAuth = (callback: (user: User | null) => void) => {
    return supabase.auth.onAuthStateChange(async (event, session) => {
        if (__DEV__) console.log(`[AuthService] onAuthStateChange: ${event}`);

        // STRICT GUARD: If we are effectively logging out, IGNORE any "signed in" or "token refreshed" events
        // that might be firing from pending promises or background timers.
        if (isLoggingOut) {
            if (event === 'SIGNED_OUT') {
                // Allow the sign-out event to proceed as it helps cleanup
            } else {
                if (__DEV__) console.warn('[AuthService] Ignoring auth event during logout:', event);
                return;
            }
        }

        // Sync tokens to AsyncStorage whenever Supabase updates the session (Refreshes, Login, etc.)
        if (session?.access_token && session?.refresh_token) {
            await setTokens(session.access_token, session.refresh_token);

            // Keep biometric session fresh with latest refresh token
            const biometricEnabled = await BiometricService.isBiometricEnabled();
            if (biometricEnabled) {
                const existingSession = await BiometricService.getBiometricSession();
                if (existingSession) {
                    await BiometricService.storeBiometricSession(
                        session.refresh_token,
                        existingSession.userId
                    );
                }
            }
        } else if (event === 'SIGNED_OUT') {
            console.log('[AuthService] Received SIGNED_OUT event. Clearing tokens.');
            // Prevent recursive loop by NOT calling AuthService.logout() here.
            // Just ensure local tokens are cleared so the UI reacts.
            await clearTokens();
            // Also need to clear user cache so next load doesn't show stale data
            await AsyncStorage.removeItem(USER_CACHE_KEY);
            callback(null);
            return;
        }

        if (session?.user) {
            let loadedFromCache = false;

            // 1. Try to load from cache immediately so App opens FAST
            try {
                const cachedUser = await AsyncStorage.getItem(USER_CACHE_KEY);
                if (cachedUser) {
                    callback(JSON.parse(cachedUser));
                    loadedFromCache = true;
                }
            } catch (e) {
                // Ignore cache error
            }

            // 2. Validate with Backend (Background)
            try {
                // FORCE re-validation via backend /auth/me
                const backendUser = await api.get<any>('/auth/me');

                const user: User = {
                    id: backendUser.id,
                    email: backendUser.email || session.user.email,
                    first_name: backendUser.first_name,
                    last_name: backendUser.last_name,
                    display_name: backendUser.display_name,
                    photo_url: backendUser.photo_url,
                    role: mapBackendRole(
                        backendUser.roles || [],
                        backendUser.has_student_profile,
                        backendUser.has_staff_profile
                    ),
                    roles: backendUser.roles || [],
                    permissions: backendUser.permissions || [],
                    admission_no: backendUser.admission_no,
                    has_student_profile: backendUser.has_student_profile,
                    has_staff_profile: backendUser.has_staff_profile,
                    staff_id: backendUser.staff_id,
                    class_section_id: backendUser.class_section_id,
                    classId: backendUser.class_section_id
                };

                // AUTO-ENROLLMENT CHECK
                // Only attempt auto-enrollment if the user does NOT already have a class section assigned.
                if ((user.role === 'student' || user.roles.includes('student')) && !user.class_section_id) {
                    EnrollmentService.ensureEnrollment(user.id)
                        .then(res => {
                            if (res?.status === 'created') console.log("Auto-enrolled student:", user.id);
                        })
                        .catch(err => {
                            console.error("Auto-enrollment failed for user:", user.id, err);
                        });
                }

                // Update cache
                await AsyncStorage.setItem(USER_CACHE_KEY, JSON.stringify(user));

                // Update specific callback
                if (!isLoggingOut) {
                    callback(user);
                }
            } catch (error: any) {
                if (error.message === 'NO_ACCESS') {
                    console.warn('User has no valid role, logging out.');
                    await clearTokens();
                    await supabase.auth.signOut();
                    callback(null);
                    return;
                }
                console.warn('Session validation failed (offline/server down), keeping session:', error);

                // CRITICAL CHANGE: Do NOT logout if backend is down.
                // Only logout if we have NO cache and NO backend (new login failed) 
                // but even then, if we have a valid Supabase session, we should probably stay logged in 
                // and just show a "Offline" state, unless the token is actually rejected (401).

                // If the error is 401, it means the token is invalid. THEN we logout.
                const status = error?.status || error?.statusCode || error?.response?.status;
                if (status === 401) {
                    console.warn('Invalid token detected, logging out.');
                    await clearTokens();
                    await supabase.auth.signOut();
                    callback(null);
                } else if (!loadedFromCache) {
                    // If we have no cache and backend failed, we can't authenticate the user reliably
                    // We must unblock the loader by returning null (logged out state)
                    callback(null);
                }
                // Otherwise, keep the user logged in (with cached data if available)
            }
        } else {
            callback(null);
        }
    });
};

const AuthService = {
    login: async (email: string, password: string): Promise<{ user: User }> => {
        try {
            // 1. Call Backend Login API
            const response = await api.post<any>('/auth/login', { email, password });

            // 2. Set Tokens
            if (response.token && response.refresh_token) {
                await setTokens(response.token, response.refresh_token);

                // 3. Sync with Supabase Client
                await supabase.auth.setSession({
                    access_token: response.token,
                    refresh_token: response.refresh_token,
                });
            }

            const backendUser = response.user;

            // 4. Construct User Object with strict mapping
            const user: User = {
                id: backendUser.id,
                email: backendUser.email,
                first_name: backendUser.first_name,
                last_name: backendUser.last_name,
                display_name: backendUser.display_name,
                photo_url: backendUser.photo_url,
                role: mapBackendRole(
                    backendUser.roles || [],
                    backendUser.has_student_profile,
                    backendUser.has_staff_profile
                ),
                roles: backendUser.roles || [],
                permissions: backendUser.permissions || [],
                admission_no: backendUser.admission_no,
                has_student_profile: backendUser.has_student_profile,
                has_staff_profile: backendUser.has_staff_profile,
                staff_id: backendUser.staff_id,
                class_section_id: backendUser.class_section_id,
                classId: backendUser.class_section_id
            };

            await AsyncStorage.setItem(USER_CACHE_KEY, JSON.stringify(user));

            return { user };
        } catch (error) {
            console.error("AuthService.login Error:", error);
            throw error;
        }
    },

    logout: async () => {
        if (isLoggingOut) return;
        isLoggingOut = true;

        try {
            console.log('[AuthService] Initiating Logout...');
            // Race network calls with a STRICT 500ms timeout
            await Promise.race([
                Promise.all([
                    notificationManager.unregisterPushToken().catch(() => { }),
                    api.post('/auth/logout', {}, { silent: true }).catch(() => { }),
                    // Wait for Supabase SignOut too, but don't let it hang forever
                    supabase.auth.signOut().catch((e) => console.warn('Supabase SignOut Error:', e))
                ]),
                new Promise((resolve) => setTimeout(resolve, 800))
            ]);
        } catch (e) {
            // Suppress errors
        }

        // Always Clean Local State Aggressively
        await clearTokens();

        // Clear biometric session on logout
        await BiometricService.clearBiometricSession();

        // Exhaustive Cleanup
        const keysToClear = [
            USER_CACHE_KEY,
            'supabase.auth.token',
            '@supabase.auth.token',
            'user_role',
            'user_profile',
            'auth_state',
            'loglevel:webpack-dev-server',
        ];

        try {
            await AsyncStorage.multiRemove(keysToClear);
            // Double check user cache
            await AsyncStorage.removeItem(USER_CACHE_KEY);
        } catch (e) {
            // Ignore storage errors
        } finally {
            // Small delay before allowing login again to ensure all listeners have settled
            setTimeout(() => {
                isLoggingOut = false;
            }, 1000);
        }
    },

    getCurrentUser: async (): Promise<User | null> => {
        const { data: { session } } = await supabase.auth.getSession();

        if (session?.user) {
            try {
                // Always fetch fresh profile to ensure role integrity
                const backendUser = await api.get<any>('/auth/me');

                return {
                    id: backendUser.id,
                    email: backendUser.email || session.user.email,
                    first_name: backendUser.first_name,
                    last_name: backendUser.last_name,
                    display_name: backendUser.display_name,
                    photo_url: backendUser.photo_url,
                    role: mapBackendRole(
                        backendUser.roles || [],
                        backendUser.has_student_profile,
                        backendUser.has_staff_profile
                    ),
                    roles: backendUser.roles || [],
                    permissions: backendUser.permissions || [],
                    admission_no: backendUser.admission_no,
                    has_student_profile: backendUser.has_student_profile,
                    has_staff_profile: backendUser.has_staff_profile,
                    staff_id: backendUser.staff_id,
                    class_section_id: backendUser.class_section_id,
                    classId: backendUser.class_section_id
                };

            } catch (err: any) {
                console.error("Failed to fetch fresh profile, force logging out:", err.message);
                await clearTokens();
                await supabase.auth.signOut();
                return null;
            }
        }
        return null;
    },

    changePassword: async (current_password: string, new_password: string): Promise<void> => {
        try {
            await api.post('/auth/change-password', { current_password, new_password });
        } catch (error) {
            console.error("AuthService.changePassword Error:", error);
            throw error;
        }
    }
};

export default AuthService;

// Register the logout callback to handle API 401s
registerLogoutCallback(AuthService.logout);
