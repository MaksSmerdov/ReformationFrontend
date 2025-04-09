import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '@services/api';

export const fetchEquipments = createAsyncThunk('equipments/fetchEquipments', async () => {
	const response = await api.get('/equipments');
	return response.data.data;
});

export const createEquipment = createAsyncThunk('equipments/createEquipment', async (equipment, { rejectWithValue }) => {
	try {
		const response = await api.post('/equipments', equipment);
		return response.data.data;
	} catch (error) {
		return rejectWithValue(error.response.data);
	}
});

export const updateEquipment = createAsyncThunk('equipments/updateEquipment', async (equipment) => {
	const response = await api.put(`/equipments/${equipment.id}`, equipment);
	return response.data.data;
});

export const deleteEquipment = createAsyncThunk('equipments/deleteEquipment', async (equipmentId) => {
	await api.delete(`/equipments/${equipmentId}`);
	return equipmentId;
});

const equipmentsSlice = createSlice({
	name: 'equipments',
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
			.addCase(fetchEquipments.pending, (state) => {
				state.status.fetch = 'loading';
			})
			.addCase(fetchEquipments.fulfilled, (state, action) => {
				state.items = action.payload;
				state.status.fetch = 'succeeded';
			})
			.addCase(fetchEquipments.rejected, (state, action) => {
				state.status.fetch = 'failed';
				state.error.fetch = action.error.message;
			})
			.addCase(createEquipment.pending, (state) => {
				state.status.create = 'loading';
			})
			.addCase(createEquipment.fulfilled, (state, action) => {
				state.items.push(action.payload);
				state.status.create = 'succeeded';
			})
			.addCase(createEquipment.rejected, (state, action) => {
				state.status.create = 'failed';
				state.error.create = action.error.message;
			})
			.addCase(updateEquipment.pending, (state) => {
				state.status.update = 'loading';
			})
			.addCase(updateEquipment.fulfilled, (state, action) => {
				const index = state.items.findIndex((equipment) => equipment.id === action.payload.id);
				if (index !== -1) {
					state.items[index] = action.payload;
				}
				state.status.update = 'succeeded';
			})
			.addCase(updateEquipment.rejected, (state, action) => {
				state.status.update = 'failed';
				state.error.update = action.error.message;
			})
			.addCase(deleteEquipment.pending, (state) => {
				state.status.delete = 'loading';
			})
			.addCase(deleteEquipment.fulfilled, (state, action) => {
				state.items = state.items.filter((equipment) => equipment.id !== action.payload);
				state.status.delete = 'succeeded';
			})
			.addCase(deleteEquipment.rejected, (state, action) => {
				state.status.delete = 'failed';
				state.error.delete = action.error.message;
			});
	}
});

export default equipmentsSlice.reducer;
