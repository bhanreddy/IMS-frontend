import AsyncStorage from '@react-native-async-storage/async-storage';
import { Alert } from 'react-native';

const API_BASE_URL = (process.env.EXPO_PUBLIC_API_URL || 'http://10.0.2.2:3000/api/v1').trim();
console.log('DEBUG: API_BASE_URL is:', API_BASE_URL);

const TOKEN_KEY = 'access_token';
const REFRESH_TOKEN_KEY = 'refresh_token';

// Token management
export async function getAccessToken(): Promise<string | null> {
    return await AsyncStorage.getItem(TOKEN_KEY);
}

export async function setTokens(accessToken: string, refreshToken: string): Promise<void> {
    await AsyncStorage.setItem(TOKEN_KEY, accessToken);
    await AsyncStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
}

export async function clearTokens(): Promise<void> {
    await AsyncStorage.removeItem(TOKEN_KEY);
    await AsyncStorage.removeItem(REFRESH_TOKEN_KEY);
}

// Global Logout Callback to avoid circular dependency
let logoutCallback: (() => Promise<void>) | null = null;

export const registerLogoutCallback = (fn: () => Promise<void>) => {
    logoutCallback = fn;
};

// API Error class
export class APIError extends Error {
    constructor(
        message: string,
        public statusCode?: number,
        public errors?: Record<string, string[]>,
        public requestId?: string
    ) {
        super(message);
        this.name = 'APIError';
    }

    // Compatibility getter
    get status() {
        return this.statusCode;
    }
}

// Generic API request function
export interface APIOptions extends RequestInit {
    silent?: boolean;
}

export async function apiRequest<T>(
    endpoint: string,
    options: APIOptions = {}
): Promise<T> {
    const { silent, ...fetchOptions } = options;
    const token = await getAccessToken();

    const headers: Record<string, string> = {
        'Content-Type': 'application/json',
        ...(fetchOptions.headers as Record<string, string>),
    };

    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    const url = `${API_BASE_URL}${endpoint}`;

    try {
        const response = await fetch(url, {
            ...fetchOptions,
            headers,
        });

        const requestId = response.headers.get('x-request-id') || response.headers.get('request-id') || undefined;

        // Handle different status codes
        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));

            // Handle validation errors (422)
            if (response.status === 422 || response.status === 400) {
                const message = errorData.message || errorData.error || 'Validation failed';
                if (!silent) {
                    Alert.alert('Error', message);
                }
                throw new APIError(
                    message,
                    response.status,
                    errorData.errors,
                    requestId
                );
            }

            // Handle unauthorized (401)
            if (response.status === 401) {
                // 1. IGNORE Login/Refresh endpoints (invalid credentials, not session expiry)
                if (endpoint.includes('/login') || endpoint.includes('/refresh')) {
                    if (!silent) Alert.alert('Login Failed', errorData.error || 'Invalid credentials');
                    throw new APIError(
                        errorData.error || 'Invalid credentials',
                        401,
                        undefined,
                        requestId
                    );
                }

                // 2. Trigger Global Logout only for Session Expiry 
                // (Generic 401s on protected routes usually mean this)
                if (logoutCallback) {
                    if (!silent) console.warn('[API] Session expired (401), triggering global logout.');
                    logoutCallback(); // Fire and forget
                }

                if (silent) {
                    // Suppress error throw to avoid "ERROR" log in console
                    return null as T;
                }

                // Abort further processing
                throw new APIError('Session expired. Please login again.', 401, undefined, requestId);
            }

            // Handle Rate Limit (429)
            if (response.status === 429) {
                const message = errorData.error || errorData.message || 'Rate limit exceeded. Please try again later.';
                if (!silent) Alert.alert('Too Many Requests', message);
                console.warn(`[API] Rate Limited (429): ${message}`);
                throw new APIError(message, 429, undefined, requestId);
            }

            // Handle forbidden (403)
            if (response.status === 403) {
                if (!silent) Alert.alert('Access Denied', 'You do not have permission to perform this action.');
                throw new APIError('Access denied', 403, undefined, requestId);
            }

            // Generic error
            const genericMsg = errorData.message || errorData.error || 'Request failed';
            console.error(`[API Error] ${response.status} ${endpoint} (Request ID: ${requestId}):`, errorData);
            if (!silent) Alert.alert('Error', `${genericMsg}\n\nCode: ${response.status}\nID: ${requestId || 'N/A'}`);
            throw new APIError(
                genericMsg,
                response.status,
                undefined,
                requestId
            );
        }

        // Handle 204 No Content
        if (response.status === 204) {
            return null as T;
        }

        return await response.json();
    } catch (error) {
        if (error instanceof APIError) {
            throw error;
        }
        // Network error
        if (!silent) Alert.alert('Network Error', 'Please check your internet connection.');
        throw new APIError('Network error. Please check your connection.');
    }
}

// Helper methods for common HTTP verbs
export const api = {
    get: <T>(endpoint: string, params?: Record<string, any>, options?: APIOptions): Promise<T> => {
        let queryString = '';
        if (params) {
            const cleanParams = Object.fromEntries(
                Object.entries(params).filter(([_, v]) => v !== undefined)
            );
            queryString = '?' + new URLSearchParams(cleanParams).toString();
        }
        return apiRequest<T>(`${endpoint}${queryString}`, { method: 'GET', ...options });
    },

    post: <T>(endpoint: string, data?: any, options?: APIOptions): Promise<T> => {
        return apiRequest<T>(endpoint, {
            method: 'POST',
            body: data ? JSON.stringify(data) : undefined,
            ...options
        });
    },

    put: <T>(endpoint: string, data?: any, options?: APIOptions): Promise<T> => {
        return apiRequest<T>(endpoint, {
            method: 'PUT',
            body: data ? JSON.stringify(data) : undefined,
            ...options
        });
    },

    patch: <T>(endpoint: string, data?: any, options?: APIOptions): Promise<T> => {
        return apiRequest<T>(endpoint, {
            method: 'PATCH',
            body: data ? JSON.stringify(data) : undefined,
            ...options
        });
    },

    delete: <T>(endpoint: string, options?: APIOptions): Promise<T> => {
        return apiRequest<T>(endpoint, { method: 'DELETE', ...options });
    },
};
