import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    Pressable,
    Dimensions,
    ActivityIndicator
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import ScreenLayout from '../../src/components/ScreenLayout';
import StudentHeader from '../../src/components/StudentHeader';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../src/hooks/useAuth';
import { ComplaintService } from '../../src/services/commonServices';
import { Complaint } from '../../src/types/models';

interface UIComplaint {
    id: string;
    title: string;
    description: string;
    type: string;
    severity: string;
    filedBy: string;
    date: string;
    status: string;
    color: string;
    icon: string;
}

export default function ComplaintsScreen() {
    const { t } = useTranslation();
    const { user } = useAuth();
    const [activeFilter, setActiveFilter] = useState('All');
    const filters = ['All', 'High', 'Medium', 'Low'];
    const [complaints, setComplaints] = useState<UIComplaint[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadComplaints();
    }, [user]);

    const loadComplaints = async () => {
        if (!user) return;
        setLoading(true);
        try {
            const data = await ComplaintService.getStudentComplaints(user.id || '');
            // Map to UI format
            const uiData = data.map((c) => {
                const severity = c.priority === 'urgent' || c.priority === 'high' ? 'High' :
                    c.priority === 'medium' ? 'Medium' : 'Low';
                const color = severity === 'High' ? '#EF4444' :
                    severity === 'Medium' ? '#F59E0B' : '#6366F1';

                return {
                    id: c.id,
                    title: c.title || 'Behavior Report',
                    description: c.description,
                    type: c.category?.toUpperCase() || 'OTHER',
                    severity,
                    filedBy: c.raised_by || 'Staff',
                    date: c.created_at ? new Date(c.created_at).toLocaleDateString() : 'Recent',
                    status: c.status.charAt(0).toUpperCase() + c.status.slice(1).replace('_', ' '),
                    color,
                    icon: severity === 'High' ? 'alert-circle' : 'information-circle'
                };
            });
            setComplaints(uiData);
        } catch (e) {
            console.error("Failed to load complaints", e);
        } finally {
            setLoading(false);
        }
    };

    const filteredComplaints = complaints.filter(c =>
        activeFilter === 'All' ? true : c.severity === activeFilter
    );

    return (
        <ScreenLayout>
            <StudentHeader showBackButton={true} title={t('home.regular_complaints') || "Complaints"} />

            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.container}
            >
                {/* ===== SUMMARY CARD ===== */}
                <Animated.View
                    entering={FadeInDown.duration(600).springify()}
                    style={styles.summaryWrapper}
                >
                    <LinearGradient
                        colors={['#6366F1', '#8B5CF6', '#A855F7']}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                        style={styles.summaryCard}
                    >
                        <View style={styles.summaryDecor1} />
                        <View style={styles.summaryDecor2} />

                        <View style={styles.summaryHeader}>
                            <View>
                                <Text style={styles.summaryTitle}>Behaviour Overview</Text>
                                <Text style={styles.summarySub}>Academic Year</Text>
                            </View>
                            {/* Trend badge removed for dynamic data unless calculated */}
                        </View>

                        <View style={styles.statsRow}>
                            <StatCard label="Total Remarks" value={complaints.length.toString()} icon="list" />
                            <StatCard
                                label="Critical"
                                value={complaints.filter(c => c.severity === 'High').length.toString()}
                                icon="alert-circle"
                                accent="#EF4444"
                            />
                            <StatCard
                                label="Warnings"
                                value={complaints.filter(c => c.severity === 'Medium').length.toString()}
                                icon="warning"
                                accent="#F59E0B"
                            />
                        </View>
                    </LinearGradient>
                </Animated.View>

                {/* ===== FILTER CHIPS ===== */}
                <Animated.View
                    entering={FadeInDown.delay(200).duration(600)}
                    style={styles.filtersContainer}
                >
                    <Text style={styles.filterLabel}>Filter by severity</Text>
                    <ScrollView
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        contentContainerStyle={styles.filterChips}
                    >
                        {filters.map((filter) => (
                            <Pressable
                                key={filter}
                                onPress={() => setActiveFilter(filter)}
                                style={({ pressed }) => [
                                    styles.filterChip,
                                    activeFilter === filter && styles.filterChipActive,
                                    pressed && styles.filterChipPressed,
                                ]}
                            >
                                <Text style={[
                                    styles.filterChipText,
                                    activeFilter === filter && styles.filterChipTextActive
                                ]}>
                                    {filter}
                                </Text>
                            </Pressable>
                        ))}
                    </ScrollView>
                </Animated.View>

                {/* ===== LIST ===== */}
                {loading ? <ActivityIndicator color="#6366F1" /> : (
                    filteredComplaints.length === 0 ? (
                        <View style={styles.emptyState}>
                            <Ionicons name="checkmark-circle-outline" size={48} color="#10B981" />
                            <Text style={styles.emptyText}>Clean Record! Keep it up.</Text>
                        </View>
                    ) : (
                        filteredComplaints.map((item, index) => (
                            <Animated.View
                                key={item.id}
                                entering={FadeInDown.delay(300 + index * 100).springify()}
                                style={styles.cardWrapper}
                            >
                                <Pressable style={styles.card}>
                                    <View style={[styles.accentBar, { backgroundColor: item.color }]} />
                                    <View style={styles.cardHeader}>
                                        <View style={styles.teacherBlock}>
                                            <View style={styles.teacherInfo}>
                                                <Text style={styles.teacherName}>{item.filedBy}</Text>
                                                <Text style={styles.subject}>Staff Member</Text>
                                            </View>
                                        </View>
                                        <SeverityBadge text={item.severity} color={item.color} icon={item.icon} />
                                    </View>
                                    <View style={styles.cardBody}>
                                        <Text style={styles.title}>{item.title}</Text>
                                        <Text style={styles.desc}>{item.description}</Text>
                                    </View>
                                    <View style={styles.footer}>
                                        <View style={styles.time}>
                                            <Ionicons name="time-outline" size={14} color="#94A3B8" />
                                            <Text style={styles.timeText}>{item.date}</Text>
                                        </View>
                                        <View style={[styles.statusTag]}>
                                            <Text style={styles.statusTextData}>{item.status}</Text>
                                        </View>
                                    </View>
                                </Pressable>
                            </Animated.View>
                        ))
                    )
                )}
                <View style={{ height: 40 }} />
            </ScrollView>
        </ScreenLayout>
    );
}

// ... Reused components (StatCard, SeverityBadge) and Styles ...
// Simply copy-pasting the style definitions or importing them if separated preferably
// For overwrite, I must include them.

const StatCard = ({ label, value, icon, accent }: any) => (
    <View style={styles.statCard}>
        <View style={[styles.statIcon, accent && { backgroundColor: `${accent}20` }]}>
            <Ionicons name={icon} size={18} color={accent || '#fff'} />
        </View>
        <Text style={[styles.statValue, accent && { color: accent }]}>
            {value}
        </Text>
        <Text style={styles.statLabel}>{label}</Text>
    </View>
);

const SeverityBadge = ({ text, color, icon }: any) => (
    <View style={[styles.badge, { backgroundColor: `${color}15`, borderColor: `${color}40` }]}>
        <Ionicons name={icon} size={14} color={color} />
        <Text style={[styles.badgeText, { color }]}>{text}</Text>
    </View>
);

const styles = StyleSheet.create({
    container: {
        padding: 20,
        paddingTop: 16,
    },
    summaryWrapper: { marginBottom: 24 },
    summaryCard: {
        borderRadius: 28,
        padding: 24,
        position: 'relative',
        overflow: 'hidden',
        shadowColor: '#6366F1',
        shadowOffset: { width: 0, height: 12 },
        shadowOpacity: 0.3,
        shadowRadius: 24,
        elevation: 12,
    },
    summaryDecor1: { position: 'absolute', top: -40, right: -40, width: 120, height: 120, borderRadius: 60, backgroundColor: 'rgba(255, 255, 255, 0.1)' },
    summaryDecor2: { position: 'absolute', bottom: -30, left: -30, width: 100, height: 100, borderRadius: 50, backgroundColor: 'rgba(255, 255, 255, 0.08)' },
    summaryHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20 },
    summaryTitle: { fontSize: 20, fontWeight: '800', color: '#FFFFFF', marginBottom: 4 },
    summarySub: { fontSize: 13, color: 'rgba(255, 255, 255, 0.8)', fontWeight: '500' },
    statsRow: { flexDirection: 'row', gap: 12 },
    statCard: { flex: 1, backgroundColor: 'rgba(255, 255, 255, 0.15)', borderRadius: 18, padding: 14, alignItems: 'center', borderWidth: 1, borderColor: 'rgba(255, 255, 255, 0.2)' },
    statIcon: { width: 36, height: 36, borderRadius: 18, backgroundColor: 'rgba(255, 255, 255, 0.2)', justifyContent: 'center', alignItems: 'center', marginBottom: 8 },
    statValue: { fontSize: 22, fontWeight: '800', color: '#FFFFFF', marginBottom: 2 },
    statLabel: { fontSize: 10, color: 'rgba(255, 255, 255, 0.8)', fontWeight: '600', textAlign: 'center' },
    filtersContainer: { marginBottom: 24 },
    filterLabel: { fontSize: 13, fontWeight: '600', color: '#64748B', marginBottom: 12, marginLeft: 4 },
    filterChips: { flexDirection: 'row', gap: 10 },
    filterChip: { paddingHorizontal: 18, paddingVertical: 10, borderRadius: 16, backgroundColor: '#F8FAFC', borderWidth: 1.5, borderColor: '#E2E8F0', flexDirection: 'row', alignItems: 'center', gap: 8 },
    filterChipActive: { borderColor: '#6366F1', shadowColor: '#6366F1', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.2, shadowRadius: 8, elevation: 4 },
    filterChipPressed: { transform: [{ scale: 0.96 }] },
    filterChipText: { fontSize: 14, fontWeight: '600', color: '#64748B' },
    filterChipTextActive: { color: '#FFFFFF' },
    emptyState: { alignItems: 'center', paddingVertical: 40, opacity: 0.5 },
    emptyText: { marginTop: 10, fontWeight: '600', color: '#6b7280' },
    cardWrapper: { marginBottom: 16 },
    card: { backgroundColor: '#FFFFFF', borderRadius: 24, padding: 20, borderWidth: 1.5, borderColor: '#F1F5F9', position: 'relative', overflow: 'hidden', shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.06, shadowRadius: 12, elevation: 3 },
    accentBar: { position: 'absolute', top: 0, left: 0, width: 4, height: '100%' },
    cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 },
    teacherBlock: { flexDirection: 'row', gap: 12, flex: 1 },
    teacherInfo: { justifyContent: 'center' },
    teacherName: { fontSize: 16, fontWeight: '700', color: '#1E293B', marginBottom: 4 },
    subject: { fontSize: 13, color: '#64748B', fontWeight: '500' },
    badge: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 12, paddingVertical: 6, borderRadius: 12, borderWidth: 1.5 },
    badgeText: { fontSize: 12, fontWeight: '700' },
    cardBody: { marginBottom: 16 },
    title: { fontSize: 16, fontWeight: '700', color: '#0F172A', marginBottom: 8 },
    desc: { fontSize: 14, color: '#64748B', lineHeight: 21, fontWeight: '500' },
    footer: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingTop: 16, borderTopWidth: 1, borderTopColor: '#F1F5F9' },
    time: { flexDirection: 'row', gap: 8, alignItems: 'center' },
    timeText: { fontSize: 13, color: '#64748B', fontWeight: '600' },
    statusTag: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8 },
    statusTextData: { fontSize: 11, fontWeight: '700', color: '#6b7280' }
});


