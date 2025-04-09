import { createSlice } from '@reduxjs/toolkit';

const applyTheme = (theme) => {
	try {
		document.documentElement.setAttribute('data-bs-theme', theme);
		localStorage.setItem('theme', theme);
	} catch (error) {
		console.error('Ошибка при установке темы:', error);
	}
};

const initialTheme = localStorage.getItem('theme') || 'light';
applyTheme(initialTheme);

const themeSlice = createSlice({
	name: 'theme',
	initialState: { theme: initialTheme },
	reducers: {
		toggleTheme: (state) => {
			const newTheme = state.theme === 'light' ? 'dark' : 'light';
			state.theme = newTheme;
			console.log('Текущая тема:', newTheme, state.theme);
			applyTheme(newTheme);
		}
	}
});

export const { toggleTheme } = themeSlice.actions;

export default themeSlice.reducer;
