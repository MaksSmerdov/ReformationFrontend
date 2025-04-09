import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '@services/api';

export const fetchProjectTypes = createAsyncThunk('projectTypes/fetchProjectTypes', async () => {
	const response = await api.get('/project-types');
	return response.data.data;
});

const projectTypesSlice = createSlice({
	name: 'projectTypes',
	initialState: {
		items: [],
		status: {
			fetchAll: 'idle'
		},
		error: {
			fetchAll: null
		}
	},
	reducers: {},
	extraReducers: (builder) => {
		builder
			.addCase(fetchProjectTypes.pending, (state) => {
				state.status.fetchAll = 'loading';
				state.error.fetchAll = null;
			})
			.addCase(fetchProjectTypes.fulfilled, (state, action) => {
				state.status.fetchAll = 'succeeded';
				state.items = action.payload;
			})
			.addCase(fetchProjectTypes.rejected, (state, action) => {
				state.status.fetchAll = 'failed';
				state.error.fetchAll = action.error.message;
			});
	}
});

export default projectTypesSlice.reducer;
