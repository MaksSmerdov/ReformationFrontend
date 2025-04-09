import { createSlice, createAsyncThunk, createSelector } from '@reduxjs/toolkit';
import api from '@services/api';

export const fetchElementGroupsByFacadeId = createAsyncThunk('elementGroups/fetchElementGroupsByFacadeId', async (facadeId, { rejectWithValue }) => {
	try {
		const response = await api.get(`/facades/${facadeId}/element-groups`);
		return { facadeId, elementGroups: response.data.data };
	} catch (err) {
		return rejectWithValue({ facadeId, message: err.response.data });
	}
});

export const fetchElementGroupById = createAsyncThunk('elementGroups/fetchElementGroupById', async ({ facadeId, elementGroupId }, { rejectWithValue }) => {
	try {
		const response = await api.get(`/facades/${facadeId}/element-groups/${elementGroupId}`);
		return { elementGroupId, elementGroup: response.data };
	} catch (err) {
		return rejectWithValue({ elementGroupId, error: err.response.data });
	}
});

export const createElementGroup = createAsyncThunk('elementGroups/createElementGroup', async ({ facadeId, data }, { rejectWithValue }) => {
	try {
		const response = await api.post(`/facades/${facadeId}/element-groups`, data);
		return response.data.element_group;
	} catch (err) {
		return rejectWithValue(err.response.data);
	}
});

export const updateElementGroup = createAsyncThunk('elementGroups/updateElementGroup', async ({ facadeId, id, data }, { rejectWithValue }) => {
	try {
		const response = await api.put(`/facades/${facadeId}/element-groups/${id}`, data);
		return response.data.element_group;
	} catch (err) {
		return rejectWithValue(err.response.data);
	}
});

export const deleteElementGroup = createAsyncThunk('elementGroups/deleteElementGroup', async ({ facadeId, id }, { rejectWithValue }) => {
	try {
		await api.delete(`/facades/${facadeId}/element-groups/${id}`);
		return id;
	} catch (err) {
		return rejectWithValue(err.response.data);
	}
});

const elementGroupsSlice = createSlice({
	name: 'elementGroups',
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
			.addCase(fetchElementGroupsByFacadeId.pending, (state, action) => {
				const { facadeId } = action.meta.arg;
				state.statuses.byFacadeId[facadeId] = { ...state.statuses.byFacadeId[facadeId], fetchAll: 'loading' };
				state.errors.byFacadeId[facadeId] = { ...state.errors.byFacadeId[facadeId], fetchAll: null };
			})
			.addCase(fetchElementGroupsByFacadeId.fulfilled, (state, action) => {
				const { facadeId, elementGroups } = action.payload;
				state.byFacadeId[facadeId] = [];
				elementGroups.forEach((elementGroup) => {
					state.byId[elementGroup.id] = elementGroup;
					state.byFacadeId[facadeId].push(elementGroup);
					state.statuses.byId[elementGroup.id] = { ...state.statuses.byId[elementGroup.id], fetch: 'succeeded' };
					state.errors.byId[elementGroup.id] = { ...state.errors.byId[elementGroup.id], fetch: null };
				});
				state.statuses.byFacadeId[facadeId] = { ...state.statuses.byFacadeId[facadeId], fetchAll: 'succeeded' };
			})
			.addCase(fetchElementGroupsByFacadeId.rejected, (state, action) => {
				const { facadeId } = action.meta.arg;
				state.statuses.byFacadeId[facadeId] = { ...state.statuses.byFacadeId[facadeId], fetchAll: 'failed' };
				state.errors.byFacadeId[facadeId] = { ...state.errors.byFacadeId[facadeId], fetchAll: action.payload.message || action.error.message };
			})
			.addCase(fetchElementGroupById.pending, (state, action) => {
				const { elementGroupId } = action.meta.arg;
				state.statuses.byId[elementGroupId] = { ...state.statuses.byId[elementGroupId], fetch: 'loading' };
				state.errors.byId[elementGroupId] = { ...state.errors.byId[elementGroupId], fetch: null };
			})
			.addCase(fetchElementGroupById.fulfilled, (state, action) => {
				const { elementGroupId, elementGroup } = action.payload;
				state.byId[elementGroup.id] = elementGroup;
				if (!state.byFacadeId[elementGroup.facade_id]) {
					state.byFacadeId[elementGroup.facade_id] = [];
				}
				state.byFacadeId[elementGroup.facade_id].push(elementGroup);
				state.statuses.byId[elementGroupId] = { ...state.statuses.byId[elementGroupId], fetch: 'succeeded' };
			})
			.addCase(fetchElementGroupById.rejected, (state, action) => {
				const { elementGroupId } = action.meta.arg;
				state.statuses.byId[elementGroupId] = { ...state.statuses.byId[elementGroupId], fetch: 'failed' };
				state.errors.byId[elementGroupId] = { ...state.errors.byId[elementGroupId], fetch: action.payload.error.message || action.error.message };
			})
			.addCase(createElementGroup.pending, (state, action) => {
				const { facadeId } = action.meta.arg;
				state.statuses.byFacadeId[facadeId] = { ...state.statuses.byFacadeId[facadeId], create: 'loading' };
				state.errors.byFacadeId[facadeId] = { ...state.errors.byFacadeId[facadeId], create: null };
			})
			.addCase(createElementGroup.fulfilled, (state, action) => {
				const elementGroup = action.payload;
				state.byId[elementGroup.id] = elementGroup;
				if (!state.byFacadeId[elementGroup.facade_id]) {
					state.byFacadeId[elementGroup.facade_id] = [];
				}
				state.byFacadeId[elementGroup.facade_id].push(elementGroup);
				state.statuses.byFacadeId[elementGroup.facade_id] = { ...state.statuses.byFacadeId[elementGroup.facade_id], create: 'succeeded' };
			})
			.addCase(createElementGroup.rejected, (state, action) => {
				const { facadeId } = action.meta.arg;
				state.statuses.byFacadeId[facadeId] = { ...state.statuses.byFacadeId[facadeId], create: 'failed' };
				state.errors.byFacadeId[facadeId] = { ...state.errors.byFacadeId[facadeId], create: action.payload ? action.payload.error : action.error.message };
			})
			.addCase(updateElementGroup.pending, (state, action) => {
				const { id } = action.meta.arg;
				state.statuses.byId[id] = { ...state.statuses.byId[id], update: 'loading' };
				state.errors.byId[id] = { ...state.errors.byId[id], update: null };
			})
			.addCase(updateElementGroup.fulfilled, (state, action) => {
				const elementGroup = action.payload;
				state.byId[elementGroup.id] = elementGroup;
				state.statuses.byId[elementGroup.id] = { ...state.statuses.byId[elementGroup.id], update: 'succeeded' };
			})
			.addCase(updateElementGroup.rejected, (state, action) => {
				const { id } = action.meta.arg;
				state.statuses.byId[id] = { ...state.statuses.byId[id], update: 'failed' };
				state.errors.byId[id] = { ...state.errors.byId[id], update: action.payload ? action.payload.error : action.error.message };
			})
			.addCase(deleteElementGroup.pending, (state, action) => {
				const { id } = action.meta.arg;
				state.statuses.byId[id] = { ...state.statuses.byId[id], delete: 'loading' };
				state.errors.byId[id] = { ...state.errors.byId[id], delete: null };
			})
			.addCase(deleteElementGroup.fulfilled, (state, action) => {
				const id = action.payload;
				const facadeId = Object.keys(state.byFacadeId).find((facadeId) => state.byFacadeId[facadeId].some((elementGroup) => elementGroup.id === id));
				if (facadeId) {
					state.byFacadeId[facadeId] = state.byFacadeId[facadeId].filter((elementGroup) => elementGroup.id !== id);
				}
				delete state.byId[id];
				state.statuses.byId[id] = { ...state.statuses.byId[id], delete: 'succeeded' };
			})
			.addCase(deleteElementGroup.rejected, (state, action) => {
				const { id } = action.meta.arg;
				state.statuses.byId[id] = { ...state.statuses.byId[id], delete: 'failed' };
				state.errors.byId[id] = { ...state.errors.byId[id], delete: action.payload ? action.payload.error : action.error.message };
			});
	}
});

export const selectElementGroupById = createSelector(
	(state) => state.elementGroups.byId,
	(_, elementGroupId) => elementGroupId,
	(byId, elementGroupId) => byId[elementGroupId]
);

export const selectElementGroupsByFacadeId = createSelector(
	(state) => state.elementGroups.byFacadeId,
	(_, facadeId) => facadeId,
	(byFacadeId, facadeId) => byFacadeId[facadeId] || []
);

export default elementGroupsSlice.reducer;
