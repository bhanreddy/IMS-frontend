import React, { createContext, useContext, useEffect, useState } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import AuthService, { listenAuth } from '../services/authService';
import { User } from '../types/models';

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
    refreshUser: async () => { }, // No-op for now unless we implement re-fetch
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        // Dev-only logger for observability
        if (__DEV__) {
            console.log(`[AuthProvider] State Change: Loading=${loading}, User=${user ? user.id : 'null'}`);
        }

        const { data: { subscription } } = listenAuth((u) => {
            if (__DEV__) console.log(`[AuthProvider] listenAuth callback triggered. User: ${u ? 'Yes' : 'No'}`);
            setUser(u);
            setLoading(false);
        });

        // SAFETY NET: Soft timeout to prevent infinite loading
        // If auth takes longer than 5 seconds, we force it to resolve (likely offline/error)
        const safetyTimeout = setTimeout(() => {
            setLoading((currentLoading) => {
                if (currentLoading) {
                    if (__DEV__) console.warn("[AuthProvider] Safety timeout triggered. forcing loading=false");
                    return false;
                }
                return currentLoading;
            });
        }, 5000);

        return () => {
            subscription.unsubscribe();
            clearTimeout(safetyTimeout);
        };
    }, []);

    const logout = async () => {
        // 1. Immediate State Update (UI Feedback)
        setUser(null);
        setLoading(false);

        // 2. Background Cleanup
        // We do NOT await this to block the UI.
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
