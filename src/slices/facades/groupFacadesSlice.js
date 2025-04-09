import { createSlice, createAsyncThunk, createSelector } from '@reduxjs/toolkit';
import api from '@services/api';

export const fetchGroupFacades = createAsyncThunk('groupFacades/fetchGroupFacades', async (projectId, { rejectWithValue }) => {
	try {
		const response = await api.get(`/projects/${projectId}/group-facades`);
		return { projectId, groupFacades: response.data.data };
	} catch (err) {
		return rejectWithValue(err.response.data);
	}
});

export const fetchGroupFacadeById = createAsyncThunk('groupFacades/fetchGroupFacadeById', async ({ projectId, groupFacadeId }, { rejectWithValue }) => {
	try {
		const response = await api.get(`/projects/${projectId}/group-facades/${groupFacadeId}`);
		return { groupFacadeId, groupFacade: response.data };
	} catch (err) {
		return rejectWithValue({ groupFacadeId, error: err.response.data });
	}
});

export const createGroupFacade = createAsyncThunk('groupFacades/createGroupFacade', async ({ projectId, data }, { rejectWithValue }) => {
	try {
		const response = await api.post(`/projects/${projectId}/group-facades`, data);
		return response.data.group_facade;
	} catch (err) {
		return rejectWithValue(err.response.data);
	}
});

export const updateGroupFacade = createAsyncThunk('groupFacades/updateGroupFacade', async ({ projectId, id, data }, { rejectWithValue }) => {
	try {
		const response = await api.put(`/projects/${projectId}/group-facades/${id}`, data);
		return response.data.group_facade;
	} catch (err) {
		return rejectWithValue(err.response.data);
	}
});

export const deleteGroupFacade = createAsyncThunk('groupFacades/deleteGroupFacade', async ({ projectId, id }, { rejectWithValue }) => {
	try {
		await api.delete(`/projects/${projectId}/group-facades/${id}`);
		return id;
	} catch (err) {
		return rejectWithValue(err.response.data);
	}
});

const groupFacadesSlice = createSlice({
	name: 'groupFacades',
	initialState: {
		byId: {},
		byProjectId: {},
		statuses: {
			fetchAll: 'idle',
			create: 'idle'
		},
		errors: {
			fetchAll: null,
			create: null
		}
	},
	reducers: {
		resetGroupFacades: (state) => {
			state.byId = {};
			state.byProjectId = {};
			state.statuses = {
				fetchAll: 'idle',
				create: 'idle'
			};
			state.errors = {
				fetchAll: null,
				create: null
			};
		}
	},
	extraReducers: (builder) => {
		builder
			.addCase(fetchGroupFacades.pending, (state) => {
				state.statuses.fetchAll = 'loading';
				state.errors.fetchAll = null;
			})
			.addCase(fetchGroupFacades.fulfilled, (state, action) => {
				state.statuses.fetchAll = 'succeeded';
				const { projectId, groupFacades } = action.payload;

				const uniqueGroupFacades = groupFacades.filter((groupFacade, index, self) => index === self.findIndex((g) => g.id === groupFacade.id));

				uniqueGroupFacades.forEach((groupFacade) => {
					if (!state.byId[groupFacade.id]) {
						state.byId[groupFacade.id] = groupFacade;
						if (!state.byProjectId[projectId]) {
							state.byProjectId[projectId] = [];
						}
						state.byProjectId[projectId].push(groupFacade);
					}
				});
			})
			.addCase(fetchGroupFacades.rejected, (state, action) => {
				state.statuses.fetchAll = 'failed';
				state.errors.fetchAll = action.payload.message || action.error.message;
			})
			.addCase(fetchGroupFacadeById.pending, (state, action) => {
				const { groupFacadeId } = action.meta.arg;
				state.statuses[groupFacadeId] = { ...state.statuses[groupFacadeId], fetch: 'loading' };
				state.errors[groupFacadeId] = { ...state.errors[groupFacadeId], fetch: null };
			})
			.addCase(fetchGroupFacadeById.fulfilled, (state, action) => {
				const { groupFacadeId, groupFacade } = action.payload;
				state.statuses[groupFacadeId] = { ...state.statuses[groupFacadeId], fetch: 'succeeded' };
				state.byId[groupFacade.id] = groupFacade;
				if (!state.byProjectId[groupFacade.project_id]) {
					state.byProjectId[groupFacade.project_id] = [];
				}
				state.byProjectId[groupFacade.project_id].push(groupFacade);
			})
			.addCase(fetchGroupFacadeById.rejected, (state, action) => {
				const { groupFacadeId, error } = action.payload;
				state.statuses[groupFacadeId] = { ...state.statuses[groupFacadeId], fetch: 'failed' };
				state.errors[groupFacadeId] = { ...state.errors[groupFacadeId], fetch: error.message || error };
			})
			.addCase(createGroupFacade.pending, (state) => {
				state.statuses.create = 'loading';
			})
			.addCase(createGroupFacade.fulfilled, (state, action) => {
				const groupFacade = action.payload;
				state.statuses.create = 'succeeded';
				state.byId[groupFacade.id] = groupFacade;
				if (!state.byProjectId[groupFacade.project_id]) {
					state.byProjectId[groupFacade.project_id] = [];
				}
				state.byProjectId[groupFacade.project_id].push(groupFacade);
			})
			.addCase(createGroupFacade.rejected, (state, action) => {
				state.statuses.create = 'failed';
				state.errors.create = action.payload ? action.payload.error : action.error.message;
			})
			.addCase(updateGroupFacade.pending, (state, action) => {
				const { id } = action.meta.arg;
				state.statuses[id] = { ...state.statuses[id], update: 'loading' };
			})
			.addCase(updateGroupFacade.fulfilled, (state, action) => {
				const groupFacade = action.payload;
				state.statuses[groupFacade.id] = { ...state.statuses[groupFacade.id], update: 'succeeded' };
				state.byId[groupFacade.id] = groupFacade;
			})
			.addCase(updateGroupFacade.rejected, (state, action) => {
				const { id } = action.meta.arg;
				state.statuses[id] = { ...state.statuses[id], update: 'failed' };
				state.errors[id] = { ...state.errors[id], update: action.payload ? action.payload.error : action.error.message };
			})
			.addCase(deleteGroupFacade.pending, (state, action) => {
				const { id } = action.meta.arg;
				state.statuses[id] = { ...state.statuses[id], delete: 'loading' };
			})
			.addCase(deleteGroupFacade.fulfilled, (state, action) => {
				const id = action.payload;
				state.statuses[id] = { ...state.statuses[id], delete: 'succeeded' };
				const projectId = Object.keys(state.byProjectId).find((projectId) => state.byProjectId[projectId].some((groupFacade) => groupFacade.id === id));
				if (projectId) {
					state.byProjectId[projectId] = state.byProjectId[projectId].filter((groupFacade) => groupFacade.id !== id);
				}
				delete state.byId[id];
			})
			.addCase(deleteGroupFacade.rejected, (state, action) => {
				const { id } = action.meta.arg;
				state.statuses[id] = { ...state.statuses[id], delete: 'failed' };
				state.errors[id] = { ...state.errors[id], delete: action.payload ? action.payload.error : action.error.message };
			});
	}
});

export const selectGroupFacadeById = createSelector(
	(state) => state.groupFacades.byId,
	(_, groupFacadeId) => groupFacadeId,
	(byId, groupFacadeId) => byId[groupFacadeId]
);

export const selectGroupFacadesByProjectId = createSelector(
	(state) => state.groupFacades.byProjectId,
	(_, projectId) => projectId,
	(byProjectId, projectId) => byProjectId[projectId] || []
);

export const { resetGroupFacades } = groupFacadesSlice.actions;

export default groupFacadesSlice.reducer;
