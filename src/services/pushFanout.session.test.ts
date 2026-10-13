/* eslint-disable import/first */
jest.mock('../constants/school', () => ({
  SCHOOL_ID: 12, SUPABASE_URL: 'https://auth.invalid', SUPABASE_ANON_KEY: 'test-key',
}));
jest.mock('./accountVault', () => ({ getBackupRefreshTokenForUser: jest.fn() }));
jest.mock('./apiClient', () => ({ getApiBaseUrl: () => 'https://api.invalid/api/v1' }));
import { unregisterVaultedAccountStandalone } from './pushFanout';
import type { VaultAccount } from './accountVault';

it('removes a saved device login without revoking other devices for that account', async () => {
  const account = {
    userId: 'parent-1',
    supabaseSession: { access_token: 'parent-device-token', refresh_token: 'refresh', expires_at: Date.now() / 1000 + 3600 },
  } as VaultAccount;
  const fetchMock = global.fetch as jest.Mock;
  fetchMock.mockClear();
  fetchMock.mockResolvedValue({ ok: true });
  await unregisterVaultedAccountStandalone(account);
  const logout = fetchMock.mock.calls.find(([url]) => String(url).includes('/auth/v1/logout'));
  expect(logout?.[0]).toBe('https://auth.invalid/auth/v1/logout?scope=local');
  expect(logout?.[1].headers.Authorization).toBe('Bearer parent-device-token');
});
