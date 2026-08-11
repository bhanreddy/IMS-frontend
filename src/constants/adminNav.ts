import React from 'react';
import { Ionicons } from '@expo/vector-icons';
import type { TFunction } from 'i18next';

export type AdminNavIconName = React.ComponentProps<typeof Ionicons>['name'];
export type AdminNavTier = 'PRIMARY' | 'FINANCE' | 'ACADEMIC' | 'OPS' | 'ADMIN';

export interface AdminNavAction {
  title: string;
  icon: AdminNavIconName;
  route: string;
  tier: AdminNavTier;
  gradient: [string, string];
  category: string;
  /** RBAC permission required to see this entry (optional). */
  permission?: string;
}

/**
 * Canonical admin navigation list — the single source of truth shared by the
 * dashboard quick-action grid and the persistent web sidebar (see
 * `useAdminSidebarItems`). Keep new admin sections here so both surfaces stay
 * in sync. Dynamic badges (diary count, access requests) are layered on by the
 * consumer, not stored here.
 *
 * Chanakya E/M School brand palette is hardcoded here intentionally so the
 * admin navigation stays visually aligned with the school logo without
 * depending on an external theme file.
 *
 * Brand palette used:
 * - Deep Green:  #0B3D2E
 * - Brand Red:   #D9472B
 * - Royal Blue:  #1239B5
 * - Navy Blue:   #0B2A6F
 * - Teal:        #2B7A78
 * - Gold:        #F2B705
 * - Warm Orange: #E86A24
 */
export function buildAdminNavActions(t: TFunction): AdminNavAction[] {
  return [
    // ─────────────────────────────────────────────────────────────────────
    // CORE ACADEMICS
    // ─────────────────────────────────────────────────────────────────────
    {
      title: t('admin_dashboard_v2.academic_structure', 'Academics'),
      icon: 'school-outline',
      route: '/admin/academics',
      tier: 'PRIMARY',
      gradient: ['#0B3D2E', '#2B7A78'],
      category: 'Academic',
    },
    {
      title: 'Class Diary',
      icon: 'book-outline',
      route: '/admin/diary/viewer',
      tier: 'PRIMARY',
      gradient: ['#1239B5', '#2B7A78'],
      category: 'Academic',
    },
    {
      title: t('admin_dashboard_v2.timetable_manager', 'Timetable'),
      icon: 'calendar-outline',
      route: '/admin/timetable',
      tier: 'PRIMARY',
      gradient: ['#0B2A6F', '#1239B5'],
      category: 'Academic',
    },
    {
      title: 'Substitutions',
      icon: 'swap-horizontal-outline',
      route: '/admin/substitutions',
      tier: 'PRIMARY',
      gradient: ['#2B7A78', '#1239B5'],
      category: 'Academic',
      permission: 'academics.manage',
    },
    {
      title: t('admin_dashboard_v2.exams', 'Exams'),
      icon: 'clipboard-outline',
      route: '/admin/exams',
      tier: 'PRIMARY',
      gradient: ['#D9472B', '#E86A24'],
      category: 'Academic',
    },
    {
      title: t('admin_dashboard_v2.progress_reports', 'Progress'),
      icon: 'stats-chart-outline',
      route: '/admin/progress-report-generator',
      tier: 'PRIMARY',
      gradient: ['#0B2A6F', '#2B7A78'],
      category: 'Academic',
    },
    {
      title: t('admin_dashboard_v2.certificates', 'Certs'),
      icon: 'ribbon-outline',
      route: '/admin/certificate-generator',
      tier: 'PRIMARY',
      gradient: ['#F2B705', '#E86A24'],
      category: 'Academic',
    },
    {
      title: 'Student Portfolio',
      icon: 'id-card-outline',
      route: '/admin/student-portfolio',
      tier: 'PRIMARY',
      gradient: ['#0B3D2E', '#1239B5'],
      category: 'Students',
    },
    {
      title: 'Year Upgrade',
      icon: 'refresh-circle-outline',
      route: '/admin/academic-year-upgrade',
      tier: 'PRIMARY',
      gradient: ['#1239B5', '#D9472B'],
      category: 'Academic',
    },

    // ─────────────────────────────────────────────────────────────────────
    // FINANCE
    // ─────────────────────────────────────────────────────────────────────
    {
      title: t('admin_dashboard_v2.fee_structure', 'Fee Setup'),
      icon: 'wallet-outline',
      route: '/admin/fees/set-class-fee',
      tier: 'FINANCE',
      gradient: ['#0B3D2E', '#2B7A78'],
      category: 'Finance',
    },
    {
      title: 'Fee Adjustments',
      icon: 'cut-outline',
      route: '/admin/fees/adjustments',
      tier: 'FINANCE',
      gradient: ['#2B7A78', '#F2B705'],
      category: 'Finance',
    },
    {
      title: 'Fee Approvals',
      icon: 'shield-checkmark-outline',
      route: '/admin/fee-approvals',
      tier: 'FINANCE',
      gradient: ['#D9472B', '#F2B705'],
      category: 'Finance',
    },
    {
      title: 'UPI Settings',
      icon: 'qr-code-outline',
      route: '/admin/upi-settings',
      tier: 'FINANCE',
      gradient: ['#1239B5', '#2B7A78'],
      category: 'Finance',
    },
    {
      title: 'Dashboard Visibility',
      icon: 'eye-outline',
      route: '/admin/fees/visibility',
      tier: 'FINANCE',
      gradient: ['#0B3D2E', '#F2B705'],
      category: 'Finance',
    },
    {
      title: t('admin_dashboard_v2.expense_tracker', 'Expenses'),
      icon: 'receipt-outline',
      route: '/admin/expenses',
      tier: 'FINANCE',
      gradient: ['#D9472B', '#E86A24'],
      category: 'Finance',
    },
    {
      title: 'Payroll',
      icon: 'card-outline',
      route: '/admin/payroll',
      tier: 'FINANCE',
      gradient: ['#0B2A6F', '#1239B5'],
      category: 'Finance',
    },

    // ─────────────────────────────────────────────────────────────────────
    // ANALYTICS & INSIGHTS
    // ─────────────────────────────────────────────────────────────────────
    {
      title: t('admin_dashboard_v2.view_reports', 'Reports'),
      icon: 'bar-chart-outline',
      route: '/admin/reports',
      tier: 'ACADEMIC',
      gradient: ['#0B2A6F', '#2B7A78'],
      category: 'Analytics',
    },
    {
      title: t('admin_dashboard_v2.smart_insights', 'Insights'),
      icon: 'bulb-outline',
      route: '/admin/smart-insights',
      tier: 'ACADEMIC',
      gradient: ['#F2B705', '#D9472B'],
      category: 'AI',
    },

    // ─────────────────────────────────────────────────────────────────────
    // COMMUNICATION & OPERATIONS
    // ─────────────────────────────────────────────────────────────────────
    {
      title: t('admin_dashboard_v2.notices', 'Notices'),
      icon: 'megaphone-outline',
      route: '/admin/notices',
      tier: 'OPS',
      gradient: ['#D9472B', '#E86A24'],
      category: 'Comms',
    },
    {
      title: t('messages.title', 'Messages'),
      icon: 'chatbubbles-outline',
      route: '/admin/messages',
      tier: 'OPS',
      gradient: ['#1239B5', '#2B7A78'],
      category: 'Comms',
    },
    {
      title: t('admin_dashboard_v2.complaints', 'Complaints'),
      icon: 'chatbubble-ellipses-outline',
      route: '/admin/complaints',
      tier: 'OPS',
      gradient: ['#D9472B', '#F2B705'],
      category: 'Support',
    },
    {
      title: t('admin_dashboard_v2.transport', 'Transport'),
      icon: 'bus-outline',
      route: '/admin/transport',
      tier: 'OPS',
      gradient: ['#F2B705', '#E86A24'],
      category: 'Ops',
    },

    // ─────────────────────────────────────────────────────────────────────
    // STAFF & HR
    // ─────────────────────────────────────────────────────────────────────
    {
      title: t('admin_dashboard_v2.manage_staff', 'Staff'),
      icon: 'people-outline',
      route: '/admin/manage-staff',
      tier: 'OPS',
      gradient: ['#0B3D2E', '#1239B5'],
      category: 'HR',
    },
    {
      title: t('admin_dashboard_v2.add_staff', 'Add Staff'),
      icon: 'person-add-outline',
      route: '/admin/addStaff',
      tier: 'OPS',
      gradient: ['#2B7A78', '#1239B5'],
      category: 'HR',
      permission: 'staff.create',
    },
    {
      title: t('admin_dashboard_v2.leaves', 'Leaves'),
      icon: 'document-text-outline',
      route: '/admin/leaves',
      tier: 'OPS',
      gradient: ['#E86A24', '#F2B705'],
      category: 'HR',
    },
    {
      title: t('admin_dashboard_v2.add_accounts_staff', 'Accounts Portal'),
      icon: 'wallet-outline',
      route: '/admin/add-accounts-staff',
      tier: 'OPS',
      gradient: ['#D9472B', '#1239B5'],
      category: 'HR',
    },

    // ─────────────────────────────────────────────────────────────────────
    // WEBSITE & ADMINISTRATION
    // ─────────────────────────────────────────────────────────────────────
    {
      title: 'Website Gallery',
      icon: 'images-outline',
      route: '/admin/website-gallery',
      tier: 'OPS',
      gradient: ['#2B7A78', '#0B3D2E'],
      category: 'Website',
      permission: 'admin.manage',
    },
    {
      title: 'App Adoption',
      icon: 'phone-portrait-outline',
      route: '/admin/app-adoption',
      tier: 'ADMIN',
      gradient: ['#1239B5', '#0B2A6F'],
      category: 'Security',
    },
    {
      title: 'Access Requests',
      icon: 'key-outline',
      route: '/admin/access-requests',
      tier: 'ADMIN',
      gradient: ['#D9472B', '#0B2A6F'],
      category: 'Security',
    },
  ];
}