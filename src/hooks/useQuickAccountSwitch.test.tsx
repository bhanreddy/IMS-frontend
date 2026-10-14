/* eslint-disable import/first, @typescript-eslint/no-require-imports */
jest.mock('expo-router', () => ({ useRouter: jest.fn() }));
jest.mock('./useAuth', () => ({ useAuth: jest.fn() }));
jest.mock('../services/accountVault', () => ({ listAccounts: jest.fn(), getActiveAccountId: jest.fn() }));
jest.mock('../utils/haptics', () => ({
  selectionAsync: jest.fn(), impactAsync: jest.fn(), notificationAsync: jest.fn(),
  ImpactFeedbackStyle: { Medium: 'medium', Light: 'light' },
  NotificationFeedbackType: { Error: 'error', Success: 'success' },
}));
jest.mock('../utils/crossPlatformAlert', () => ({ alertCompat: jest.fn() }));

import React from 'react';
import { useRouter } from 'expo-router';
import { useAuth } from './useAuth';
import { useQuickAccountSwitch } from './useQuickAccountSwitch';
import * as vault from '../services/accountVault';
import { alertCompat } from '../utils/crossPlatformAlert';
const { act, create } = require('react-test-renderer');
const switchAccount = jest.fn();
const replace = jest.fn();
const refresh = jest.fn();
let context: ReturnType<typeof useQuickAccountSwitch>;
let root: { unmount: () => void };
function Probe() { context = useQuickAccountSwitch(refresh); return null; }
async function mount() { await act(async () => { root = create(<Probe />); }); }

beforeEach(() => {
  jest.clearAllMocks();
  (useAuth as jest.Mock).mockReturnValue({ user: { userId: 'a' }, switchAccount });
  (useRouter as jest.Mock).mockReturnValue({ replace });
  (vault.listAccounts as jest.Mock).mockResolvedValue([{ userId: 'a' }, { userId: 'b' }, { userId: 'c' }]);
  (vault.getActiveAccountId as jest.Mock).mockResolvedValue('a');
  switchAccount.mockResolvedValue({ session: { validatedUser: { userId: 'b', role: { code: 'student' } } } });
  refresh.mockResolvedValue(undefined);
});
afterEach(async () => { await act(async () => { root?.unmount(); }); });

it('reads the latest accounts once when cycling, including newly added accounts', async () => {
  await mount();
  (vault.listAccounts as jest.Mock).mockClear();
  (vault.getActiveAccountId as jest.Mock).mockClear();
  (vault.listAccounts as jest.Mock).mockResolvedValue([{ userId: 'a' }, { userId: 'new-account' }, { userId: 'b' }]);
  await act(async () => { expect(await context.switchToNext()).toBe(true); });
  expect(vault.listAccounts).toHaveBeenCalledTimes(1);
  expect(vault.getActiveAccountId).toHaveBeenCalledTimes(1);
  expect(switchAccount).toHaveBeenCalledWith('new-account');
});

it('finishes and closes the picker while the dashboard refresh remains pending', async () => {
  await mount();
  let finishRefresh!: () => void;
  refresh.mockImplementation(() => new Promise<void>((resolve) => { finishRefresh = resolve; }));
  await act(async () => { await context.openSheet(); });
  expect(context.sheetOpen).toBe(true);
  await act(async () => { expect(await context.switchTo('b')).toBe(true); });
  expect(replace).toHaveBeenCalled();
  expect(refresh).toHaveBeenCalledTimes(1);
  expect(context.switching).toBe(false);
  expect(context.sheetOpen).toBe(false);
  expect(context.activeId).toBe('b');
  await act(async () => { finishRefresh(); });
});

it('does not report a failed account switch when the later dashboard refresh fails', async () => {
  await mount();
  refresh.mockRejectedValue(new Error('dashboard offline'));
  await act(async () => { expect(await context.switchTo('b')).toBe(true); });
  expect(context.activeId).toBe('b');
  expect(alertCompat).not.toHaveBeenCalled();
});

it('leaves the active account and picker intact when switching is refused', async () => {
  await mount();
  switchAccount.mockResolvedValue({ error: 'Fingerprint verification failed' });
  await act(async () => { await context.openSheet(); });
  await act(async () => { expect(await context.switchTo('b')).toBe(false); });
  expect(context.activeId).toBe('a');
  expect(context.sheetOpen).toBe(true);
  expect(replace).not.toHaveBeenCalled();
  expect(refresh).not.toHaveBeenCalled();
});

it('opens the cached picker immediately while fresh vault reads are pending', async () => {
  await mount();
  let finishRead!: (accounts: { userId: string }[]) => void;
  (vault.listAccounts as jest.Mock).mockImplementation(() => new Promise((resolve) => { finishRead = resolve; }));
  let opening!: Promise<void>;
  await act(async () => { opening = context.openSheet(); });
  expect(context.sheetOpen).toBe(true);
  expect(context.accounts).toHaveLength(3);
  await act(async () => { finishRead([{ userId: 'a' }, { userId: 'b' }]); await opening; });
  expect(context.accounts).toHaveLength(2);
});
