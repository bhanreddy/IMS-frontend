import type { LoginQrSchool } from '../student-login-qr/types';

export interface RoleLoginQrRole {
  code: string;
  label: string;
}

export interface RoleLoginQrMetadata {
  school: LoginQrSchool | null;
  roles: RoleLoginQrRole[];
}

export interface RoleLoginQrAccount {
  id: string;
  name: string;
  role_code: string;
  role_label: string;
  designation: string | null;
  staff_code: string | null;
  login_email: string | null;
  login_configured: boolean;
  qr_ready: boolean;
  qr_expires_at: string | null;
}

export interface IssuedRoleLoginQr {
  qrPayload: string;
  credentialId: string;
  expiresAt: string;
  created: boolean;
  account: {
    id: string;
    name: string;
    roleCode: string;
    roleLabel: string;
    staffCode: string | null;
    designation: string | null;
    email: string | null;
  };
}

export interface RoleLoginQrAccountPage {
  rows: RoleLoginQrAccount[];
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}
