import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '@services/api';
import { updateStaircaseInCurrentProject } from '@slices/rooms/currentProjectSlice';

export const fetchStaircases = createAsyncThunk('staircases/fetchStaircases', async (projectId) => {
	const response = await api.get(`/projects/${projectId}/staircases`);
	return { projectId, staircases: response.data.data };
});

export const createStaircase = createAsyncThunk('staircases/createStaircase', async (data, { rejectWithValue }) => {
	try {
		const response = await api.post(`/projects/${data.project_id}/staircases`, data);
		return response.data.staircase;
	} catch (err) {
		return rejectWithValue(err.response.data);
	}
});

export const updateStaircase = createAsyncThunk('staircases/updateStaircase', async ({ id, ...data }, { rejectWithValue }) => {
	try {
		const response = await api.put(`/projects/${data.project_id}/staircases/${id}`, data);
		return response.data.staircase;
	} catch (err) {
		return rejectWithValue(err.response.data);
	}
});

export const deleteStaircase = createAsyncThunk('staircases/deleteStaircase', async ({ id, projectId }, { rejectWithValue }) => {
	try {
		await api.delete(`/projects/${projectId}/staircases/${id}`);
		return { id, projectId };
	} catch (err) {
		return rejectWithValue(err.response.data);
	}
});

export const fetchStaircaseById = createAsyncThunk('staircases/fetchStaircaseById', async ({ projectId, staircaseId }, { rejectWithValue }) => {
	try {
		const response = await api.get(`/projects/${projectId}/staircases/${staircaseId}`);
		return response.data;
	} catch (err) {
		return rejectWithValue(err.response.data);
	}
});

const staircasesSlice = createSlice({
	name: 'staircases',
	initialState: {
		items: [],
		byId: {},
		byProjectId: {},
		status: 'idle',
		error: null,
		createStatus: 'idle',
		createError: null,
		updateStatus: 'idle',
		updateError: null,
		deleteStatus: 'idle',
		deleteError: null,
		fetchByIdStatus: 'idle',
		fetchByIdError: null
	},
	reducers: {},
	extraReducers: (builder) => {
		builder
			.addCase(fetchStaircases.pending, (state) => {
				state.status = 'loading';
			})
			.addCase(fetchStaircases.fulfilled, (state, action) => {
				state.status = 'succeeded';
				const { projectId, staircases } = action.payload;
				state.items = staircases;
				state.byId = staircases.reduce((acc, staircase) => {
					acc[staircase.id] = staircase;
					return acc;
				}, {});
				state.byProjectId[projectId] = staircases.map((staircase) => staircase.id);
			})
			.addCase(fetchStaircases.rejected, (state, action) => {
				state.status = 'failed';
				state.error = action.error.message;
			})
			.addCase(createStaircase.fulfilled, (state, action) => {
				state.createStatus = 'succeeded';
				const staircase = action.payload;
				state.items.push(staircase);
				state.byId[staircase.id] = staircase;
				if (!state.byProjectId[staircase.project_id]) {
					state.byProjectId[staircase.project_id] = [];
				}
				state.byProjectId[staircase.project_id].push(staircase.id);
			})
			.addCase(updateStaircase.fulfilled, (state, action) => {
				state.updateStatus = 'succeeded';
				const updatedStaircase = action.payload;
				const index = state.items.findIndex((staircase) => staircase.id === updatedStaircase.id);
				if (index !== -1) {
					state.items[index] = updatedStaircase;
				}
				state.byId[updatedStaircase.id] = updatedStaircase;
				dispatch(updateStaircaseInCurrentProject(updatedStaircase));
			})
			.addCase(deleteStaircase.fulfilled, (state, action) => {
				state.deleteStatus = 'succeeded';
				const { id, projectId } = action.payload;
				state.items = state.items.filter((staircase) => staircase.id !== id);
				delete state.byId[id];
				if (state.byProjectId[projectId]) {
					state.byProjectId[projectId] = state.byProjectId[projectId].filter((staircaseId) => staircaseId !== id);
				}
			})
			.addCase(fetchStaircaseById.fulfilled, (state, action) => {
				state.fetchByIdStatus = 'succeeded';
				const staircase = action.payload;
				state.byId[staircase.id] = staircase;
				if (!state.byProjectId[staircase.project_id]) {
					state.byProjectId[staircase.project_id] = [];
				}
				if (!state.byProjectId[staircase.project_id].includes(staircase.id)) {
					state.byProjectId[staircase.project_id].push(staircase.id);
				}
			});
	}
});

export default staircasesSlice.reducer;
