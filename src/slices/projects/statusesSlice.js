import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { createSelector } from 'reselect';
import api from '@services/api';
import { selectStatusGroupById } from '@slices/projects/statusGroupsSlice';

export const fetchStatuses = createAsyncThunk('statuses/fetchStatuses', async ({ groupId, projectTypeId }, { rejectWithValue, getState }) => {
	try {
		const response = await api.get(`/project-types/${projectTypeId}/status-groups/${groupId}/statuses`);
		const statuses = response.data.data;
		const state = getState();
		const statusGroup = selectStatusGroupById(state, groupId);
		const color = statusGroup ? statusGroup.color : null;

		return { groupId, statuses: statuses.map((status) => ({ ...status, color })) };
	} catch (error) {
		return rejectWithValue({ groupId, error: error.response.data });
	}
});

const statusesSlice = createSlice({
	name: 'statuses',
	initialState: {
		items: {},
		byId: {},
		status: {},
		error: {}
	},
	reducers: {
		setStatuses: (state, action) => {
			action.payload.forEach((status) => {
				state.byId[status.id] = status;
			});
		},
		setStatusesFromGroups: (state, action) => {
			action.payload.forEach((group) => {
				group.statuses.forEach((status) => {
					status.color = group.color;
					if (!status.status_logics) {
						status.status_logics = [];
					}
					state.byId[status.id] = status;
				});
			});
		}
	},
	extraReducers: (builder) => {
		builder
			.addCase(fetchStatuses.pending, (state, action) => {
				state.status[action.meta.arg.groupId] = 'loading';
			})
			.addCase(fetchStatuses.fulfilled, (state, action) => {
				state.status[action.payload.groupId] = 'succeeded';
				state.items[action.payload.groupId] = action.payload.statuses;
				action.payload.statuses.forEach((status) => {
					state.byId[status.id] = status;
				});
			})
			.addCase(fetchStatuses.rejected, (state, action) => {
				state.status[action.payload.groupId] = 'failed';
				state.error[action.payload.groupId] = action.payload.error;
			});
	}
});

export const { setStatuses, setStatusesFromGroups } = statusesSlice.actions;

export const selectStatusById = (state, statusId) => state.statuses.byId[statusId];

export default statusesSlice.reducer;
