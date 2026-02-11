import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Dimensions,
  Image,
} from "react-native";
import { FontAwesome5, MaterialIcons, Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import Animated, { FadeInDown, FadeInUp } from "react-native-reanimated";
import { LinearGradient } from "expo-linear-gradient";
import { useTranslation } from 'react-i18next';
import { useAuth } from '../src/hooks/useAuth';
import { ActivityIndicator } from 'react-native';
import { SCHOOL_CONFIG } from '../src/constants/schoolConfig';


const { width } = Dimensions.get("window");

export default function Index() {
  const router = useRouter();
  const { t } = useTranslation();
  const { user, loading } = useAuth();

  return (
    <SafeAreaView style={styles.container}>
      {/* ================= LOADING STATE (SPLASH) ================= */}
      {(loading || user) ? (
        <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
          <ActivityIndicator size="large" color="#4F46E5" />
        </View>
      ) : (
        <>
          {/* ================= HEADER (OLD STYLE REFINED) ================= */}
          <Animated.View
            entering={FadeInDown.duration(800)}
            style={styles.header}
          >

            <LinearGradient
              colors={["#3a1c71", "#d76d77", "#ffaf7b"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.headerGradient}
            >
              <View style={styles.headerContent}>
                <View style={styles.headerRow}>
                  <Image source={SCHOOL_CONFIG.logo} style={styles.schoolLogo} />
                  <Text style={styles.schoolName}>{SCHOOL_CONFIG.name}</Text>
                </View>

                <Text style={styles.welcomeText}>{t('index.welcome')}</Text>
                <Text style={styles.bigTitle}>{t('index.futuristic')}</Text>
                <Text style={styles.bigTitle}>{t('index.next_gen')}</Text>
                <Text style={styles.bigTitle}>{t('index.education')}</Text>
              </View>
            </LinearGradient>



            {/* Decorative Icon */}
            <FontAwesome5
              name="walking"
              size={120}
              color="rgba(255,255,255,0.15)"
              style={styles.walkIcon}
            />
          </Animated.View>

          {/* ================= CONTENT ================= */}
          <View style={styles.content}>
            <Animated.Text
              entering={FadeInDown.delay(300)}
              style={styles.tagline}
            >
              {t('index.tagline')}
            </Animated.Text>

            {/* ================= LOGIN GRID (NEW STYLE) ================= */}
            <View style={styles.grid}>
              <LoginCard
                icon={<FontAwesome5 name="user-graduate" size={30} color="#4F46E5" />}
                title={t('index.student_login')}
                delay={400}
                onPress={() => router.push("/login")}
              />

              <LoginCard
                icon={<Ionicons name="people" size={30} color="#10B981" />}
                title={t('index.staff_login')}
                delay={500}
                onPress={() => router.push("/staff-login")}
              />

              <LoginCard
                icon={<MaterialIcons name="groups" size={32} color="#8B5CF6" />}
                title={t('index.admin_login')}
                delay={600}
                onPress={() => router.push("/admin-login")}
              />

              <LoginCard
                icon={<FontAwesome5 name="calculator" size={30} color="#F59E0B" />}
                title={t('index.accounts_login')}
                delay={700}
                onPress={() => router.push("/accounts-login")}
              />
            </View>

            <Animated.Text
              entering={FadeInUp.delay(900)}
              style={styles.footer}
            >
              {t('index.powered_by')}
            </Animated.Text>
          </View>
        </>
      )}
    </SafeAreaView>
  );
}

/* ================= LOGIN CARD ================= */

type CardProps = {
  icon: React.ReactElement;
  title: string;
  onPress: () => void;
  delay: number;
  // added delay prop to avoid errors if strict ts check
};

function LoginCard({ icon, title, onPress, delay }: CardProps) {
  return (
    <Animated.View
      entering={FadeInDown.delay(delay)}
      style={styles.cardWrapper}
    >
      <Pressable
        onPress={onPress}
        style={({ pressed }) => [
          styles.card,
          pressed && styles.cardPressed,
        ]}
      >
        <View style={styles.iconCircle}>{icon}</View>
        <Text style={styles.cardText}>{title}</Text>
      </Pressable>
    </Animated.View>
  );
}


/* ================= STYLES ================= */
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F9FA",
  },

  /* ================= HEADER ================= */
  header: {
    height: 300,
    // Removed padding from here so gradient can fill edge-to-edge
    borderBottomRightRadius: width,
    justifyContent: "flex-start",
    overflow: "hidden",
    backgroundColor: "#fff", // Fallback
  },
  headerGradient: {
    flex: 1,
    // No padding here either if we want full bleed, 
    // but the content inside needs padding.
    width: "100%",
    height: "100%",
  },
  headerContent: {
    padding: 24, // Padding moved here
    flex: 1,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 28,
  },
  schoolName: {
    color: "#fff",
    fontSize: 22,
    fontWeight: "800",
    letterSpacing: 0.4,
  },
  schoolLogo: {
    width: 50,
    height: 50,
    resizeMode: "contain",
  },
  welcomeText: {
    color: "rgba(255,255,255,0.85)",
    fontSize: 14,
    fontWeight: "700",
    letterSpacing: 2,
    marginBottom: 6,
  },
  bigTitle: {
    color: "#fff",
    fontSize: 30,
    fontWeight: "900",
    lineHeight: 36,
  },
  walkIcon: {
    position: "absolute",
    right: -20,
    bottom: -30,
    transform: [{ rotate: "-15deg" }],
  },

  /* ================= CONTENT ================= */
  content: {
    flex: 1,
    padding: 24,
    marginTop: -10,
  },
  tagline: {
    fontSize: 18,
    fontWeight: "600",
    color: "#374151",
    marginBottom: 24,
  },

  /* ================= GRID ================= */
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    gap: 16,
  },
  cardWrapper: {
    width: "47%",
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 22,
    height: 160,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 8,
  },
  cardPressed: {
    transform: [{ scale: 0.97 }],
    opacity: 0.95,
  },
  iconCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: "#F3F4F6",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },
  cardText: {
    fontSize: 15,
    fontWeight: "700",
    color: "#1F2937",
    textAlign: "center",
  },

  footer: {
    marginTop: "auto",
    textAlign: "center",
    fontSize: 12,
    fontWeight: "600",
    color: "#9CA3AF",
    marginBottom: 8,
  },
});


