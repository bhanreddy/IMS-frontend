import translate from 'translate-google-api';
import AsyncStorage from '@react-native-async-storage/async-storage';

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

            // 3. Translate in chunks to avoid API limits (if any, though library handles some)
            // The library accepts an array of strings.
            // Note: usage is translate(text, { to: 'te' })

            const translatedValues: string[] = [];

            // Process in chunks of 50 to be safe
            const CHUNK_SIZE = 50;
            for (let i = 0; i < values.length; i += CHUNK_SIZE) {
                const chunk = values.slice(i, i + CHUNK_SIZE);
                try {
                    const result = await translate(chunk, {
                        tld: "com",
                        to: "te",
                    });
                    // Result is array of strings
                    translatedValues.push(...result);
                } catch (err) {
                    console.warn('Translation unavailable (offline or blocked). Using English.');
                    // Fallback: keep english for this chunk if failed
                    translatedValues.push(...chunk);
                }
            }

            // 4. Reconstruct object
            const flatTe: FlatMap = {};
            keys.forEach((key, index) => {
                flatTe[key] = translatedValues[index] || values[index]; // Fallback to English if missing
            });

            const teResource = unflattenObject(flatTe);

            // 5. Cache result
            await AsyncStorage.setItem(TRANSLATION_CACHE_KEY, JSON.stringify(teResource));

            return teResource;

        } catch (error) {
            console.warn('Translation service error (offline/blocked):', error);
            return enResource; // Fallback to English on critical failure
        }
    },

    /**
     * Forces a refresh of translations (clears cache)
     */
    refresh: async () => {
        await AsyncStorage.removeItem(TRANSLATION_CACHE_KEY);
    }
};
