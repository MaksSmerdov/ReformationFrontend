import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '@services/api';
import { createSelector } from 'reselect';

export const fetchTickets = createAsyncThunk('elementTickets/fetchTickets', async ({ elementId }) => {
	const response = await api.get(`/elements/${elementId}/tickets`);
	return { elementId, tickets: response.data.data };
});

export const fetchTicket = createAsyncThunk('elementTickets/fetchTicket', async ({ elementId, ticketId }) => {
	const response = await api.get(`/elements/${elementId}/tickets/${ticketId}`);
	return response.data.data;
});

export const createTicket = createAsyncThunk('elementTickets/createTicket', async ({ elementId, ticket }, { rejectWithValue, dispatch }) => {
	try {
		const response = await api.post(`/elements/${elementId}/tickets`, ticket);
		return response.data.data;
	} catch (error) {
		return rejectWithValue(error.response.data);
	}
});

export const updateTicket = createAsyncThunk('elementTickets/updateTicket', async ({ elementId, ticket }, { dispatch }) => {
	const response = await api.put(`/elements/${elementId}/tickets/${ticket.id}`, ticket);
	return response.data.data;
});

export const deleteTicket = createAsyncThunk('elementTickets/deleteTicket', async ({ elementId, ticketId }, { dispatch }) => {
	await api.delete(`/elements/${elementId}/tickets/${ticketId}`);
	return { elementId, ticketId };
});

const elementTicketsSlice = createSlice({
	name: 'elementTickets',
	initialState: {
		byId: {},
		byElementId: {},
		byElementStatusId: {},
		status: {
			fetch: {},
			create: {},
			update: {},
			delete: {}
		},
		error: {
			fetch: {},
			create: {},
			update: {},
			delete: {}
		}
	},
	reducers: {},
	extraReducers: (builder) => {
		builder
			.addCase(fetchTickets.pending, (state, action) => {
				state.status.fetch[action.meta.arg.elementId] = 'loading';
			})
			.addCase(fetchTickets.fulfilled, (state, action) => {
				const { elementId, tickets } = action.payload;
				state.byElementId[elementId] = Array.isArray(tickets) ? tickets : [];
				tickets.forEach((ticket) => {
					state.byId[ticket.id] = ticket;
					if (ticket.element_statuses) {
						const elementStatusId = ticket.element_statuses[0].id;
						if (!state.byElementStatusId[elementStatusId]) {
							state.byElementStatusId[elementStatusId] = [];
						}
						state.byElementStatusId[elementStatusId].push(ticket);
					}
				});
				state.status.fetch[action.payload.elementId] = 'succeeded';
			})
			.addCase(fetchTickets.rejected, (state, action) => {
				state.status.fetch[action.meta.arg.elementId] = 'failed';
				state.error.fetch[action.meta.arg.elementId] = action.error.message;
			})
			.addCase(fetchTicket.pending, (state, action) => {
				state.status.fetch[action.meta.arg.ticketId] = 'loading';
			})
			.addCase(fetchTicket.fulfilled, (state, action) => {
				state.byId[action.payload.id] = action.payload;
				state.status.fetch[action.payload.id] = 'succeeded';
			})
			.addCase(fetchTicket.rejected, (state, action) => {
				state.status.fetch[action.meta.arg.ticketId] = 'failed';
				state.error.fetch[action.meta.arg.ticketId] = action.error.message;
			})
			.addCase(createTicket.pending, (state, action) => {
				state.status.create[action.meta.arg.elementId] = 'loading';
			})
			.addCase(createTicket.fulfilled, (state, action) => {
				const elementId = action.payload.element_statuses[0].element_id;
				const elementStatusId = action.payload.element_statuses[0].id;
				if (!state.byElementId[elementId]) {
					state.byElementId[elementId] = [];
				}
				if (!state.byElementStatusId[elementStatusId]) {
					state.byElementStatusId[elementStatusId] = [];
				}
				state.byElementId[elementId].push(action.payload);
				state.byElementStatusId[elementStatusId].push(action.payload);
				state.byId[action.payload.id] = action.payload;
				state.status.create[elementId] = 'succeeded';
			})
			.addCase(createTicket.rejected, (state, action) => {
				state.status.create[action.meta.arg.elementId] = 'failed';
				state.error.create[action.meta.arg.elementId] = action.error.message;
			})
			.addCase(updateTicket.pending, (state, action) => {
				state.status.update[action.meta.arg.elementId] = 'loading';
			})
			.addCase(updateTicket.fulfilled, (state, action) => {
				const elementId = action.payload.element_statuses[0].element_id;
				const elementStatusId = action.payload.element_statuses[0].id;
				const index = state.byElementId[elementId].findIndex((ticket) => ticket.id === action.payload.id);
				if (index !== -1) {
					state.byElementId[elementId][index] = action.payload;
				}
				const statusIndex = state.byElementStatusId[elementStatusId].findIndex((ticket) => ticket.id === action.payload.id);
				if (statusIndex !== -1) {
					state.byElementStatusId[elementStatusId][statusIndex] = action.payload;
				}
				state.byId[action.payload.id] = action.payload;
				state.status.update[elementId] = 'succeeded';
			})
			.addCase(updateTicket.rejected, (state, action) => {
				state.status.update[action.meta.arg.elementId] = 'failed';
				state.error.update[action.meta.arg.elementId] = action.error.message;
			})
			.addCase(deleteTicket.pending, (state, action) => {
				state.status.delete[action.meta.arg.elementId] = 'loading';
			})
			.addCase(deleteTicket.fulfilled, (state, action) => {
				const { elementId, ticketId } = action.payload;
				state.status.delete[elementId] = 'succeeded';
				if (state.byElementId[elementId]) {
					state.byElementId[elementId] = state.byElementId[elementId].filter((ticket) => ticket.id !== ticketId);
					Object.keys(state.byElementStatusId).forEach((elementStatusId) => {
						state.byElementStatusId[elementStatusId] = state.byElementStatusId[elementStatusId].filter((ticket) => ticket.id !== ticketId);
					});
				}
				delete state.byId[ticketId];
			})
			.addCase(deleteTicket.rejected, (state, action) => {
				state.status.delete[action.meta.arg.elementId] = 'failed';
				state.error.delete[action.meta.arg.elementId] = action.error.message;
			});
	}
});

export const selectTicketsByElementIds = createSelector(
	(state) => state.elementTickets.byElementId,
	(_, elementIds) => elementIds,
	(byElementId, elementIds) => {
		if (!elementIds || elementIds.length === 0) {
			return [];
		}
		return elementIds.flatMap((elementId) => byElementId[elementId] || []);
	}
);

export default elementTicketsSlice.reducer;
