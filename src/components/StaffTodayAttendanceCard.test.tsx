/* eslint-disable @typescript-eslint/no-require-imports */
import React from 'react';
import { Platform, TouchableOpacity } from 'react-native';
import StaffTodayAttendanceCard from './StaffTodayAttendanceCard';
import { staffAttendanceV2Client as client } from '../services/staffAttendanceV2Client';
const { create, act } = require('react-test-renderer');
jest.mock('../services/staffAttendanceV2Client', () => ({ staffAttendanceV2Client: {
  getTodayStatus: jest.fn(), performCheckIn: jest.fn(), performCheckOut: jest.fn(),
} }));
jest.mock('../utils/haptics', () => ({ impactAsync: jest.fn(), notificationAsync: jest.fn(),
  ImpactFeedbackStyle: { Medium: 'medium' }, NotificationFeedbackType: { Success: 'success', Error: 'error' } }));
let tree: any;
beforeEach(() => {
  jest.clearAllMocks();
  Object.defineProperty(Platform, 'OS', { value: 'android', configurable: true });
  jest.mocked(client.getTodayStatus).mockResolvedValue({ attendance_date: '2026-10-14',
    device_registration_status: 'approved', can_check_in: true, can_check_out: false, enforcement_mode: 'pilot' } as any);
});
afterEach(() => { act(() => tree?.unmount()); });
it.each(['admin', 'web'])('does not auto-submit attendance from a %s view', async view => {
  if (view === 'web') Object.defineProperty(Platform, 'OS', { value: 'web', configurable: true });
  await act(async () => { tree = create(<StaffTodayAttendanceCard isDark={false} isViewingAsAdmin={view === 'admin'} autoAction="check_in" />); });
  expect(client.performCheckIn).not.toHaveBeenCalled();
});
it('serializes rapid check-in taps before React rerenders', async () => {
  let finish!: (value: any) => void;
  jest.mocked(client.performCheckIn).mockReturnValue(new Promise(resolve => { finish = resolve; }));
  await act(async () => { tree = create(<StaffTodayAttendanceCard isDark={false} />); });
  const button = tree.root.findAllByType(TouchableOpacity).find((node: any) =>
    node.findAll((child: any) => child.props.children === 'Verified Check In').length > 0);
  expect(button).toBeDefined();
  let first: Promise<void>;
  act(() => { first = button.props.onPress(); void button.props.onPress(); });
  expect(client.performCheckIn).toHaveBeenCalledTimes(1);
  await act(async () => { finish({ success: true }); await first; });
});
