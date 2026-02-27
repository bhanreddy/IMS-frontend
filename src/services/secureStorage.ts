import * as SecureStore from 'expo-secure-store';

/**
 * Adapter for Supabase to use Expo SecureStore for session persistence.
 * This ensures tokens are stored in the device's secure keychain/keystore
 * and persist across app restarts and updates.
 * 
 * enhanced with chunking to support values > 2048 bytes (Android limit).
 */

const CHUNK_SIZE = 2000;
const CHUNK_PREFIX = '___CHUNKED___:';

const SecureStoreAdapter = {
    getItem: async (key: string) => {
        try {
            console.log(`[SecureStore] Getting item: ${key}`);
            const item = await SecureStore.getItemAsync(key);
            if (!item) {
                console.log(`[SecureStore] Item not found: ${key}`);
                return null;
            }

            if (item.startsWith(CHUNK_PREFIX)) {
                console.log(`[SecureStore] Item is chunked: ${key}`);
                const count = parseInt(item.replace(CHUNK_PREFIX, ''), 10);
                if (isNaN(count)) return null;

                let fullValue = '';
                for (let i = 0; i < count; i++) {
                    const chunk = await SecureStore.getItemAsync(`${key}_chunk_${i}`);
                    if (chunk) {
                        fullValue += chunk;
                    } else {
                        console.warn(`[SecureStore] Missing chunk ${i} for key ${key}`);
                    }
                }
                return fullValue;
            }

            // console.log(`[SecureStore] Retrieved item: ${key} (Length: ${item.length})`);
            return item;
        } catch (error) {
            console.error('SecureStoreAdapter.getItem failed', error);
            return null;
        }
    },

    setItem: async (key: string, value: string) => {
        try {
            console.log(`[SecureStore] Setting item: ${key} (Length: ${value.length})`);
            if (value.length <= CHUNK_SIZE) {
                await SecureStoreAdapter.removeItem(key);
                return SecureStore.setItemAsync(key, value);
            }

            // Chunk logic
            const chunks = [];
            for (let i = 0; i < value.length; i += CHUNK_SIZE) {
                chunks.push(value.slice(i, i + CHUNK_SIZE));
            }

            console.log(`[SecureStore] Chunking ${key} into ${chunks.length} chunks`);

            // Store chunks
            for (let i = 0; i < chunks.length; i++) {
                await SecureStore.setItemAsync(`${key}_chunk_${i}`, chunks[i]);
            }

            // Store metadata on main key
            await SecureStore.setItemAsync(key, `${CHUNK_PREFIX}${chunks.length}`);
        } catch (error) {
            console.error('SecureStoreAdapter.setItem failed', error);
        }
    },

    removeItem: async (key: string) => {
        try {
            console.log(`[SecureStore] Removing item: ${key}`);
            const item = await SecureStore.getItemAsync(key);

            if (item && item.startsWith(CHUNK_PREFIX)) {
                const count = parseInt(item.replace(CHUNK_PREFIX, ''), 10);
                if (!isNaN(count)) {
                    for (let i = 0; i < count; i++) {
                        await SecureStore.deleteItemAsync(`${key}_chunk_${i}`);
                    }
                }
            }

            return SecureStore.deleteItemAsync(key);
        } catch (error) {
            console.error('SecureStoreAdapter.removeItem failed', error);
        }
    },
};

export default SecureStoreAdapter;
