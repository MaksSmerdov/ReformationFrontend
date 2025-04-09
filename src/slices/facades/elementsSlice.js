import { createSlice, createAsyncThunk, createSelector } from '@reduxjs/toolkit';
import api from '@services/api';
import { createSelector as reselectCreateSelector } from 'reselect';

export const fetchElementsByFacadeId = createAsyncThunk('elements/fetchElementsByFacadeId', async (facadeId, { rejectWithValue }) => {
	try {
		const response = await api.get(`/facades/${facadeId}/elements`);
		return { facadeId, elements: response.data.data };
	} catch (err) {
		return rejectWithValue({ facadeId, message: err.response.data });
	}
});

export const fetchElementById = createAsyncThunk('elements/fetchElementById', async ({ facadeId, elementId }, { rejectWithValue }) => {
	try {
		const response = await api.get(`/facades/${facadeId}/elements/${elementId}`);
		return { elementId, element: response.data };
	} catch (err) {
		return rejectWithValue({ elementId, error: err.response.data });
	}
});

export const createElement = createAsyncThunk('elements/createElement', async ({ facadeId, data }, { rejectWithValue }) => {
	try {
		const response = await api.post(`/facades/${facadeId}/elements`, data);
		return response.data.data;
	} catch (err) {
		return rejectWithValue(err.response.data);
	}
});

export const updateElement = createAsyncThunk('elements/updateElement', async ({ facadeId, id, data }, { rejectWithValue }) => {
	try {
		const response = await api.put(`/facades/${facadeId}/elements/${id}`, data);
		return response.data.element;
	} catch (err) {
		return rejectWithValue(err.response.data);
	}
});

export const deleteElement = createAsyncThunk('elements/deleteElement', async ({ facadeId, id }, { rejectWithValue }) => {
	try {
		await api.delete(`/facades/${facadeId}/elements/${id}`);
		return id;
	} catch (err) {
		return rejectWithValue(err.response.data);
	}
});

export const massUpdateElements = createAsyncThunk('elements/massUpdateElements', async ({ facadeId, data }, { rejectWithValue }) => {
	try {
		const response = await api.patch(`/facades/${facadeId}/elements/mass-update`, data);
		return response.data.data;
	} catch (err) {
		return rejectWithValue(err.response.data);
	}
});

export const massUpdateElementsArray = createAsyncThunk('elements/massUpdateElementsArray', async ({ facadeId, data }, { rejectWithValue }) => {
	try {
		const response = await api.patch(`/facades/${facadeId}/elements/mass-update-array`, data);
		return response.data.data;
	} catch (err) {
		return rejectWithValue(err.response.data);
	}
});

const elementsSlice = createSlice({
	name: 'elements',
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
		},
		savingElements: {}
	},
	reducers: {
		startSavingElement: (state, action) => {
			state.savingElements[action.payload] = true;
		},
		finishSavingElement: (state, action) => {
			state.savingElements[action.payload] = false;
		},
		failSavingElement: (state, action) => {
			state.savingElements[action.payload] = false;
		}
	},
	extraReducers: (builder) => {
		builder
			.addCase(fetchElementsByFacadeId.pending, (state, action) => {
				const { facadeId } = action.meta.arg;
				state.statuses.byFacadeId[facadeId] = { ...state.statuses.byFacadeId[facadeId], fetchAll: 'loading' };
				state.errors.byFacadeId[facadeId] = { ...state.errors.byFacadeId[facadeId], fetchAll: null };
			})
			.addCase(fetchElementsByFacadeId.fulfilled, (state, action) => {
				const { facadeId, elements } = action.payload;
				state.byFacadeId[facadeId] = [];
				elements.forEach((element) => {
					state.byId[element.id] = element;
					state.byFacadeId[facadeId].push(element);
					state.statuses.byId[element.id] = { ...state.statuses.byId[element.id], fetch: 'succeeded' };
					state.errors.byId[element.id] = { ...state.errors.byId[element.id], fetch: null };
				});
				state.statuses.byFacadeId[facadeId] = { ...state.statuses.byFacadeId[facadeId], fetchAll: 'succeeded' };
			})
			.addCase(fetchElementsByFacadeId.rejected, (state, action) => {
				const { facadeId } = action.meta.arg;
				state.statuses.byFacadeId[facadeId] = { ...state.statuses.byFacadeId[facadeId], fetchAll: 'failed' };
				state.errors.byFacadeId[facadeId] = {
					...state.errors.byFacadeId[facadeId],
					fetchAll: action.payload.message || action.error.message
				};
			})
			.addCase(fetchElementById.pending, (state, action) => {
				const { elementId } = action.meta.arg;
				state.statuses.byId[elementId] = { ...state.statuses.byId[elementId], fetch: 'loading' };
				state.errors.byId[elementId] = { ...state.errors.byId[elementId], fetch: null };
			})
			.addCase(fetchElementById.fulfilled, (state, action) => {
				const { elementId, element } = action.payload;
				state.byId[element.id] = element;
				if (!state.byFacadeId[element.facade_id]) {
					state.byFacadeId[element.facade_id] = [];
				}
				state.byFacadeId[element.facade_id].push(element);
				state.statuses.byId[elementId] = { ...state.statuses.byId[elementId], fetch: 'succeeded' };
			})
			.addCase(fetchElementById.rejected, (state, action) => {
				const { elementId } = action.meta.arg;
				state.statuses.byId[elementId] = { ...state.statuses.byId[elementId], fetch: 'failed' };
				state.errors.byId[elementId] = {
					...state.errors.byId[elementId],
					fetch: action.payload.error.message || action.error.message
				};
			})
			.addCase(createElement.pending, (state, action) => {
				const { facadeId } = action.meta.arg;
				state.statuses.byFacadeId[facadeId] = { ...state.statuses.byFacadeId[facadeId], create: 'loading' };
				state.errors.byFacadeId[facadeId] = { ...state.errors.byFacadeId[facadeId], create: null };
			})
			.addCase(createElement.fulfilled, (state, action) => {
				const element = action.payload;
				state.byId[element.id] = element;
				if (!state.byFacadeId[element.facade_id]) {
					state.byFacadeId[element.facade_id] = [];
				}
				state.byFacadeId[element.facade_id].push(element);
				state.statuses.byFacadeId[element.facade_id] = {
					...state.statuses.byFacadeId[element.facade_id],
					create: 'succeeded'
				};
			})
			.addCase(createElement.rejected, (state, action) => {
				const { facadeId } = action.meta.arg;
				state.statuses.byFacadeId[facadeId] = { ...state.statuses.byFacadeId[facadeId], create: 'failed' };
				state.errors.byFacadeId[facadeId] = {
					...state.errors.byFacadeId[facadeId],
					create: action.payload ? action.payload.error : action.error.message
				};
			})
			.addCase(updateElement.pending, (state, action) => {
				const { id } = action.meta.arg;
				state.statuses.byId[id] = { ...state.statuses.byId[id], update: 'loading' };
				state.errors.byId[id] = { ...state.errors.byId[id], update: null };
			})
			.addCase(updateElement.fulfilled, (state, action) => {
				const element = action.payload;
				state.byId[element.id] = element;
				state.statuses.byId[element.id] = { ...state.statuses.byId[element.id], update: 'succeeded' };
			})
			.addCase(updateElement.rejected, (state, action) => {
				const { id } = action.meta.arg;
				state.statuses.byId[id] = { ...state.statuses.byId[id], update: 'failed' };
				state.errors.byId[id] = {
					...state.errors.byId[id],
					update: action.payload ? action.payload.error : action.error.message
				};
			})
			.addCase(deleteElement.pending, (state, action) => {
				const { id } = action.meta.arg;
				state.statuses.byId[id] = { ...state.statuses.byId[id], delete: 'loading' };
				state.errors.byId[id] = { ...state.errors.byId[id], delete: null };
			})
			.addCase(deleteElement.fulfilled, (state, action) => {
				const id = action.payload;
				const facadeId = Object.keys(state.byFacadeId).find((facadeId) => state.byFacadeId[facadeId].some((element) => element.id === id));
				if (facadeId) {
					state.byFacadeId[facadeId] = state.byFacadeId[facadeId].filter((element) => element.id !== id);
				}
				delete state.byId[id];
				state.statuses.byId[id] = { ...state.statuses.byId[id], delete: 'succeeded' };
			})
			.addCase(deleteElement.rejected, (state, action) => {
				const { id } = action.meta.arg;
				state.statuses.byId[id] = { ...state.statuses.byId[id], delete: 'failed' };
				state.errors.byId[id] = {
					...state.errors.byId[id],
					delete: action.payload ? action.payload.error : action.error.message
				};
			})
			.addCase(massUpdateElements.pending, (state, action) => {
				const { facadeId } = action.meta.arg;
				state.statuses.byFacadeId[facadeId] = { ...state.statuses.byFacadeId[facadeId], massUpdate: 'loading' };
				state.errors.byFacadeId[facadeId] = { ...state.errors.byFacadeId[facadeId], massUpdate: null };
			})
			.addCase(massUpdateElements.fulfilled, (state, action) => {
				const updatedElements = action.payload;
				if (!updatedElements.length) return;

				const facadeId = updatedElements[0].facade_id;

				updatedElements.forEach((element) => {
					state.byId[element.id] = element;

					if (element.facade_id) {
						if (!state.byFacadeId[element.facade_id]) {
							state.byFacadeId[element.facade_id] = [];
						}

						const index = state.byFacadeId[element.facade_id].findIndex((el) => el.id === element.id);
						if (index !== -1) {
							state.byFacadeId[element.facade_id][index] = element;
						} else {
							state.byFacadeId[element.facade_id].push(element);
						}
					}

					state.statuses.byId[element.id] = { ...state.statuses.byId[element.id], update: 'succeeded' };
				});

				if (facadeId) {
					state.statuses.byFacadeId[facadeId] = {
						...state.statuses.byFacadeId[facadeId],
						massUpdate: 'succeeded'
					};
				}
			})
			.addCase(massUpdateElements.rejected, (state, action) => {
				const { facadeId } = action.meta.arg;
				state.statuses.byFacadeId[facadeId] = { ...state.statuses.byFacadeId[facadeId], massUpdate: 'failed' };
				state.errors.byFacadeId[facadeId] = {
					...state.errors.byFacadeId[facadeId],
					massUpdate: action.payload.message || action.error.message
				};
			})
			.addCase(massUpdateElementsArray.pending, (state, action) => {
				const { facadeId } = action.meta.arg;
				state.statuses.byFacadeId[facadeId] = { ...state.statuses.byFacadeId[facadeId], massUpdateArray: 'loading' };
				state.errors.byFacadeId[facadeId] = { ...state.errors.byFacadeId[facadeId], massUpdateArray: null };
			})
			.addCase(massUpdateElementsArray.fulfilled, (state, action) => {
				const updatedElements = action.payload;
				if (!updatedElements.length) return;

				const facadeId = updatedElements[0].facade_id;

				updatedElements.forEach((element) => {
					state.byId[element.id] = element;

					if (element.facade_id) {
						if (!state.byFacadeId[element.facade_id]) {
							state.byFacadeId[element.facade_id] = [];
						}

						const index = state.byFacadeId[element.facade_id].findIndex((el) => el.id === element.id);
						if (index !== -1) {
							state.byFacadeId[element.facade_id][index] = element;
						} else {
							state.byFacadeId[element.facade_id].push(element);
						}
					}

					state.statuses.byId[element.id] = { ...state.statuses.byId[element.id], update: 'succeeded' };
				});

				if (facadeId) {
					state.statuses.byFacadeId[facadeId] = {
						...state.statuses.byFacadeId[facadeId],
						massUpdateArray: 'succeeded'
					};
				}
			})
			.addCase(massUpdateElementsArray.rejected, (state, action) => {
				const { facadeId } = action.meta.arg;
				state.statuses.byFacadeId[facadeId] = { ...state.statuses.byFacadeId[facadeId], massUpdateArray: 'failed' };
				state.errors.byFacadeId[facadeId] = {
					...state.errors.byFacadeId[facadeId],
					massUpdateArray: action.payload.message || action.error.message
				};
			});
	}
});

export const selectElementById = createSelector(
	(state) => state.elements.byId,
	(_, elementId) => elementId,
	(byId, elementId) => byId[elementId]
);

export const selectElementsByFacadeId = createSelector(
	(state) => state.elements.byFacadeId,
	(_, facadeId) => facadeId,
	(byFacadeId, facadeId) => byFacadeId[facadeId] || []
);

export const selectElementsByIds = reselectCreateSelector(
	(state) => state.elements.byId,
	(_, elementIds) => elementIds,
	(byId, elementIds) => elementIds.map((id) => byId[id])
);

export const { startSavingElement, finishSavingElement, failSavingElement } = elementsSlice.actions;

export default elementsSlice.reducer;
