import { createSlice, createAsyncThunk, createSelector } from '@reduxjs/toolkit';
import api from '@services/api';
import { setElementStatusesFromFacade } from '@slices/statuses/elementStatusesSlice';

export const fetchAllFacades = createAsyncThunk('facades/fetchAllFacades', async (projectId, { rejectWithValue }) => {
	try {
		const response = await api.get(`/projects/${projectId}/facades`);
		return { projectId, facades: response.data.data };
	} catch (err) {
		return rejectWithValue(err.response.data);
	}
});

export const fetchFacadeById = createAsyncThunk('facades/fetchFacadeById', async ({ projectId, facadeId }, { rejectWithValue, dispatch }) => {
	try {
		const response = await api.get(`/projects/${projectId}/facades/${facadeId}`);
		if (!response.data) {
			return rejectWithValue({ facadeId, error: 'Facade not found' });
		}
		const facade = response.data;
		dispatch(setElementStatusesFromFacade(facade));
		return { facadeId, facade };
	} catch (err) {
		return rejectWithValue({ facadeId, error: err.response.data });
	}
});

export const createFacade = createAsyncThunk('facades/createFacade', async ({ projectId, data }, { rejectWithValue }) => {
	try {
		const response = await api.post(`/projects/${projectId}/facades`, data);
		return response.data.facade;
	} catch (err) {
		return rejectWithValue(err.response.data);
	}
});

export const updateFacade = createAsyncThunk('facades/updateFacade', async ({ projectId, id, data }, { rejectWithValue }) => {
	try {
		const response = await api.put(`/projects/${projectId}/facades/${id}`, data);
		return response.data.facade;
	} catch (err) {
		return rejectWithValue(err.response.data);
	}
});

export const deleteFacade = createAsyncThunk('facades/deleteFacade', async ({ projectId, id }, { rejectWithValue }) => {
	try {
		await api.delete(`/projects/${projectId}/facades/${id}`);
		return id;
	} catch (err) {
		return rejectWithValue(err.response.data);
	}
});

const facadesSlice = createSlice({
	name: 'facades',
	initialState: {
		byId: {},
		byProjectId: {},
		byGroupFacadesId: {},
		statuses: {
			fetchAll: 'idle',
			create: 'idle',
			statusFetchFacadeById: {}
		},
		errors: {
			fetchAll: null,
			create: null,
			statusFetchFacadeById: {}
		}
	},
	extraReducers: (builder) => {
		builder
			.addCase(fetchAllFacades.pending, (state) => {
				state.statuses.fetchAll = 'loading';
				state.errors.fetchAll = null;
			})
			.addCase(fetchAllFacades.fulfilled, (state, action) => {
				state.statuses.fetchAll = 'succeeded';
				const { projectId, facades } = action.payload;
				facades.forEach((facade) => {
					state.byId[facade.id] = facade;
					state.statuses[facade.id] = { ...state.statuses[facade.id], fetch: 'succeeded' };
					state.errors[facade.id] = { ...state.errors[facade.id], fetch: null };
					if (!state.byProjectId[projectId]) {
						state.byProjectId[projectId] = [];
					}
					if (!state.byProjectId[projectId].some((f) => f.id === facade.id)) {
						state.byProjectId[projectId].filter((f) => f.id !== facade.id);
					}
					state.byProjectId[projectId].push(facade);
					if (!state.byGroupFacadesId[facade.group_facade_id]) {
						state.byGroupFacadesId[facade.group_facade_id] = [];
					}
					if (state.byGroupFacadesId[facade.group_facade_id].some((f) => f.id === facade.id)) {
						state.byGroupFacadesId[facade.group_facade_id] = state.byGroupFacadesId[facade.group_facade_id].filter((f) => f.id !== facade.id);
					}
					state.byGroupFacadesId[facade.group_facade_id].push(facade);
				});
			})
			.addCase(fetchAllFacades.rejected, (state, action) => {
				state.statuses.fetchAll = 'failed';
				state.errors.fetchAll = action.payload.message || action.error.message;
			})
			.addCase(fetchFacadeById.pending, (state, action) => {
				const { facadeId } = action.meta.arg;
				state.statuses.statusFetchFacadeById[facadeId] = 'loading';
				state.errors.statusFetchFacadeById[facadeId] = null;
			})
			.addCase(fetchFacadeById.fulfilled, (state, action) => {
				const { facadeId, facade } = action.payload;
				state.byId[facade.id] = facade;
				if (!state.byProjectId[facade.project_id]) {
					state.byProjectId[facade.project_id] = [];
				}
				if (!state.byProjectId[facade.project_id].some((f) => f.id === facade.id)) {
					state.byProjectId[facade.project_id].push(facade);
				}
				state.statuses.statusFetchFacadeById[facadeId] = 'succeeded';
			})
			.addCase(fetchFacadeById.rejected, (state, action) => {
				const { facadeId } = action.meta.arg;
				state.statuses.statusFetchFacadeById[facadeId] = 'failed';
				state.errors.statusFetchFacadeById[facadeId] = action.payload?.error || action.error.message;
			})
			.addCase(createFacade.pending, (state) => {
				state.statuses.create = 'loading';
			})
			.addCase(createFacade.fulfilled, (state, action) => {
				const facade = action.payload;
				state.statuses.create = 'succeeded';
				state.byId[facade.id] = facade;
				if (!state.byProjectId[facade.project_id]) {
					state.byProjectId[facade.project_id] = [];
				}
				state.byProjectId[facade.project_id].push(facade);
				if (!state.byGroupFacadesId[facade.group_facade_id]) {
					state.byGroupFacadesId[facade.group_facade_id] = [];
				}
				state.byGroupFacadesId[facade.group_facade_id].push(facade);
			})
			.addCase(createFacade.rejected, (state, action) => {
				state.statuses.create = 'failed';
				state.errors.create = action.payload ? action.payload.error : action.error.message;
			})
			.addCase(updateFacade.pending, (state, action) => {
				const { id } = action.meta.arg;
				state.statuses[id] = { ...state.statuses[id], update: 'loading' };
			})
			.addCase(updateFacade.fulfilled, (state, action) => {
				const facade = action.payload;
				if (state.byId[facade.id].group_facade_id !== facade.group_facade_id) {
					const oldGroupFacadeId = state.byId[facade.id].group_facade_id;
					const newGroupFacadeId = facade.group_facade_id;
					state.byGroupFacadesId[oldGroupFacadeId] = state.byGroupFacadesId[oldGroupFacadeId].filter((f) => f.id !== facade.id);
					if (!state.byGroupFacadesId[newGroupFacadeId]) {
						state.byGroupFacadesId[newGroupFacadeId] = [];
					}
					state.byGroupFacadesId[newGroupFacadeId].push(facade);
				}
				state.statuses[facade.id] = { ...state.statuses[facade.id], update: 'succeeded' };
				state.byId[facade.id] = facade;
			})
			.addCase(updateFacade.rejected, (state, action) => {
				const { id } = action.meta.arg;
				state.statuses[id] = { ...state.statuses[id], update: 'failed' };
				state.errors[id] = { ...state.errors[id], update: action.payload ? action.payload.error : action.error.message };
			})
			.addCase(deleteFacade.pending, (state, action) => {
				const { id } = action.meta.arg;
				state.statuses[id] = { ...state.statuses[id], delete: 'loading' };
			})
			.addCase(deleteFacade.fulfilled, (state, action) => {
				const id = action.payload;
				state.statuses[id] = { ...state.statuses[id], delete: 'succeeded' };
				const projectId = Object.keys(state.byProjectId).find((projectId) => state.byProjectId[projectId].some((facade) => facade.id === id));
				if (projectId) {
					state.byProjectId[projectId] = state.byProjectId[projectId].filter((facade) => facade.id !== id);
				}
				const groupFacadeId = Object.keys(state.byGroupFacadesId).find((groupFacadeId) => state.byGroupFacadesId[groupFacadeId].some((facade) => facade.id === id));
				if (groupFacadeId) {
					state.byGroupFacadesId[groupFacadeId] = state.byGroupFacadesId[groupFacadeId].filter((facade) => facade.id !== id);
				}
				delete state.byId[id];
			})
			.addCase(deleteFacade.rejected, (state, action) => {
				const { id } = action.meta.arg;
				state.statuses[id] = { ...state.statuses[id], delete: 'failed' };
				state.errors[id] = { ...state.errors[id], delete: action.payload ? action.payload.error : action.error.message };
			});
	}
});

export const selectFacadeById = createSelector(
	(state) => state.facades.byId,
	(_, facadeId) => facadeId,
	(byId, facadeId) => byId[facadeId]
);

export const selectFacadesByProjectId = createSelector(
	(state) => state.facades.byProjectId,
	(_, projectId) => projectId,
	(byProjectId, projectId) => byProjectId[projectId] || []
);

export const selectFacadesByGroupFacadeId = createSelector(
	(state) => state.facades.byGroupFacadesId,
	(_, groupFacadeId) => groupFacadeId,
	(byGroupFacadesId, groupFacadeId) => byGroupFacadesId[groupFacadeId] || []
);

export default facadesSlice.reducer;
