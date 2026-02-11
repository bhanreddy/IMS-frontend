import { Stack } from 'expo-router';
import { ErrorBoundary } from '../src/components/ErrorBoundary';
import '../src/i18n';
import { AuthProvider } from '../src/hooks/useAuth';
import { ThemeProvider } from '../src/context/ThemeContext';

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
      <ErrorBoundary>
        <Stack
          screenOptions={{
            headerShown: false,
          }}
        />
      </ErrorBoundary>
    </ThemeProvider>
  );
}