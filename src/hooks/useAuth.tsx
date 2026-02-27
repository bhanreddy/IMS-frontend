import React, { createContext, useContext, useEffect, useState, useRef } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import AuthService, { listenAuth } from '../services/authService';
import BiometricService from '../services/biometricService';
import { supabase } from '../services/supabaseConfig';
import { User } from '../types/models';

const MAX_BIOMETRIC_ATTEMPTS = 3;

interface AuthContextType {
    user: User | null;
    loading: boolean;
    logout: () => Promise<void>;
    refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
    user: null,
    loading: true,
    logout: async () => { },
    refreshUser: async () => { },
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();
    const biometricAttempted = useRef(false);

    useEffect(() => {
        if (__DEV__) {
            console.log(`[AuthProvider] State Change: Loading=${loading}, User=${user ? user.id : 'null'}`);
        }

        const { data: { subscription } } = listenAuth((u) => {
            if (__DEV__) console.log(`[AuthProvider] listenAuth callback triggered. User: ${u ? 'Yes' : 'No'}`);
            setUser(u);
            setLoading(false);
        });

        // Attempt biometric login on app launch (runs once)
        attemptBiometricLogin();

        // SAFETY NET: Extended timeout to account for biometric prompt
        const safetyTimeout = setTimeout(() => {
            setLoading((currentLoading) => {
                if (currentLoading) {
                    if (__DEV__) console.warn("[AuthProvider] Safety timeout triggered. forcing loading=false");
                    return false;
                }
                return currentLoading;
            });
        }, 10000); // Extended from 5s to 10s to accommodate biometric prompt

        return () => {
            subscription.unsubscribe();
            clearTimeout(safetyTimeout);
        };
    }, []);

    /**
     * Attempt biometric login on app launch.
     *
     * Flow:
     * 1. Check if biometric is enabled in SecureStore
     * 2. Retrieve stored refresh_token + user_id
     * 3. Verify device still has enrolled biometrics
     * 4. Prompt biometric (max 3 attempts)
     * 5. On success: restore Supabase session → triggers onAuthStateChange → normal flow
     * 6. On failure: clear biometric data, fall back to manual login
     */
    const attemptBiometricLogin = async () => {
        // Prevent re-prompt during same session
        if (biometricAttempted.current) return;
        biometricAttempted.current = true;

        try {
            // 1. Is biometric enabled?
            const enabled = await BiometricService.isBiometricEnabled();
            if (!enabled) {
                if (__DEV__) console.log('[AuthProvider] Biometric not enabled, skipping.');
                return;
            }

            // 2. Get stored session
            const session = await BiometricService.getBiometricSession();
            if (!session) {
                if (__DEV__) console.log('[AuthProvider] No stored biometric session.');
                await BiometricService.clearBiometricSession();
                return;
            }

            // 3. Check device biometrics still available
            const available = await BiometricService.isBiometricAvailable();
            if (!available) {
                if (__DEV__) console.warn('[AuthProvider] Biometrics no longer available on device.');
                await BiometricService.clearBiometricSession();
                return;
            }

            // 4. Prompt biometric (up to 3 attempts)
            let authenticated = false;
            for (let attempt = 1; attempt <= MAX_BIOMETRIC_ATTEMPTS; attempt++) {
                if (__DEV__) console.log(`[AuthProvider] Biometric attempt ${attempt}/${MAX_BIOMETRIC_ATTEMPTS}`);

                const result = await BiometricService.promptBiometric(
                    'Unlock with biometrics to continue'
                );

                if (result.success) {
                    authenticated = true;
                    break;
                }

                // If user cancelled (not a failed scan), don't retry
                if (result.error === 'user_cancel' || result.error === 'system_cancel' || result.error === 'app_cancel') {
                    if (__DEV__) console.log('[AuthProvider] Biometric cancelled by user.');
                    break;
                }

                if (__DEV__) console.warn(`[AuthProvider] Biometric attempt ${attempt} failed:`, result.error);
            }

            if (!authenticated) {
                if (__DEV__) console.log('[AuthProvider] Biometric authentication failed. Falling back to manual login.');
                // Don't clear the session — user might try again next launch
                // Just let the normal auth flow show login screen
                return;
            }

            // 5. Restore Supabase session using stored refresh token
            if (__DEV__) console.log('[AuthProvider] Biometric success! Restoring session...');

            const { error } = await supabase.auth.setSession({
                access_token: '', // Will be refreshed automatically
                refresh_token: session.refreshToken,
            });

            if (error) {
                console.error('[AuthProvider] Session restoration failed:', error.message);
                // Token expired or invalidated — clear biometric data
                await BiometricService.clearBiometricSession();
                return;
            }

            // Session restored → onAuthStateChange will fire → normal flow continues
            if (__DEV__) console.log('[AuthProvider] Session restored via biometric.');

        } catch (error) {
            console.error('[AuthProvider] Biometric login error:', error);
            // Non-fatal: fall through to normal auth flow
        }
    };

    const logout = async () => {
        // 1. Immediate State Update (UI Feedback)
        setUser(null);
        setLoading(false);

        // 2. Background Cleanup (includes biometric session clearing)
        AuthService.logout().catch(err => {
            console.warn("Background logout error:", err);
        });
    };

    const refreshUser = async () => {
        // Optional: Implement force refresh if needed
    };

    if (loading) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff' }}>
                <ActivityIndicator size="large" color="#4F46E5" />
            </View>
        );
    }

    return (
        <AuthContext.Provider value={{ user, loading, logout, refreshUser }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    return useContext(AuthContext);
}
