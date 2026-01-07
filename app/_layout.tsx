import { Stack } from 'expo-router';
import '../src/i18n';
import { AuthProvider } from '../src/hooks/useAuth';

export default function Layout() {
  return (
    <AuthProvider>
      <Stack
        screenOptions={{
          headerShown: false, // 🔥 THIS LINE FIXES EVERYTHING
        }}
      />
    </AuthProvider>
  );
}
