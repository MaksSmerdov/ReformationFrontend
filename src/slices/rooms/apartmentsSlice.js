import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '@services/api';

export const fetchApartmentById = createAsyncThunk('apartments/fetchApartmentById', async ({ staircaseId, apartmentId }, { rejectWithValue }) => {
	try {
		const response = await api.get(`/staircases/${staircaseId}/apartments/${apartmentId}`);
		return response.data;
	} catch (err) {
		return rejectWithValue(err.response.data);
	}
});

export const fetchApartments = createAsyncThunk('apartments/fetchApartments', async (staircaseId, { rejectWithValue }) => {
	try {
		const response = await api.get(`/staircases/${staircaseId}/apartments`);
		return { staircaseId, apartments: response.data.data };
	} catch (err) {
		return rejectWithValue(err.response.data);
	}
});

export const createApartment = createAsyncThunk('apartments/createApartment', async ({ staircaseId, apartment }, { rejectWithValue }) => {
	try {
		const response = await api.post(`/staircases/${staircaseId}/apartments`, apartment);
		return response.data.apartment;
	} catch (err) {
		return rejectWithValue(err.response.data);
	}
});

export const updateApartment = createAsyncThunk('apartments/updateApartment', async ({ staircaseId, apartment }, { rejectWithValue }) => {
	try {
		const response = await api.put(`/staircases/${staircaseId}/apartments/${apartment.id}`, apartment);
		return response.data.apartment;
	} catch (err) {
		return rejectWithValue(err.response.data);
	}
});

export const deleteApartment = createAsyncThunk('apartments/deleteApartment', async ({ staircaseId, apartmentId }, { rejectWithValue }) => {
	try {
		await api.delete(`/staircases/${staircaseId}/apartments/${apartmentId}`);
		return apartmentId;
	} catch (err) {
		return rejectWithValue(err.response.data);
	}
});

const apartmentsSlice = createSlice({
	name: 'apartments',
	initialState: {
		items: [],
		byId: {},
		byStaircaseId: {},
		status: {
			fetchAll: 'idle',
			fetch: {},
			create: 'idle',
			update: {},
			delete: {}
		},
		error: {
			fetchAll: null,
			fetch: {},
			create: null,
			update: {},
			delete: {}
		},
		savingApartments: {}
	},
	reducers: {
		startSavingApartment: (state, action) => {
			state.savingApartments[action.payload] = true;
		},
		finishSavingApartment: (state, action) => {
			state.savingApartments[action.payload] = false;
		},
		failSavingApartment: (state, action) => {
			state.savingApartments[action.payload] = false;
		}
	},
	extraReducers: (builder) => {
		builder
			.addCase(fetchApartments.pending, (state) => {
				state.status.fetchAll = 'loading';
				state.error.fetchAll = null;
			})
			.addCase(fetchApartments.fulfilled, (state, action) => {
				state.status.fetchAll = 'succeeded';
				const { staircaseId, apartments } = action.payload;
				state.byStaircaseId[staircaseId] = apartments.map((apartment) => apartment.id);
				apartments.forEach((apartment) => {
					state.byId[apartment.id] = apartment;
					if (!state.items.includes(apartment.id)) {
						state.items.push(apartment.id);
					}
				});
			})
			.addCase(fetchApartments.rejected, (state, action) => {
				state.status.fetchAll = 'failed';
				state.error.fetchAll = action.payload.message || action.error.message;
				console.error('Fetch Apartments Error:', state.error.fetchAll);
			})
			.addCase(fetchApartmentById.pending, (state, action) => {
				state.status.fetch[action.meta.arg.apartmentId] = 'loading';
				state.error.fetch[action.meta.arg.apartmentId] = null;
			})
			.addCase(fetchApartmentById.fulfilled, (state, action) => {
				state.byId[action.payload.id] = action.payload;
				if (!state.items.includes(action.payload.id)) {
					state.items.push(action.payload.id);
				}
				state.status.fetch[action.meta.arg.apartmentId] = 'succeeded';
			})
			.addCase(fetchApartmentById.rejected, (state, action) => {
				state.status.fetch[action.meta.arg.apartmentId] = 'failed';
				state.error.fetch[action.meta.arg.apartmentId] = action.payload.message || action.error.message;
				console.error('Fetch Apartment By ID Error:', state.error.fetch[action.meta.arg.apartmentId]);
			})
			.addCase(createApartment.pending, (state) => {
				state.status.create = 'loading';
				state.error.create = null;
			})
			.addCase(createApartment.fulfilled, (state, action) => {
				state.status.create = 'succeeded';
				state.byId[action.payload.id] = action.payload;
				state.items.push(action.payload.id);
			})
			.addCase(createApartment.rejected, (state, action) => {
				state.status.create = 'failed';
				state.error.create = action.payload.message || action.error.message;
				console.error('Create Apartment Error:', state.error.create);
			})
			.addCase(updateApartment.pending, (state, action) => {
				state.status.update[action.meta.arg.apartment.id] = 'loading';
				state.error.update[action.meta.arg.apartment.id] = null;
			})
			.addCase(updateApartment.fulfilled, (state, action) => {
				state.status.update[action.meta.arg.apartment.id] = 'succeeded';
				state.byId[action.payload.id] = action.payload;
			})
			.addCase(updateApartment.rejected, (state, action) => {
				state.status.update[action.meta.arg.apartment.id] = 'failed';
				state.error.update[action.meta.arg.apartment.id] = action.payload.message || action.error.message;
				console.error('Update Apartment Error:', state.error.update[action.meta.arg.apartment.id]);
			})
			.addCase(deleteApartment.pending, (state, action) => {
				state.status.delete[action.meta.arg.apartmentId] = 'loading';
				state.error.delete[action.meta.arg.apartmentId] = null;
			})
			.addCase(deleteApartment.fulfilled, (state, action) => {
				state.status.delete[action.meta.arg.apartmentId] = 'succeeded';
				delete state.byId[action.payload];
				state.items = state.items.filter((id) => id !== action.payload);
			})
			.addCase(deleteApartment.rejected, (state, action) => {
				state.status.delete[action.meta.arg.apartmentId] = 'failed';
				state.error.delete[action.meta.arg.apartmentId] = action.payload.message || action.error.message;
				console.error('Delete Apartment Error:', state.error.delete[action.meta.arg.apartmentId]);
			});
	}
});

export const { startSavingApartment, finishSavingApartment, failSavingApartment } = apartmentsSlice.actions;

export default apartmentsSlice.reducer;
