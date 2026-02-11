import React from 'react';
import { render, waitFor, screen } from '@testing-library/react-native';
import ProfileScreen from '../../../app/Screen/profile';
import { StudentService } from '../../services/studentService';
import { Student } from '../../types/models';

// Mock the services
jest.mock('../../services/studentService');
jest.mock('expo-router', () => ({
    useRouter: () => ({ push: jest.fn(), replace: jest.fn(), back: jest.fn() }),
    Stack: { Screen: ({ options }: any) => null },
}));

const mockStudent: Student = {
    id: '123',
    admission_no: 'ADM001',
    admission_date: '2023-01-01',
    first_name: 'John',
    last_name: 'Doe',
    display_name: 'John Doe',
    gender_id: 1,
    dob: '2005-01-01',
    status: 'active',
    email: 'john@test.com',
    phone: '1234567890',
    current_enrollment: {
        id: 'enr1',
        roll_number: '101',
        class_code: '10',
        class_id: 'c1',
        section_name: 'A',
        section_id: 's1',
        academic_year: '2023-2024'
    },
    parents: [
        {
            first_name: 'Jane',
            last_name: 'Doe',
            relation: 'Mother',
            phone: '9876543210',
            is_primary: true
        }
    ]
};

describe('ProfileScreen Integration', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        (StudentService.getProfile as jest.Mock).mockResolvedValue(mockStudent);
    });

    it('renders student details correctly', async () => {
        render(<ProfileScreen />);

        // Wait for loading to finish
        await waitFor(() => expect(StudentService.getProfile).toHaveBeenCalled());

        // Assert Student Name
        expect(screen.getByText(/John Doe/)).toBeTruthy();

        // Assert Admission details
        expect(screen.getByText(/ADM001/)).toBeTruthy();

        // Assert Class details
        expect(screen.getByText(/10\s*-\s*A/)).toBeTruthy();

        // Assert Parent details
        expect(screen.getByText(/Jane Doe/)).toBeTruthy();
        expect(screen.getByText(/Mother/)).toBeTruthy();
    });

    it('handles empty profile gracefully', async () => {
        (StudentService.getProfile as jest.Mock).mockResolvedValue(null);
        render(<ProfileScreen />);
        await waitFor(() => expect(StudentService.getProfile).toHaveBeenCalled());
        // Should show error or empty state (depending on implementation)
    });
});
