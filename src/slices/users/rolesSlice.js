import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '@services/api';

export const fetchRoles = createAsyncThunk('roles/fetchRoles', async () => {
	const response = await api.get('/roles');
	return response.data;
});

export const createRole = createAsyncThunk('roles/createRole', async (role, { rejectWithValue }) => {
	try {
		const response = await api.post('/roles', role);
		return response.data;
	} catch (error) {
		return rejectWithValue(error.response.data);
	}
});

export const updateRole = createAsyncThunk('roles/updateRole', async (role, { rejectWithValue }) => {
	try {
		const response = await api.put(`/roles/${role.id}`, role);
		return response.data;
	} catch (error) {
		return rejectWithValue(error.response.data);
	}
});

export const deleteRole = createAsyncThunk('roles/deleteRole', async (id, { rejectWithValue }) => {
	try {
		await api.delete(`/roles/${id}`);
		return id;
	} catch (error) {
		return rejectWithValue(error.response.data);
	}
});

const rolesSlice = createSlice({
	name: 'roles',
	initialState: {
		items: [],
		status: {
			fetchAll: 'idle',
			create: 'idle',
			update: 'idle',
			delete: 'idle'
		},
		error: {
			fetchAll: null,
			create: null,
			update: null,
			delete: null
		}
	},
	reducers: {},
	extraReducers: (builder) => {
		builder
			.addCase(fetchRoles.pending, (state) => {
				state.status.fetchAll = 'loading';
				state.error.fetchAll = null;
			})
			.addCase(fetchRoles.fulfilled, (state, action) => {
				state.status.fetchAll = 'succeeded';
				state.items = action.payload.data;
			})
			.addCase(fetchRoles.rejected, (state, action) => {
				state.status.fetchAll = 'failed';
				state.error.fetchAll = action.error.message;
			})
			.addCase(createRole.pending, (state) => {
				state.status.create = 'loading';
				state.error.create = null;
			})
			.addCase(createRole.fulfilled, (state, action) => {
				state.status.create = 'succeeded';
				state.items.push(action.payload.role);
			})
			.addCase(createRole.rejected, (state, action) => {
				state.status.create = 'failed';
				state.error.create = action.error.message;
			})
			.addCase(updateRole.pending, (state) => {
				state.status.update = 'loading';
				state.error.update = null;
			})
			.addCase(updateRole.fulfilled, (state, action) => {
				state.status.update = 'succeeded';
				const index = state.items.findIndex((role) => role.id === action.payload.role.id);
				if (index !== -1) {
					state.items[index] = action.payload.role;
				}
			})
			.addCase(updateRole.rejected, (state, action) => {
				state.status.update = 'failed';
				state.error.update = action.error.message;
			})
			.addCase(deleteRole.pending, (state) => {
				state.status.delete = 'loading';
				state.error.delete = null;
			})
			.addCase(deleteRole.fulfilled, (state, action) => {
				state.status.delete = 'succeeded';
				state.items = state.items.filter((role) => role.id !== action.payload);
			})
			.addCase(deleteRole.rejected, (state, action) => {
				state.status.delete = 'failed';
				state.error.delete = action.error.message;
			});
	}
});

export default rolesSlice.reducer;
