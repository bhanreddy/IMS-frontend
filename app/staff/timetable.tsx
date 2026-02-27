import React, { useState, useEffect, useMemo } from 'react';
import { View, Text, StyleSheet, Dimensions, Platform, ActivityIndicator, Pressable } from 'react-native';
import { TimetableService, TimetableSlot } from '../../src/services/timetableService';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, {
  FadeInDown, FadeIn, useAnimatedScrollHandler, useSharedValue,
  useAnimatedStyle, interpolate, Extrapolation, withRepeat, withSequence,
  withTiming, withDelay, withSpring, Easing
} from 'react-native-reanimated';
import { BlurView } from 'expo-blur';
import { useTheme } from '../../src/hooks/useTheme';
import { format } from 'date-fns';
import { Svg, Path, Circle, Rect, Line, Ellipse, G } from 'react-native-svg';

const { width, height } = Dimensions.get('window');
const FONT_FAMILY = Platform.OS === 'ios' ? 'SF Pro Display' : 'sans-serif';

// ─── Dynamic Gradient By Time of Day ───────────────────────────────
const getTimeGradient = (hour: number, isDark: boolean): string[] => {
  if (isDark) return ['#0F0A1E', '#1A1035', '#0D0B1A'];
  if (hour < 6) return ['#0F172A', '#1E1B4B', '#312E81'];       // Night
  if (hour < 10) return ['#FFF7ED', '#FEF3C7', '#ECFEFF'];       // Morning – warm peach
  if (hour < 14) return ['#F0FDFA', '#ECFEFF', '#EFF6FF'];       // Midday – cool sky
  if (hour < 17) return ['#FFFBEB', '#FEF3C7', '#F3E8FF'];       // Afternoon – golden lavender
  if (hour < 20) return ['#F5F3FF', '#EDE9FE', '#FDF2F8'];       // Evening – soft violet
  return ['#1E1B4B', '#312E81', '#0F172A'];                       // Night
};

// ─── Subject Themes ────────────────────────────────────────────────
const getSubjectTheme = (name: string) => {
  const lower = name.toLowerCase();
  if (lower.includes('math')) return { bg: 'rgba(16,185,129,0.08)', text: '#065F46', accent: '#10B981', label: 'Mathematics' };
  if (lower.includes('sci')) return { bg: 'rgba(249,115,22,0.08)', text: '#9A3412', accent: '#F97316', label: 'Science' };
  if (lower.includes('eng')) return { bg: 'rgba(139,92,246,0.08)', text: '#581C87', accent: '#8B5CF6', label: 'English' };
  if (lower.includes('hind')) return { bg: 'rgba(79,70,229,0.08)', text: '#3730A3', accent: '#4F46E5', label: 'Hindi' };
  if (lower.includes('hist')) return { bg: 'rgba(236,72,153,0.08)', text: '#9D174D', accent: '#EC4899', label: 'History' };
  if (lower.includes('geo')) return { bg: 'rgba(6,182,212,0.08)', text: '#155E75', accent: '#06B6D4', label: 'Geography' };
  if (lower.includes('comp')) return { bg: 'rgba(59,130,246,0.08)', text: '#1E40AF', accent: '#3B82F6', label: 'Computer' };
  if (lower.includes('art')) return { bg: 'rgba(244,63,94,0.08)', text: '#9F1239', accent: '#F43F5E', label: 'Art' };
  if (lower.includes('music')) return { bg: 'rgba(168,85,247,0.08)', text: '#6B21A8', accent: '#A855F7', label: 'Music' };
  if (lower.includes('sport') || lower.includes('phy'))
    return { bg: 'rgba(34,197,94,0.08)', text: '#166534', accent: '#22C55E', label: 'Sports' };
  return { bg: 'rgba(100,116,139,0.08)', text: '#334155', accent: '#64748B', label: 'Subject' };
};

// ─── Subject-Specific Anime Avatars ────────────────────────────────
const SubjectAvatar = ({ size = 44, subject = '' }: { size?: number; subject?: string }) => {
  const theme = getSubjectTheme(subject);
  const lower = subject.toLowerCase();

  // Math avatar: glasses + ruler character
  if (lower.includes('math')) {
    return (
      <Svg width={size} height={size} viewBox="0 0 48 48">
        <Circle cx="24" cy="24" r="22" fill={theme.bg.replace('0.08', '0.35')} />
        <Circle cx="24" cy="20" r="10" fill="#D1FAE5" />
        {/* Eyes with glasses */}
        <Circle cx="20" cy="19" r="3" fill="none" stroke="#065F46" strokeWidth="1.5" />
        <Circle cx="28" cy="19" r="3" fill="none" stroke="#065F46" strokeWidth="1.5" />
        <Line x1="23" y1="19" x2="25" y2="19" stroke="#065F46" strokeWidth="1.2" />
        <Circle cx="20" cy="19" r="1.2" fill="#065F46" />
        <Circle cx="28" cy="19" r="1.2" fill="#065F46" />
        {/* Smile */}
        <Path d="M21 24 Q24 27 27 24" stroke="#065F46" strokeWidth="1.2" fill="none" strokeLinecap="round" />
        {/* Ruler */}
        <Rect x="34" y="10" width="4" height="18" rx="1" fill="#10B981" fillOpacity="0.6" />
        <Line x1="34" y1="14" x2="36" y2="14" stroke="#fff" strokeWidth="0.8" />
        <Line x1="34" y1="18" x2="36" y2="18" stroke="#fff" strokeWidth="0.8" />
        <Line x1="34" y1="22" x2="36" y2="22" stroke="#fff" strokeWidth="0.8" />
        {/* Hair */}
        <Path d="M14 18 Q16 8 24 10 Q32 8 34 18" fill="#065F46" fillOpacity="0.3" />
      </Svg>
    );
  }

  // Science avatar: flask + goggles character
  if (lower.includes('sci')) {
    return (
      <Svg width={size} height={size} viewBox="0 0 48 48">
        <Circle cx="24" cy="24" r="22" fill={theme.bg.replace('0.08', '0.35')} />
        <Circle cx="24" cy="20" r="10" fill="#FFEDD5" />
        {/* Goggles */}
        <Rect x="16" y="16" width="7" height="5" rx="2" fill="none" stroke="#9A3412" strokeWidth="1.5" />
        <Rect x="25" y="16" width="7" height="5" rx="2" fill="none" stroke="#9A3412" strokeWidth="1.5" />
        <Line x1="23" y1="18.5" x2="25" y2="18.5" stroke="#9A3412" strokeWidth="1.2" />
        <Circle cx="19.5" cy="18.5" r="1" fill="#9A3412" />
        <Circle cx="28.5" cy="18.5" r="1" fill="#9A3412" />
        {/* Smile */}
        <Path d="M21 24.5 Q24 27 27 24.5" stroke="#9A3412" strokeWidth="1.2" fill="none" strokeLinecap="round" />
        {/* Flask */}
        <Path d="M36 28 L33 18 L37 18 L40 28 Q40 34 36 34 Q32 34 32 28 Z" fill="#F97316" fillOpacity="0.5" />
        <Ellipse cx="36" cy="30" rx="3" ry="1.5" fill="#FDBA74" fillOpacity="0.6" />
      </Svg>
    );
  }

  // English avatar: quill + book character
  if (lower.includes('eng')) {
    return (
      <Svg width={size} height={size} viewBox="0 0 48 48">
        <Circle cx="24" cy="24" r="22" fill={theme.bg.replace('0.08', '0.35')} />
        <Circle cx="24" cy="20" r="10" fill="#EDE9FE" />
        {/* Eyes */}
        <Ellipse cx="20" cy="19" rx="1.5" ry="2" fill="#581C87" />
        <Ellipse cx="28" cy="19" rx="1.5" ry="2" fill="#581C87" />
        {/* Smile */}
        <Path d="M21 24 Q24 27 27 24" stroke="#581C87" strokeWidth="1.2" fill="none" strokeLinecap="round" />
        {/* Blush */}
        <Ellipse cx="16" cy="22" rx="2.5" ry="1.5" fill="#DDD6FE" fillOpacity="0.7" />
        <Ellipse cx="32" cy="22" rx="2.5" ry="1.5" fill="#DDD6FE" fillOpacity="0.7" />
        {/* Quill */}
        <Path d="M35 8 Q38 14 36 22 L34 20 Q36 14 35 8 Z" fill="#8B5CF6" fillOpacity="0.6" />
        <Line x1="36" y1="22" x2="37" y2="28" stroke="#8B5CF6" strokeWidth="1" />
      </Svg>
    );
  }

  // Hindi avatar: book + pen character
  if (lower.includes('hind')) {
    return (
      <Svg width={size} height={size} viewBox="0 0 48 48">
        <Circle cx="24" cy="24" r="22" fill={theme.bg.replace('0.08', '0.35')} />
        <Circle cx="24" cy="20" r="10" fill="#E0E7FF" />
        {/* Eyes */}
        <Circle cx="20" cy="19" r="1.5" fill="#3730A3" />
        <Circle cx="28" cy="19" r="1.5" fill="#3730A3" />
        {/* Happy smile */}
        <Path d="M21 24 Q24 28 27 24" stroke="#3730A3" strokeWidth="1.3" fill="none" strokeLinecap="round" />
        {/* Bindi */}
        <Circle cx="24" cy="14" r="1.2" fill="#EF4444" />
        {/* Book */}
        <Rect x="8" y="28" width="10" height="8" rx="1" fill="#4F46E5" fillOpacity="0.5" />
        <Line x1="13" y1="28" x2="13" y2="36" stroke="#E0E7FF" strokeWidth="0.8" />
        {/* Pen */}
        <Line x1="36" y1="14" x2="40" y2="32" stroke="#4F46E5" strokeWidth="1.5" strokeLinecap="round" />
        <Circle cx="40" cy="33" r="1" fill="#4F46E5" />
      </Svg>
    );
  }

  // Default avatar: generic student character
  return (
    <Svg width={size} height={size} viewBox="0 0 48 48">
      <Circle cx="24" cy="24" r="22" fill={theme.bg.replace('0.08', '0.35')} />
      <Circle cx="24" cy="20" r="10" fill={theme.accent + '25'} />
      {/* Eyes */}
      <Circle cx="20" cy="19" r="1.5" fill={theme.text} />
      <Circle cx="28" cy="19" r="1.5" fill={theme.text} />
      {/* Smile */}
      <Path d="M21 24 Q24 27 27 24" stroke={theme.text} strokeWidth="1.2" fill="none" strokeLinecap="round" />
      {/* Star accessory */}
      <Path d="M36 12 L37.5 16 L42 16 L38.5 19 L39.5 23 L36 20.5 L32.5 23 L33.5 19 L30 16 L34.5 16 Z" fill={theme.accent} fillOpacity="0.4" />
    </Svg>
  );
};

// ─── Floating Sparkle (Reduced) ────────────────────────────────────
const FloatingElement = ({ delay, top, left, size, color, opacity }: { delay: number; top: number; left: number; size: number; color: string; opacity: number }) => {
  const translateY = useSharedValue(0);
  useEffect(() => {
    translateY.value = withDelay(delay, withRepeat(
      withSequence(
        withTiming(12, { duration: 4000, easing: Easing.inOut(Easing.ease) }),
        withTiming(-12, { duration: 4000, easing: Easing.inOut(Easing.ease) })
      ), -1, true
    ));
  }, []);
  const animatedStyle = useAnimatedStyle(() => ({ transform: [{ translateY: translateY.value }] }));

  return (
    <Animated.View style={[{ position: 'absolute', top, left }, animatedStyle]}>
      <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
        <Path d="M12 0C12 6.627 17.373 12 24 12C17.373 12 12 17.373 12 24C12 17.373 6.627 12 0 12C6.627 12 12 6.627 12 0Z" fill={color} fillOpacity={opacity} />
      </Svg>
    </Animated.View>
  );
};

// ─── Progress Helpers ──────────────────────────────────────────────
const timeToMinutes = (timeStr: string): number => {
  const [h, m] = timeStr.split(':').map(Number);
  return h * 60 + m;
};

const getPeriodStatus = (startStr: string, endStr: string, now: Date): 'upcoming' | 'active' | 'completed' => {
  const nowMin = now.getHours() * 60 + now.getMinutes();
  const startMin = timeToMinutes(startStr);
  const endMin = timeToMinutes(endStr);
  if (nowMin < startMin) return 'upcoming';
  if (nowMin > endMin) return 'completed';
  return 'active';
};

const getPeriodProgress = (startStr: string, endStr: string, now: Date): number => {
  const nowMin = now.getHours() * 60 + now.getMinutes();
  const startMin = timeToMinutes(startStr);
  const endMin = timeToMinutes(endStr);
  if (nowMin <= startMin) return 0;
  if (nowMin >= endMin) return 1;
  return (nowMin - startMin) / (endMin - startMin);
};

// ─── Animated Progress Bar ─────────────────────────────────────────
const AnimatedProgressBar = ({ progress, accent }: { progress: number; accent: string }) => {
  const animWidth = useSharedValue(0);
  useEffect(() => {
    animWidth.value = withTiming(progress, { duration: 800, easing: Easing.out(Easing.cubic) });
  }, [progress]);

  const barStyle = useAnimatedStyle(() => ({
    width: `${animWidth.value * 100}%`,
  }));

  return (
    <View style={styles.progressBarContainer}>
      <View style={styles.progressBarTrack}>
        <Animated.View style={[styles.progressBarFill, { backgroundColor: accent }, barStyle]}>
          <LinearGradient
            colors={[accent, accent + 'AA']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={StyleSheet.absoluteFill}
          />
        </Animated.View>
      </View>
      <Text style={[styles.progressText, { color: accent }]}>{Math.round(progress * 100)}%</Text>
    </View>
  );
};

// ─── Live Time Indicator ───────────────────────────────────────────
const LiveTimeIndicator = ({ isDark }: { isDark: boolean }) => {
  const pulse = useSharedValue(0.6);
  useEffect(() => {
    pulse.value = withRepeat(
      withSequence(
        withTiming(1, { duration: 1000, easing: Easing.inOut(Easing.ease) }),
        withTiming(0.6, { duration: 1000, easing: Easing.inOut(Easing.ease) })
      ), -1, true
    );
  }, []);
  const pulseStyle = useAnimatedStyle(() => ({ opacity: pulse.value }));

  return (
    <Animated.View style={[styles.liveIndicator, pulseStyle]}>
      <View style={[styles.liveIndicatorDiamond, { backgroundColor: isDark ? '#818CF8' : '#4F46E5' }]} />
      <View style={[styles.liveIndicatorLine, { backgroundColor: isDark ? '#818CF8' : '#4F46E5' }]} />
    </Animated.View>
  );
};

// ─── Slot Item Component ───────────────────────────────────────────
const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

const SlotItem = ({ item, index, currentTime, isDark, totalSlots }: {
  item: TimetableSlot; index: number; currentTime: Date; isDark: boolean; totalSlots: number;
}) => {
  const status = getPeriodStatus(item.start_time, item.end_time, currentTime);
  const isActive = status === 'active';
  const isCompleted = status === 'completed';
  const subjectTheme = getSubjectTheme(item.subject_name || '');
  const progress = isActive ? getPeriodProgress(item.start_time, item.end_time, currentTime) : 0;

  // Press animation
  const scale = useSharedValue(1);
  const handlePressIn = () => { scale.value = withSpring(0.97, { damping: 15, stiffness: 200 }); };
  const handlePressOut = () => { scale.value = withSpring(1, { damping: 15, stiffness: 200 }); };
  const animatedPressableStyle = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));

  // Active pulse for timeline dot
  const pulseOpacity = useSharedValue(0.3);
  useEffect(() => {
    if (isActive) {
      pulseOpacity.value = withRepeat(
        withSequence(
          withTiming(0.8, { duration: 1000, easing: Easing.inOut(Easing.ease) }),
          withTiming(0.3, { duration: 1000, easing: Easing.inOut(Easing.ease) })
        ), -1, true
      );
    }
  }, [isActive]);
  const pulseStyle = useAnimatedStyle(() => ({ opacity: pulseOpacity.value }));

  // Timeline line fill for active period
  const lineFill = useSharedValue(0);
  useEffect(() => {
    if (isActive) {
      lineFill.value = withTiming(progress, { duration: 600, easing: Easing.out(Easing.cubic) });
    } else if (isCompleted) {
      lineFill.value = 1;
    }
  }, [isActive, isCompleted, progress]);

  return (
    <Animated.View
      entering={FadeInDown.delay(index * 80).duration(300).easing(Easing.out(Easing.cubic))}
      style={styles.timelineRow}
    >
      {/* ── Left: Time Column ── */}
      <View style={styles.timeColumn}>
        <Text style={[
          styles.startTime,
          { color: isActive ? subjectTheme.accent : isDark ? '#94A3B8' : '#64748B' },
          isActive && styles.activeStartTime
        ]}>
          {item.start_time.substring(0, 5)}
        </Text>
        <Text style={[styles.endTime, { color: isDark ? '#475569' : '#94A3B8' }]}>
          {item.end_time.substring(0, 5)}
        </Text>
      </View>

      {/* ── Center: Timeline Line & Dot ── */}
      <View style={styles.timelineCenter}>
        {/* Top line segment */}
        {index > 0 && (
          <View style={styles.timelineLineSegment}>
            <View style={[
              styles.timelineLineBg,
              { backgroundColor: isDark ? '#1E293B' : '#E2E8F0' }
            ]} />
            {(isCompleted || isActive) && (
              <View style={[styles.timelineLineFilled, {
                backgroundColor: isCompleted ? (isDark ? '#334155' : '#CBD5E1') : subjectTheme.accent,
              }]} />
            )}
          </View>
        )}
        {index === 0 && <View style={{ height: 20 }} />}

        {/* Dot */}
        <View style={styles.dotContainer}>
          {isActive && (
            <Animated.View style={[styles.dotPulse, { backgroundColor: subjectTheme.accent }, pulseStyle]} />
          )}
          <View style={[
            styles.timelineDot,
            {
              backgroundColor: isActive ? subjectTheme.accent
                : isCompleted ? (isDark ? '#334155' : '#CBD5E1')
                  : (isDark ? '#1E293B' : '#F1F5F9'),
              borderColor: isActive ? subjectTheme.accent
                : isCompleted ? (isDark ? '#475569' : '#E2E8F0')
                  : (isDark ? '#334155' : '#CBD5E1'),
            }
          ]}>
            {isCompleted && <Ionicons name="checkmark" size={9} color={isDark ? '#94A3B8' : '#fff'} />}
            {isActive && <View style={[styles.dotInnerGlow, { backgroundColor: '#fff' }]} />}
          </View>
        </View>

        {/* Live time indicator between active and next */}
        {isActive && index < totalSlots - 1 && <LiveTimeIndicator isDark={isDark} />}

        {/* Bottom line segment */}
        {index < totalSlots - 1 && !isActive && (
          <View style={[styles.timelineLineSegment, { flex: 1 }]}>
            <View style={[styles.timelineLineBg, { backgroundColor: isDark ? '#1E293B' : '#E2E8F0' }]} />
            {isCompleted && <View style={[styles.timelineLineFilled, { backgroundColor: isDark ? '#334155' : '#CBD5E1' }]} />}
          </View>
        )}
        {isActive && (
          <View style={[styles.timelineLineSegment, { flex: 1 }]}>
            <View style={[styles.timelineLineBg, { backgroundColor: isDark ? '#1E293B' : '#E2E8F0' }]} />
          </View>
        )}
        {index === totalSlots - 1 && <View style={{ flex: 1 }} />}
      </View>

      {/* ── Right: Glass Card ── */}
      <AnimatedPressable
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        style={[styles.cardWrapper, animatedPressableStyle, isCompleted && { opacity: 0.55 }]}
      >
        <BlurView
          intensity={isActive ? 45 : 30}
          tint={isDark ? 'dark' : 'light'}
          style={[
            styles.cardBlur,
            {
              borderColor: isActive
                ? subjectTheme.accent + '30'
                : isDark ? 'rgba(255,255,255,0.08)' : 'rgba(255,255,255,0.5)',
            }
          ]}
        >
          <View style={[
            styles.cardContent,
            {
              backgroundColor: isDark
                ? (isActive ? 'rgba(30,27,75,0.6)' : 'rgba(15,23,42,0.5)')
                : (isActive ? 'rgba(255,255,255,0.7)' : 'rgba(255,255,255,0.55)'),
            },
            isActive && {
              shadowColor: subjectTheme.accent,
              shadowOpacity: 0.2,
              shadowRadius: 16,
              shadowOffset: { width: 0, height: 6 },
              elevation: 10,
            }
          ]}>
            {/* Inner depth shadow layer */}
            <View style={[styles.cardInnerShadow, {
              borderColor: isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.03)',
            }]} />

            {/* Accent bar */}
            <View style={[styles.cardAccentBar, { backgroundColor: subjectTheme.accent, opacity: isActive ? 1 : 0.5 }]} />

            {/* Card header */}
            <View style={styles.cardHeader}>
              <View style={[styles.periodBadge, { backgroundColor: subjectTheme.bg }]}>
                <Text style={[styles.periodText, { color: subjectTheme.accent, fontFamily: FONT_FAMILY }]}>
                  Period {item.period_number}
                </Text>
              </View>
              {isActive && (
                <Animated.View
                  entering={FadeIn.duration(250)}
                  style={[styles.activeTag, { backgroundColor: subjectTheme.accent + '15' }]}
                >
                  <View style={[styles.activeTagDot, { backgroundColor: subjectTheme.accent }]} />
                  <Text style={[styles.activeTagText, { color: subjectTheme.accent, fontFamily: FONT_FAMILY }]}>
                    Live
                  </Text>
                </Animated.View>
              )}
            </View>

            {/* Card body */}
            <View style={styles.cardBodyRow}>
              <View style={styles.cardTextContent}>
                <Text style={[styles.subjectName, { color: isDark ? '#F1F5F9' : '#0F172A', fontFamily: FONT_FAMILY }]}>
                  {item.subject_name}
                </Text>
                <View style={styles.detailItem}>
                  <Ionicons name="people-outline" size={13} color={isDark ? '#64748B' : '#94A3B8'} />
                  <Text style={[styles.detailText, { color: isDark ? '#64748B' : '#94A3B8', fontFamily: FONT_FAMILY }]}>
                    {item.class_name} - {item.section_name}
                  </Text>
                </View>
              </View>
              <SubjectAvatar size={44} subject={item.subject_name || 'N/A'} />
            </View>

            {/* Animated Progress Bar for active period */}
            {isActive && (
              <Animated.View entering={FadeIn.duration(300)}>
                <AnimatedProgressBar progress={progress} accent={subjectTheme.accent} />
              </Animated.View>
            )}
          </View>
        </BlurView>
      </AnimatedPressable>
    </Animated.View>
  );
};

// ─── Main Screen ───────────────────────────────────────────────────
const TimeTableScreen = () => {
  const { isDark } = useTheme();
  const [loading, setLoading] = useState(true);
  const [slots, setSlots] = useState<TimetableSlot[]>([]);
  const [currentTime, setCurrentTime] = useState(new Date());

  const scrollY = useSharedValue(0);
  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => { scrollY.value = event.contentOffset.y; }
  });

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 30000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => { loadTimetable(); }, []);

  const loadTimetable = async () => {
    try {
      const data = await TimetableService.getTeacherTimetable();
      setSlots(data.sort((a, b) => a.period_number - b.period_number));
    } catch (error) {
      console.error("Failed to load timetable", error);
    } finally {
      setLoading(false);
    }
  };

  const headerAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: interpolate(scrollY.value, [0, 120], [0, -40], Extrapolation.CLAMP) }],
    opacity: interpolate(scrollY.value, [0, 120], [1, 0.8], Extrapolation.CLAMP),
  }));

  const getGreeting = () => {
    const hour = currentTime.getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 17) return 'Good Afternoon';
    return 'Good Evening';
  };

  const getGreetingEmoji = () => {
    const hour = currentTime.getHours();
    if (hour < 6) return '🌙';
    if (hour < 12) return '☀️';
    if (hour < 17) return '🌤️';
    if (hour < 20) return '🌅';
    return '🌙';
  };

  const gradientColors = useMemo(
    () => getTimeGradient(currentTime.getHours(), isDark),
    [currentTime.getHours(), isDark]
  );

  // Stats
  const totalPeriods = slots.length;
  const completedPeriods = slots.filter(s => getPeriodStatus(s.start_time, s.end_time, currentTime) === 'completed').length;
  const activePeriod = slots.find(s => getPeriodStatus(s.start_time, s.end_time, currentTime) === 'active');

  return (
    <View style={styles.container}>
      {/* Dynamic Gradient Background */}
      <LinearGradient
        colors={gradientColors as any}
        style={StyleSheet.absoluteFillObject}
        start={{ x: 0, y: 0 }}
        end={{ x: 0.5, y: 1 }}
      />

      {/* Reduced Background Sparkles (2 instead of 4, lower opacity) */}
      <FloatingElement delay={0} top={height * 0.12} left={width * 0.75} size={40} color={isDark ? '#6366F1' : '#C7D2FE'} opacity={0.09} />
      <FloatingElement delay={800} top={height * 0.55} left={width * 0.08} size={50} color={isDark ? '#A855F7' : '#DDD6FE'} opacity={0.06} />

      <Animated.ScrollView
        onScroll={scrollHandler}
        scrollEventThrottle={16}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 130 }}
      >
        {/* ── Header ── */}
        <Animated.View style={[styles.headerContainer, headerAnimatedStyle]}>
          <View style={styles.headerContent}>
            <View>
              <Text style={[styles.greeting, { color: isDark ? '#CBD5E1' : '#64748B', fontFamily: FONT_FAMILY }]}>
                {getGreeting()} {getGreetingEmoji()}
              </Text>
              <Text style={[styles.dateText, { color: isDark ? '#F8FAFC' : '#0F172A', fontFamily: FONT_FAMILY }]}>
                {format(currentTime, 'EEEE, dd MMM')}
              </Text>
            </View>

            {/* Quick Stats Capsule */}
            <Animated.View entering={FadeIn.delay(200).duration(400)} style={[
              styles.statsCapsule,
              { backgroundColor: isDark ? 'rgba(30,27,75,0.6)' : 'rgba(255,255,255,0.6)' }
            ]}>
              <View style={styles.statsItem}>
                <Text style={[styles.statsNumber, { color: isDark ? '#818CF8' : '#4F46E5', fontFamily: FONT_FAMILY }]}>
                  {completedPeriods}
                </Text>
                <Text style={[styles.statsLabel, { color: isDark ? '#64748B' : '#94A3B8', fontFamily: FONT_FAMILY }]}>done</Text>
              </View>
              <View style={[styles.statsDivider, { backgroundColor: isDark ? '#334155' : '#E2E8F0' }]} />
              <View style={styles.statsItem}>
                <Text style={[styles.statsNumber, { color: isDark ? '#818CF8' : '#4F46E5', fontFamily: FONT_FAMILY }]}>
                  {totalPeriods}
                </Text>
                <Text style={[styles.statsLabel, { color: isDark ? '#64748B' : '#94A3B8', fontFamily: FONT_FAMILY }]}>total</Text>
              </View>
            </Animated.View>
          </View>

          {/* Active Period Banner */}
          {activePeriod && (
            <Animated.View entering={FadeInDown.delay(300).duration(300)} style={[
              styles.activeBanner,
              { backgroundColor: isDark ? 'rgba(79,70,229,0.12)' : 'rgba(79,70,229,0.06)' }
            ]}>
              <View style={styles.activeBannerDot} />
              <Text style={[styles.activeBannerText, { color: isDark ? '#A5B4FC' : '#4F46E5', fontFamily: FONT_FAMILY }]}>
                Now: {activePeriod.subject_name} · {activePeriod.class_name} - {activePeriod.section_name}
              </Text>
            </Animated.View>
          )}
        </Animated.View>

        {/* ── Content ── */}
        {loading ? (
          <View style={styles.center}>
            <ActivityIndicator size="large" color={isDark ? '#818CF8' : '#4F46E5'} />
          </View>
        ) : slots.length > 0 ? (
          <View style={styles.timelineWrapper}>
            {slots.map((slot, index) => (
              <SlotItem
                key={slot.id || `slot-${index}`}
                item={slot}
                index={index}
                currentTime={currentTime}
                isDark={isDark}
                totalSlots={slots.length}
              />
            ))}
          </View>
        ) : (
          <Animated.View entering={FadeInDown.duration(400)} style={styles.emptyState}>
            <View style={styles.emptyIconContainer}>
              <Ionicons name="calendar-outline" size={64} color={isDark ? '#334155' : '#D1D5DB'} />
            </View>
            <Text style={[styles.emptyTitle, { color: isDark ? '#E2E8F0' : '#0F172A', fontFamily: FONT_FAMILY }]}>
              No classes today
            </Text>
            <Text style={[styles.emptySubtitle, { color: isDark ? '#64748B' : '#94A3B8', fontFamily: FONT_FAMILY }]}>
              Enjoy your free time ✨
            </Text>
          </Animated.View>
        )}
      </Animated.ScrollView>
    </View>
  );
};

export default TimeTableScreen;

// ─── Styles ────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  center: {
    marginTop: 100,
    justifyContent: 'center',
    alignItems: 'center',
  },

  // Header
  headerContainer: {
    paddingTop: Platform.OS === 'ios' ? 66 : 48,
    paddingBottom: 24,
    paddingHorizontal: 24,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  greeting: {
    fontSize: 15,
    fontWeight: '600',
    letterSpacing: 0.2,
    marginBottom: 4,
  },
  dateText: {
    fontSize: 24,
    fontWeight: '800',
    letterSpacing: -0.6,
  },

  // Stats Capsule
  statsCapsule: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 16,
    gap: 12,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.15)',
  },
  statsItem: {
    alignItems: 'center',
    gap: 1,
  },
  statsNumber: {
    fontSize: 18,
    fontWeight: '800',
    letterSpacing: -0.5,
  },
  statsLabel: {
    fontSize: 10,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  statsDivider: {
    width: 1,
    height: 20,
  },

  // Active Banner
  activeBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 16,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 12,
    gap: 8,
  },
  activeBannerDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#4F46E5',
  },
  activeBannerText: {
    fontSize: 13,
    fontWeight: '600',
    letterSpacing: -0.1,
    flex: 1,
  },

  // Timeline
  timelineWrapper: {
    paddingHorizontal: 20,
    paddingTop: 4,
  },
  timelineRow: {
    flexDirection: 'row',
    minHeight: 120,
  },

  // Time Column
  timeColumn: {
    width: 56,
    alignItems: 'flex-end',
    paddingRight: 12,
    paddingTop: 16,
  },
  startTime: {
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: -0.3,
  },
  activeStartTime: {
    fontSize: 17,
    fontWeight: '800',
  },
  endTime: {
    fontSize: 12,
    fontWeight: '500',
    marginTop: 3,
  },

  // Center Timeline
  timelineCenter: {
    width: 28,
    alignItems: 'center',
  },
  timelineLineSegment: {
    width: 2.5,
    height: 22,
    position: 'relative',
    overflow: 'hidden',
  },
  timelineLineBg: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 2,
  },
  timelineLineFilled: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 2,
  },
  dotContainer: {
    width: 22,
    height: 22,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  timelineDot: {
    width: 14,
    height: 14,
    borderRadius: 7,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 2,
  },
  dotInnerGlow: {
    width: 5,
    height: 5,
    borderRadius: 3,
  },
  dotPulse: {
    position: 'absolute',
    width: 26,
    height: 26,
    borderRadius: 13,
    zIndex: 1,
  },

  // Live Time Indicator
  liveIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 16,
    zIndex: 10,
  },
  liveIndicatorDiamond: {
    width: 7,
    height: 7,
    borderRadius: 1.5,
    transform: [{ rotate: '45deg' }],
  },
  liveIndicatorLine: {
    width: 10,
    height: 1.5,
    marginLeft: -1,
    borderRadius: 1,
  },

  // Cards
  cardWrapper: {
    flex: 1,
    paddingLeft: 10,
    paddingBottom: 16,
  },
  cardBlur: {
    flex: 1,
    borderRadius: 20,
    overflow: 'hidden',
    borderWidth: 1,
  },
  cardContent: {
    flex: 1,
    padding: 16,
    borderRadius: 20,
  },
  cardInnerShadow: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 20,
    borderWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.12)',
    borderLeftColor: 'rgba(255,255,255,0.08)',
    borderRightColor: 'rgba(0,0,0,0.02)',
    borderBottomColor: 'rgba(0,0,0,0.04)',
    pointerEvents: 'none',
  },
  cardAccentBar: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: 4,
    borderTopLeftRadius: 20,
    borderBottomLeftRadius: 20,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  periodBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
  },
  periodText: {
    fontSize: 10,
    fontWeight: '800',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  activeTag: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    gap: 5,
  },
  activeTagDot: {
    width: 5,
    height: 5,
    borderRadius: 3,
  },
  activeTagText: {
    fontSize: 10,
    fontWeight: '800',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  cardBodyRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardTextContent: {
    flex: 1,
    paddingRight: 8,
  },
  subjectName: {
    fontSize: 20,
    fontWeight: '800',
    marginBottom: 5,
    letterSpacing: -0.4,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  detailText: {
    fontSize: 13,
    fontWeight: '500',
    letterSpacing: -0.1,
  },

  // Progress Bar
  progressBarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
    gap: 8,
  },
  progressBarTrack: {
    flex: 1,
    height: 4,
    backgroundColor: 'rgba(0,0,0,0.06)',
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressText: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: -0.2,
    minWidth: 32,
    textAlign: 'right',
  },

  // Empty State
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 80,
    gap: 8,
  },
  emptyIconContainer: {
    marginBottom: 16,
    opacity: 0.7,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '700',
    letterSpacing: -0.3,
  },
  emptySubtitle: {
    fontSize: 14,
    fontWeight: '500',
  },
});