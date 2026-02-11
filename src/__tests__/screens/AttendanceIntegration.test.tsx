import React from 'react';
import { render, waitFor, screen } from '@testing-library/react-native';
import AttendanceScreen from '../../../app/Screen/attendance';
import { StudentService } from '../../services/studentService';

// Mock dependencies
jest.mock('../../services/studentService');
jest.mock('../../hooks/useAuth', () => ({
    useAuth: () => ({ user: { id: '123' } }),
}));
jest.mock('expo-router', () => ({
    useRouter: () => ({ back: jest.fn() }),
}));
// Fix for "React.useContext is not a function" or similar router issues if any,
// but checking ProfileIntegration.test.tsx, it mocks like:
/*
jest.mock('expo-router', () => ({
    useRouter: () => ({ push: jest.fn(), replace: jest.fn(), back: jest.fn() }),
    Stack: { Screen: ({ options }: any) => null },
}));
*/
// I will use the same pattern for consistency
jest.mock('react-i18next', () => ({
    useTranslation: () => ({
        t: (key: string, defaultValue: string) => defaultValue || key,
        i18n: {
            language: 'en',
            changeLanguage: jest.fn(),
        },
    }),
}));
jest.mock('expo-haptics', () => ({
    impactAsync: jest.fn(),
    ImpactFeedbackStyle: { Light: 'light' },
}));
jest.mock('@expo/vector-icons', () => {
    const { Text } = require('react-native');
    const Icon = (props: any) => <Text testID={props.name} {...props}>{props.name}</Text>;
    return {
        Ionicons: Icon,
        MaterialIcons: Icon,
        Feather: Icon,
    };
});

jest.mock('react-native-safe-area-context', () => ({
    SafeAreaProvider: ({ children }: any) => children,
    SafeAreaView: ({ children }: any) => children,
    useSafeAreaInsets: () => ({ top: 0, bottom: 0, left: 0, right: 0 }),
}));

jest.mock('../../components/MenuOverlay', () => {
    const { View } = require('react-native');
    return () => <View testID="MenuOverlay" />;
});



jest.mock('expo-linear-gradient', () => ({
    LinearGradient: ({ children, style }: any) => {
        const { View } = require('react-native');
        return <View style={style}>{children}</View>;
    },
}));

jest.mock('react-native-reanimated', () => {
    const View = require('react-native').View;
    return {
        default: {
            View: View,
            createAnimatedComponent: (Component: any) => (props: any) => <Component {...props} />,
        },
        FadeInDown: {
            delay: () => ({
                duration: () => ({}),
            }),
            duration: () => ({}),
        },
        FadeInUp: {
            delay: () => ({
                duration: () => ({}),
            }),
            duration: () => ({}),
        }
    };
});

// Replicated from ProfileIntegration test mock
jest.mock('expo-router', () => ({
    useRouter: () => ({ push: jest.fn(), replace: jest.fn(), back: jest.fn() }),
    Stack: { Screen: ({ options }: any) => null },
}));

const mockAttendanceData = {
    summary: {
        present: 20,
        absent: 2,
        late: 1,
        total: 23
    },
    records: [
        {
            attendance_date: '2023-10-25',
            status: 'present',
            remarks: ''
        },
        {
            attendance_date: '2023-10-24',
            status: 'absent',
            remarks: 'Sick'
        }
    ]
};

describe('AttendanceScreen Integration', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        (StudentService.getAttendance as jest.Mock).mockResolvedValue(mockAttendanceData);
    });

    it('renders attendance stats and list correctly', async () => {
        render(<AttendanceScreen />);

        await waitFor(() => expect(StudentService.getAttendance).toHaveBeenCalledWith('123'));

        screen.debug();

        // Check Stats
        expect(screen.getByText('20')).toBeTruthy();
        expect(screen.getByText('2')).toBeTruthy();
        expect(screen.getByText('1')).toBeTruthy();

        // Check List Items
        expect(screen.getAllByText('PRESENT').length).toBeGreaterThan(0);
        expect(screen.getAllByText('ABSENT').length).toBeGreaterThan(0);
    });

    it('renders empty state correctly', async () => {
        (StudentService.getAttendance as jest.Mock).mockResolvedValue({ summary: { present: 0, absent: 0, late: 0, total: 0 }, records: [] });
        render(<AttendanceScreen />);
        await waitFor(() => expect(StudentService.getAttendance).toHaveBeenCalled());
        expect(screen.getByText(/No attendance records found/i)).toBeTruthy();
    });
});
