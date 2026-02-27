import React, { useEffect, useState, useCallback } from 'react';
import {
    View,
    Text,
    StyleSheet,
    Modal,
    TouchableOpacity,
    TouchableWithoutFeedback,
} from 'react-native';
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withSpring,
    withTiming,
    interpolate,
    Extrapolation,
    runOnJS,
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';

interface Props {
    visible: boolean;
    onCancel: () => void;
    onConfirm: () => void;
}

const LogoutConfirmModal: React.FC<Props> = ({
    visible,
    onCancel,
    onConfirm,
}) => {
    // Local state to keep Modal mounted while animation runs
    const [isMounted, setIsMounted] = useState(visible);

    // 0 = closed, 1 = open
    const progress = useSharedValue(0);

    const closeAnimations = useCallback((callback?: () => void) => {
        progress.value = withTiming(0, { duration: 250 }, (finished) => {
            if (finished) {
                runOnJS(setIsMounted)(false);
                if (callback) runOnJS(callback)();
            }
        });
    }, [progress]);

    useEffect(() => {
        if (visible) {
            setIsMounted(true);
            progress.value = withSpring(1, { damping: 15, stiffness: 200, mass: 0.8 });
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        } else if (isMounted) {
            closeAnimations();
        }
    }, [visible]);

    const handleCancel = () => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        closeAnimations(onCancel);
    };

    const handleConfirm = () => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        closeAnimations(onConfirm);
    };

    const backdropStyle = useAnimatedStyle(() => ({
        opacity: interpolate(progress.value, [0, 1], [0, 1], Extrapolation.CLAMP),
    }));

    const modalStyle = useAnimatedStyle(() => ({
        transform: [
            { translateY: interpolate(progress.value, [0, 1], [200, 0], Extrapolation.CLAMP) },
            { scale: interpolate(progress.value, [0, 1], [0.95, 1], Extrapolation.CLAMP) }
        ],
        opacity: interpolate(progress.value, [0, 0.5, 1], [0, 0.5, 1], Extrapolation.CLAMP),
    }));

    if (!isMounted) return null;

    return (
        <Modal
            transparent
            visible={isMounted}
            animationType="none"
            onRequestClose={handleCancel}
        >
            <View style={styles.container}>
                <TouchableWithoutFeedback onPress={handleCancel}>
                    <Animated.View style={[styles.overlay, backdropStyle]} />
                </TouchableWithoutFeedback>

                <Animated.View style={[styles.box, modalStyle]}>
                    <Text style={styles.title}>
                        Do You Really Want to Log Out?
                    </Text>

                    <View style={styles.buttonRow}>
                        <TouchableOpacity
                            style={[styles.button, styles.noButton]}
                            onPress={handleCancel}
                            activeOpacity={0.7}
                        >
                            <Text style={styles.noText}>NO</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={[styles.button, styles.yesButton]}
                            onPress={handleConfirm}
                            activeOpacity={0.7}
                        >
                            <Text style={styles.yesText}>Yes</Text>
                        </TouchableOpacity>
                    </View>
                </Animated.View>
            </View>
        </Modal>
    );
};

export default LogoutConfirmModal;

/* ============================ STYLES ============================ */

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    overlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0,0,0,0.4)',
    },
    box: {
        width: '85%',
        backgroundColor: '#FFFFFF',
        borderRadius: 20,
        paddingVertical: 28,
        paddingHorizontal: 20,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.15,
        shadowRadius: 20,
        elevation: 10,
    },
    title: {
        fontSize: 18,
        fontWeight: '700',
        textAlign: 'center',
        marginBottom: 28,
        color: '#1F2937',
    },
    buttonRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
        paddingHorizontal: 10,
        gap: 16,
    },
    button: {
        flex: 1,
        paddingVertical: 12,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
    },
    noButton: {
        backgroundColor: '#F3F4F6',
        borderWidth: 1,
        borderColor: '#E5E7EB',
    },
    yesButton: {
        backgroundColor: '#FEE2E2',
        borderWidth: 1,
        borderColor: '#FECACA',
    },
    noText: {
        fontSize: 15,
        fontWeight: '600',
        color: '#4B5563',
    },
    yesText: {
        fontSize: 15,
        fontWeight: '600',
        color: '#DC2626',
    },
});
