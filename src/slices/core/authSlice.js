import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '@services/api';
import { getLocalStorage, setLocalStorage, clearLocalStorage, getCurrentUser } from '@services/storage';
import { defineAbilitiesFor } from '@services/ability';

export const login = createAsyncThunk('auth/login', async (credentials, { rejectWithValue }) => {
	try {
		const response = await api.post('/login', credentials);
		setLocalStorage('token', response.data.token);
		setLocalStorage('user', JSON.stringify(response.data.user));
		return response.data;
	} catch (error) {
		return rejectWithValue(error.response);
	}
});

export const logout = createAsyncThunk('auth/logout', async (_, { rejectWithValue }) => {
	try {
		await api.post('/logout');
		clearLocalStorage();
		return {};
	} catch (error) {
		return rejectWithValue(error.response.data);
	}
});

const authSlice = createSlice({
	name: 'auth',
	initialState: {
		token: getLocalStorage('token'),
		user: getCurrentUser(),
		status: 'idle',
		error: null
	},
	reducers: {
		updateAbility: (state, action) => {
			state.ability = defineAbilitiesFor(action.payload);
		}
	},
	extraReducers: (builder) => {
		builder
			.addCase(login.pending, (state) => {
				state.status = 'loading';
			})
			.addCase(login.fulfilled, (state, action) => {
				state.token = action.payload.token;
				state.user = action.payload.user;
				state.status = 'succeeded';
				state.ability = defineAbilitiesFor(action.payload.user);
			})
			.addCase(login.rejected, (state, action) => {
				state.status = 'failed';
				state.error = action.payload;
			})
			.addCase(logout.pending, (state) => {
				state.status = 'loading';
			})
			.addCase(logout.fulfilled, (state) => {
				state.token = null;
				state.user = null;
				state.status = 'succeeded';
				state.ability = defineAbilitiesFor({ roles: [] });
			})
			.addCase(logout.rejected, (state, action) => {
				state.status = 'failed';
				state.error = action.payload;
			});
	}
});

export const { updateAbility } = authSlice.actions;

export default authSlice.reducer;
