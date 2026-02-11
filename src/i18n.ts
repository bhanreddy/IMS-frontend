import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import en from './Locale/en.json';
import { TranslationService } from './services/translationService'; // Import service

import AsyncStorage from '@react-native-async-storage/async-storage';

const MODULE_ID = 'settings';

const languageDetector = {
    type: 'languageDetector',
    async: true,
    detect: async (callback: (lang: string) => void) => {
        try {
            const savedLanguage = await AsyncStorage.getItem(MODULE_ID);
            if (savedLanguage) {
                return callback(savedLanguage);
            }
            return callback('en');
        } catch (error) {
            console.error('Error reading language', error);
            callback('en');
        }
    },
    init: () => { },
    cacheUserLanguage: async (language: string) => {
        try {
            await AsyncStorage.setItem(MODULE_ID, language);
        } catch (error) {
            console.error('Error saving language', error);
        }
    },
};

i18n
    .use(languageDetector as any)
    .use(initReactI18next)
    .init({
        resources: {
            en: { translation: en },
            // Telugu will be loaded dynamically
        },
        fallbackLng: 'en',
        interpolation: {
            escapeValue: false,
        },
        react: {
            useSuspense: false,
        }
    });

// Dynamically load Telugu translations in background
TranslationService.translateToTelugu(en).then((teResources) => {
    i18n.addResourceBundle('te', 'translation', teResources, true, true);
    // If language was detected as 'te' but resources weren't ready, this update might trigger a re-render
    // or we might need to change language again if it didn't verify resources first.
    // However, i18n normally handles adding resources gracefully.

});

export default i18n;
