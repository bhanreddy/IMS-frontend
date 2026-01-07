import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    Modal,
    TouchableOpacity,
} from 'react-native';

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
    return (
        <Modal
            transparent
            visible={visible}
            animationType="fade"
            onRequestClose={onCancel}
        >
            <View style={styles.overlay}>

                <View style={styles.box}>
                    <Text style={styles.title}>
                        Do You Really Want to Log Out?
                    </Text>

                    <View style={styles.buttonRow}>
                        <TouchableOpacity
                            style={[styles.button, styles.noButton]}
                            onPress={onCancel}
                        >
                            <Text style={styles.noText}>NO</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={[styles.button, styles.yesButton]}
                            onPress={onConfirm}
                        >
                            <Text style={styles.yesText}>Yes</Text>
                        </TouchableOpacity>
                    </View>
                </View>

            </View>
        </Modal>
    );
};

export default LogoutConfirmModal;

/* ============================ STYLES ============================ */

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.4)',
        justifyContent: 'center',
        alignItems: 'center',
    },

    box: {
        width: '85%',
        backgroundColor: '#f2f2f2',
        borderRadius: 16,
        paddingVertical: 24,
        paddingHorizontal: 16,
        alignItems: 'center',
        elevation: 5,
    },

    title: {
        fontSize: 18,
        fontWeight: '700',
        textAlign: 'center',
        marginBottom: 24,
    },

    buttonRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
        paddingHorizontal: 10,
    },

    button: {
        width: '42%',
        paddingVertical: 10,
        borderRadius: 20,
        alignItems: 'center',
        elevation: 3,
    },

    noButton: {
        backgroundColor: '#b7ffb7',
    },

    yesButton: {
        backgroundColor: '#ff5c5c',
    },

    noText: {
        fontSize: 16,
        fontWeight: '700',
        color: '#000',
    },

    yesText: {
        fontSize: 16,
        fontWeight: '700',
        color: '#fff',
    },
});
