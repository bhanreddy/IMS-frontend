import { api } from '../../services/apiClient';
import type {
  IssuedRoleLoginQr,
  RoleLoginQrAccount,
  RoleLoginQrAccountPage,
  RoleLoginQrMetadata,
} from './types';

export interface RoleLoginQrFilters {
  role?: string;
  search?: string;
  page?: number;
  limit?: number;
}

export async function fetchAllRoleLoginQrAccounts(
  filters: Omit<RoleLoginQrFilters, 'page' | 'limit'>,
): Promise<RoleLoginQrAccount[]> {
  const rows: RoleLoginQrAccount[] = [];
  let page = 1;
  let totalPages = 1;
  do {
    const result = await RoleLoginQrApi.accounts({ ...filters, page, limit: 200 });
    rows.push(...result.rows);
    totalPages = result.totalPages;
    page += 1;
  } while (page <= totalPages && page <= 20);
  return rows;
}

export const RoleLoginQrApi = {
  metadata: () => api.get<RoleLoginQrMetadata>('/role-login-qr/metadata', undefined, { silent: true }),
  accounts: (filters: RoleLoginQrFilters) =>
    api.get<RoleLoginQrAccountPage>('/role-login-qr/users', filters, { silent: true }),
  generate: (userId: string) =>
    api.post<IssuedRoleLoginQr>(`/role-login-qr/${userId}/generate`, {}, { silent: true }),
  regenerate: (userId: string) =>
    api.post<IssuedRoleLoginQr>(`/role-login-qr/${userId}/regenerate`, { confirm: true }, { silent: true }),
  bulk: (userIds: string[]) =>
    api.post<{ credentials: IssuedRoleLoginQr[]; failures: { userId: string; code: string }[] }>(
      '/role-login-qr/bulk',
      { userIds },
      { silent: true, timeoutMs: 60000 },
    ),
  auditExport: (payload: {
    exportType: 'png' | 'single_card_pdf' | 'a4_pdf' | 'print';
    userIds: string[];
    role?: string;
  }) => api.post('/role-login-qr/export-audit', payload, { silent: true }),
};
