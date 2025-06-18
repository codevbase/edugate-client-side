// API Configuration
import axios from 'axios';

const API_CONFIG = {
    // Development server
    development: {
        baseURL: 'http://localhost:3000',
        credentials: 'include', // Include cookies in requests
        headers: {
            'Content-Type': 'application/json'
        }
    },
    // Production server
    production: {
        baseURL: 'http://localhost:3000',
        credentials: 'include', // Include cookies in requests
        headers: {
            'Content-Type': 'application/json'
        }
    }
};

// Determine environment
const isDevelopment = import.meta.env.DEV;
const config = isDevelopment ? API_CONFIG.development : API_CONFIG.production;

console.log('🌍 Environment:', isDevelopment ? 'Development' : 'Production');
console.log('🔗 API Base URL:', config.baseURL);

// Create axios instance with proper configuration
const createApiInstance = () => {
    const instance = axios.create({
        baseURL: config.baseURL,
        withCredentials: true, // This is crucial for sending cookies
        headers: config.headers,
        timeout: 10000
    });

    // Request interceptor for logging
    instance.interceptors.request.use(
        (config) => {
            console.log('🚀 API Request:', config.method?.toUpperCase(), config.url);
            return config;
        },
        (error) => {
            console.error('❌ Request Error:', error);
            return Promise.reject(error);
        }
    );

    // Response interceptor for error handling
    instance.interceptors.response.use(
        (response) => {
            console.log('✅ API Response:', response.status, response.config.url);
            return response;
        },
        (error) => {
            console.error('❌ Response Error:', error.response?.status, error.response?.data);
            
            // Handle authentication errors
            if (error.response?.status === 401) {
                console.log('🔐 Authentication failed - redirecting to login');
                // You might want to redirect to login or clear user state here
            }
            
            return Promise.reject(error);
        }
    );

    return instance;
};

export { createApiInstance, config }; 