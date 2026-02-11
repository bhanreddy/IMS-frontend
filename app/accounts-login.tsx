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
import { useTranslation } from 'react-i18next';
import { useAuth } from '@/src/hooks/useAuth'; // Import useAuth
import { SCHOOL_CONFIG } from '@/src/constants/schoolConfig';

const { width } = Dimensions.get('window');

import AuthService from '@/src/services/authService';
import { ActivityIndicator, Alert } from 'react-native';

const AccountsLoginScreen: React.FC = () => {
    const router = useRouter();
    const { t } = useTranslation();
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [showPassword, setShowPassword] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false);

    /* New Auth Check */
    const { user, loading: authLoading } = useAuth();

    // Anti-flicker: Show spinner if checking auth or already logged in
    if (authLoading || user) {
        return (
            <SafeAreaView style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
                <ActivityIndicator size="large" color="#11998e" />
            </SafeAreaView>
        );
    }

    const handleLogin = async () => {
        if (!email || !password) {
            Alert.alert('Required Fields', 'Please enter your email and password.');
            return;
        }

        setLoading(true);
        try {
            // 1. Authenticate via Backend (Implicitly fetches user + roles)
            const { user } = await AuthService.login(email, password);

            // 2. Strict Role Check: Portal-Specific Enforcement
            if (user.role === 'accountant') {
                // Success: Redirection handled by AuthGuard
                console.log("Login success, waiting for AuthGuard...");
            } else {
                // SECURITY: Unauthorized Role Entry Blocked
                Alert.alert(
                    'Unauthorized Access',
                    'This portal is restricted to Accounts Department personnel only. Your attempt has been logged.',
                    [{ text: 'OK', onPress: () => AuthService.logout() }]
                );
            }
        } catch (error: any) {
            // APIError from apiClient will already have triggered an alert if not silent
            // We just ensure the loading state is cleared and potentially log the failure
            console.error("[AccountantLogin] Authentication pipeline failed:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor="#11998e" />

            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={{ flex: 1 }}
            >
                <ScrollView contentContainerStyle={{ flexGrow: 1 }} showsVerticalScrollIndicator={false}>

                    {/* Top Header Section */}
                    <View style={styles.headerWrapper}>
                        <LinearGradient
                            colors={['#11998e', '#38ef7d']}
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
                                <Text style={styles.headerTitle}>{t('login.accounts')}</Text>

                                <View style={styles.schoolInfoContainer}>
                                    <Image source={SCHOOL_CONFIG.logo} style={styles.schoolIcon} />
                                    <Text style={styles.schoolNameText}>
                                        {SCHOOL_CONFIG.name}
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
                            <Text style={styles.subtitleText}>{t('login.signin_accounts')}</Text>
                        </Animated.View>

                        {/* Email Input */}
                        <Animated.View
                            entering={FadeInDown.delay(300).duration(600).springify()}
                            style={styles.inputWrapper}
                        >
                            <View style={styles.inputContainer}>
                                <FontAwesome5 name="user-alt" size={20} color="#888" style={styles.inputIcon} />
                                <TextInput
                                    style={styles.input}
                                    placeholder="Accountant Email"
                                    placeholderTextColor="#B0B0B0"
                                    value={email}
                                    onChangeText={setEmail}
                                    autoCapitalize="none"
                                    keyboardType="email-address"
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
                                    colors={['#1D976C', '#93F9B9']}
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
                            <Text style={styles.otherLoginsLabel}>{t('login.not_accounts')}</Text>
                            <View style={styles.otherLoginsRow}>
                                <TouchableOpacity onPress={() => router.push('/login')}>
                                    <Text style={styles.otherLoginText}>{t('login.student')}</Text>
                                </TouchableOpacity>
                                <View style={styles.loginDivider} />
                                <TouchableOpacity onPress={() => router.push('/staff-login')}>
                                    <Text style={styles.otherLoginText}>{t('login.staff')}</Text>
                                </TouchableOpacity>
                                <View style={styles.loginDivider} />
                                <TouchableOpacity onPress={() => router.push('/admin-login')}>
                                    <Text style={styles.otherLoginText}>{t('login.admin')}</Text>
                                </TouchableOpacity>
                            </View>
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
        opacity: 0.0,
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
        color: '#1D976C',
        fontWeight: '700',
        fontSize: 14,
    },
    loginButtonContainer: {
        width: '100%',
        shadowColor: '#1D976C',
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
        color: '#1D976C',
        paddingHorizontal: 10,
    },
    loginDivider: {
        width: 1,
        height: 14,
        backgroundColor: '#D1D5DB',
    },
});

export default AccountsLoginScreen;


