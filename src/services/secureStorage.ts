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
            const item = await SecureStore.getItemAsync(key);
            if (!item) return null;

            if (item.startsWith(CHUNK_PREFIX)) {
                const count = parseInt(item.replace(CHUNK_PREFIX, ''), 10);
                if (isNaN(count)) return null;

                let fullValue = '';
                for (let i = 0; i < count; i++) {
                    const chunk = await SecureStore.getItemAsync(`${key}_chunk_${i}`);
                    if (chunk) {
                        fullValue += chunk;
                    }
                }
                return fullValue;
            }

            return item;
        } catch (error) {
            console.error('SecureStoreAdapter.getItem failed', error);
            return null;
        }
    },

    setItem: async (key: string, value: string) => {
        try {
            // First, check if there was an old chunked value to clean up? 
            // Actually, we can just overwrite. But if we go from chunked to non-chunked, 
            // valid chunks might remain. It's safe to ignore them or clean them.
            // Let's implement basic cleanup if we are overwriting.
            // But reading before writing adds latency.
            // Let's just handle the writing logic for now. 

            if (value.length <= CHUNK_SIZE) {
                // If previously chunked, we should ideally clean up, but for now 
                // just overwriting the main key is enough to "break" the chunk link.
                // The orphan chunks will just sit there. 
                // To be cleaner:
                await SecureStoreAdapter.removeItem(key); // clear old data/chunks
                return SecureStore.setItemAsync(key, value);
            }

            // Chunk logic
            const chunks = [];
            for (let i = 0; i < value.length; i += CHUNK_SIZE) {
                chunks.push(value.slice(i, i + CHUNK_SIZE));
            }

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
            // Check if chunked to clean up chunks
            // We need to read it first to know if it's chunked.
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
