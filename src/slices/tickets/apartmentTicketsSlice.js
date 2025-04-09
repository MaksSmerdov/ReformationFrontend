import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '@services/api';
import { updateCurrentProjectApartmentTickets } from '@slices/rooms/currentProjectSlice';

export const fetchTickets = createAsyncThunk('apartmentTickets/fetchTickets', async ({ apartmentId }) => {
	const response = await api.get(`/apartments/${apartmentId}/tickets`);
	return { apartmentId, tickets: response.data.data };
});

export const fetchTicket = createAsyncThunk('apartmentTickets/fetchTicket', async ({ apartmentId, ticketId }) => {
	const response = await api.get(`/apartments/${apartmentId}/tickets/${ticketId}`);
	return response.data.data;
});

export const createTicket = createAsyncThunk('apartmentTickets/createTicket', async ({ apartmentId, ticket }, { rejectWithValue, dispatch }) => {
	try {
		const response = await api.post(`/apartments/${apartmentId}/tickets`, ticket);
		// console.log('apartmentTicketsSlice createTicket response:', response);
		if (response.data) {
			dispatch(updateCurrentProjectApartmentTickets(response.data.data));
			return response.data.data;
		} else {
			throw new Error('Response data is undefined');
		}
	} catch (error) {
		return rejectWithValue(error.response ? error.response.data : error.message);
	}
});

export const updateTicket = createAsyncThunk('apartmentTickets/updateTicket', async ({ apartmentId, ticket }, { dispatch }) => {
	const response = await api.put(`/apartments/${apartmentId}/tickets/${ticket.id}`, ticket);
	dispatch(updateCurrentProjectApartmentTickets(response.data.data));
	return response.data.data;
});

export const deleteTicket = createAsyncThunk('apartmentTickets/deleteTicket', async ({ apartmentId, ticketId }, { dispatch }) => {
	await api.delete(`/apartments/${apartmentId}/tickets/${ticketId}`);
	dispatch(updateCurrentProjectApartmentTickets({ id: ticketId, delete: true }));
	return { apartmentId, ticketId };
});

const apartmentTicketsSlice = createSlice({
	name: 'apartmentTickets',
	initialState: {
		byId: {},
		byApartmentId: {},
		byApartmentStatusId: {},
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
	reducers: {
		updateTicketFiles: (state, action) => {
			const { ticketId, files } = action.payload;
			if (state.byId[ticketId]) {
				state.byId[ticketId].files = files;
			}
		}
	},
	extraReducers: (builder) => {
		builder
			.addCase(fetchTickets.pending, (state, action) => {
				state.status.fetch[action.meta.arg.apartmentId] = 'loading';
			})
			.addCase(fetchTickets.fulfilled, (state, action) => {
				const { apartmentId, tickets } = action.payload;
				state.byApartmentId[apartmentId] = Array.isArray(tickets) ? tickets : [];
				tickets.forEach((ticket) => {
					state.byId[ticket.id] = ticket;
					if (ticket.apartment_statuses) {
						const apartmentStatusId = ticket.apartment_statuses[0].id;
						if (!state.byApartmentStatusId[apartmentStatusId]) {
							state.byApartmentStatusId[apartmentStatusId] = [];
						}
						state.byApartmentStatusId[apartmentStatusId].push(ticket);
					}
				});
				state.status.fetch[action.payload.apartmentId] = 'succeeded';
			})
			.addCase(fetchTickets.rejected, (state, action) => {
				state.status.fetch[action.meta.arg.apartmentId] = 'failed';
				state.error.fetch[action.meta.arg.apartmentId] = action.error.message;
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
				state.status.create[action.meta.arg.apartmentId] = 'loading';
			})
			.addCase(createTicket.fulfilled, (state, action) => {
				// console.log('apartmentTicketsSlice createTicket fulfilled action.payload:', action.payload);
				const apartmentId = action.payload.apartment_statuses[0].apartment_id;
				const apartmentStatusId = action.payload.apartment_statuses[0].id;
				if (!state.byApartmentId[apartmentId]) {
					state.byApartmentId[apartmentId] = [];
				}
				if (!state.byApartmentStatusId[apartmentStatusId]) {
					state.byApartmentStatusId[apartmentStatusId] = [];
				}
				state.byApartmentId[apartmentId].push(action.payload);
				state.byApartmentStatusId[apartmentStatusId].push(action.payload);
				state.byId[action.payload.id] = action.payload;
				state.status.create[apartmentId] = 'succeeded';
			})
			.addCase(createTicket.rejected, (state, action) => {
				state.status.create[action.meta.arg.apartmentId] = 'failed';
				state.error.create[action.meta.arg.apartmentId] = action.error.message;
			})
			.addCase(updateTicket.pending, (state, action) => {
				state.status.update[action.meta.arg.apartmentId] = 'loading';
			})
			.addCase(updateTicket.fulfilled, (state, action) => {
				const apartmentId = action.payload.apartment_statuses[0].apartment_id;
				// const apartmentStatusId = action.payload.apartment_statuses[0].id;
				// const index = state.byApartmentId[apartmentId].findIndex((ticket) => ticket.id === action.payload.id);
				// if (index !== -1) {
				// 	state.byApartmentId[apartmentId][index] = action.payload;
				// }
				// const statusIndex = state.byApartmentStatusId[apartmentStatusId].findIndex((ticket) => ticket.id === action.payload.id);
				// if (statusIndex !== -1) {
				// 	state.byApartmentStatusId[apartmentStatusId][statusIndex] = action.payload;
				// }
				state.byId[action.payload.id] = action.payload;
				console.log('apartmentTicketsSlice updateTicket fulfilled action.payload:', action.payload, state.byId[action.payload.id]);
				state.status.update[apartmentId] = 'succeeded';
			})
			.addCase(updateTicket.rejected, (state, action) => {
				state.status.update[action.meta.arg.apartmentId] = 'failed';
				state.error.update[action.meta.arg.apartmentId] = action.error.message;
			})
			.addCase(deleteTicket.pending, (state, action) => {
				state.status.delete[action.meta.arg.apartmentId] = 'loading';
			})
			.addCase(deleteTicket.fulfilled, (state, action) => {
				const { apartmentId, ticketId } = action.payload;
				state.status.delete[apartmentId] = 'succeeded';
				if (state.byApartmentId[apartmentId]) {
					state.byApartmentId[apartmentId] = state.byApartmentId[apartmentId].filter((ticket) => ticket.id !== ticketId);
					Object.keys(state.byApartmentStatusId).forEach((apartmentStatusId) => {
						state.byApartmentStatusId[apartmentStatusId] = state.byApartmentStatusId[apartmentStatusId].filter((ticket) => ticket.id !== ticketId);
					});
				}
				delete state.byId[ticketId];
			})
			.addCase(deleteTicket.rejected, (state, action) => {
				state.status.delete[action.meta.arg.apartmentId] = 'failed';
				state.error.delete[action.meta.arg.apartmentId] = action.error.message;
			});
	}
});

export const { updateTicketFiles } = apartmentTicketsSlice.actions;

export default apartmentTicketsSlice.reducer;
