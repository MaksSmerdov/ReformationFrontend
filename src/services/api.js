import axios from 'axios';
import { clearLocalStorage } from '@services/storage';

const api = axios.create({
	baseURL: '/api'
});

api.interceptors.request.use((config) => {
	const token = localStorage.getItem('token');
	if (token) {
		config.headers.Authorization = `Bearer ${token}`;
		config.headers.Accept = 'application/json';
		config.headers['X-Requested-With'] = 'XMLHttpRequest';

		if (config.data instanceof FormData) {
			config.headers['Content-Type'] = 'multipart/form-data';
		} else {
			config.headers['Content-Type'] = 'application/json';
		}
	}
	// console.log('Request Config:', config);
	return config;
});

api.interceptors.response.use(
	(response) => {
		// console.log('Response:', response);
		return response;
	},
	(error) => {
		// console.log('Error Response:', error.response);
		if (error.response && error.response.status === 401) {
			if (window.location.pathname !== '/login') {
				clearLocalStorage();
				window.location.href = '/login';
			}
		}
		return Promise.reject(error);
	}
);

export default api;
