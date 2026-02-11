export const lightTheme = {
    dark: false,
    colors: {
        primary: '#2563EB',
        background: '#FFFFFF',
        card: '#F5F5F5',
        text: '#000000',
        border: '#E0E0E0',
        notification: '#FF3B30',
        textSecondary: '#6B7280',
        danger: '#EF4444',
        success: '#10B981',
        warning: '#F59E0B',
    },
};

export const darkTheme = {
    dark: true,
    colors: {
        primary: '#3B82F6',
        background: '#0F172A',
        card: '#020617',
        text: '#E5E7EB',
        border: '#1E293B',
        notification: '#FF453A',
        textSecondary: '#9CA3AF',
        danger: '#F87171',
        success: '#34D399',
        warning: '#FBBF24',
    },
};

export type Theme = typeof lightTheme;
