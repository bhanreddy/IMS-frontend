import React from 'react';
import { render, waitFor, screen } from '@testing-library/react-native';
import FeesScreen from '../../../app/Screen/fees';
import { StudentService } from '../../services/studentService';

// Mock dependencies
jest.mock('../../services/studentService');
jest.mock('../../hooks/useAuth', () => ({
    useAuth: () => ({ user: { id: '123' } }),
}));
jest.mock('expo-router', () => ({
    useRouter: () => ({ back: jest.fn(), push: jest.fn() }),
}));

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
    ImpactFeedbackStyle: { Light: 'light', Medium: 'medium' },
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

const mockFeesData = {
    summary: {
        total_due: 50000,
        balance: 15000,
        paid: 35000
    },
    fees: [
        {
            id: '1',
            fee_type: 'Tuition Fee',
            due_date: '2023-12-31',
            status: 'pending',
            amount_due: 20000,
            amount_paid: 5000
        },
        {
            id: '2',
            fee_type: 'Transport Fee',
            due_date: '2023-11-30',
            status: 'paid',
            amount_due: 10000,
            amount_paid: 10000
        }
    ]
};

describe('FeesScreen Integration', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        (StudentService.getFees as jest.Mock).mockResolvedValue(mockFeesData);
    });

    it('renders fees stats and list correctly', async () => {
        render(<FeesScreen />);

        await waitFor(() => expect(StudentService.getFees).toHaveBeenCalledWith('123'));

        // Check Stats
        expect(screen.getByText('50,000')).toBeTruthy();
        expect(screen.getByText('15,000')).toBeTruthy();

        // Check List Items
        expect(screen.getByText('Tuition Fee')).toBeTruthy();
        expect(screen.getByText('PENDING')).toBeTruthy();
        expect(screen.getByText('Transport Fee')).toBeTruthy();
        expect(screen.getByText('PAID')).toBeTruthy();
    });

    it('renders empty state correctly', async () => {
        (StudentService.getFees as jest.Mock).mockResolvedValue({ summary: { total_due: 0, balance: 0, paid: 0 }, fees: [] });
        render(<FeesScreen />);
        await waitFor(() => expect(StudentService.getFees).toHaveBeenCalled());
        expect(screen.getByText(/No fee records found/i)).toBeTruthy();
    });
});
