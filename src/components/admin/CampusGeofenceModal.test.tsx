/* eslint-disable @typescript-eslint/no-require-imports */
import React from 'react';
import { Alert, TextInput, TouchableOpacity } from 'react-native';
import CampusGeofenceModal from './CampusGeofenceModal';
import { api } from '../../services/apiClient';
const { create, act } = require('react-test-renderer');
jest.mock('../../services/apiClient', () => ({ api: { get: jest.fn(), put: jest.fn() } }));
jest.mock('../../utils/haptics', () => ({ notificationAsync: jest.fn(), NotificationFeedbackType: { Success: 'success' } }));
let tree: any;
const policy = { id: 'campus-1', campus_name: 'School', center_latitude: '17.385', center_longitude: '78.486',
  radius_meters: '100', max_accuracy_meters: '50', max_location_age_seconds: 30, grace_period_minutes: 15,
  check_in_start_time: '07:30', check_in_end_time: '10:00', check_out_start_time: '15:30', check_out_end_time: '19:00', enforcement_mode: 'pilot' };
beforeEach(() => {
  jest.clearAllMocks();
  jest.mocked(api.get).mockResolvedValue({ ...policy });
  jest.mocked(api.put).mockResolvedValue({});
  jest.spyOn(Alert, 'alert').mockImplementation(() => {});
});
afterEach(() => { act(() => tree?.unmount()); jest.restoreAllMocks(); });
async function render() {
  await act(async () => { tree = create(<CampusGeofenceModal visible isDark={false} onClose={jest.fn()} />); });
}
const save = () => tree.root.findAllByType(TouchableOpacity).find((button: any) =>
  button.findAll((child: any) => child.props.children === 'Save Geofence Rules').length > 0);
it('preserves partial negative and decimal coordinates and saves numbers', async () => {
  await render();
  const latitude = tree.root.findAllByType(TextInput).find((input: any) => input.props.value === '17.385');
  act(() => latitude.props.onChangeText('-'));
  expect(latitude.props.value).toBe('-');
  act(() => latitude.props.onChangeText('-17.'));
  expect(latitude.props.value).toBe('-17.');
  act(() => latitude.props.onChangeText('-17.385'));
  await act(async () => { await save().props.onPress(); });
  expect(api.put).toHaveBeenCalledWith('/attendance/v2/admin/policy', expect.objectContaining({ center_latitude: -17.385, center_longitude: 78.486 }));
});
it('does not save stale defaults after the policy fails to load', async () => {
  jest.mocked(api.get).mockRejectedValueOnce(new Error('offline'));
  await render();
  expect(save().props.disabled).toBe(true);
  await act(async () => { await save().props.onPress(); });
  expect(api.put).not.toHaveBeenCalled();
});
it('requires explicit campus coordinates for a new policy', async () => {
  jest.mocked(api.get).mockResolvedValueOnce({ ...policy, id: null });
  await render();
  await act(async () => { await save().props.onPress(); });
  expect(api.put).not.toHaveBeenCalled();
  expect(Alert.alert).toHaveBeenCalledWith('Save Failed', expect.stringContaining('valid number'));
});
