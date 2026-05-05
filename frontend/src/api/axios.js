import axios from 'axios';

const api = axios.create({
    baseURL: 'http://127.0.0.1:8080/api',
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    },
    withCredentials: true, // Useful for Sanctum / Sessions
});

// Response interceptor for global error handling
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response && error.response.status === 422) {
            // Can handle validation errors globally or pass them through
            console.error('Validation Errors:', error.response.data.errors);
        }
        return Promise.reject(error);
    }
);

export default api;
