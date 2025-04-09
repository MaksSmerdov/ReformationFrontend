import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '@services/api';

export const fetchUsers = createAsyncThunk('users/fetchUsers', async () => {
	const response = await api.get('/users');
	return response.data;
});

export const createUser = createAsyncThunk('users/createUser', async (user, { rejectWithValue }) => {
	try {
		const response = await api.post('/users', user);
		return response.data.data;
	} catch (error) {
		return rejectWithValue(error.response.data);
	}
});

export const updateUser = createAsyncThunk('users/updateUser', async (user, { rejectWithValue }) => {
	try {
		const response = await api.put(`/users/${user.id}`, user);
		return response.data.data;
	} catch (error) {
		return rejectWithValue(error.response.data);
	}
});

export const deleteUser = createAsyncThunk('users/deleteUser', async (id, { rejectWithValue }) => {
	try {
		await api.delete(`/users/${id}`);
		return id;
	} catch (error) {
		return rejectWithValue(error.response.data);
	}
});

const usersSlice = createSlice({
	name: 'users',
	initialState: {
		items: [],
		status: 'idle',
		error: null,
		fetchAllStatus: 'idle'
	},
	reducers: {},
	extraReducers: (builder) => {
		builder
			.addCase(fetchUsers.pending, (state) => {
				state.status = 'loading';
				state.fetchAllStatus = 'loading';
			})
			.addCase(fetchUsers.fulfilled, (state, action) => {
				state.status = 'succeeded';
				state.fetchAllStatus = 'succeeded';
				state.items = action.payload.data;
			})
			.addCase(fetchUsers.rejected, (state, action) => {
				state.status = 'failed';
				state.fetchAllStatus = 'failed';
				state.error = action.error.message;
			})
			.addCase(createUser.fulfilled, (state, action) => {
				state.items.push(action.payload);
			})
			.addCase(updateUser.fulfilled, (state, action) => {
				const index = state.items.findIndex((user) => user.id === action.payload.id);
				if (index !== -1) {
					state.items[index] = action.payload;
				}
			})
			.addCase(deleteUser.fulfilled, (state, action) => {
				state.items = state.items.filter((user) => user.id !== action.payload);
			});
	}
});

export default usersSlice.reducer;
