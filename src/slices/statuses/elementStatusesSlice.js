import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '@services/api';

export const fetchElementStatuses = createAsyncThunk('elementStatuses/fetchElementStatuses', async (elementId) => {
	const response = await api.get(`/elements/${elementId}/statuses`);
	return { elementId, statuses: response.data.data };
});

export const createElementStatus = createAsyncThunk('elementStatuses/createElementStatus', async ({ elementId, status }, { rejectWithValue }) => {
	try {
		const response = await api.post(`/elements/${elementId}/statuses`, status);
		const newStatus = response.data.data;
		return newStatus;
	} catch (error) {
		return rejectWithValue(error.response.data);
	}
});

export const updateElementStatus = createAsyncThunk('elementStatuses/updateElementStatus', async ({ elementId, statusId, status }, { rejectWithValue }) => {
	try {
		const response = await api.put(`/elements/${elementId}/statuses/${statusId}`, status);
		const updatedStatus = response.data;
		return updatedStatus;
	} catch (error) {
		return rejectWithValue(error.response.data);
	}
});

export const deleteElementStatus = createAsyncThunk('elementStatuses/deleteElementStatus', async ({ elementId, statusId }, { rejectWithValue }) => {
	try {
		await api.delete(`/elements/${elementId}/statuses/${statusId}`);
		return statusId;
	} catch (error) {
		return rejectWithValue(error.response.data);
	}
});

const elementStatusesSlice = createSlice({
	name: 'elementStatuses',
	initialState: {
		byElementId: {},
		status: {},
		error: {},
		createStatus: {},
		createError: {},
		updateStatus: {},
		updateError: {},
		deleteStatus: {},
		deleteError: {}
	},
	reducers: {
		setElementStatusesFromFacade: (state, action) => {
			const facade = action.payload;
			facade.elements.forEach((element) => {
				if (element.element_statuses) {
					state.byElementId[element.id] = element.element_statuses;
					state.status[element.id] = 'succeeded';
				}
			});
		}
	},
	extraReducers: (builder) => {
		builder
			.addCase(fetchElementStatuses.pending, (state, action) => {
				state.status[action.meta.arg] = 'loading';
			})
			.addCase(fetchElementStatuses.fulfilled, (state, action) => {
				state.status[action.payload.elementId] = 'succeeded';
				const { elementId, statuses } = action.payload;
				state.byElementId[elementId] = statuses;
			})
			.addCase(fetchElementStatuses.rejected, (state, action) => {
				state.status[action.meta.arg] = 'failed';
				state.error[action.meta.arg] = action.error.message;
			})
			.addCase(createElementStatus.pending, (state, action) => {
				state.createStatus[action.meta.arg.elementId] = 'loading';
			})
			.addCase(createElementStatus.fulfilled, (state, action) => {
				state.createStatus[action.payload.element_id] = 'succeeded';
				const { element_id, ...status } = action.payload;
				if (!state.byElementId[element_id]) {
					state.byElementId[element_id] = [];
				}
				state.byElementId[element_id].push(status);
			})
			.addCase(createElementStatus.rejected, (state, action) => {
				state.createStatus[action.meta.arg.elementId] = 'failed';
				state.createError[action.meta.arg.elementId] = action.error.message;
			})
			.addCase(updateElementStatus.pending, (state, action) => {
				state.updateStatus[action.meta.arg.elementId] = 'loading';
			})
			.addCase(updateElementStatus.fulfilled, (state, action) => {
				state.updateStatus[action.payload.element_id] = 'succeeded';
				const { element_id, id, ...updatedStatus } = action.payload;
				const statuses = state.byElementId[element_id];
				const index = statuses.findIndex((status) => status.id === id);
				if (index !== -1) {
					statuses[index] = { id, ...updatedStatus };
				}
			})
			.addCase(updateElementStatus.rejected, (state, action) => {
				state.updateStatus[action.meta.arg.elementId] = 'failed';
				state.updateError[action.meta.arg.elementId] = action.error.message;
			})
			.addCase(deleteElementStatus.pending, (state, action) => {
				state.deleteStatus[action.meta.arg.elementId] = 'loading';
			})
			.addCase(deleteElementStatus.fulfilled, (state, action) => {
				state.deleteStatus[action.meta.arg.elementId] = 'succeeded';
				const elementId = action.meta.arg.elementId;
				const statusId = action.payload;
				state.byElementId[elementId] = state.byElementId[elementId].filter((status) => status.id !== statusId);
			})
			.addCase(deleteElementStatus.rejected, (state, action) => {
				state.deleteStatus[action.meta.arg.elementId] = 'failed';
				state.deleteError[action.meta.arg.elementId] = action.error.message;
			});
	}
});

export const { setElementStatusesFromFacade } = elementStatusesSlice.actions;

export const selectElementStatusesByElementId = (state, elementId) => state.elementStatuses.byElementId[elementId];

export default elementStatusesSlice.reducer;
