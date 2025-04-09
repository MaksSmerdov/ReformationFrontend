import { createSlice, createAsyncThunk, createSelector } from '@reduxjs/toolkit';
import api from '@services/api';

// Асинхронные действия для получения, создания, обновления и удаления типов элементов
export const fetchElementTypes = createAsyncThunk('elementTypes/fetchElementTypes', async (_, { rejectWithValue }) => {
	try {
		const response = await api.get('/element-types');
		return response.data.data;
	} catch (err) {
		return rejectWithValue(err.response.data);
	}
});

export const fetchElementTypeById = createAsyncThunk('elementTypes/fetchElementTypeById', async (id, { rejectWithValue }) => {
	try {
		const response = await api.get(`/element-types/${id}`);
		return response.data;
	} catch (err) {
		return rejectWithValue(err.response.data);
	}
});

export const createElementType = createAsyncThunk('elementTypes/createElementType', async (data, { rejectWithValue }) => {
	try {
		const response = await api.post('/element-types', data);
		return response.data;
	} catch (err) {
		return rejectWithValue(err.response.data);
	}
});

export const updateElementType = createAsyncThunk('elementTypes/updateElementType', async ({ id, data }, { rejectWithValue }) => {
	try {
		const response = await api.put(`/element-types/${id}`, data);
		return response.data;
	} catch (err) {
		return rejectWithValue(err.response.data);
	}
});

export const deleteElementType = createAsyncThunk('elementTypes/deleteElementType', async (id, { rejectWithValue }) => {
	try {
		await api.delete(`/element-types/${id}`);
		return id;
	} catch (err) {
		return rejectWithValue(err.response.data);
	}
});

// Слайс для управления состоянием типов элементов
const elementTypesSlice = createSlice({
	name: 'elementTypes',
	initialState: {
		items: [],
		byId: {},
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
	reducers: {},
	extraReducers: (builder) => {
		builder
			.addCase(fetchElementTypes.pending, (state) => {
				state.status.fetchAll = 'loading';
				state.error.fetchAll = null;
			})
			.addCase(fetchElementTypes.fulfilled, (state, action) => {
				state.status.fetchAll = 'succeeded';
				state.items = action.payload;
				state.byId = action.payload.reduce((acc, elementType) => {
					acc[elementType.id] = elementType;
					return acc;
				}, {});
			})
			.addCase(fetchElementTypes.rejected, (state, action) => {
				state.status.fetchAll = 'failed';
				state.error.fetchAll = action.payload;
			})
			.addCase(fetchElementTypeById.pending, (state) => {
				state.status.fetchOne = 'loading';
				state.error.fetchOne = null;
			})
			.addCase(fetchElementTypeById.fulfilled, (state, action) => {
				state.status.fetchOne = 'succeeded';
				state.byId[action.payload.id] = action.payload;
			})
			.addCase(fetchElementTypeById.rejected, (state, action) => {
				state.status.fetchOne = 'failed';
				state.error.fetchOne = action.payload;
			})
			.addCase(createElementType.pending, (state) => {
				state.status.create = 'loading';
				state.error.create = null;
			})
			.addCase(createElementType.fulfilled, (state, action) => {
				state.status.create = 'succeeded';
				state.items.push(action.payload);
				state.byId[action.payload.id] = action.payload;
			})
			.addCase(createElementType.rejected, (state, action) => {
				state.status.create = 'failed';
				state.error.create = action.payload;
			})
			.addCase(updateElementType.pending, (state) => {
				state.status.update = 'loading';
				state.error.update = null;
			})
			.addCase(updateElementType.fulfilled, (state, action) => {
				state.status.update = 'succeeded';
				state.byId[action.payload.id] = action.payload;
				const index = state.items.findIndex((item) => item.id === action.payload.id);
				if (index !== -1) {
					state.items[index] = action.payload;
				}
			})
			.addCase(updateElementType.rejected, (state, action) => {
				state.status.update = 'failed';
				state.error.update = action.payload;
			})
			.addCase(deleteElementType.pending, (state) => {
				state.status.delete = 'loading';
				state.error.delete = null;
			})
			.addCase(deleteElementType.fulfilled, (state, action) => {
				state.status.delete = 'succeeded';
				state.items = state.items.filter((item) => item.id !== action.payload);
				delete state.byId[action.payload];
			})
			.addCase(deleteElementType.rejected, (state, action) => {
				state.status.delete = 'failed';
				state.error.delete = action.payload;
			});
	}
});

// Селекторы для получения данных из состояния
export const selectElementTypes = (state) => state.elementTypes.items;
export const selectElementTypeById = (state, id) => state.elementTypes.byId[id];

export default elementTypesSlice.reducer;
