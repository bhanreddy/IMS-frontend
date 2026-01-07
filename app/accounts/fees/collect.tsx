import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, Alert, ActivityIndicator } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import AdminHeader from '../../../src/components/AdminHeader';
import { useAuth } from '../../../src/hooks/useAuth';
import { FeesService } from '../../../src/services/fees.service';

export default function CollectFeesScreen() {
    const router = useRouter();
    const params = useLocalSearchParams();
    const { user } = useAuth();
    const [loading, setLoading] = useState(false);

    // Params from list
    const feeId = params.feeId as string;
    const studentName = params.name as string;
    const dueAmount = params.due as string;

    const [amount, setAmount] = useState('');
    const [mode, setMode] = useState('Cash'); // Cash, UPI, Cheque
    const [remarks, setRemarks] = useState('');

    const handleCollect = async () => {
        if (!amount) {
            Alert.alert("Error", "Please enter amount");
            return;
        }

        if (!feeId) {
            Alert.alert("Error", "Fee ID is required");
            return;
        }

        setLoading(true);
        try {
            await FeesService.payFee(feeId, {
                amount: parseFloat(amount),
                method: mode.toLowerCase(),
                remarks,
                collectedBy: user?.uid
            });

            Alert.alert("Success", "Fee collected successfully!", [
                { text: "OK", onPress: () => router.back() }
            ]);
        } catch (error) {
            Alert.alert("Error", "Failed to collect fee");
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            <AdminHeader title="Collect Fee" showBackButton={true} />
            <ScrollView contentContainerStyle={styles.content}>

                <View style={styles.infoCard}>
                    <Text style={styles.label}>Student Name</Text>
                    <Text style={styles.value}>{studentName || 'Unknown'}</Text>

                    <View style={styles.divider} />

                    <Text style={styles.label}>Due Amount</Text>
                    <Text style={[styles.value, { color: '#EF4444' }]}>₹{dueAmount || '0'}</Text>
                </View>

                <View style={styles.form}>
                    <Text style={styles.sectionTitle}>Payment Details</Text>

                    <Text style={styles.inputLabel}>Amount (₹)</Text>
                    <TextInput
                        style={styles.input}
                        keyboardType="numeric"
                        value={amount}
                        onChangeText={setAmount}
                        placeholder="Enter amount"
                    />

                    <Text style={styles.inputLabel}>Payment Mode</Text>
                    <View style={styles.modeRow}>
                        {['Cash', 'UPI', 'Cheque'].map((m) => (
                            <TouchableOpacity
                                key={m}
                                style={[styles.modeBtn, mode === m && styles.modeBtnActive]}
                                onPress={() => setMode(m)}
                            >
                                <Text style={[styles.modeText, mode === m && styles.modeTextActive]}>{m}</Text>
                            </TouchableOpacity>
                        ))}
                    </View>

                    <Text style={styles.inputLabel}>Remarks (Optional)</Text>
                    <TextInput
                        style={[styles.input, { height: 80, textAlignVertical: 'top' }]}
                        multiline
                        value={remarks}
                        onChangeText={setRemarks}
                        placeholder="e.g. Receipt No. 1234"
                    />

                    <TouchableOpacity
                        style={styles.payBtn}
                        onPress={handleCollect}
                        disabled={loading}
                    >
                        {loading ? <ActivityIndicator color="#fff" /> : (
                            <Text style={styles.payBtnText}>Collect Payment</Text>
                        )}
                    </TouchableOpacity>

                </View>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F3F4F6',
    },
    content: {
        padding: 20,
    },
    infoCard: {
        backgroundColor: '#fff',
        padding: 20,
        borderRadius: 16,
        marginBottom: 20,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 5,
        elevation: 2,
    },
    label: {
        fontSize: 13,
        color: '#6B7280',
        marginBottom: 4,
    },
    value: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#1F2937',
    },
    divider: {
        height: 1,
        backgroundColor: '#E5E7EB',
        marginVertical: 15,
    },
    form: {
        backgroundColor: '#fff',
        padding: 20,
        borderRadius: 16,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 20,
        color: '#111827',
    },
    inputLabel: {
        fontSize: 14,
        fontWeight: '600',
        color: '#374151',
        marginBottom: 8,
    },
    input: {
        backgroundColor: '#F9FAFB',
        borderWidth: 1,
        borderColor: '#E5E7EB',
        borderRadius: 10,
        padding: 12,
        fontSize: 16,
        color: '#1F2937',
        marginBottom: 20,
    },
    modeRow: {
        flexDirection: 'row',
        gap: 10,
        marginBottom: 20,
    },
    modeBtn: {
        flex: 1,
        paddingVertical: 10,
        borderWidth: 1,
        borderColor: '#E5E7EB',
        borderRadius: 8,
        alignItems: 'center',
    },
    modeBtnActive: {
        backgroundColor: '#EFF6FF',
        borderColor: '#3B82F6',
    },
    modeText: {
        fontSize: 14,
        color: '#6B7280',
        fontWeight: '500',
    },
    modeTextActive: {
        color: '#3B82F6',
        fontWeight: '700',
    },
    payBtn: {
        backgroundColor: '#10B981',
        paddingVertical: 15,
        borderRadius: 12,
        alignItems: 'center',
        marginTop: 10,
    },
    payBtnText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
});
