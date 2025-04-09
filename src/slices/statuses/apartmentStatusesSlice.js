import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '@services/api';
import { updateApartmentStatusInCurrentProject, deleteApartmentStatusInCurrentProject, addApartmentStatusToCurrentProject } from '@slices/rooms/currentProjectSlice';

export const fetchApartmentStatuses = createAsyncThunk('apartmentStatuses/fetchApartmentStatuses', async (apartmentId) => {
	const response = await api.get(`/apartments/${apartmentId}/statuses`);
	return { apartmentId, statuses: response.data.data };
});

export const createApartmentStatus = createAsyncThunk('apartmentStatuses/createApartmentStatus', async ({ apartmentId, status }, { rejectWithValue, dispatch }) => {
	try {
		const response = await api.post(`/apartments/${apartmentId}/statuses`, status);
		const newStatus = response.data.data;
		dispatch(addApartmentStatusToCurrentProject(newStatus));
		return newStatus;
	} catch (error) {
		return rejectWithValue(error.response.data);
	}
});

export const updateApartmentStatus = createAsyncThunk('apartmentStatuses/updateApartmentStatus', async ({ apartmentId, statusId, status }, { rejectWithValue, dispatch }) => {
	try {
		const response = await api.put(`/apartments/${apartmentId}/statuses/${statusId}`, status);
		const updatedStatus = response.data;
		dispatch(updateApartmentStatusInCurrentProject(updatedStatus));
		return updatedStatus;
	} catch (error) {
		return rejectWithValue(error.response.data);
	}
});

export const deleteApartmentStatus = createAsyncThunk('apartmentStatuses/deleteApartmentStatus', async ({ apartmentId, statusId }, { rejectWithValue, dispatch }) => {
	try {
		await api.delete(`/apartments/${apartmentId}/statuses/${statusId}`);
		dispatch(deleteApartmentStatusInCurrentProject({ apartmentId, statusId }));
		return statusId;
	} catch (error) {
		return rejectWithValue(error.response.data);
	}
});

const apartmentStatusesSlice = createSlice({
	name: 'apartmentStatuses',
	initialState: {
		byApartmentId: {},
		status: {},
		error: {},
		createStatus: {},
		createError: {},
		updateStatus: {},
		updateError: {},
		deleteStatus: {},
		deleteError: {}
	},
	reducers: {},
	extraReducers: (builder) => {
		builder
			.addCase(fetchApartmentStatuses.pending, (state, action) => {
				state.status[action.meta.arg] = 'loading';
			})
			.addCase(fetchApartmentStatuses.fulfilled, (state, action) => {
				state.status[action.payload.apartmentId] = 'succeeded';
				const { apartmentId, statuses } = action.payload;
				state.byApartmentId[apartmentId] = statuses;
			})
			.addCase(fetchApartmentStatuses.rejected, (state, action) => {
				state.status[action.meta.arg] = 'failed';
				state.error[action.meta.arg] = action.error.message;
			})
			.addCase(createApartmentStatus.pending, (state, action) => {
				state.createStatus[action.meta.arg.apartmentId] = 'loading';
			})
			.addCase(createApartmentStatus.fulfilled, (state, action) => {
				state.createStatus[action.payload.apartment_id] = 'succeeded';
				const { apartment_id, ...status } = action.payload;
				if (!state.byApartmentId[apartment_id]) {
					state.byApartmentId[apartment_id] = [];
				}
				state.byApartmentId[apartment_id].push(status);
			})
			.addCase(createApartmentStatus.rejected, (state, action) => {
				state.createStatus[action.meta.arg.apartmentId] = 'failed';
				state.createError[action.meta.arg.apartmentId] = action.error.message;
			})
			.addCase(updateApartmentStatus.pending, (state, action) => {
				state.updateStatus[action.meta.arg.apartmentId] = 'loading';
			})
			.addCase(updateApartmentStatus.fulfilled, (state, action) => {
				state.updateStatus[action.payload.apartment_id] = 'succeeded';
				const { apartment_id, id, ...updatedStatus } = action.payload;
				const statuses = state.byApartmentId[apartment_id];
				const index = statuses.findIndex((status) => status.id === id);
				if (index !== -1) {
					statuses[index] = { id, ...updatedStatus };
				}
			})
			.addCase(updateApartmentStatus.rejected, (state, action) => {
				state.updateStatus[action.meta.arg.apartmentId] = 'failed';
				state.updateError[action.meta.arg.apartmentId] = action.error.message;
			})
			.addCase(deleteApartmentStatus.pending, (state, action) => {
				state.deleteStatus[action.meta.arg.apartmentId] = 'loading';
			})
			.addCase(deleteApartmentStatus.fulfilled, (state, action) => {
				state.deleteStatus[action.meta.arg.apartmentId] = 'succeeded';
				const apartmentId = action.meta.arg.apartmentId;
				const statusId = action.payload;
				state.byApartmentId[apartmentId] = state.byApartmentId[apartmentId].filter((status) => status.id !== statusId);
			})
			.addCase(deleteApartmentStatus.rejected, (state, action) => {
				state.deleteStatus[action.meta.arg.apartmentId] = 'failed';
				state.deleteError[action.meta.arg.apartmentId] = action.error.message;
			});
	}
});

export default apartmentStatusesSlice.reducer;
