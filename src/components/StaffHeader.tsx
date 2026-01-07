import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Switch, Platform } from 'react-native';
import { Feather, Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { SafeAreaView } from 'react-native-safe-area-context';

import MenuOverlay from './MenuOverlay';

interface StaffHeaderProps {
    title: string;
    subtitle?: string; // Added subtitle prop
    showMenuButton?: boolean;
    showProfileButton?: boolean;
    showBackButton?: boolean;
    onMenuPress?: () => void;
}

const StaffHeader: React.FC<StaffHeaderProps> = ({
    title,
    subtitle,
    showMenuButton = true,
    showProfileButton = true,
    showBackButton = false,
    onMenuPress
}) => {
    const router = useRouter();
    const { t, i18n } = useTranslation();
    const [isTelugu, setIsTelugu] = useState(i18n.language === 'te');
    const [menuVisible, setMenuVisible] = useState(false);

    React.useEffect(() => {
        setIsTelugu(i18n.language === 'te');
    }, [i18n.language]);

    const toggleLanguage = () => {
        const newLang = !isTelugu;
        setIsTelugu(newLang);
        i18n.changeLanguage(newLang ? 'te' : 'en');
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    };

    const handleMenuPress = () => {
        if (onMenuPress) {
            onMenuPress();
        } else {
            setMenuVisible(true);
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        }
    };

    return (
        <SafeAreaView edges={['top']} style={styles.container}>
            {/* Left: Back or Menu */}
            <View style={styles.leftContainer}>
                {showBackButton ? (
                    <TouchableOpacity
                        onPress={() => {
                            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                            if (router.canGoBack()) {
                                router.back();
                            } else {
                                router.push('/staff/dashboard' as any);
                            }
                        }}
                        style={styles.iconButton}
                    >
                        <Ionicons name="arrow-back" size={24} color="#1F2937" />
                    </TouchableOpacity>
                ) : (
                    showMenuButton && (
                        <TouchableOpacity
                            onPress={handleMenuPress}
                            style={styles.iconButton}
                        >
                            <Feather name="menu" size={24} color="#1F2937" />
                        </TouchableOpacity>
                    )
                )}
            </View>

            {/* Center: Title */}
            <View style={{ flex: 1, alignItems: 'center' }}>
                <Text style={styles.title}>{title}</Text>
                {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
            </View>

            {/* Right: Lang Toggle & Settings */}
            <View style={styles.rightContainer}>
                {/* Language Toggle */}
                <View style={styles.langToggleWrapper}>
                    <Text style={[styles.langText, !isTelugu && styles.activeLang]}>En</Text>
                    <Switch
                        trackColor={{ false: "#E5E7EB", true: "#818CF8" }}
                        thumbColor={isTelugu ? "#fff" : "#f4f3f4"}

                        onValueChange={toggleLanguage}
                        value={isTelugu}
                        style={{ transform: [{ scaleX: 0.8 }, { scaleY: 0.8 }] }}
                    />
                    <Text style={[styles.langText, isTelugu && styles.activeLang]}>Te</Text>
                </View>

                {showProfileButton && (
                    <TouchableOpacity
                        onPress={() => {
                            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                            router.push('/staff/settings' as any);
                        }}
                        style={styles.iconButton}
                    >
                        <Ionicons name="settings-outline" size={22} color="#1F2937" />
                    </TouchableOpacity>
                )}
            </View>

            <MenuOverlay visible={menuVisible} onClose={() => setMenuVisible(false)} userType="staff" />
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingBottom: 14,
        paddingTop: 10, // Small extra padding
        backgroundColor: '#FFFFFF',
        borderBottomWidth: 1,
        borderBottomColor: '#F3F4F6',
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
    },
    searchButton: {
        padding: 8,
        marginRight: 8,
    },
    langToggleWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        marginRight: 12,
        backgroundColor: '#F3F4F6',
        borderRadius: 20,
        paddingHorizontal: 8,
        paddingVertical: 4,
    },
    leftContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        minWidth: 40,
    },
    iconButton: {
        width: 40,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 20,
        backgroundColor: '#F9FAFB',
    },
    title: {
        fontSize: 18,
        fontWeight: '700',
        color: '#111827',
        flex: 1,
        textAlign: 'center',
    },
    subtitle: {
        fontSize: 12,
        color: '#6B7280',
        marginTop: 2,
    },
    rightContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    langText: {
        fontSize: 11,
        color: '#9CA3AF',
        fontWeight: '600',
    },
    activeLang: {
        color: '#4F46E5',
    },
});

export default StaffHeader;