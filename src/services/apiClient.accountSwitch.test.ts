/* eslint-disable import/first */
jest.mock('../constants/school', () => ({ SCHOOL_ID: 12, API_URL: 'https://pilot.invalid/api/v1' }));
jest.mock('../components/CustomAlert', () => ({ showAlert: jest.fn() }));
jest.mock('@react-native-community/netinfo', () => ({ fetch: jest.fn(async () => ({ isConnected: true, isInternetReachable: true })) }));
jest.mock('./supabaseConfig', () => ({ supabase: { auth: { getSession: jest.fn(), refreshSession: jest.fn() } } }));
jest.mock('./deviceId', () => ({ getOrCreateDeviceId: jest.fn(async () => 'installation-1') }));
jest.mock('./activeContextStore', () => ({ getActiveContextId: jest.fn(async () => 'outgoing-context') }));
jest.mock('./staffBiometricService', () => ({ staffBiometricService: {
  getStoredRegistration: jest.fn(async () => ({ devicePublicKey: 'device-key', keyAlias: 'alias' })),
} }));

import { api } from './apiClient';
import { supabase } from './supabaseConfig';
import { getActiveContextId } from './activeContextStore';
const fetchMock = global.fetch as jest.Mock;
const options = { headers: { Authorization: 'Bearer target-token' }, omitAuth: true, silent: true };
beforeEach(() => { jest.clearAllMocks(); });

it('validates the target directly without waiting for the live auth lock or sending the outgoing portal context', async () => {
  (supabase.auth.getSession as jest.Mock).mockImplementation(() => new Promise(() => {}));
  fetchMock.mockResolvedValue({
    ok: true, status: 200, headers: { get: () => null },
    json: async () => ({ success: true, school_id: 12, data: { userId: 'target' } }),
  });
  await expect(api.post('/auth/validate-school-user', {}, options)).resolves.toEqual({ userId: 'target' });
  const [url, request] = fetchMock.mock.calls[0];
  expect(url).toBe('https://pilot.invalid/api/v1/auth/validate-school-user');
  expect(request.headers.Authorization).toBe('Bearer target-token');
  expect(request.headers['X-Device-Id']).toBe('installation-1');
  expect(request.headers['X-Device-Public-Key']).toBe('device-key');
  expect(request.headers['X-Active-Context']).toBeUndefined();
  expect(JSON.parse(request.body).school_id).toBe('12');
  expect(getActiveContextId).not.toHaveBeenCalled();
  expect(supabase.auth.getSession).not.toHaveBeenCalled();
});

it.each([401, 403])('returns a target validation failure (%s) without recovering the outgoing account', async (status) => {
  fetchMock.mockResolvedValue({
    ok: false, status, headers: { get: () => null },
    json: async () => ({ error: 'Target rejected', code: 'ACCOUNT_NOT_ACTIVE' }),
  });
  await expect(api.post('/auth/validate-school-user', {}, options)).rejects.toMatchObject({ statusCode: status });
  expect(fetchMock).toHaveBeenCalledTimes(1);
  expect(supabase.auth.getSession).not.toHaveBeenCalled();
  expect(supabase.auth.refreshSession).not.toHaveBeenCalled();
});
