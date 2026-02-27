import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, StatusBar, KeyboardAvoidingView, Platform, Alert, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';
import AdminHeader from '../../src/components/AdminHeader';
import { useTranslation } from 'react-i18next';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useAuth } from '../../src/hooks/useAuth';
import { StaffService } from '@/src/services/staffService';
import { Functions } from '@/src/services/functions';
import { useTheme } from '../../src/hooks/useTheme';
import { Theme } from '../../src/theme/themes';
const InputField = ({
  label,
  placeholder,
  value,
  onChangeText,
  keyboardType = 'default',
  icon,
  secureTextEntry = false
}: any) => {
  const {
    theme,
    isDark
  } = useTheme();
  const styles = React.useMemo(() => getStyles(theme, isDark), [theme, isDark]);
  return <View style={styles.inputGroup}>
    <Text style={styles.label}>{label}</Text>
    <View style={styles.inputContainer}>
      <Ionicons name={icon} size={20} color="#9CA3AF" style={styles.inputIcon} />
      <TextInput style={styles.input} placeholder={placeholder} placeholderTextColor="#9CA3AF" value={value} onChangeText={onChangeText} keyboardType={keyboardType as any} secureTextEntry={secureTextEntry} />
    </View>
  </View>;
};
export default function AddStaffScreen() {
  const {
    theme,
    isDark
  } = useTheme();
  const styles = React.useMemo(() => getStyles(theme, isDark), [theme, isDark]);
  const router = useRouter();
  const {
    id
  } = useLocalSearchParams();
  const {
    t
  } = useTranslation();
  const {
    user
  } = useAuth();
  const [loading, setLoading] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    phone: '',
    designationId: '2',
    // Default: Teacher
    salary: '',
    genderId: '1',
    // Default: Male
    staffCode: '',
    dob: '',
    // YYYY-MM-DD
    joiningDate: new Date().toISOString().split('T')[0] // Today
  });
  useEffect(() => {
    if (id) {
      setIsEditMode(true);
      loadUserData(id as string);
    }
  }, [id]);
  const loadUserData = async (userId: string) => {
    try {
      const data: any = await StaffService.getById(userId);
      if (data) {
        setFormData({
          firstName: data.first_name || '',
          lastName: data.last_name || '',
          email: data.email || '',
          password: '',
          phone: data.phone || '',
          designationId: data.designation_id?.toString() || '2',
          salary: data.salary ? data.salary.toString() : '',
          genderId: data.gender ? data.gender === 'Male' ? '1' : data.gender === 'Female' ? '2' : '3' : '1',
          // Approximation
          staffCode: data.staff_code || '',
          dob: data.dob || '',
          joiningDate: data.joining_date || ''
        });
      }
    } catch (e) {
      console.error(e);
      Alert.alert("Error", "Failed to load staff data");
    }
  };
  const handleSave = async () => {
    if (!formData.firstName || !formData.lastName || !formData.staffCode || !formData.joiningDate) {
      Alert.alert("Error", "Please fill required fields (Name, Staff Code, Joining Date)");
      return;
    }
    if (!isEditMode && !formData.password) {
      Alert.alert("Error", "Password is required for new staff");
      return;
    }
    setLoading(true);
    try {
      const payload = {
        first_name: formData.firstName,
        last_name: formData.lastName,
        middle_name: '',
        email: formData.email,
        password: formData.password || undefined,
        phone: formData.phone,
        designation_id: parseInt(formData.designationId),
        department: '',
        // Not used yet
        salary: formData.salary ? parseFloat(formData.salary) : undefined,
        gender_id: parseInt(formData.genderId),
        staff_code: formData.staffCode,
        joining_date: formData.joiningDate,
        dob: formData.dob || undefined,
        role_code: formData.designationId === '10' ? 'driver' : (formData.designationId === '3' ? 'admin' : 'staff')
      };
      if (isEditMode) {
        await StaffService.update(id as string, payload as any); // Partial Update
        Alert.alert("Success", "Staff Account Updated!", [{
          text: "OK",
          onPress: () => router.back()
        }]);
      } else {
        await StaffService.create(payload);
        Alert.alert("Success", "Staff Account Created!", [{
          text: "OK",
          onPress: () => router.back()
        }]);
      }
    } catch (error: any) {
      console.error(error);
      const errorMessage = error.message || "Failed to save staff account";
      Alert.alert("Error", errorMessage);
    } finally {
      setLoading(false);
    }
  };
  return <View style={styles.container}>
    <StatusBar barStyle="dark-content" backgroundColor="#fff" />
    <AdminHeader title={isEditMode ? "Edit Staff" : "Add Staff"} showBackButton={true} />

    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{
      flex: 1
    }}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Animated.View entering={FadeInDown.delay(100).duration(500)}>
          <Text style={styles.sectionTitle}>Personal Details</Text>
          <View style={styles.row}>
            <View style={styles.halfInput}>
              <InputField label="First Name *" placeholder="Jane" value={formData.firstName} onChangeText={(t: string) => setFormData({
                ...formData,
                firstName: t
              })} icon="person-outline" />
            </View>
            <View style={styles.halfInput}>
              <InputField label="Last Name *" placeholder="Doe" value={formData.lastName} onChangeText={(t: string) => setFormData({
                ...formData,
                lastName: t
              })} icon="person-outline" />
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Gender *</Text>
            <View style={styles.radioContainer}>
              <TouchableOpacity style={[styles.radioBtn, formData.genderId === '1' && styles.radioBtnActive]} onPress={() => setFormData({
                ...formData,
                genderId: '1'
              })}>
                <Text style={[styles.radioText, formData.genderId === '1' && styles.radioTextActive]}>Male</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.radioBtn, formData.genderId === '2' && styles.radioBtnActive]} onPress={() => setFormData({
                ...formData,
                genderId: '2'
              })}>
                <Text style={[styles.radioText, formData.genderId === '2' && styles.radioTextActive]}>Female</Text>
              </TouchableOpacity>
            </View>
          </View>

          <InputField label="Date of Birth (YYYY-MM-DD)" placeholder="1990-01-01" value={formData.dob} onChangeText={(t: string) => setFormData({
            ...formData,
            dob: t
          })} icon="calendar-outline" />
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(200).duration(500)}>
          <Text style={styles.sectionTitle}>Employment Details</Text>
          <InputField label="Staff Code *" placeholder="STF-2024-001" value={formData.staffCode} onChangeText={(t: string) => setFormData({
            ...formData,
            staffCode: t
          })} icon="id-card-outline" />
          <InputField label="Joining Date (YYYY-MM-DD) *" placeholder="2024-01-01" value={formData.joiningDate} onChangeText={(t: string) => setFormData({
            ...formData,
            joiningDate: t
          })} icon="calendar-outline" />

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Designation *</Text>
            <View style={styles.radioContainer}>
              <TouchableOpacity style={[styles.radioBtn, formData.designationId === '1' && styles.radioBtnActive]} onPress={() => setFormData({
                ...formData,
                designationId: '1'
              })}>
                <Text style={[styles.radioText, formData.designationId === '1' && styles.radioTextActive]}>Principal</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.radioBtn, formData.designationId === '2' && styles.radioBtnActive]} onPress={() => setFormData({
                ...formData,
                designationId: '2'
              })}>
                <Text style={[styles.radioText, formData.designationId === '2' && styles.radioTextActive]}>Teacher</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.radioBtn, formData.designationId === '3' && styles.radioBtnActive]} onPress={() => setFormData({
                ...formData,
                designationId: '3'
              })}>
                <Text style={[styles.radioText, formData.designationId === '3' && styles.radioTextActive]}>Admin</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.radioBtn, formData.designationId === '10' && styles.radioBtnActive]} onPress={() => setFormData({
                ...formData,
                designationId: '10'
              })}>
                <Text style={[styles.radioText, formData.designationId === '10' && styles.radioTextActive]}>Driver</Text>
              </TouchableOpacity>
            </View>
          </View>

          <InputField label="Salary" placeholder="50000" value={formData.salary} onChangeText={(t: string) => setFormData({
            ...formData,
            salary: t
          })} keyboardType="numeric" icon="cash-outline" />
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(300).duration(500)}>
          <Text style={styles.sectionTitle}>Contact & Login</Text>
          <InputField label="Email Address" placeholder="staff@school.com" value={formData.email} onChangeText={(t: string) => setFormData({
            ...formData,
            email: t
          })} keyboardType="email-address" icon="mail-outline" />
          <InputField label="Phone Number" placeholder="+1 234 567" value={formData.phone} onChangeText={(t: string) => setFormData({
            ...formData,
            phone: t
          })} keyboardType="phone-pad" icon="call-outline" />
          {!isEditMode && <InputField label="Password *" placeholder="******" value={formData.password} onChangeText={(t: string) => setFormData({
            ...formData,
            password: t
          })} secureTextEntry={true} icon="lock-closed-outline" />}
        </Animated.View>


        <TouchableOpacity style={styles.saveButton} activeOpacity={0.8} onPress={handleSave} disabled={loading}>
          {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.saveButtonText}>{isEditMode ? "Update Details" : "Create Staff Member"}</Text>}
        </TouchableOpacity>

      </ScrollView>
    </KeyboardAvoidingView>
  </View>;
}
const getStyles = (theme: Theme, isDark: boolean) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.card
  },
  content: {
    padding: 20,
    paddingBottom: 50
  },
  inputGroup: {
    marginBottom: 15
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
    marginBottom: 8
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.background,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: 12,
    paddingHorizontal: 15,
    height: 50
  },
  inputIcon: {
    marginRight: 10
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#1F2937'
  },
  saveButton: {
    backgroundColor: '#2563EB',
    borderRadius: 12,
    height: 55,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 30,
    shadowColor: '#2563EB',
    shadowOffset: {
      width: 0,
      height: 4
    },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4
  },
  saveButtonText: {
    color: theme.colors.background,
    fontSize: 16,
    fontWeight: 'bold'
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#111827',
    marginTop: 10,
    marginBottom: 15
  },
  row: {
    flexDirection: 'row',
    gap: 10
  },
  halfInput: {
    flex: 1
  },
  radioContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10
  },
  radioBtn: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: theme.colors.border,
    backgroundColor: theme.colors.background
  },
  radioBtnActive: {
    borderColor: '#2563EB',
    backgroundColor: '#EFF6FF'
  },
  radioText: {
    color: '#374151',
    fontSize: 14
  },
  radioTextActive: {
    color: '#2563EB',
    fontWeight: '600'
  }
});