import { useCallback, useEffect, useRef, useState } from 'react';
import { useRouter } from 'expo-router';
import { useAuth } from './useAuth';
import * as accountVault from '../services/accountVault';
import type { VaultAccount } from '../services/accountVault';
import { getHomeRouteForRole } from '../utils/portalRoutes';
import { isStudentRole } from '../utils/roleHelpers';
import { alertCompat } from '../utils/crossPlatformAlert';
import * as Haptics from '../utils/haptics';

export function useQuickAccountSwitch(onSwitched?: () => void | Promise<void>) {
  const { user, switchAccount } = useAuth();
  const router = useRouter();
  const [accounts, setAccounts] = useState<VaultAccount[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [switching, setSwitching] = useState(false);
  const busyRef = useRef(false);

  const loadAccounts = useCallback(async () => {
    try {
      const [accs, active] = await Promise.all([
        accountVault.listAccounts(),
        accountVault.getActiveAccountId(),
      ]);
      const activeUserId = active ?? user?.userId ?? null;
      setAccounts(accs);
      setActiveId(activeUserId);
      return { accounts: accs, activeId: activeUserId };
    } catch {
      /* vault read failures are non-fatal */
      return null;
    }
  }, [user?.userId]);

  useEffect(() => {
    void loadAccounts();
  }, [loadAccounts, user?.userId]);

  const performSwitch = useCallback(
    async (userId: string) => {
      if (busyRef.current || userId === activeId) return false;
      busyRef.current = true;
      setSwitching(true);
      try {
        const res = await switchAccount(userId);
        if (res?.error) {
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
          alertCompat('Could not switch', res.error);
          return false;
        }
        setActiveId(userId);
        const roleCode = res.session?.validatedUser?.role?.code;
        if (roleCode) {
          router.replace(getHomeRouteForRole(roleCode) as any);
        }
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        // Refresh student data after navigation without holding the switcher's
        // busy state open for another round of dashboard network requests.
        if (isStudentRole(roleCode)) {
          void Promise.resolve().then(() => onSwitched?.()).catch(() => {
            /* dashboard queries retry independently of the completed switch */
          });
        }
        return true;
      } catch (e: any) {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
        alertCompat(
          'Could not switch',
          e?.message || 'Account switch failed. Try again, or re-add the account.'
        );
        return false;
      } finally {
        busyRef.current = false;
        setSwitching(false);
      }
    },
    [activeId, onSwitched, router, switchAccount]
  );

  const switchToNext = useCallback(async () => {
    if (busyRef.current) return false;
    const snapshot = await loadAccounts();
    if (!snapshot) return false;
    const accs = snapshot.accounts;
    const current = snapshot.activeId;
    if (accs.length <= 1) {
      Haptics.selectionAsync();
      setSheetOpen(true);
      return false;
    }
    const idx = accs.findIndex((a) => a.userId === current);
    const nextIdx = idx >= 0 ? (idx + 1) % accs.length : 0;
    const next = accs[nextIdx];
    if (!next || next.userId === current) {
      Haptics.selectionAsync();
      return false;
    }
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    return performSwitch(next.userId);
  }, [loadAccounts, performSwitch]);

  const switchTo = useCallback(
    async (userId: string) => {
      Haptics.selectionAsync();
      const ok = await performSwitch(userId);
      if (ok) setSheetOpen(false);
      return ok;
    },
    [performSwitch]
  );

  const openSheet = useCallback(async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setSheetOpen(true);
    await loadAccounts();
  }, [loadAccounts]);

  const closeSheet = useCallback(() => setSheetOpen(false), []);

  return {
    accounts,
    activeId,
    sheetOpen,
    switching,
    switchToNext,
    switchTo,
    openSheet,
    closeSheet,
    reloadAccounts: loadAccounts,
  };
}
