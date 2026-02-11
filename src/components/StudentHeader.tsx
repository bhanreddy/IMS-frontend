import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Switch, Platform, Alert } from 'react-native';
import { Ionicons, MaterialIcons, Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router'; // If navigation is needed
import { useTranslation } from 'react-i18next'; // Assuming i18n is set up based on imports in other files
import * as Haptics from 'expo-haptics';
import { SafeAreaView } from 'react-native-safe-area-context';

import MenuOverlay from './MenuOverlay';
import { SCHOOL_CONFIG } from '../constants/schoolConfig';

interface StudentHeaderProps {
    onMenuPress?: () => void;
}

const StudentHeader: React.FC<StudentHeaderProps & { showBackButton?: boolean, title?: string, showSettingsButton?: boolean }> = ({ onMenuPress, showBackButton = false, title = SCHOOL_CONFIG.name, showSettingsButton = true }) => {
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

    const handleTabPress = (tabName: string) => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        if (tabName === 'Diary') {
            router.push('/Screen/diary' as any);
        } else if (tabName === 'LMS') {
            router.push('/Screen/lms' as any);
        }
    };

    const handleBack = () => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        if (router.canGoBack()) {
            router.back();
        } else {
            router.replace('/(tabs)/home');
        }
    };

    return (
        <SafeAreaView edges={['top']} style={styles.container}>
            {/* 1. Left: Menu or Back Button */}
            {showBackButton ? (
                <TouchableOpacity onPress={handleBack} style={styles.iconButton}>
                    <Ionicons name="arrow-back" size={24} color="#1F2937" />
                </TouchableOpacity>
            ) : (
                <TouchableOpacity onPress={handleMenuPress} style={styles.iconButton}>
                    <Ionicons name="menu" size={24} color="#1F2937" />
                </TouchableOpacity>
            )}

            {/* Title (Only if provided, e.g. in sub-screens) */}
            {title && (
                <Text style={styles.headerTitle}>{title}</Text>
            )}

            {/* 2. & 3. Middle Left: Diary & LMS Tabs (Hide if back button is shown or title is present to avoid clutter, or keep if design requires) */}
            {/* Logic: If it's a sub-screen (Back button valid), usually we show Title. If Home, we show Tabs. */}
            {!showBackButton && !title && (
                <View style={styles.tabsContainer}>
                    <TouchableOpacity
                        style={styles.tabButton}
                        onPress={() => handleTabPress('Diary')}
                    >
                        <Ionicons name="book-outline" size={20} color="#4B5563" />
                        <Text style={styles.tabText}>Diary</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.tabButton}
                        onPress={() => handleTabPress('LMS')}
                    >
                        <MaterialIcons name="computer" size={20} color="#4B5563" />
                        <Text style={styles.tabText}>LMS</Text>
                    </TouchableOpacity>
                </View>
            )}

            {/* Spacer */}
            <View style={{ flex: 1 }} />

            {/* 4. Right: Language Toggle */}
            <View style={styles.languageContainer}>
                <Text style={[styles.langText, !isTelugu && styles.activeLang]}>Eng</Text>
                <Switch
                    trackColor={{ false: "#E5E7EB", true: "#E5E7EB" }}
                    thumbColor={isTelugu ? "#4F46E5" : "#4F46E5"}
                    ios_backgroundColor="#E5E7EB"
                    onValueChange={toggleLanguage}
                    value={isTelugu}
                    style={{ transform: [{ scaleX: 0.8 }, { scaleY: 0.8 }] }}
                />
                <Text style={[styles.langText, isTelugu && styles.activeLang]}>Tel</Text>
            </View>

            {/* 5. Far Right: Settings Button */}
            {showSettingsButton && (
                <TouchableOpacity
                    onPress={() => {
                        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                        router.push('/Screen/settings' as any);
                    }}
                    style={styles.iconButton}
                >
                    <Ionicons name="settings-outline" size={22} color="#1F2937" />
                </TouchableOpacity>
            )}

            <MenuOverlay visible={menuVisible} onClose={() => setMenuVisible(false)} userType="student" />
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 12,
        backgroundColor: '#FFFFFF',
        borderBottomWidth: 1,
        borderBottomColor: '#F3F4F6',
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
    },
    iconButton: {
        width: 40,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 20,
        backgroundColor: '#F9FAFB',
    },
    tabsContainer: {
        flexDirection: 'row',
        marginLeft: 12,
        gap: 12,
    },
    tabButton: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 10,
        paddingVertical: 6,
        borderRadius: 12,
        backgroundColor: '#F3F4F6',
        gap: 6,
    },
    tabText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#374151',
    },
    languageContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginRight: 8,
        gap: 4,
        backgroundColor: '#F9FAFB',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 16,
    },
    langText: {
        fontSize: 12,
        color: '#9CA3AF',
        fontWeight: '600',
    },
    activeLang: {
        color: '#4F46E5',
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: '#1F2937',
        marginLeft: 12,
    }
});

export default StudentHeader;
