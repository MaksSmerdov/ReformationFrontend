import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { createSelector } from 'reselect';
import api from '@services/api';

export const fetchGuidesByFacadeId = createAsyncThunk('guides/fetchGuidesByFacadeId', async (facadeId, { rejectWithValue }) => {
	try {
		const response = await api.get(`/facades/${facadeId}/facade-guides`);
		return { facadeId, guides: response.data.data };
	} catch (err) {
		return rejectWithValue({ facadeId, message: err.response.data });
	}
});

export const fetchGuideById = createAsyncThunk('guides/fetchGuideById', async ({ facadeId, guideId }, { rejectWithValue }) => {
	try {
		const response = await api.get(`/facades/${facadeId}/facade-guides/${guideId}`);
		return { guideId, guide: response.data };
	} catch (err) {
		return rejectWithValue({ guideId, error: err.response.data });
	}
});

export const createGuide = createAsyncThunk('guides/createGuide', async ({ facadeId, data }, { rejectWithValue }) => {
	try {
		const response = await api.post(`/facades/${facadeId}/facade-guides`, data);
		return response.data.guide;
	} catch (err) {
		return rejectWithValue(err.response.data);
	}
});

export const updateGuide = createAsyncThunk('guides/updateGuide', async ({ facadeId, id, data }, { rejectWithValue }) => {
	try {
		const response = await api.put(`/facades/${facadeId}/facade-guides/${id}`, data);
		return response.data.guide;
	} catch (err) {
		return rejectWithValue(err.response.data);
	}
});

export const deleteGuide = createAsyncThunk('guides/deleteGuide', async ({ facadeId, id }, { rejectWithValue }) => {
	try {
		await api.delete(`/facades/${facadeId}/facade-guides/${id}`);
		return id;
	} catch (err) {
		return rejectWithValue(err.response.data);
	}
});

const guidesSlice = createSlice({
	name: 'guides',
	initialState: {
		byId: {},
		byFacadeId: {},
		statuses: {
			byId: {},
			byFacadeId: {}
		},
		errors: {
			byId: {},
			byFacadeId: {}
		}
	},
	reducers: {},
	extraReducers: (builder) => {
		builder
			.addCase(fetchGuidesByFacadeId.pending, (state, action) => {
				const { facadeId } = action.meta.arg;
				state.statuses.byFacadeId[facadeId] = { ...state.statuses.byFacadeId[facadeId], fetchAll: 'loading' };
				state.errors.byFacadeId[facadeId] = { ...state.errors.byFacadeId[facadeId], fetchAll: null };
			})
			.addCase(fetchGuidesByFacadeId.fulfilled, (state, action) => {
				const { facadeId, guides } = action.payload;
				state.byFacadeId[facadeId] = [];
				guides.forEach((guide) => {
					state.byId[guide.id] = guide;
					state.byFacadeId[facadeId].push(guide);
					state.statuses.byId[guide.id] = { ...state.statuses.byId[guide.id], fetch: 'succeeded' };
					state.errors.byId[guide.id] = { ...state.errors.byId[guide.id], fetch: null };
				});
				state.statuses.byFacadeId[facadeId] = { ...state.statuses.byFacadeId[facadeId], fetchAll: 'succeeded' };
			})
			.addCase(fetchGuidesByFacadeId.rejected, (state, action) => {
				const { facadeId } = action.meta.arg;
				state.statuses.byFacadeId[facadeId] = { ...state.statuses.byFacadeId[facadeId], fetchAll: 'failed' };
				state.errors.byFacadeId[facadeId] = { ...state.errors.byFacadeId[facadeId], fetchAll: action.payload.message || action.error.message };
			})
			.addCase(fetchGuideById.pending, (state, action) => {
				const { guideId } = action.meta.arg;
				state.statuses.byId[guideId] = { ...state.statuses.byId[guideId], fetch: 'loading' };
				state.errors.byId[guideId] = { ...state.errors.byId[guideId], fetch: null };
			})
			.addCase(fetchGuideById.fulfilled, (state, action) => {
				const { guideId, guide } = action.payload;
				state.byId[guide.id] = guide;
				if (!state.byFacadeId[guide.facade_id]) {
					state.byFacadeId[guide.facade_id] = [];
				}
				state.byFacadeId[guide.facade_id].push(guide);
				state.statuses.byId[guideId] = { ...state.statuses.byId[guideId], fetch: 'succeeded' };
			})
			.addCase(fetchGuideById.rejected, (state, action) => {
				const { guideId } = action.meta.arg;
				state.statuses.byId[guideId] = { ...state.statuses.byId[guideId], fetch: 'failed' };
				state.errors.byId[guideId] = { ...state.errors.byId[guideId], fetch: action.payload.error.message || action.error.message };
			})
			.addCase(createGuide.pending, (state, action) => {
				const { facadeId } = action.meta.arg;
				state.statuses.byFacadeId[facadeId] = { ...state.statuses.byFacadeId[facadeId], create: 'loading' };
				state.errors.byFacadeId[facadeId] = { ...state.errors.byFacadeId[facadeId], create: null };
			})
			.addCase(createGuide.fulfilled, (state, action) => {
				const guide = action.payload;
				state.byId[guide.id] = guide;
				if (!state.byFacadeId[guide.facade_id]) {
					state.byFacadeId[guide.facade_id] = [];
				}
				state.byFacadeId[guide.facade_id].push(guide);
				state.statuses.byFacadeId[guide.facade_id] = { ...state.statuses.byFacadeId[guide.facade_id], create: 'succeeded' };
			})
			.addCase(createGuide.rejected, (state, action) => {
				const { facadeId } = action.meta.arg;
				state.statuses.byFacadeId[facadeId] = { ...state.statuses.byFacadeId[facadeId], create: 'failed' };
				state.errors.byFacadeId[facadeId] = { ...state.errors.byFacadeId[facadeId], create: action.payload ? action.payload.error : action.error.message };
			})
			.addCase(updateGuide.pending, (state, action) => {
				const { id } = action.meta.arg;
				state.statuses.byId[id] = { ...state.statuses.byId[id], update: 'loading' };
				state.errors.byId[id] = { ...state.errors.byId[id], update: null };
			})
			.addCase(updateGuide.fulfilled, (state, action) => {
				const guide = action.payload;
				state.byId[guide.id] = guide;
				state.statuses.byId[guide.id] = { ...state.statuses.byId[guide.id], update: 'succeeded' };
			})
			.addCase(updateGuide.rejected, (state, action) => {
				const { id } = action.meta.arg;
				state.statuses.byId[id] = { ...state.statuses.byId[id], update: 'failed' };
				state.errors.byId[id] = { ...state.errors.byId[id], update: action.payload ? action.payload.error : action.error.message };
			})
			.addCase(deleteGuide.pending, (state, action) => {
				const { id } = action.meta.arg;
				state.statuses.byId[id] = { ...state.statuses.byId[id], delete: 'loading' };
				state.errors.byId[id] = { ...state.errors.byId[id], delete: null };
			})
			.addCase(deleteGuide.fulfilled, (state, action) => {
				const id = action.payload;
				const facadeId = Object.keys(state.byFacadeId).find((facadeId) => state.byFacadeId[facadeId].some((guide) => guide.id === id));
				if (facadeId) {
					state.byFacadeId[facadeId] = state.byFacadeId[facadeId].filter((guide) => guide.id !== id);
				}
				delete state.byId[id];
				state.statuses.byId[id] = { ...state.statuses.byId[id], delete: 'succeeded' };
			})
			.addCase(deleteGuide.rejected, (state, action) => {
				const { id } = action.meta.arg;
				state.statuses.byId[id] = { ...state.statuses.byId[id], delete: 'failed' };
				state.errors.byId[id] = { ...state.errors.byId[id], delete: action.payload ? action.payload.error : action.error.message };
			});
	}
});

export const selectGuideById = createSelector(
	(state) => state.guides.byId,
	(_, guideId) => guideId,
	(byId, guideId) => byId[guideId]
);

export const selectGuidesByFacadeId = createSelector(
	(state) => state.guides.byFacadeId,
	(_, facadeId) => facadeId,
	(byFacadeId, facadeId) => byFacadeId[facadeId] || []
);

export default guidesSlice.reducer;
