import React from 'react';
import AccountsLayout from '../../app/accounts/_layout';
import DashboardMenuOverlay from '../components/DashboardMenuOverlay';
import { StudentService } from '../services/studentService';

// eslint-disable-next-line @typescript-eslint/no-require-imports
const { create, act } = require('react-test-renderer');
let mockPathname = '/accounts/dashboard';
let mockAuth = { user: { userId: 'accounts-user' }, role: 'accountant', loading: false };
let mockCanViewStudents = true;
const mockRouter = { push: jest.fn() };

jest.mock('expo-router', () => ({
  Stack: () => null,
  usePathname: () => mockPathname,
  useRouter: () => mockRouter,
}));
jest.mock('../hooks/useRequireRole', () => ({ useRequireRole: jest.fn() }));
jest.mock('../hooks/useAuth', () => ({ useAuth: () => mockAuth }));
jest.mock('../hooks/usePermissions', () => ({
  usePermissions: () => ({ hasPermission: () => mockCanViewStudents }),
}));
jest.mock('../hooks/useTheme', () => ({
  useTheme: () => ({ theme: { colors: { background: '#fff' } } }),
}));
jest.mock('../components/AdminHeader', () => ({ __esModule: true, default: () => null }));
jest.mock('../components/AccountsWebSidebar', () => ({
  __esModule: true,
  default: () => null,
  ACCOUNTS_SIDEBAR_NAV: [{
    title: 'Pending Enrollments', route: '/accounts/pending-enrollments', permission: 'students.view',
  }],
}));
jest.mock('../components/DashboardMenuOverlay', () => ({ __esModule: true, default: () => null }));
jest.mock('../services/studentService', () => ({
  StudentService: { getUnenrolledStudents: jest.fn() },
}));

const fetchPending = jest.mocked(StudentService.getUnenrolledStudents);
let tree: any;
async function renderLayout() {
  await act(async () => { tree = create(<AccountsLayout />); });
}
async function navigate(pathname: string) {
  mockPathname = pathname;
  await act(async () => { tree.update(<AccountsLayout />); });
}
beforeEach(() => {
  jest.clearAllMocks();
  mockPathname = '/accounts/dashboard';
  mockAuth = { user: { userId: 'accounts-user' }, role: 'accountant', loading: false };
  mockCanViewStudents = true;
  fetchPending.mockResolvedValue([]);
});
afterEach(async () => { await act(async () => tree?.unmount()); });

it('does not refresh the Accounts badge while a student opens Messages and returns home', async () => {
  mockAuth = { user: { userId: 'student-user' }, role: 'student', loading: false };
  await renderLayout();
  await navigate('/Screen/messages');
  await navigate('/home');
  expect(fetchPending).not.toHaveBeenCalled();
});

it.each(['accountant', 'admin', 'principal'])('refreshes the badge for an authorized %s in Accounts', async role => {
  mockAuth.role = role;
  await renderLayout();
  expect(fetchPending).toHaveBeenCalledWith(undefined, { silent: true });
  await navigate('/accounts/fees');
  expect(fetchPending).toHaveBeenCalledTimes(2);
});

it('does not fetch while authentication is loading', async () => {
  mockAuth.loading = true;
  await renderLayout();
  expect(fetchPending).not.toHaveBeenCalled();
});

it('does not fetch without permission to view students', async () => {
  mockCanViewStudents = false;
  await renderLayout();
  expect(fetchPending).not.toHaveBeenCalled();
});

it('stops fetching when the Accounts layout stays mounted outside its portal', async () => {
  await renderLayout();
  await navigate('/Screen/messages');
  await navigate('/home');
  expect(fetchPending).toHaveBeenCalledTimes(1);
});

it('discards an unfinished badge refresh after switching to a student account', async () => {
  let resolvePending!: (rows: any[]) => void;
  fetchPending.mockReturnValueOnce(new Promise(resolve => { resolvePending = resolve; }));
  await renderLayout();
  mockAuth = { user: { userId: 'student-user' }, role: 'student', loading: false };
  await navigate('/Screen/messages');
  await act(async () => { resolvePending([{ id: 'pending-student' }]); });
  await navigate('/home');
  expect(fetchPending).toHaveBeenCalledTimes(1);
  const nav = tree.root.findByType(DashboardMenuOverlay);
  expect(nav.props.items[0].badge).toBeUndefined();
});
