import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '@services/api';

export const fetchSpecializations = createAsyncThunk('specializations/fetchSpecializations', async () => {
	const response = await api.get('/specializations');
	return response.data.data;
});

export const createSpecialization = createAsyncThunk('specializations/createSpecialization', async (specialization, { rejectWithValue }) => {
	try {
		const response = await api.post('/specializations', specialization);
		return response.data.data;
	} catch (error) {
		return rejectWithValue(error.response.data);
	}
});

export const updateSpecialization = createAsyncThunk('specializations/updateSpecialization', async (specialization) => {
	const response = await api.put(`/specializations/${specialization.id}`, specialization);
	return response.data.data;
});

export const deleteSpecialization = createAsyncThunk('specializations/deleteSpecialization', async (id) => {
	await api.delete(`/specializations/${id}`);
	return id;
});

const specializationsSlice = createSlice({
	name: 'specializations',
	initialState: {
		items: [],
		status: {
			fetch: 'idle',
			create: 'idle',
			update: 'idle',
			delete: 'idle'
		},
		error: {
			fetch: null,
			create: null,
			update: null,
			delete: null
		}
	},
	reducers: {},
	extraReducers: (builder) => {
		builder
			.addCase(fetchSpecializations.pending, (state) => {
				state.status.fetch = 'loading';
			})
			.addCase(fetchSpecializations.fulfilled, (state, action) => {
				state.status.fetch = 'succeeded';
				state.items = action.payload;
			})
			.addCase(fetchSpecializations.rejected, (state, action) => {
				state.status.fetch = 'failed';
				state.error.fetch = action.error.message;
			})
			.addCase(createSpecialization.pending, (state) => {
				state.status.create = 'loading';
			})
			.addCase(createSpecialization.fulfilled, (state, action) => {
				state.status.create = 'succeeded';
				state.items.push(action.payload);
			})
			.addCase(createSpecialization.rejected, (state, action) => {
				state.status.create = 'failed';
				state.error.create = action.error.message;
			})
			.addCase(updateSpecialization.pending, (state) => {
				state.status.update = 'loading';
			})
			.addCase(updateSpecialization.fulfilled, (state, action) => {
				const index = state.items.findIndex((specialization) => specialization.id === action.payload.id);
				if (index !== -1) {
					state.items[index] = action.payload;
				}
				state.status.update = 'succeeded';
			})
			.addCase(updateSpecialization.rejected, (state, action) => {
				state.status.update = 'failed';
				state.error.update = action.error.message;
			})
			.addCase(deleteSpecialization.pending, (state) => {
				state.status.delete = 'loading';
			})
			.addCase(deleteSpecialization.fulfilled, (state, action) => {
				state.status.delete = 'succeeded';
				state.items = state.items.filter((specialization) => specialization.id !== action.payload);
			})
			.addCase(deleteSpecialization.rejected, (state, action) => {
				state.status.delete = 'failed';
				state.error.delete = action.error.message;
			});
	}
});

export default specializationsSlice.reducer;
