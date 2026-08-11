/**
 * Global School Configuration
 * Edit this file to change the school branding across the entire app.
 *
 * This configuration is used in:
 * - App Headers (Admin, Staff, Student)
 * - Login/Logout Screens
 * - Report Cards & Certificates
 * - PDF Generation
 * - App-wide theming (colors, typography, spacing, shapes)
 */

import type { SchoolTheme } from '../theme/types';
import { defaultDarkTheme, defaultLightTheme } from '../theme/types';

/**
 * Build `rgba(...)` from `#RRGGBB` / `#RGB` for ribbon overlays and dividers.
 *
 * Marked as a Reanimated worklet so it can be called from inside `useAnimatedStyle`
 * on the UI thread (the scroll-driven dashboard headers do this). Reanimated 4 throws
 * a hard "tried to synchronously call a non-worklet function on the UI thread" error
 * otherwise, which blanks every dashboard after login. It remains a normal function
 * when called from the JS thread (PDFs, welcome screen, ribbon, etc.).
 */
export function schoolColorWithAlpha(hex: string | undefined | null, alpha: number): string {
  'worklet';
  if (hex == null || typeof hex !== 'string') {
    return `rgba(212,43,43,${alpha})`;
  }
  let h = hex.trim().replace('#', '');
  if (h.length === 3) {
    h = h[0] + h[0] + h[1] + h[1] + h[2] + h[2];
  }
  if (!/^[0-9a-fA-F]{6}$/.test(h)) {
    return `rgba(212,43,43,${alpha})`;
  }
  const r = parseInt(h.slice(0, 2), 16);
  const g = parseInt(h.slice(2, 4), 16);
  const b = parseInt(h.slice(4, 6), 16);
  return `rgba(${r},${g},${b},${alpha})`;
}

/**
 * App-wide theme configuration.
 * This is the SINGLE SOURCE OF TRUTH for all visual styling.
 * 
 * To customize your school's appearance, modify the values below.
 * The app will automatically use these values throughout all screens and components.
 * 
 * Both light and dark themes are defined here. The app respects user preference.
 */
export const schoolTheme: { light: SchoolTheme; dark: SchoolTheme } = {
  light: {
    ...defaultLightTheme,
    colors: {
      ...defaultLightTheme.colors,
      // Primary brand color – Logo Red Ring
      primary: '#D42B2B',
      primaryLight: '#E57373',
      primaryDark: '#8B1A1A',
      // Secondary color – Logo Tree Green
      secondary: '#1B5E20',
      // Accent color – Logo Gold Stars & Trim
      accent: '#D4AF37',
      // Backgrounds – warm cream neutrals (matching red/gold warmth)
      background: '#FFF8F0',
      surface: '#FFFFFF',
      card: '#FFFAF5',
      // Text colors – warm dark neutrals from logo border
      textPrimary: '#2D2D2D',
      textStrong: '#1A1A1A',
      textSecondary: '#5D4037',
      textMuted: '#8D6E63',
      text: '#2D2D2D',
      textTertiary: '#D4AF37',
      // Borders – warm beige
      border: '#E8D5B7',
      borderLight: '#F5E6D0',
      // Semantic colors
      danger: '#C62828',
      success: '#2E7D32',
      warning: '#F59E0B',
      info: '#1565C0',
      notification: '#C62828',
      // Navigation – red tints from logo
      navPill: '#FDECEA',
      navIconActive: '#D42B2B',
      navIconInactive: '#E57373',
      // Header/Footer backgrounds (with transparency for glass effect)
      headerBg: 'rgba(255,248,240, 0.92)',
      footerBg: 'rgba(255,250,245, 0.94)',
      // Alert colors
      alertBg: '#FFF8F0',
      alertBorder: '#E8D5B7',
      alertIcon: '#D42B2B',
      alertText: '#8B1A1A',
      alertBgDanger: '#FEF2F2',
      alertBorderDanger: '#FECACA',
      alertIconDanger: '#C62828',
      alertTextDanger: '#7F1D1D',
      alertBgInfo: '#E3F2FD',
      alertBorderInfo: '#BBDEFB',
      alertIconInfo: '#1565C0',
      alertTextInfo: '#0D47A1',
    },
    typography: {
      fontFamily: 'System',
      fontFamilyBold: 'System',
      fontSizeXS: 11,
      fontSizeSM: 13,
      fontSizeMD: 15,
      fontSizeLG: 17,
      fontSizeXL: 20,
      fontSizeXXL: 24,
      fontSizeXXXL: 28,
    },
    spacing: {
      xs: 4,
      sm: 8,
      md: 12,
      lg: 16,
      xl: 24,
      xxl: 32,
    },
    shape: {
      borderRadiusXS: 6,
      borderRadiusSM: 8,
      borderRadiusMD: 12,
      borderRadiusLG: 16,
      borderRadiusXL: 20,
      borderRadiusFull: 9999,
    },
    shadows: {
      none: {
        shadowColor: 'transparent',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0,
        shadowRadius: 0,
        elevation: 0,
      },
      sm: {
        shadowColor: '#0F172A',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.04,
        shadowRadius: 6,
        elevation: 2,
      },
      md: {
        shadowColor: '#0F172A',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.08,
        shadowRadius: 16,
        elevation: 6,
      },
      lg: {
        shadowColor: '#D42B2B',
        shadowOffset: { width: 0, height: 12 },
        shadowOpacity: 0.1,
        shadowRadius: 24,
        elevation: 12,
      },
    },
  },
  dark: {
    ...defaultDarkTheme,
    colors: {
      ...defaultDarkTheme.colors,
      // Primary – lighter red for dark mode legibility
      primary: '#EF5350',
      primaryLight: '#EF9A9A',
      primaryDark: '#D42B2B',
      // Secondary – lighter green
      secondary: '#66BB6A',
      // Accent – bright gold for dark backgrounds
      accent: '#FFD54F',
      // Dark backgrounds – deep warm-charcoal tones (from logo border)
      background: '#1A1A1A',
      surface: '#2D2D2D',
      card: '#3E2723',
      // Light text for dark backgrounds
      textPrimary: '#FFF8F0',
      textStrong: '#FFFFFF',
      textSecondary: '#D7CCC8',
      textMuted: '#BCAAA4',
      text: '#FFF8F0',
      textTertiary: '#FFD54F',
      // Darker borders – warm brown
      border: '#5D4037',
      borderLight: '#6D4C41',
      // Lighter semantic colors for dark mode
      danger: '#EF5350',
      success: '#66BB6A',
      warning: '#FBBF24',
      info: '#42A5F5',
      notification: '#EF5350',
      // Navigation – red tint for dark
      navPill: 'rgba(212,43,43, 0.2)',
      navIconActive: '#EF5350',
      navIconInactive: '#D42B2B',
      // Header/Footer with dark warm glass effect
      headerBg: 'rgba(26,26,26, 0.92)',
      footerBg: 'rgba(45,45,45, 0.94)',
      // Alert colors (dark mode)
      alertBg: 'rgba(212,43,43, 0.12)',
      alertBorder: 'rgba(239,83,80, 0.3)',
      alertIcon: '#EF5350',
      alertText: '#FFF8F0',
      alertBgDanger: 'rgba(198,40,40, 0.1)',
      alertBorderDanger: 'rgba(198,40,40, 0.2)',
      alertIconDanger: '#EF5350',
      alertTextDanger: '#FFCDD2',
      alertBgInfo: 'rgba(21,101,192, 0.12)',
      alertBorderInfo: 'rgba(21,101,192, 0.25)',
      alertIconInfo: '#42A5F5',
      alertTextInfo: '#BBDEFB',
    },
    typography: {
      fontFamily: 'System',
      fontFamilyBold: 'System',
      fontSizeXS: 11,
      fontSizeSM: 13,
      fontSizeMD: 15,
      fontSizeLG: 17,
      fontSizeXL: 20,
      fontSizeXXL: 24,
      fontSizeXXXL: 28,
    },
    spacing: {
      xs: 4,
      sm: 8,
      md: 12,
      lg: 16,
      xl: 24,
      xxl: 32,
    },
    shape: {
      borderRadiusXS: 6,
      borderRadiusSM: 8,
      borderRadiusMD: 12,
      borderRadiusLG: 16,
      borderRadiusXL: 20,
      borderRadiusFull: 9999,
    },
    shadows: {
      none: {
        shadowColor: 'transparent',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0,
        shadowRadius: 0,
        elevation: 0,
      },
      sm: {
        shadowColor: '#0F172A',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.06,
        shadowRadius: 6,
        elevation: 2,
      },
      md: {
        shadowColor: '#0F172A',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.1,
        shadowRadius: 16,
        elevation: 6,
      },
      lg: {
        shadowColor: '#D42B2B',
        shadowOffset: { width: 0, height: 12 },
        shadowOpacity: 0.2,
        shadowRadius: 24,
        elevation: 12,
      },
    },
  },
};

export const SCHOOL_CONFIG = {
  // The official name of the school displayed in headers and reports
  name: "Chanakya E/M School",

  // Short line under the school name on the header ribbon
  tagline: "Commited to Genuine Education",

  // Motto / core values shown in the first info column of the ribbon (letterhead)
  motto: "Imagine , Believe , Achieve",

  // The school logo used in headers and reports
  // Ensure the image exists in assets/images/
  logo: require('../../assets/images/icon.png'),

  // Optional: School Address for reports
  address: "Narayanapet Road, Maddur, Dist Narayanapet, Telangana-509411",

  // Optional: Contact info for reports
  contact: "9010619786",

  // Optional: School email for letterhead / reports
  email: "chanakyaschool7939@gmail.com",

  // Website or Email
  website: "www.nexsyrus.com",

  websiteGallery: {
    enabled: false,
    unavailableTitle: 'Build Your School Website',
    unavailableMessage: 'You need to build a website first. Contact Nexsyrus to Build Your Own Website.',
    contactUrl: 'https://api.whatsapp.com/send?phone=917892654731&text=Hi%2C%20I%20want%20to%20build%20a%20website%20for%20my%20school.',
  },

  // CBSE Affiliation No (if applicable)
  cbseAffiliationNo: "NA",

  // School Code (if applicable)
  schoolCode: "VMS",

  /**
   * Full recognition / affiliation sentence for certificates & PDFs.
   * Leave blank to show only `recognitionNo` as "RC No. …", or both combined.
   */
  recognitionLine: "",

  recognitionNo: "192/A1/PVT/2026",

  /**
   * Colour theme for ribbon / letterhead chrome (SchoolRibbon, etc.).
   * Extracted from the logo: red outer ring, dark-green tree, gold stars, blue ribbon.
   */
  theme: {
    /** Gold stripes, dividers, and trim (logo gold stars & accents) */
    accent: '#D4AF37',
    /** Tagline text – warm gold */
    ribbonTagline: '#FFE082',
    /** Four-stop diagonal ribbon – red ring → deep maroon → dark green tree depth */
    ribbonGradient: ['#5D101D', '#8B1A1A', '#D42B2B', '#1B5E20'] as const,
    /** Optional stops for expo-linear-gradient (length must match ribbonGradient) */
    ribbonGradientLocations: [0, 0.30, 0.65, 1] as const,
    /** Main title on the ribbon */
    ribbonTitle: '#FFFFFF',
    /** Scrolling marquee dot separator */
    marqueeSeparator: 'rgba(255,255,255,0.85)',
    /** Letterhead / info column body */
    ribbonBody: 'rgba(255,255,255,0.92)',
    ribbonBodyMuted: 'rgba(255,255,255,0.9)',
    /**
     * Icons over the ribbon / unsafe area (`expo-status-bar`).
     * Use `light` on dark gradients, `dark` if you switch to a light ribbon.
     */
    statusBarOnRibbon: 'light' as 'light' | 'dark',
  },
};

/** True when a config value is blank or a placeholder like NA / nil. */
function isBlankOfficialConfig(v?: string | null): boolean {
  const t = String(v ?? '').trim();
  if (!t) return true;
  return /^(n\/?a|na|nil|null|none|undefined|-|—|\.{2,}|_{2,})$/i.test(t);
}

/**
 * Combined recognition line for certificates / PDFs.
 * Built from `SCHOOL_CONFIG.recognitionLine` + optional `recognitionNo` (RC No.).
 * Empty when neither is configured — callers must hide the UI, not show "NA".
 */
export const SCHOOL_RECOGNITION_LINE = (() => {
  const line = String(SCHOOL_CONFIG.recognitionLine ?? '').trim();
  const rc = String(SCHOOL_CONFIG.recognitionNo ?? '').trim();
  const hasLine = !isBlankOfficialConfig(line);
  const hasRc = !isBlankOfficialConfig(rc);
  if (!hasLine && !hasRc) return '';
  if (hasLine && hasRc) {
    if (/rc\s*no\.?/i.test(line)) return line;
    return `${line.replace(/\s*,?\s*$/, '')}, RC No. ${rc}`;
  }
  if (hasLine) return line;
  return `RC No. ${rc}`;
})();