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

const { width } = Dimensions.get('window');

import AuthService from '../src/services/authService';
import { ActivityIndicator, Alert } from 'react-native';

const LoginScreen: React.FC = () => {
  const router = useRouter();
  const { t } = useTranslation();
  const [id, setId] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  const handleLogin = async () => {
    if (!id || !password) {
      Alert.alert('Error', t('login.enter_id') + ' & ' + t('login.enter_pass'));
      return;
    }

    setLoading(true);
    try {
      const response = await AuthService.login(id, password);
      const userRole = response.user.role;

      // RBAC Redirection
      if (userRole === 'student') {
        router.replace('/(tabs)/home');
      } else if (userRole === 'staff' || userRole === 'teacher') {
        // Prevent staff from logging in via student login if stricter separation is desired, 
        // but for now we allow redirection or guide them.
        // Let's redirect them to their dashboard if they happen to use this screen.
        router.replace('/staff/dashboard');
      } else if (userRole === 'admin') {
        router.replace('/admin/dashboard');
      } else if (userRole === 'accountant') {
        router.replace('/accounts/dashboard');
      } else {
        // Fallback
        router.replace('/(tabs)/home');
      }

    } catch (error: any) {
      Alert.alert('Login Failed', error.message || 'Invalid credentials');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#3a1c71" />

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView contentContainerStyle={{ flexGrow: 1 }} showsVerticalScrollIndicator={false}>

          {/* Top Header Section */}
          <View style={styles.headerWrapper}>
            <LinearGradient
              colors={["#3a1c71", "#d76d77", "#ffaf7b"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.headerGradient}
            >

              {/* Back Button */}
              <TouchableOpacity
                style={styles.backButton}
                onPress={() => router.back()}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              >
                <Ionicons name="arrow-back" size={28} color="#fff" />
              </TouchableOpacity>

              <View style={styles.headerContent}>
                <Text style={styles.headerTitle}>{t('login.login_to')}</Text>

                <View style={styles.schoolInfoContainer}>
                  {/* Placeholder for the student icon */}
                  <Image
                    source={{ uri: 'https://cdn-icons-png.flaticon.com/512/5850/5850276.png' }}
                    style={styles.schoolIcon}
                    resizeMode="contain"
                  />
                  <Text style={styles.schoolNameText}>
                    {t('common.school_name').replace("\n", "\n")}
                  </Text>
                </View>
              </View>
            </LinearGradient>

            {/* Decorative white curve at the bottom of header */}
            <View style={styles.headerCurve} />
          </View>

          {/* Form Section */}
          <View style={styles.formContainer}>

            <Animated.View entering={FadeInDown.delay(200).duration(600).springify()}>
              <Text style={styles.welcomeBackText}>{t('login.welcome_back')}</Text>
              <Text style={styles.subtitleText}>{t('login.signin_continue')}</Text>
            </Animated.View>

            {/* ID Input */}
            <Animated.View
              entering={FadeInDown.delay(300).duration(600).springify()}
              style={styles.inputWrapper}
            >
              <View style={styles.inputContainer}>
                <FontAwesome5 name="user-alt" size={20} color="#888" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder={t('login.enter_id')}
                  placeholderTextColor="#B0B0B0"
                  value={id}
                  onChangeText={setId}
                  autoCapitalize="none"
                />
              </View>
            </Animated.View>

            {/* Password Input */}
            <Animated.View
              entering={FadeInDown.delay(400).duration(600).springify()}
              style={styles.inputWrapper}
            >
              <View style={styles.inputContainer}>
                <MaterialIcons name="lock" size={24} color="#888" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder={t('login.enter_pass')}
                  placeholderTextColor="#B0B0B0"
                  secureTextEntry={!showPassword}
                  value={password}
                  onChangeText={setPassword}
                />
                <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                  <Ionicons name={showPassword ? "eye-off" : "eye"} size={22} color="#888" />
                </TouchableOpacity>
              </View>
            </Animated.View>

            {/* Forgot Password Link */}
            <Animated.View entering={FadeInDown.delay(500).duration(600)}>
              <TouchableOpacity
                style={styles.forgotPasswordContainer}
                onPress={() => router.push('/forgot-password')}
              >
                <Text style={styles.forgotPasswordText}>{t('login.forgot_pass')}</Text>
              </TouchableOpacity>
            </Animated.View>

            {/* Login Button */}
            <Animated.View entering={FadeInUp.delay(600).springify()}>
              <TouchableOpacity
                style={styles.loginButtonContainer}
                activeOpacity={0.8}
                onPress={handleLogin}
                disabled={loading}
              >
                <LinearGradient
                  colors={['#FF512F', '#DD2476']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.loginButton}
                >
                  {loading ? (
                    <ActivityIndicator color="#fff" />
                  ) : (
                    <>
                      <Text style={styles.loginButtonText}>{t('login.login_btn')}</Text>
                      <Ionicons name="arrow-forward" size={24} color="#fff" style={{ marginLeft: 10 }} />
                    </>
                  )}
                </LinearGradient>
              </TouchableOpacity>
            </Animated.View>

            {/* Other Logins */}
            <Animated.View entering={FadeInUp.delay(800).springify()} style={styles.otherLoginsContainer}>
              <Text style={styles.otherLoginsLabel}>{t('login.not_student')}</Text>
              <View style={styles.otherLoginsRow}>
                <TouchableOpacity onPress={() => router.push('/staff-login')}>
                  <Text style={styles.otherLoginText}>{t('login.staff')}</Text>
                </TouchableOpacity>
                <View style={styles.loginDivider} />
                <TouchableOpacity onPress={() => router.push('/admin-login')}>
                  <Text style={styles.otherLoginText}>{t('login.admin')}</Text>
                </TouchableOpacity>
                <View style={styles.loginDivider} />
                <TouchableOpacity onPress={() => router.push('/accounts-login')}>
                  <Text style={styles.otherLoginText}>{t('login.accounts')}</Text>
                </TouchableOpacity>
              </View>

              {/* dev login bypass */}
              <TouchableOpacity
                onPress={() => {
                  setId('test@example.com');
                  setPassword('password123');
                  setTimeout(() => handleLogin(), 100);
                }}
                style={{ marginTop: 20, padding: 10, backgroundColor: '#eee', borderRadius: 8, alignItems: 'center' }}
              >
                <Text style={{ fontSize: 12, color: '#555' }}>[Dev: Mock Student Login]</Text>
              </TouchableOpacity>

            </Animated.View>

          </View>
        </ScrollView>
      </KeyboardAvoidingView>
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
    alignItems: 'center',
    marginTop: 20,
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
