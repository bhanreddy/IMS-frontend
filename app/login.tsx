import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  StatusBar,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';

import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons, FontAwesome5, MaterialIcons } from '@expo/vector-icons';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import { useTranslation } from 'react-i18next'; // 1. Import
import { useAuth } from '@/src/hooks/useAuth'; // Import useAuth
import { SCHOOL_CONFIG } from '@/src/constants/schoolConfig';

const { width } = Dimensions.get('window');

import AuthService from '@/src/services/authService';
import { ActivityIndicator, Alert } from 'react-native';

const LoginScreen: React.FC = () => {
  const router = useRouter();
  const { t } = useTranslation();
  const [loading, setLoading] = useState<boolean>(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  /* New Auth Check */
  const { user, loading: authLoading } = useAuth(); // Import useAuth hook

  // If we are checking auth or user is already logged in, show spinner to avoid flicker before redirect
  if (authLoading || user) {
    return (
      <SafeAreaView style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color="#3a1c71" />
      </SafeAreaView>
    );
  }

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please enter both email and password');
      return;
    }

    setLoading(true);
    try {
      const response = await AuthService.login(email, password);
      // userRole check is still good to keep as a secondary gate, 
      // though AuthGuard will also redirect if they land on the wrong dashboard.
      const userRole = response.user.role;

      // Strict Student Check
      if (userRole === 'student') {
        // Redirection handled by AuthGuard
        console.log("Login success, waiting for AuthGuard...");
      } else {
        // Prevent staff/admin from logging in via student portal
        Alert.alert('Access Restricted', 'This login is for students only. Please use the Staff or Admin login.');
        await AuthService.logout();
      }

    } catch (error: any) {
      console.error("Login Error Details:", error);
      Alert.alert('Login Failed', error.message || 'Invalid credentials');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#3a1c71" />

      <View style={styles.headerWrapper}>
        <LinearGradient
          colors={["#3a1c71", "#d76d77", "#ffaf7b"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.headerGradient}
        >
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <Ionicons name="arrow-back" size={24} color="#fff" />
          </TouchableOpacity>

          <View style={styles.headerContent}>
            <Text style={styles.headerTitle}>{t('login.login_to')}</Text>
            <View style={styles.schoolInfoContainer}>
              <Image source={SCHOOL_CONFIG.logo} style={styles.schoolIcon} />
              <Text style={styles.schoolNameText}>
                {SCHOOL_CONFIG.name}
              </Text>
            </View>
          </View>
        </LinearGradient>
      </View>

      <View style={styles.formContainer}>
        <Text style={styles.welcomeBackText}>Welcome Back</Text>
        <Text style={styles.subtitleText}>Sign in to your account</Text>

        <View style={styles.inputWrapper}>
          <View style={styles.inputContainer}>
            <Ionicons name="mail-outline" size={20} color="#666" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Email Address"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              placeholderTextColor="#999"
            />
          </View>
        </View>

        <View style={styles.inputWrapper}>
          <View style={styles.inputContainer}>
            <Ionicons name="lock-closed-outline" size={20} color="#666" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              placeholderTextColor="#999"
            />
          </View>
        </View>

        <TouchableOpacity
          style={[styles.loginButton, { backgroundColor: '#3a1c71' }]}
          onPress={handleLogin}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#FFF" />
          ) : (
            <Text style={styles.loginButtonText}>Sign In</Text>
          )}
        </TouchableOpacity>

      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  /* Header Styles */
  headerWrapper: {
    height: 320,
    position: 'relative',
    marginBottom: 20,
  },
  headerGradient: {
    flex: 1,
    paddingTop: 10,
    paddingHorizontal: 24,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  backButton: {
    marginTop: 10,
    alignSelf: 'flex-start',
    padding: 8,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
  headerContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 0,
    paddingBottom: 40,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: 'rgba(255,255,255,0.9)',
    marginBottom: 30,
    letterSpacing: 1,
  },
  schoolInfoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.15)',
    paddingVertical: 15,
    paddingHorizontal: 25,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  schoolIcon: {
    width: 60,
    height: 60,
    marginRight: 15,
    resizeMode: 'contain',
  },
  schoolNameText: {
    fontSize: 20,
    fontWeight: '800',
    color: '#fff',
    textAlign: 'left',
    lineHeight: 26,
    textShadowColor: 'rgba(0,0,0,0.1)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  headerCurve: {
    position: 'absolute',
    bottom: -1,
    left: 0,
    right: 0,
    height: 30,
    backgroundColor: '#fff',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    opacity: 0.0, // Hidden for now, can be enabled for a different style
  },

  /* Form Styles */
  formContainer: {
    paddingHorizontal: 30,
    paddingTop: 10,
    paddingBottom: 40,
  },
  welcomeBackText: {
    fontSize: 28,
    fontWeight: '800',
    color: '#333',
    marginBottom: 5,
  },
  subtitleText: {
    fontSize: 16,
    color: '#666',
    marginBottom: 30,
  },
  inputWrapper: {
    marginBottom: 20,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    height: 60,
    paddingHorizontal: 20,
  },
  inputIcon: {
    marginRight: 15,
  },
  input: {
    flex: 1,
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
  },
  forgotPasswordContainer: {
    alignSelf: 'flex-end',
    marginBottom: 40,
  },
  forgotPasswordText: {
    color: '#4F46E5',
    fontWeight: '700',
    fontSize: 14,
  },
  loginButtonContainer: {
    width: '100%',
    shadowColor: '#FF512F',
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 8,
  },
  loginButton: {
    width: '100%',
    height: 60,
    borderRadius: 16,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loginButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '800',
    letterSpacing: 1,
  },
  otherLoginsContainer: {
    marginTop: 30,
    alignItems: 'center',
  },
  otherLoginsLabel: {
    fontSize: 14,
    color: '#9CA3AF',
    marginBottom: 10,
  },
  otherLoginsRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  otherLoginText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#4F46E5',
    paddingHorizontal: 10,
  },
  loginDivider: {
    width: 1,
    height: 14,
    backgroundColor: '#D1D5DB',
  },
});

export default LoginScreen;


