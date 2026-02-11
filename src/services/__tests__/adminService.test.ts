import { AdminService } from '../adminService';
import { api } from '../apiClient';

// Mock API Client
jest.mock('../apiClient', () => ({
    api: {
        get: jest.fn(),
        post: jest.fn(),
        put: jest.fn(),
        delete: jest.fn(),
    },
    APIError: class extends Error {
        statusCode: number;
        constructor(msg: string, code: number) {
            super(msg);
            this.statusCode = code;
        }
    }
}));

describe('AdminService', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('getDashboardStats', () => {
        it('should call /admin/dashboard-stats', async () => {
            const mockStats = {
                totalStudents: 150,
                staffPresent: 20,
                totalStaff: 25,
                collection: 50000,
                complaints: 2
            };
            (api.get as jest.Mock).mockResolvedValue(mockStats);

            const result = await AdminService.getDashboardStats();

            expect(api.get).toHaveBeenCalledWith('/admin/dashboard-stats');
            expect(result).toEqual(mockStats);
        });

        it('should propagate API errors (e.g. 403 Forbidden)', async () => {
            const error = new Error('Access denied');
            (error as any).statusCode = 403;
            (api.get as jest.Mock).mockRejectedValue(error);

            await expect(AdminService.getDashboardStats()).rejects.toThrow('Access denied');
        });
    });
});
