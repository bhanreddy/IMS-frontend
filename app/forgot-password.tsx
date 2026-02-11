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

const { width } = Dimensions.get('window');

const ForgotPasswordScreen: React.FC = () => {
    const router = useRouter();
    const [email, setEmail] = useState<string>('');

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
                                <View style={styles.iconCircle}>
                                    <MaterialIcons name="lock-reset" size={50} color="#3a1c71" />
                                </View>
                                <Text style={styles.headerTitle}>Forgot Password?</Text>
                            </View>
                        </LinearGradient>

                        {/* Decorative white curve at the bottom of header */}
                        <View style={styles.headerCurve} />
                    </View>

                    {/* Form Section */}
                    <View style={styles.formContainer}>

                        <Animated.View entering={FadeInDown.delay(200).duration(600).springify()}>
                            <Text style={styles.subtitleText}>
                                Don't worry! It happens. Please enter your ID or Email associated with your account.
                            </Text>
                        </Animated.View>

                        {/* ID/Email Input */}
                        <Animated.View
                            entering={FadeInDown.delay(300).duration(600).springify()}
                            style={styles.inputWrapper}
                        >
                            <View style={styles.inputContainer}>
                                <MaterialIcons name="alternate-email" size={22} color="#888" style={styles.inputIcon} />
                                <TextInput
                                    style={styles.input}
                                    placeholder="Enter ID or Email"
                                    placeholderTextColor="#B0B0B0"
                                    value={email}
                                    onChangeText={setEmail}
                                    autoCapitalize="none"
                                    keyboardType="email-address"
                                />
                            </View>
                        </Animated.View>

                        {/* Reset Button */}
                        <Animated.View entering={FadeInUp.delay(400).springify()}>
                            <TouchableOpacity
                                style={styles.loginButtonContainer}
                                activeOpacity={0.8}
                                onPress={() => {
                                    // Handle reset logic here
                                    alert('Reset link sent!');
                                }}
                            >
                                <LinearGradient
                                    colors={['#FF512F', '#DD2476']}
                                    start={{ x: 0, y: 0 }}
                                    end={{ x: 1, y: 0 }}
                                    style={styles.loginButton}
                                >
                                    <Text style={styles.loginButtonText}>SEND RESET LINK</Text>
                                    <Ionicons name="mail-outline" size={22} color="#fff" style={{ marginLeft: 10 }} />
                                </LinearGradient>
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
        height: 300,
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
        justifyContent: 'center',
        marginTop: 10,
        flex: 1,
        marginBottom: 40,
    },
    iconCircle: {
        width: 90,
        height: 90,
        borderRadius: 45,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 16,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 5,
    },
    headerTitle: {
        fontSize: 26,
        fontWeight: '800',
        color: '#fff',
        letterSpacing: 0.5,
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
    },

    /* Form Styles */
    formContainer: {
        paddingHorizontal: 30,
        paddingTop: 10,
        paddingBottom: 40,
    },
    subtitleText: {
        fontSize: 16,
        color: '#666',
        textAlign: 'center',
        marginBottom: 40,
        lineHeight: 24,
        paddingHorizontal: 10,
    },
    inputWrapper: {
        marginBottom: 30,
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
        fontSize: 16,
        fontWeight: '800',
        letterSpacing: 1,
    },
});

export default ForgotPasswordScreen;


