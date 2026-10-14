import { ViewStyle } from "react-native";

export const ADMIN_THEME = {
    colors: {
        primary: '#D42B2B', // Logo red ring
        secondary: '#1B5E20', // Logo tree green
        success: '#2E7D32', // Forest green (logo-adjacent)
        warning: '#F59E0B', // Amber
        danger: '#C62828', // Deep red
        info: '#1565C0', // Logo blue ribbon
        background: {
            app: '#FFF8F0', // Warm cream
            surface: '#FFFFFF',
            subtle: '#FFF5EB', // Warm subtle
        },
        text: {
            primary: '#2D2D2D', // Logo near-black
            secondary: '#5D4037', // Warm brown
            muted: '#8D6E63', // Muted brown
            inverse: '#FFFFFF',
        },
        border: '#E8D5B7', // Warm beige
        icon: '#5D4037',
    },
    spacing: {
        xs: 4,
        s: 8,
        m: 16,
        l: 24,
        xl: 32,
        xxl: 48,
    },
    borderRadius: {
        s: 8,
        m: 12,
        l: 16,
        xl: 24,
        full: 9999,
    },
    shadows: {
        sm: {
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 1 },
            shadowOpacity: 0.05,
            shadowRadius: 2,
            elevation: 2,
        } as ViewStyle,
        md: {
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.06,
            shadowRadius: 8,
            elevation: 4,
        } as ViewStyle,
        lg: {
            shadowColor: "#D42B2B", // Colored shadow for emphasis (logo red)
            shadowOffset: { width: 0, height: 10 },
            shadowOpacity: 0.15,
            shadowRadius: 20,
            elevation: 10,
        } as ViewStyle,
        none: {
            shadowColor: "transparent",
            shadowOffset: { width: 0, height: 0 },
            shadowOpacity: 0,
            shadowRadius: 0,
            elevation: 0,
        } as ViewStyle,
    },
    typography: {
        size: {
            xs: 12,
            s: 14,
            m: 16,
            l: 18,
            xl: 20,
            xxl: 24,
            xxxl: 30,
        },
        weight: {
            regular: '400',
            medium: '500',
            semibold: '600',
            bold: '700',
        } as const,
    }
};
