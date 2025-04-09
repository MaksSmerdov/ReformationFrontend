import { createSlice, createAsyncThunk, createSelector } from '@reduxjs/toolkit';
import api from '@services/api';
import { setStatusesFromGroups } from '@slices/projects/statusesSlice';

export const fetchStatusGroups = createAsyncThunk('statusGroups/fetchStatusGroups', async ({ projectTypeId }, { dispatch, rejectWithValue }) => {
	try {
		const response = await api.get(`/project-types/${projectTypeId}/status-groups`);
		const statusGroups = response.data.data;
		if (!Array.isArray(statusGroups)) {
			throw new Error('Invalid data format');
		}
		dispatch(setStatusesFromGroups(statusGroups));
		return statusGroups;
	} catch (error) {
		return rejectWithValue(error.response?.data || { error: 'Unknown error' });
	}
});

export const createStatusGroup = createAsyncThunk('statusGroups/createStatusGroup', async (data, { rejectWithValue }) => {
	try {
		const response = await api.post(`/project-types/${data.project_type_id}/status-groups`, data);
		return { projectTypeId: data.project_type_id, statusGroup: response.data.status_group };
	} catch (err) {
		return rejectWithValue(err.response.data);
	}
});

export const updateStatusGroup = createAsyncThunk('statusGroups/updateStatusGroup', async ({ id, ...data }, { rejectWithValue }) => {
	try {
		const response = await api.put(`/project-types/${data.project_type_id}/status-groups/${id}`, data);
		return { projectTypeId: data.project_type_id, statusGroup: response.data.status_group };
	} catch (err) {
		return rejectWithValue(err.response.data);
	}
});

export const deleteStatusGroup = createAsyncThunk('statusGroups/deleteStatusGroup', async ({ id, projectTypeId }, { rejectWithValue }) => {
	try {
		await api.delete(`/project-types/${projectTypeId}/status-groups/${id}`);
		return { projectTypeId, id };
	} catch (err) {
		return rejectWithValue(err.response.data);
	}
});

const statusGroupsSlice = createSlice({
	name: 'statusGroups',
	initialState: {
		items: {},
		byId: {},
		byProjectTypeId: {},
		status: 'idle',
		error: null,
		createStatus: 'idle',
		createError: null,
		updateStatus: 'idle',
		updateError: null,
		deleteStatus: 'idle',
		deleteError: null
	},
	reducers: {
		setStatusGroups: (state, action) => {
			action.payload.forEach((group) => {
				state.byId[group.id] = group;
				state.byProjectTypeId[group.project_type_id] = [];
				state.byProjectTypeId[group.project_type_id].push(group.id);
			});
		}
	},
	extraReducers: (builder) => {
		builder
			.addCase(fetchStatusGroups.pending, (state) => {
				state.status = 'loading';
			})
			.addCase(fetchStatusGroups.fulfilled, (state, action) => {
				state.status = 'succeeded';

				state.byProjectTypeId[action.meta.arg.projectTypeId] = [];

				action.payload.forEach((group) => {
					state.byId[group.id] = group;

					if (!state.byProjectTypeId[group.project_type_id]) {
						state.byProjectTypeId[group.project_type_id] = [];
					}
					state.byProjectTypeId[group.project_type_id].push(group.id);
				});
			})
			.addCase(fetchStatusGroups.rejected, (state, action) => {
				state.status = 'failed';
				state.error = action.payload ? action.payload.error : action.error.message;
			})
			.addCase(createStatusGroup.pending, (state) => {
				state.createStatus = 'loading';
				state.createError = null;
			})
			.addCase(createStatusGroup.fulfilled, (state, action) => {
				state.createStatus = 'succeeded';
				const { projectTypeId, statusGroup } = action.payload;

				state.byId[statusGroup.id] = statusGroup;

				if (!state.byProjectTypeId[projectTypeId]) {
					state.byProjectTypeId[projectTypeId] = [];
				}
				state.byProjectTypeId[projectTypeId].push(statusGroup.id);
			})
			.addCase(createStatusGroup.rejected, (state, action) => {
				state.createStatus = 'failed';
				state.createError = action.payload ? action.payload.error : action.error.message;
			})
			.addCase(updateStatusGroup.pending, (state) => {
				state.updateStatus = 'loading';
				state.updateError = null;
			})
			.addCase(updateStatusGroup.fulfilled, (state, action) => {
				state.updateStatus = 'succeeded';
				const { projectTypeId, statusGroup } = action.payload;

				state.byId[statusGroup.id] = statusGroup;

				if (!state.byProjectTypeId[projectTypeId]) {
					state.byProjectTypeId[projectTypeId] = [];
				}
				if (!state.byProjectTypeId[projectTypeId].includes(statusGroup.id)) {
					state.byProjectTypeId[projectTypeId].push(statusGroup.id);
				}
			})
			.addCase(updateStatusGroup.rejected, (state, action) => {
				state.updateStatus = 'failed';
				state.updateError = action.payload ? action.payload.error : action.error.message;
			})
			.addCase(deleteStatusGroup.pending, (state) => {
				state.deleteStatus = 'loading';
				state.deleteError = null;
			})
			.addCase(deleteStatusGroup.fulfilled, (state, action) => {
				state.deleteStatus = 'succeeded';
				const { projectTypeId, id } = action.payload;

				delete state.byId[id];

				if (state.byProjectTypeId[projectTypeId]) {
					state.byProjectTypeId[projectTypeId] = state.byProjectTypeId[projectTypeId].filter((groupId) => groupId !== id);
				}
			})
			.addCase(deleteStatusGroup.rejected, (state, action) => {
				state.deleteStatus = 'failed';
				state.deleteError = action.payload ? action.payload.error : action.error.message;
			});
	}
});

export const selectStatusGroupsByProjectTypeId = createSelector([(state) => state.statusGroups.byProjectTypeId, (state) => state.statusGroups.byId, (state, projectTypeId) => projectTypeId], (byProjectTypeId, byId, projectTypeId) => {
	const groupIds = byProjectTypeId[projectTypeId] || [];
	return groupIds.map((id) => byId[id]);
});

export const { setStatusGroups } = statusGroupsSlice.actions;

export const selectStatusGroupById = (state, groupId) => state.statusGroups.byId[groupId];

export default statusGroupsSlice.reducer;
