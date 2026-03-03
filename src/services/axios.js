import axios from 'axios';
import API_BASE_URL from '../config/api';

// Create axios instance
const axiosInstance = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Helper function to handle unauthorized state consistently
const handleUnauthorized = () => {
    localStorage.removeItem('admin_token');
    localStorage.removeItem('admin_user');
    window.location.href = '/login';
};

// Request interceptor
axiosInstance.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('admin_token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor
axiosInstance.interceptors.response.use(
    (response) => {
        // Catch custom Laravel JSON responses that return 200 OK but are actually unauthorized
        if (
            response.data &&
            response.data.success === false &&
            response.data.message === "Unauthorized. Login Required."
        ) {
            handleUnauthorized();
            return Promise.reject(new Error("Unauthorized. Login Required."));
        }

        return response;
    },
    (error) => {
        // Catch standard 401 HTTP errors OR error responses with your specific message
        if (
            error.response?.status === 401 ||
            error.response?.data?.message === "Unauthorized. Login Required."
        ) {
            handleUnauthorized();
        }

        return Promise.reject(error);
    }
);

export default axiosInstance;