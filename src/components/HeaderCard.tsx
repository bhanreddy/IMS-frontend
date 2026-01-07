import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Image, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import Animated, {
    FadeInDown,
    useSharedValue,
    useAnimatedStyle,
    withRepeat,
    withTiming,
    Easing,
} from 'react-native-reanimated';
import { BlurView } from 'expo-blur';

interface HeaderCardProps {
    schoolName: string;
    studentName: string;
    classSec: string;
    rollNo: string;
}

const { width } = Dimensions.get('window');

const HeaderCard: React.FC<HeaderCardProps> = ({
    schoolName,
    studentName,
    classSec,
    rollNo,
}) => {
    /* ---------------- Animations ---------------- */
    const shimmerX = useSharedValue(-width);
    const pulse = useSharedValue(1);

    useEffect(() => {
        shimmerX.value = withRepeat(
            withTiming(width * 1.5, {
                duration: 2800,
                easing: Easing.linear,
            }),
            -1,
            false
        );

        pulse.value = withRepeat(
            withTiming(1.6, {
                duration: 1400,
                easing: Easing.out(Easing.ease),
            }),
            -1,
            true
        );
    }, []);

    const shimmerStyle = useAnimatedStyle(() => ({
        transform: [{ translateX: shimmerX.value }],
    }));

    const pulseStyle = useAnimatedStyle(() => ({
        transform: [{ scale: pulse.value }],
        opacity: 0.25,
    }));

    /* ---------------- UI ---------------- */
    return (
        <Animated.View
            entering={FadeInDown.duration(700).springify()}
            style={styles.wrapper}
        >
            {/* Ambient Luxury Glows */}
            <View style={styles.glowBlue} />
            <View style={styles.glowViolet} />

            <LinearGradient
                colors={['#654ea3', '#eaafc8']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.card}
            >
                {/* Glass Blur */}
                <BlurView intensity={30} tint="dark" style={StyleSheet.absoluteFill} />

                {/* Inner Border */}
                <View style={styles.innerBorder} />

                {/* Glossy Top Reflection */}
                <LinearGradient
                    colors={[
                        'rgba(255,255,255,0.35)',
                        'rgba(255,255,255,0.12)',
                        'transparent',
                    ]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 0, y: 1 }}
                    style={styles.glossHighlight}
                />

                {/* Shimmer */}
                <Animated.View style={[styles.shimmer, shimmerStyle]}>
                    <LinearGradient
                        colors={[
                            'transparent',
                            'rgba(255,255,255,0.06)',
                            'rgba(255,255,255,0.15)',
                            'rgba(255,255,255,0.06)',
                            'transparent',
                        ]}
                        start={{ x: 0, y: 0.5 }}
                        end={{ x: 1, y: 0.5 }}
                        style={{ flex: 1 }}
                    />
                </Animated.View>

                {/* School Badge */}
                <View style={styles.schoolBadge}>
                    <Ionicons name="school-outline" size={18} color="#c7d2fe" />
                    <Text style={styles.schoolName} numberOfLines={1}>
                        {schoolName}
                    </Text>
                </View>

                {/* Content */}
                <View style={styles.content}>
                    {/* Avatar */}
                    <View style={styles.avatarWrap}>
                        <LinearGradient
                            colors={['#60a5fa', '#a78bfa']}
                            style={styles.avatarBorder}
                        >
                            <Image
                                source={{
                                    uri: 'https://cdn-icons-png.flaticon.com/512/4333/4333609.png',
                                }}
                                style={styles.avatar}
                            />
                        </LinearGradient>

                        {/* Status */}
                        <View style={styles.status}>
                            <Animated.View style={[styles.statusPulse, pulseStyle]} />
                            <View style={styles.statusDot} />
                        </View>
                    </View>

                    {/* Student Info */}
                    <View style={styles.info}>
                        <Text style={styles.studentName} numberOfLines={1}>
                            {studentName}
                        </Text>

                        <View style={styles.metaRow}>
                            <View style={styles.metaItem}>
                                <Ionicons name="layers-outline" size={14} color="#93c5fd" />
                                <Text style={styles.metaText}>{classSec}</Text>
                            </View>

                            <View style={styles.divider} />

                            <View style={styles.metaItem}>
                                <Ionicons name="id-card-outline" size={14} color="#c4b5fd" />
                                <Text style={styles.metaText}>Roll {rollNo}</Text>
                            </View>
                        </View>
                    </View>
                </View>
            </LinearGradient>
        </Animated.View>
    );
};

export default HeaderCard;

/* ===================== STYLES ===================== */

const styles = StyleSheet.create({
    wrapper: {
        marginHorizontal: 20,
        marginTop: 18,
    },

    /* Glows */
    glowBlue: {
        position: 'absolute',
        top: -60,
        left: -50,
        width: 200,
        height: 200,
        borderRadius: 100,
        backgroundColor: '#4b6cb7',
        opacity: 0.22,
    },

    glowViolet: {
        position: 'absolute',
        bottom: -60,
        right: -50,
        width: 180,
        height: 180,
        borderRadius: 90,
        backgroundColor: '#8e9eab',
        opacity: 0.18,
    },

    /* Card */
    card: {
        borderRadius: 28,
        padding: 22,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.12)',

        shadowColor: '#000',
        shadowOffset: { width: 0, height: 18 },
        shadowOpacity: 0.35,
        shadowRadius: 30,
        elevation: 18,
    },

    innerBorder: {
        ...StyleSheet.absoluteFillObject,
        borderRadius: 28,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.18)',
    },

    glossHighlight: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: '45%',
        borderTopLeftRadius: 28,
        borderTopRightRadius: 28,
    },

    shimmer: {
        ...StyleSheet.absoluteFillObject,
        transform: [{ skewX: '-20deg' }],
    },

    /* School Badge */
    schoolBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        backgroundColor: 'rgba(255,255,255,0.08)',
        alignSelf: 'flex-start',
        paddingHorizontal: 14,
        paddingVertical: 6,
        borderRadius: 20,
        marginBottom: 18,
    },

    schoolName: {
        color: '#f8fafc',
        fontWeight: '700',
        fontSize: 14,
        maxWidth: width * 0.6,
    },

    /* Content */
    content: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 18,
    },

    avatarWrap: {
        position: 'relative',
    },

    avatarBorder: {
        width: 78,
        height: 78,
        borderRadius: 26,
        padding: 3,
    },

    avatar: {
        width: '100%',
        height: '100%',
        borderRadius: 22,
        backgroundColor: '#020617',
    },

    status: {
        position: 'absolute',
        bottom: -2,
        right: -2,
        width: 18,
        height: 18,
        justifyContent: 'center',
        alignItems: 'center',
    },

    statusPulse: {
        position: 'absolute',
        width: 22,
        height: 22,
        borderRadius: 11,
        backgroundColor: '#22c55e',
    },

    statusDot: {
        width: 12,
        height: 12,
        borderRadius: 6,
        backgroundColor: '#22c55e',
        borderWidth: 2,
        borderColor: '#020617',
    },

    info: {
        flex: 1,
    },

    studentName: {
        color: '#ffffff',
        fontSize: 22,
        fontWeight: '800',
        marginBottom: 10,
    },

    metaRow: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(255,255,255,0.07)',
        borderRadius: 14,
        paddingVertical: 8,
        paddingHorizontal: 12,
    },

    metaItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },

    metaText: {
        color: '#f1f5f9',
        fontWeight: '600',
        fontSize: 13,
    },

    divider: {
        width: 1,
        height: 16,
        backgroundColor: 'rgba(255,255,255,0.2)',
        marginHorizontal: 14,
    },
});
