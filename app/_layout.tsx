import { Stack } from 'expo-router';
import { ErrorBoundary } from '../src/components/ErrorBoundary';
import '../src/i18n';
import { AuthProvider } from '../src/hooks/useAuth';
import { ThemeProvider, ThemeContext } from '../src/context/ThemeContext';
import { ThemeProvider as NavThemeProvider, DefaultTheme, DarkTheme } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import { useContext } from 'react';

import { useNotifications } from '../src/hooks/useNotifications';
import { useAuthGuard } from '../src/hooks/useAuthGuard';
import { useNotificationObserver } from '../src/hooks/useNotificationObserver';

export default function Layout() {
  // useNotifications must be inside AuthProvider

  return (
    <AuthProvider>
      <AuthGuardWrapper />
    </AuthProvider>
  );
}


function AuthGuardWrapper() {
  useAuthGuard();
  useNotifications();
  useNotificationObserver(); // Handle Deep Links

  return (
    <ThemeProvider>
      <ThemeSyncWrapper />
    </ThemeProvider>
  );
}

function ThemeSyncWrapper() {
  const { theme, isDark } = useContext(ThemeContext);

  // Convert our custom theme to React Navigation theme format
  const baseNavTheme = isDark ? DarkTheme : DefaultTheme;
  const navTheme = {
    ...baseNavTheme,
    dark: isDark,
    colors: {
      ...baseNavTheme.colors,
      primary: theme.colors.primary,
      background: theme.colors.background,
      card: theme.colors.card,
      text: theme.colors.text,
      border: theme.colors.border,
      notification: theme.colors.notification,
    },
  };

  return (
    <NavThemeProvider value={navTheme}>
      <StatusBar style={isDark ? 'light' : 'dark'} backgroundColor={theme.colors.background} />
      <ErrorBoundary>
        <Stack
          screenOptions={{
            headerShown: false,
            animation: 'slide_from_right',
            contentStyle: { backgroundColor: theme.colors.background },
          }}
        />
      </ErrorBoundary>
    </NavThemeProvider>
  );
}