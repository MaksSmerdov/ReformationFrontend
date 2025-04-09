import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '@services/api';
import { createSelector } from 'reselect';

export const fetchAllTeams = createAsyncThunk('teams/fetchAllTeams', async () => {
	const response = await api.get('/teams');
	return response.data.data;
});

export const fetchOneTeam = createAsyncThunk('teams/fetchOneTeam', async (teamId) => {
	const response = await api.get(`/teams/${teamId}`);
	return response.data.data;
});

export const createTeam = createAsyncThunk('teams/createTeam', async (team, { rejectWithValue }) => {
	try {
		const response = await api.post('/teams', team);
		return response.data.data;
	} catch (error) {
		return rejectWithValue(error.response.data);
	}
});

export const updateTeam = createAsyncThunk('teams/updateTeam', async (team) => {
	const response = await api.put(`/teams/${team.team.id}`, team);
	return response.data.data;
});

export const deleteTeam = createAsyncThunk('teams/deleteTeam', async (teamId) => {
	await api.delete(`/teams/${teamId}`);
	return teamId;
});

const teamsSlice = createSlice({
	name: 'teams',
	initialState: {
		items: [],
		byId: {},
		selectedTeam: null,
		status: {
			fetchAll: 'idle',
			fetchOne: 'idle',
			create: 'idle',
			update: 'idle',
			delete: 'idle'
		},
		error: {
			fetchAll: null,
			fetchOne: null,
			create: null,
			update: null,
			delete: null
		}
	},
	reducers: {
		setTeams: (state, action) => {
			state.items = action.payload;
			state.byId = action.payload.reduce((acc, team) => {
				acc[team.id] = team;
				return acc;
			}, {});
			state.status.fetchAll = 'succeeded';
		},
		clearSelectedTeam: (state) => {
			state.selectedTeam = null;
		}
	},
	extraReducers: (builder) => {
		builder
			.addCase(fetchAllTeams.pending, (state) => {
				state.status.fetchAll = 'loading';
			})
			.addCase(fetchAllTeams.fulfilled, (state, action) => {
				state.items = action.payload;
				state.byId = action.payload.reduce((acc, team) => {
					acc[team.team.id] = team;
					return acc;
				}, {});
				console.log('fetchAllTeams fulfilled items:', state.items);
				console.log('fetchAllTeams fulfilled byId:', state.byId);
				state.status.fetchAll = 'succeeded';
			})
			.addCase(fetchAllTeams.rejected, (state, action) => {
				state.status.fetchAll = 'failed';
				state.error.fetchAll = action.error.message;
			})
			.addCase(fetchOneTeam.pending, (state) => {
				state.status.fetchOne = 'loading';
			})
			.addCase(fetchOneTeam.fulfilled, (state, action) => {
				state.selectedTeam = action.payload;
				state.byId[action.payload.id] = action.payload;
				state.status.fetchOne = 'succeeded';
			})
			.addCase(fetchOneTeam.rejected, (state, action) => {
				state.status.fetchOne = 'failed';
				state.error.fetchOne = action.error.message;
			})
			.addCase(createTeam.pending, (state) => {
				state.status.create = 'loading';
			})
			.addCase(createTeam.fulfilled, (state, action) => {
				state.items.push(action.payload);
				state.byId[action.payload.id] = action.payload;
				state.status.create = 'succeeded';
			})
			.addCase(createTeam.rejected, (state, action) => {
				state.status.create = 'failed';
				state.error.create = action.error.message;
			})
			.addCase(updateTeam.pending, (state) => {
				state.status.update = 'loading';
			})
			.addCase(updateTeam.fulfilled, (state, action) => {
				const index = state.items.findIndex((team) => team.team.id === action.payload.team.id);
				if (index !== -1) {
					state.items[index] = action.payload;
				}
				state.byId[action.payload.id] = action.payload;
				state.status.update = 'succeeded';
			})
			.addCase(updateTeam.rejected, (state, action) => {
				state.status.update = 'failed';
				state.error.update = action.error.message;
			})
			.addCase(deleteTeam.pending, (state) => {
				state.status.delete = 'loading';
			})
			.addCase(deleteTeam.fulfilled, (state, action) => {
				state.items = state.items.filter((team) => team.team.id !== action.payload);
				delete state.byId[action.payload];
				state.status.delete = 'succeeded';
			})
			.addCase(deleteTeam.rejected, (state, action) => {
				state.status.delete = 'failed';
				state.error.delete = action.error.message;
			});
	}
});

export const { setTeams, clearSelectedTeam } = teamsSlice.actions;

export const selectTeams = (state) => state.teams.items;
export const selectSelectedTeam = (state) => state.teams.selectedTeam;

export default teamsSlice.reducer;
