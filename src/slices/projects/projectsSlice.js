import { createSlice, createAsyncThunk, createSelector } from '@reduxjs/toolkit';
import api from '@services/api';

export const fetchProjects = createAsyncThunk('projects/fetchProjects', async () => {
	const response = await api.get('/projects');
	return response.data;
});

export const fetchProjectById = createAsyncThunk('projects/fetchProjectById', async (id, { rejectWithValue }) => {
	try {
		const response = await api.get(`/projects/${id}`);
		return response.data;
	} catch (error) {
		return rejectWithValue(error.response.data);
	}
});

export const createProject = createAsyncThunk('projects/createProject', async (project, { rejectWithValue }) => {
	try {
		const response = await api.post('/projects', project);
		return response.data.project;
	} catch (error) {
		return rejectWithValue(error.response.data);
	}
});

export const updateProject = createAsyncThunk('projects/updateProject', async (project, { rejectWithValue }) => {
	try {
		const response = await api.put(`/projects/${project.id}`, project);
		return response.data.project;
	} catch (error) {
		return rejectWithValue(error.response.message);
	}
});

export const deleteProject = createAsyncThunk('projects/deleteProject', async (id, { rejectWithValue }) => {
	try {
		const response = await api.delete(`/projects/${id}`);
		return response.message;
	} catch (error) {
		return rejectWithValue(error.response.data);
	}
});

export const deleteProjectHard = createAsyncThunk('projects/deleteProjectHard', async (id, { rejectWithValue }) => {
	try {
		await api.delete(`/projects/${id}/force-delete`);
		return id;
	} catch (error) {
		return rejectWithValue(error.response.data);
	}
});

export const restoreProject = createAsyncThunk('projects/restoreProject', async (id, { rejectWithValue }) => {
	try {
		await api.post(`/projects/${id}/restore`);
		return id;
	} catch (error) {
		return rejectWithValue(error.response.data);
	}
});

const projectsSlice = createSlice({
	name: 'projects',
	initialState: {
		items: [],
		byId: {},
		status: 'idle',
		error: null,
		current: null
	},
	reducers: {
		clearError(state) {
			state.error = null;
		}
	},
	extraReducers: (builder) => {
		builder
			.addCase(fetchProjects.pending, (state) => {
				state.status = 'loading';
			})
			.addCase(fetchProjects.fulfilled, (state, action) => {
				state.status = 'succeeded';
				state.items = action.payload.data;
				state.byId = action.payload.data.reduce((acc, project) => {
					acc[project.id] = project;
					return acc;
				}, {});
			})
			.addCase(fetchProjects.rejected, (state, action) => {
				state.status = 'failed';
				state.error = action.error.message;
			})
			.addCase(fetchProjectById.fulfilled, (state, action) => {
				if (action.payload && action.payload.id) {
					state.byId[action.payload.id] = action.payload;
					const index = state.items.findIndex((project) => project.id === action.payload.id);
					if (index !== -1) {
						state.items[index] = action.payload;
					} else {
						state.items.push(action.payload);
					}
					state.current = action.payload;
				}
			})
			.addCase(fetchProjectById.rejected, (state, action) => {
				state.error = action.payload ? action.payload.error : action.error.message;
			})
			.addCase(createProject.fulfilled, (state, action) => {
				state.items.push(action.payload);
				state.byId[action.payload.id] = action.payload;
				state.error = null;
			})
			.addCase(createProject.rejected, (state, action) => {
				state.error = action.payload ? action.payload.error : action.error.message;
			})
			.addCase(updateProject.fulfilled, (state, action) => {
				const index = state.items.findIndex((project) => project.id === action.payload.id);
				if (index !== -1) {
					state.items[index] = action.payload;
				}
				state.byId[action.payload.id] = action.payload;
				state.error = null;
			})
			.addCase(updateProject.rejected, (state, action) => {
				state.error = action.payload ? action.payload.error : action.error.message;
			})
			.addCase(deleteProject.fulfilled, (state, action) => {
				state.items = state.items.filter((project) => project.id !== action.payload);
				delete state.byId[action.payload];
				state.error = null;
			})
			.addCase(deleteProject.rejected, (state, action) => {
				state.error = action.payload ? action.payload.error : action.error.message;
			})
			.addCase(deleteProjectHard.fulfilled, (state, action) => {
				state.items = state.items.filter((project) => project.id !== action.payload);
				delete state.byId[action.payload];
				state.error = null;
			})
			.addCase(deleteProjectHard.rejected, (state, action) => {
				state.error = action.payload ? action.payload.error : action.error.message;
			})
			.addCase(restoreProject.fulfilled, (state, action) => {
				const index = state.items.findIndex((project) => project.id === action.payload);
				if (index !== -1) {
					state.items[index].deleted_at = null;
				}
				state.byId[action.payload].deleted_at = null;
				state.error = null;
			})
			.addCase(restoreProject.rejected, (state, action) => {
				state.error = action.payload ? action.payload.error : action.error.message;
			});
	}
});

export const selectProjectByFacadeId = createSelector([(state) => state.projects.byId, (state, facadeId) => facadeId], (projectsById, facadeId) => {
	return Object.values(projectsById).find((project) => project.facadeId === facadeId);
});

export const { clearError } = projectsSlice.actions;

export default projectsSlice.reducer;
