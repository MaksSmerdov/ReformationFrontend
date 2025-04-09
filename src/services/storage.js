export const getLocalStorage = (key) => {
	return localStorage.getItem(key);
};

export const getCurrentUser = (key, value) => {
	return JSON.parse(localStorage.getItem('user'));
};

export const setLocalStorage = (key, value) => {
	localStorage.setItem(key, value);
};

export const clearLocalStorage = () => {
	localStorage.removeItem('token');
	localStorage.removeItem('user');
};
