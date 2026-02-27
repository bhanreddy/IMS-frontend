import React, { useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image, StatusBar, ActivityIndicator, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AdminHeader from '../../src/components/AdminHeader';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { usePayroll } from '../../src/hooks/usePayroll';
import { PayrollEntry } from '../../src/types/payroll';
import { useTheme } from '../../src/hooks/useTheme';
import { Theme } from '../../src/theme/themes';
const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
export default function AccountsPayroll() {
  const {
    theme,
    isDark
  } = useTheme();
  const styles = React.useMemo(() => getStyles(theme, isDark), [theme, isDark]);
  const {
    payrollData,
    loading,
    summary,
    selectedMonth,
    selectedYear,
    setSelectedMonth,
    setSelectedYear,
    fetchPayroll,
    markAsPaid
  } = usePayroll();
  useEffect(() => {
    fetchPayroll();
  }, [selectedMonth, selectedYear]);
  const handlePrevMonth = () => {
    if (selectedMonth === 1) {
      setSelectedMonth(12);
      setSelectedYear(y => y - 1);
    } else {
      setSelectedMonth(m => m - 1);
    }
  };
  const handleNextMonth = () => {
    if (selectedMonth === 12) {
      setSelectedMonth(1);
      setSelectedYear(y => y + 1);
    } else {
      setSelectedMonth(m => m + 1);
    }
  };
  const handleProcessPay = (item: PayrollEntry) => {
    Alert.alert('Confirm Payment', `Mark ₹${item.net_salary.toLocaleString('en-IN')} as PAID for ${item.staff?.person?.first_name}?`, [{
      text: 'Cancel',
      style: 'cancel'
    }, {
      text: 'Confirm',
      onPress: async () => {
        const success = await markAsPaid(item.id);
        if (!success) Alert.alert('Error', 'Failed to update payment status');
      }
    }]);
  };
  const renderItem = ({
    item,
    index
  }: {
    item: PayrollEntry;
    index: number;
  }) => {
return <Animated.View entering={FadeInDown.delay(index * 50).duration(400)}>
            <TouchableOpacity style={styles.card} activeOpacity={0.9}>
                <View style={styles.headerRow}>
                    <Image source={{
            uri: item.staff?.person?.photo_url || 'https://cdn-icons-png.flaticon.com/512/3135/3135715.png'
          }} style={styles.avatar} />
                    <View style={styles.info}>
                        <Text style={styles.name}>
                            {item.staff?.person?.display_name || `${item.staff?.person?.first_name} ${item.staff?.person?.last_name}`}
                        </Text>
                        <Text style={styles.role}>{item.staff?.designation?.name || 'Staff'}</Text>
                    </View>
                    <View style={styles.salaryBox}>
                        <Text style={styles.salary}>₹{item.net_salary.toLocaleString('en-IN')}</Text>
                    </View>
                </View>

                <View style={styles.footer}>
                    <View style={[styles.statusBadge, item.status === 'paid' ? styles.sPaid : styles.sPending]}>
                        <Text style={[styles.statusText, item.status === 'paid' ? {
              color: '#065F46'
            } : {
              color: '#92400E'
            }]}>{item.status.toUpperCase()}</Text>
                    </View>

                    {item.status === 'paid' ? <Text style={styles.dateText}>Paid on {item.payment_date}</Text> : <TouchableOpacity style={styles.payBtn} onPress={() => handleProcessPay(item)}>
                            <Text style={styles.payBtnText}>Process Pay</Text>
                        </TouchableOpacity>}
                </View>
            </TouchableOpacity>
        </Animated.View>;
  };
  return <View style={styles.container}>
            <StatusBar barStyle="dark-content" backgroundColor="#fff" />
            <AdminHeader title="Payroll" showBackButton={true} />

            {/* MONTH SELECTOR */}
            <View style={styles.monthSelector}>
                <TouchableOpacity onPress={handlePrevMonth} style={styles.monthBtn}>
                    <Ionicons name="chevron-back" size={24} color="#374151" />
                </TouchableOpacity>
                <Text style={styles.monthText}>{MONTHS[selectedMonth - 1]} {selectedYear}</Text>
                <TouchableOpacity onPress={handleNextMonth} style={styles.monthBtn}>
                    <Ionicons name="chevron-forward" size={24} color="#374151" />
                </TouchableOpacity>
            </View>

            {/* SUMMARY CARDS */}
            <View style={styles.summaryRow}>
                <View style={[styles.summaryCard, {
        backgroundColor: '#EEF2FF'
      }]}>
                    <Text style={styles.summaryLabel}>Total Paid</Text>
                    <Text style={[styles.summaryValue, {
          color: '#4F46E5'
        }]}>
                        ₹{summary.total_paid.toLocaleString('en-IN')}
                    </Text>
                </View>
                <View style={[styles.summaryCard, {
        backgroundColor: '#FEF3C7'
      }]}>
                    <Text style={styles.summaryLabel}>Pending</Text>
                    <Text style={[styles.summaryValue, {
          color: '#D97706'
        }]}>
                        ₹{summary.total_pending.toLocaleString('en-IN')}
                    </Text>
                </View>
            </View>

            {loading ? <View style={styles.centered}>
                    <ActivityIndicator size="large" color="#4F46E5" />
                    <Text style={{
        marginTop: 10,
        color: '#6B7280'
      }}>Generating payroll...</Text>
                </View> : <FlatList data={payrollData} keyExtractor={item => item.id} renderItem={renderItem} contentContainerStyle={styles.listContent} showsVerticalScrollIndicator={false} ListEmptyComponent={<View style={styles.centered}>
                            <Text style={{
        color: '#9CA3AF'
      }}>No payroll records found.</Text>
                        </View>} />}
        </View>;
}
const getStyles = (theme: Theme, isDark: boolean) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.card
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  listContent: {
    padding: 20
  },
  // Month Selector
  monthSelector: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: theme.colors.background,
    marginHorizontal: 20,
    marginTop: 15,
    padding: 10,
    borderRadius: 12,
    elevation: 1
  },
  monthBtn: {
    padding: 5
  },
  monthText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#111827'
  },
  // Summary
  summaryRow: {
    flexDirection: 'row',
    gap: 15,
    paddingHorizontal: 20,
    marginTop: 15
  },
  summaryCard: {
    flex: 1,
    padding: 15,
    borderRadius: 12,
    alignItems: 'center'
  },
  summaryLabel: {
    fontSize: 12,
    color: theme.colors.textSecondary,
    marginBottom: 5
  },
  summaryValue: {
    fontSize: 16,
    fontWeight: 'bold'
  },
  // Card
  card: {
    backgroundColor: theme.colors.background,
    borderRadius: 16,
    padding: 15,
    marginBottom: 15,
    shadowColor: theme.colors.text,
    shadowOffset: {
      width: 0,
      height: 1
    },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 1
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 15,
    backgroundColor: theme.colors.border
  },
  info: {
    flex: 1
  },
  name: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1F2937'
  },
  role: {
    fontSize: 13,
    color: theme.colors.textSecondary
  },
  salaryBox: {
    backgroundColor: theme.colors.card,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8
  },
  salary: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#1F2937'
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: theme.colors.card,
    paddingTop: 12
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6
  },
  sPaid: {
    backgroundColor: '#D1FAE5'
  },
  sPending: {
    backgroundColor: '#FEF3C7'
  },
  statusText: {
    fontSize: 11,
    fontWeight: '700'
  },
  dateText: {
    fontSize: 12,
    color: theme.colors.textSecondary
  },
  payBtn: {
    backgroundColor: theme.colors.primary,
    paddingVertical: 6,
    paddingHorizontal: 15,
    borderRadius: 8
  },
  payBtnText: {
    color: theme.colors.background,
    fontSize: 12,
    fontWeight: '600'
  }
});