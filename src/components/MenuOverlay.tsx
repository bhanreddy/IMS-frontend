import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Modal,
    ScrollView,
    Image,
    Alert,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { useRouter, Href } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import AuthService from '../services/authService';

interface Props {
    visible: boolean;
    onClose: () => void;
    userType?: 'student' | 'staff';
}

const MenuOverlay: React.FC<Props> = ({ visible, onClose, userType = 'student' }) => {
    const { t } = useTranslation();
    const router = useRouter();

    const studentMenuItems = [
        { key: 'dcgd', label: 'DCGD', icon: 'https://cdn-icons-png.flaticon.com/512/3135/3135715.png', link: '/Screen/dcgd' },
        { key: 'imp_exam', label: 'IMP Exam Links', icon: 'https://cdn-icons-png.flaticon.com/512/942/942748.png', link: '/Screen/examLinkScreen' },
        { key: 'sports', label: 'Sports', icon: 'https://cdn-icons-png.flaticon.com/512/857/857455.png', link: '/Screen/sports' },
        { key: 'contact_teacher', label: 'Contact Teacher', icon: 'https://cdn-icons-png.flaticon.com/512/597/597177.png', link: '/Screen/contactTeacher' },
        { key: 'ai_doubt', label: 'AI Doubt Assist', icon: 'https://cdn-icons-png.flaticon.com/512/4712/4712109.png', link: '/Screen/aiChat' },
        { key: 'event_photos', label: 'Event Photos', icon: 'https://cdn-icons-png.flaticon.com/512/747/747310.png', link: '/Screen/eventPhotos' },
        { key: 'insurance', label: 'Insurance', icon: 'https://cdn-icons-png.flaticon.com/512/2966/2966486.png', link: '/Screen/insurance' },
        { key: 'money_science', label: 'Money Science', icon: 'https://cdn-icons-png.flaticon.com/512/3135/3135706.png', link: '/Screen/moneyScience' },
        { key: 'logout', label: 'Logout', icon: 'https://cdn-icons-png.flaticon.com/512/1828/1828479.png', link: '/login' },
    ];

    const staffMenuItems = [
        { key: 'attendance', label: 'Mark Attendance', icon: 'https://cdn-icons-png.flaticon.com/512/3589/3589030.png', link: '/staff/manage-students' },
        { key: 'timetable', label: 'My Timetable', icon: 'https://cdn-icons-png.flaticon.com/512/2693/2693507.png', link: '/staff/timetable' },
        { key: 'upload_marks', label: 'Upload Marks', icon: 'https://cdn-icons-png.flaticon.com/512/2921/2921226.png', link: '/staff/results' },
        { key: 'leaves', label: 'Apply Leave', icon: 'https://cdn-icons-png.flaticon.com/512/2965/2965335.png', link: '/staff/leaves' },
        { key: 'profile', label: 'Staff Profile', icon: 'https://cdn-icons-png.flaticon.com/512/3135/3135715.png', link: '/staff/profile' },
        { key: 'logout', label: 'Logout', icon: 'https://cdn-icons-png.flaticon.com/512/1828/1828479.png', link: '/staff-login' },
    ];

    const itemsToRender = userType === 'staff' ? staffMenuItems : studentMenuItems;

    const handlePress = async (key: string, link: string) => {
        onClose();
        if (key === 'logout') {
            await AuthService.logout();
            router.replace(link as Href);
        } else {
            // Alert.alert('Coming Soon', `${key} feature is under development`);
            router.push(link as Href);
        }
    };

    return (
        <Modal visible={visible} transparent animationType="fade">
            <View style={styles.overlay}>

                {/* SIDE PANEL */}
                <SafeAreaView style={styles.panel} edges={['top', 'bottom']}>

                    {/* HEADER */}
                    <View style={styles.menuHeader}>
                        <Image
                            source={{ uri: 'https://cdn-icons-png.flaticon.com/512/1828/1828859.png' }}
                            style={styles.menuIcon}
                        />
                        <Text style={styles.menuTitle}>{userType === 'staff' ? 'Staff Menu' : 'Menu'}</Text>
                    </View>

                    {/* MENU ITEMS */}
                    <ScrollView showsVerticalScrollIndicator={false}>
                        {itemsToRender.map(item => (
                            <TouchableOpacity
                                key={item.key}
                                style={styles.menuItem}
                                onPress={() => handlePress(item.key, item.link)}
                            >
                                <Text style={styles.menuText}>{item.label}</Text>
                                <Image source={{ uri: item.icon }} style={styles.itemIcon} />
                            </TouchableOpacity>
                        ))}
                    </ScrollView>

                    {/* CLOSE BUTTON */}
                    <TouchableOpacity style={styles.closeButton} onPress={onClose}>
                        <Text style={styles.closeText}>Close X</Text>
                    </TouchableOpacity>

                </SafeAreaView>
            </View>
        </Modal>
    );
};

export default MenuOverlay;

/* ======================= STYLES ======================= */

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.6)',
        flexDirection: 'row',
    },

    panel: {
        width: '85%',
        backgroundColor: '#fff',
        borderTopRightRadius: 24,
        borderBottomRightRadius: 24,
        padding: 16,
    },


    /* Header */
    menuHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#f2f2f2',
        paddingVertical: 10,
        paddingHorizontal: 14,
        borderRadius: 16,
        marginBottom: 18,
        elevation: 3,
    },

    menuIcon: {
        width: 24,
        height: 24,
        marginRight: 10,
    },

    menuTitle: {
        fontSize: 22,
        fontWeight: 'bold',
    },

    /* Menu item */
    menuItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#f1f1f1',
        paddingVertical: 14,
        paddingHorizontal: 16,
        borderRadius: 16,
        marginBottom: 12,
        elevation: 2,
    },

    menuText: {
        fontSize: 18,
        fontWeight: '600',
    },

    itemIcon: {
        width: 32,
        height: 32,
    },

    /* Close */
    closeButton: {
        marginTop: 20,
        backgroundColor: '#f1f1f1',
        paddingVertical: 14,
        borderRadius: 18,
        alignItems: 'center',
        elevation: 3,
    },

    closeText: {
        fontSize: 26,
        fontWeight: 'bold',
        color: '#ff3b3b',
    },
});
