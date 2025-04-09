import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '@services/api';
import { updateStaircaseLayoutInCurrentProject } from '@slices/rooms/currentProjectSlice';

export const fetchStaircaseLayouts = createAsyncThunk('staircaseLayouts/fetchStaircaseLayouts', async (staircaseId) => {
	const response = await api.get(`/staircases/${staircaseId}/layouts`);
	return { staircaseId, data: response.data.data };
});

export const fetchStaircaseLayoutById = createAsyncThunk('staircaseLayouts/fetchStaircaseLayoutById', async ({ staircaseId, layoutId }) => {
	const response = await api.get(`/staircases/${staircaseId}/layouts/${layoutId}`);
	return { staircaseId, layout: response.data.data };
});

export const createStaircaseLayout = createAsyncThunk('staircaseLayouts/createStaircaseLayout', async (data, { rejectWithValue }) => {
	try {
		const response = await api.post(`/staircases/${data.staircase_id}/layouts`, data);
		return { staircaseId: data.staircase_id, layout: response.data.layout };
	} catch (err) {
		return rejectWithValue(err.response.data);
	}
});

export const updateStaircaseLayout = createAsyncThunk('staircaseLayouts/updateStaircaseLayout', async ({ id, ...data }, { rejectWithValue }) => {
	try {
		const response = await api.put(`/staircases/${data.staircase_id}/layouts/${id}`, data);
		return { staircaseId: data.staircase_id, layout: response.data.data };
	} catch (err) {
		return rejectWithValue(err.response.data);
	}
});

export const deleteStaircaseLayout = createAsyncThunk('staircaseLayouts/deleteStaircaseLayout', async ({ id, staircaseId }, { rejectWithValue }) => {
	try {
		await api.delete(`/staircases/${staircaseId}/layouts/${id}`);
		return { staircaseId, id };
	} catch (err) {
		return rejectWithValue(err.response.data);
	}
});

const staircaseLayoutsSlice = createSlice({
	name: 'staircaseLayouts',
	initialState: {
		items: {},
		status: 'idle',
		error: null,
		createStatus: 'idle',
		createError: null,
		updateStatus: 'idle',
		updateError: null,
		deleteStatus: 'idle',
		deleteError: null
	},
	reducers: {},
	extraReducers: (builder) => {
		builder
			.addCase(fetchStaircaseLayouts.pending, (state) => {
				state.status = 'loading';
			})
			.addCase(fetchStaircaseLayouts.fulfilled, (state, action) => {
				state.status = 'succeeded';
				state.items[action.payload.staircaseId] = action.payload.data;
			})
			.addCase(fetchStaircaseLayouts.rejected, (state, action) => {
				state.status = 'failed';
				state.error = action.error.message;
			})
			.addCase(fetchStaircaseLayoutById.pending, (state) => {
				state.status = 'loading';
			})
			.addCase(fetchStaircaseLayoutById.fulfilled, (state, action) => {
				state.status = 'succeeded';
				const index = state.items[action.payload.staircaseId].findIndex((layout) => layout.id === action.payload.layout.id);
				if (index !== -1) {
					state.items[action.payload.staircaseId][index] = action.payload.layout;
				} else {
					state.items[action.payload.staircaseId].push(action.payload.layout);
				}
			})
			.addCase(fetchStaircaseLayoutById.rejected, (state, action) => {
				state.status = 'failed';
				state.error = action.error.message;
			})
			.addCase(createStaircaseLayout.pending, (state) => {
				state.createStatus = 'loading';
			})
			.addCase(createStaircaseLayout.fulfilled, (state, action) => {
				state.createStatus = 'succeeded';
				state.items[action.payload.staircaseId].push(action.payload.layout);
			})
			.addCase(createStaircaseLayout.rejected, (state, action) => {
				state.createStatus = 'failed';
				state.createError = action.payload ? action.payload.error : action.error.message;
			})
			.addCase(updateStaircaseLayout.pending, (state) => {
				state.updateStatus = 'loading';
			})
			.addCase(updateStaircaseLayout.fulfilled, (state, action) => {
				state.updateStatus = 'succeeded';
				const index = state.items[action.payload.staircaseId].findIndex((layout) => layout.id === action.payload.layout.id);
				if (index !== -1) {
					state.items[action.payload.staircaseId][index] = action.payload.layout;
				}
				dispatch(updateStaircaseLayoutInCurrentProject(action.payload.layout));
			})
			.addCase(updateStaircaseLayout.rejected, (state, action) => {
				state.updateStatus = 'failed';
				state.updateError = action.payload ? action.payload.error : action.error.message;
			})
			.addCase(deleteStaircaseLayout.pending, (state) => {
				state.deleteStatus = 'loading';
			})
			.addCase(deleteStaircaseLayout.fulfilled, (state, action) => {
				state.deleteStatus = 'succeeded';
				state.items[action.payload.staircaseId] = state.items[action.payload.staircaseId].filter((layout) => layout.id !== action.payload.id);
			})
			.addCase(deleteStaircaseLayout.rejected, (state, action) => {
				state.deleteStatus = 'failed';
				state.deleteError = action.payload ? action.payload.error : action.error.message;
			});
	}
});

export default staircaseLayoutsSlice.reducer;
