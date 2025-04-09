import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { fetchElementsByFacadeId } from '@slices/facades/elementsSlice';
import api from '@services/api';

export const fetchOrdersByElementId = createAsyncThunk('elementOrders/fetchOrdersByElementId', async (elementIds, { rejectWithValue }) => {
	try {
		const response = await api.get(`/element-orders?element_ids=${elementIds.toString()}`);
		return { elementIds, elementOrders: response.data.data };
	} catch (err) {
		return rejectWithValue({ elementIds, message: err.response.data });
	}
});

export const deleteOrderById = createAsyncThunk('elementOrders/deleteOrderById', async ({ order_id: id, facadeId }, { rejectWithValue, dispatch }) => {
	try {
		const response = await api.delete(`/element-orders/${id}`);
		dispatch(fetchElementsByFacadeId(facadeId));
		return { id, elementOrders: response.data };
	} catch (err) {
		return rejectWithValue({ id, message: err.response.data });
	}
});

export const createOrdersByElementId = createAsyncThunk('elementOrders/createOrdersByElementId', async (
	{
		selectedElementIds,
		material,
		facadeId
	},
	{ rejectWithValue, dispatch }) => {
	try {
		const data =
		{
			element_ids: selectedElementIds,
			warehouse_id: 1,
			supplier_id: 1,
			order_date: "2025-03-25",
			expected_arrival_date: "2025-04-01",
			assignments: [
				{
					nomenclature: {
						sku: material.sku,
						title: material.title,
						unit: "pcs",
						type: "material",
						note: material.note,
					},
					quantity: 1,
					price: 50.75,
					width: material.width,
					height: material.height,
					side: material.side,
				}
			]
		}
		const response = await api.post('/element-orders', data);
		dispatch(fetchElementsByFacadeId(facadeId));
		return { elementOrders: response.data.data };
	} catch (err) {
		return rejectWithValue({ message: err.response.data });
	}
});

export const updateOrderByElementId = createAsyncThunk('elementOrders/updateOrderByElementId', async (
	{
		id,
		material
	},
	{ rejectWithValue }) => {

	try {
		const data =
		{
			order_date: "2025-03-25",
			expected_arrival_date: "2025-04-01",
			assignments: [
				{
					nomenclature_id: material.id,
					nomenclature: {
						title: material.title,
						sku: material.sku,
						note: material.note
					},
					quantity: 1,
					price: material.price,
					width: material.width,
					height: material.height,
					side: material.side,
				},
			]
		}
		const response = await api.put(`/element-orders/${id}`, data);
		return { id, elementOrder: response.data.data };
	} catch (err) {
		return rejectWithValue({ message: err.response.data });
	}
});

export const fakeNomenclatureId = 'fake_nomenclature_id';
export const fakeOrderId = 'none';

const initialState = {
	orders: [],
	load: false,
	errorMessage: '',
};

const elementOrdersSlice = createSlice({
	name: 'elementOrders',
	initialState,
	reducers: {
		addEmptyOrder(state) {
			const data = {
				id: fakeOrderId,
				warehouse_id: 1,
				supplier_id: 1,
				order_date: "2025-03-26",
				expected_arrival_date: "2025-04-01",
				order_items: [
					{
						id: fakeNomenclatureId,
						nomenclature: {
							sku: '',
							title: '',
							unit: '',
							type: '',
							note: '',
						},
						quantity: 1,
						width: 0,
						height: 0,
						side: 'entire_element',
						price: 0,

					}
				]
			}
			state.orders.push(data);
		},
		deleteEmptyOrder(state) {
			state.orders = state.orders.filter(item => item.id !== fakeOrderId);
		},
		reset() {
			return initialState;
		},
	},
	extraReducers: (builder) => {
		builder
			.addCase(fetchOrdersByElementId.pending, (state) => {
				state.load = true;
				state.errorMessage = '';
			})
			.addCase(fetchOrdersByElementId.fulfilled, (state, action) => {
				state.load = false;
				const { elementOrders } = action.payload;
				state.orders = elementOrders;
				state.errorMessage = '';
			})
			.addCase(fetchOrdersByElementId.rejected, (state, action) => {
				state.load = false;
				state.errorMessage = action.payload.message.error;
			})
			.addCase(createOrdersByElementId.pending, (state) => {
				state.load = true;
				state.errorMessage = '';
			})
			.addCase(createOrdersByElementId.fulfilled, (state, action) => {
				state.load = false;
				const { elementOrders } = action.payload;
				state.orders = state.orders.filter(item => item.id !== fakeOrderId);
				state.orders.push(...elementOrders);
				state.errorMessage = '';
			})
			.addCase(createOrdersByElementId.rejected, (state, action) => {
				state.load = false;
				state.errorMessage = action.payload.message.error;
			})
			.addCase(deleteOrderById.pending, (state) => {
				state.load = true;
				state.errorMessage = '';
			})
			.addCase(deleteOrderById.fulfilled, (state, action) => {
				state.load = false;
				const { id } = action.payload;
				state.orders = state.orders.filter(item => item.id !== id);
				state.errorMessage = '';
			})
			.addCase(deleteOrderById.rejected, (state, action) => {
				state.load = false;
				state.errorMessage = action.payload.message.error;
			})
			.addCase(updateOrderByElementId.pending, (state) => {
				state.load = true;
				state.errorMessage = '';
			})
			.addCase(updateOrderByElementId.fulfilled, (state, action) => {
				state.load = false;
				const { id, elementOrder } = action.payload;
				const idx = state.orders.findIndex(item => item.id === id);
				if (idx !== -1) {
					state.orders[idx] = elementOrder;
				}
				state.errorMessage = '';
			})
			.addCase(updateOrderByElementId.rejected, (state, action) => {
				state.load = false;
				state.errorMessage = action.payload.message.error;
			})
	}
});

export const selectElementOrders = (state) => state.elementOrders.orders;
export const selectElementOrdersLoad = (state) => state.elementOrders.load;
export const selectElementOrdersError = (state) => state.elementOrders.errorMessage;

export const {
	addEmptyOrder,
	deleteEmptyOrder,
	reset,
} = elementOrdersSlice.actions;

export default elementOrdersSlice.reducer;
