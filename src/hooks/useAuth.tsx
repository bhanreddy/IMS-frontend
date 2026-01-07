import React, { createContext, useContext, useEffect, useState } from 'react';
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

    useEffect(() => {
        const unsubscribe = listenAuth((u) => {
            setUser(u);
            setLoading(false);
        });
        return () => unsubscribe();
    }, []);

    const logout = async () => {
        await AuthService.logout();
    };

    const refreshUser = async () => {
        // Optional: Implement force refresh if needed
    };

    return (
        <AuthContext.Provider value={{ user, loading, logout, refreshUser }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    return useContext(AuthContext);
}
