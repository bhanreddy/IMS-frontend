import AsyncStorage from '@react-native-async-storage/async-storage';
import { api } from './apiClient';

const TRANSLATION_CACHE_KEY = 'cached_telugu_translations';
const VERSION_KEY = 'translation_version';

// Simple flattened key-value pair type
type FlatMap = { [key: string]: string };

/**
 * Flattens a nested object into a single level object with dot-notation keys.
 * e.g., { a: { b: 'hello' } } -> { 'a.b': 'hello' }
 */
const flattenObject = (obj: any, prefix = ''): FlatMap => {
    return Object.keys(obj).reduce((acc: FlatMap, k) => {
        const pre = prefix.length ? prefix + '.' : '';
        if (typeof obj[k] === 'object' && obj[k] !== null) {
            Object.assign(acc, flattenObject(obj[k], pre + k));
        } else if (typeof obj[k] === 'string') {
            acc[pre + k] = obj[k];
        }
        return acc;
    }, {});
};

/**
 * Unflattens a dot-notation key-value map back into a nested object.
 */
const unflattenObject = (data: FlatMap): any => {
    const result: any = {};
    for (const i in data) {
        const keys = i.split('.');
        keys.reduce((r, e, j) => {
            return r[e] || (r[e] = keys.length - 1 === j ? data[i] : {});
        }, result);
    }
    return result;
};

export const TranslationService = {
    /**
     * Translates the provided English resource object to Telugu.
     * Checks cache first. If cache is invalid or missing, performs API call.
     */
    translateToTelugu: async (enResource: any): Promise<any> => {
        try {
            // 1. Check local cache first
            const cached = await AsyncStorage.getItem(TRANSLATION_CACHE_KEY);
            if (cached) {
                return JSON.parse(cached);
            }

            // 2. Flatten object to get all strings
            const flatEn = flattenObject(enResource);
            const keys = Object.keys(flatEn);
            const values = Object.values(flatEn);

            // 3. Translate in chunks to avoid API limits
            const translatedValues: string[] = [];

            // Process in chunks of 50 to be safe
            const CHUNK_SIZE = 50;
            for (let i = 0; i < values.length; i += CHUNK_SIZE) {
                const chunk = values.slice(i, i + CHUNK_SIZE);
                try {
                    const result = await api.post<{ translations: string[] }>('/ai/translate', { texts: chunk }, { silent: true });

                    if (result && result.translations) {
                        translatedValues.push(...result.translations);
                    } else {
                        translatedValues.push(...chunk);
                    }
                } catch (err) {
                    console.warn(`Translation chunk ${i} unavailable. Using English:`, err);
                    // Fallback: keep english for this chunk if failed
                    translatedValues.push(...chunk);
                }
            }

            // 4. Reconstruct object
            const flatTe: FlatMap = {};
            keys.forEach((key, index) => {
                flatTe[key] = translatedValues[index] || values[index]; // Default back to English just in case
            });

            const teResource = unflattenObject(flatTe);

            // 5. Cache result
            await AsyncStorage.setItem(TRANSLATION_CACHE_KEY, JSON.stringify(teResource));

            return teResource;

        } catch (error) {
            console.warn('Translation service error:', error);
            return enResource; // Fallback to English on critical failure
        }
    },

    /**
     * Translates a single text string on demand.
     */
    translateText: async (text: string): Promise<string> => {
        try {
            const result = await api.post<{ translations: string[] }>('/ai/translate', { texts: [text] }, { silent: true });
            if (result && result.translations && result.translations.length > 0) {
                return result.translations[0];
            }
            return text;
        } catch (error) {
            console.warn('Translate API error:', error);
            return text;
        }
    },

    /**
     * Forces a refresh of translations (clears cache)
     */
    refresh: async () => {
        await AsyncStorage.removeItem(TRANSLATION_CACHE_KEY);
    }
};
