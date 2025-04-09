import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '@services/api';

// Асинхронные действия для создания групп, кластеров и слоёв
export const storeWithElements = createAsyncThunk('elementGroupsAdditional/storeWithElements', async ({ facadeId, data }, { rejectWithValue }) => {
	try {
		const response = await api.post(`/facades/${facadeId}/element-groups/store-with-elements`, data);
		return response.data;
	} catch (err) {
		return rejectWithValue(err.response.data);
	}
});

export const storeWithGroups = createAsyncThunk('elementGroupsAdditional/storeWithGroups', async ({ facadeId, data }, { rejectWithValue }) => {
	try {
		const response = await api.post(`/facades/${facadeId}/element-groups/store-with-groups`, data);
		return response.data;
	} catch (err) {
		return rejectWithValue(err.response.data);
	}
});

export const storeWithClusters = createAsyncThunk('elementGroupsAdditional/storeWithClusters', async ({ facadeId, data }, { rejectWithValue }) => {
	try {
		const response = await api.post(`/facades/${facadeId}/element-groups/store-with-clusters`, data);
		return response.data;
	} catch (err) {
		return rejectWithValue(err.response.data);
	}
});

const elementGroupsAdditionalSlice = createSlice({
	name: 'elementGroupsAdditional',
	initialState: {
		status: 'idle',
		error: null
	},
	reducers: {},
	extraReducers: (builder) => {
		builder
			.addCase(storeWithElements.pending, (state) => {
				state.error = null;
				state.status = 'loading';
			})
			.addCase(storeWithElements.fulfilled, (state) => {
				state.status = 'succeeded';
			})
			.addCase(storeWithElements.rejected, (state, action) => {
				state.status = 'failed';
				state.error = action.payload ? action.payload.message : action.error.message;
			})
			.addCase(storeWithGroups.pending, (state) => {
				state.error = null;
				state.status = 'loading';
			})
			.addCase(storeWithGroups.fulfilled, (state) => {
				state.status = 'succeeded';
			})
			.addCase(storeWithGroups.rejected, (state, action) => {
				state.status = 'failed';
				state.error = action.payload ? action.payload.message : action.error.message;
			})
			.addCase(storeWithClusters.pending, (state) => {
				state.error = null;
				state.status = 'loading';
			})
			.addCase(storeWithClusters.fulfilled, (state) => {
				state.status = 'succeeded';
			})
			.addCase(storeWithClusters.rejected, (state, action) => {
				state.status = 'failed';
				state.error = action.payload ? action.payload.message : action.error.message;
			});
	}
});

export const selectGroupError = (state) => state.elementGroupsAdditional.error;

export default elementGroupsAdditionalSlice.reducer;
