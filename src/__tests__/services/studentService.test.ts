import { StudentService } from '../../services/studentService';
import { api } from '../../services/apiClient';

// Mock the API client
jest.mock('../../services/apiClient', () => ({
    api: {
        get: jest.fn(),
        post: jest.fn(),
    },
}));

describe('StudentService', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    it('getProfile fetches student profile correctly', async () => {
        const mockProfile = { id: '123', display_name: 'John Doe', roll_number: 'A1' };
        (api.get as jest.Mock).mockResolvedValue(mockProfile);

        const result = await StudentService.getProfile();

        expect(api.get).toHaveBeenCalledWith('/students/profile/me');
        expect(result).toEqual(mockProfile);
    });

    it('getAttendance fetches attendance with summary', async () => {
        const mockAttendance = {
            summary: { present: 10, absent: 2, total: 12 },
            records: []
        };
        (api.get as jest.Mock).mockResolvedValue(mockAttendance);

        const result = await StudentService.getAttendance('123');

        expect(api.get).toHaveBeenCalledWith('/students/123/attendance', undefined);
        expect(result).toEqual(mockAttendance);
    });

    it('getFees fetches fees correctly', async () => {
        const mockFees = {
            summary: { total_due: 1000, balance: 500 },
            fees: []
        };
        (api.get as jest.Mock).mockResolvedValue(mockFees);

        const result = await StudentService.getFees('123');

        expect(api.get).toHaveBeenCalledWith('/students/123/fees');
        expect(result).toEqual(mockFees);
    });
});
