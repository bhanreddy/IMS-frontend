import { API_config } from './config';
import AsyncStorage from '@react-native-async-storage/async-storage';

const getHeaders = async () => {
    const token = await AsyncStorage.getItem('userToken');
    const headers: HeadersInit = {
        'Content-Type': 'application/json',
    };
    if (token) {
        (headers as any).Authorization = `Bearer ${token}`;
    }
    return headers;
};

const handleResponse = async (response: Response) => {
    const data = await response.json();
    if (!response.ok) {
        throw { response: { data, status: response.status } };
    }
    return { data, status: response.status };
};

const client = {
    get: async (endpoint: string) => {
        const headers = await getHeaders();
        try {
            const response = await fetch(`${API_config.baseURL}${endpoint}`, {
                method: 'GET',
                headers,
            });
            return handleResponse(response);
        } catch (e) {
            throw e;
        }
    },
    post: async (endpoint: string, body: any) => {
        const headers = await getHeaders();
        try {
            const response = await fetch(`${API_config.baseURL}${endpoint}`, {
                method: 'POST',
                headers,
                body: JSON.stringify(body),
            });
            return handleResponse(response);
        } catch (e) {
            throw e;
        }
    },
    patch: async (endpoint: string, body: any) => {
        const headers = await getHeaders();
        try {
            const response = await fetch(`${API_config.baseURL}${endpoint}`, {
                method: 'PATCH',
                headers,
                body: JSON.stringify(body),
            });
            return handleResponse(response);
        } catch (e) {
            throw e;
        }
    },
    delete: async (endpoint: string) => {
        const headers = await getHeaders();
        try {
            const response = await fetch(`${API_config.baseURL}${endpoint}`, {
                method: 'DELETE',
                headers,
            });
            return handleResponse(response);
        } catch (e) {
            throw e;
        }
    },
};

export default client;
