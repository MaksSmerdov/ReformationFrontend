import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '@services/api';
import { updateCurrentProjectRoomTickets } from '@slices/rooms/currentProjectSlice';

export const fetchTickets = createAsyncThunk('roomTickets/fetchTickets', async ({ roomId }) => {
	const response = await api.get(`/rooms/${roomId}/tickets`);
	return { roomId, tickets: response.data.data };
});

export const fetchTicket = createAsyncThunk('roomTickets/fetchTicket', async ({ roomId, ticketId }) => {
	const response = await api.get(`/rooms/${roomId}/tickets/${ticketId}`);
	return response.data.data;
});

export const createTicket = createAsyncThunk('roomTickets/createTicket', async ({ roomId, ticket }, { rejectWithValue, dispatch }) => {
	try {
		const response = await api.post(`/rooms/${roomId}/tickets`, ticket);
		dispatch(updateCurrentProjectRoomTickets(response.data.data));
		return response.data.data;
	} catch (error) {
		return rejectWithValue(error.response.data);
	}
});

export const updateTicket = createAsyncThunk('roomTickets/updateTicket', async ({ roomId, ticket }, { dispatch }) => {
	const response = await api.put(`/rooms/${roomId}/tickets/${ticket.id}`, ticket);
	dispatch(updateCurrentProjectRoomTickets(response.data.data));
	return response.data.data;
});

export const deleteTicket = createAsyncThunk('roomTickets/deleteTicket', async ({ roomId, ticketId }, { dispatch }) => {
	await api.delete(`/rooms/${roomId}/tickets/${ticketId}`);
	dispatch(updateCurrentProjectRoomTickets({ id: ticketId, delete: true }));
	return { roomId, ticketId };
});

const roomTicketsSlice = createSlice({
	name: 'roomTickets',
	initialState: {
		byId: {},
		byRoomId: {},
		byRoomStatusId: {},
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
				state.status.fetch[action.meta.arg.roomId] = 'loading';
			})
			.addCase(fetchTickets.fulfilled, (state, action) => {
				const { roomId, tickets } = action.payload;
				state.byRoomId[roomId] = Array.isArray(tickets) ? tickets : [];
				tickets.forEach((ticket) => {
					state.byId[ticket.id] = ticket;
					if (ticket.room_statuses) {
						const roomStatusId = ticket.room_statuses[0].id;
						if (!state.byRoomStatusId[roomStatusId]) {
							state.byRoomStatusId[roomStatusId] = [];
						}
						state.byRoomStatusId[roomStatusId].push(ticket);
					}
				});
				state.status.fetch[action.payload.roomId] = 'succeeded';
			})
			.addCase(fetchTickets.rejected, (state, action) => {
				state.status.fetch[action.meta.arg.roomId] = 'failed';
				state.error.fetch[action.meta.arg.roomId] = action.error.message;
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
				state.status.create[action.meta.arg.roomId] = 'loading';
			})
			.addCase(createTicket.fulfilled, (state, action) => {
				const roomId = action.payload.room_statuses[0].room_id;
				const roomStatusId = action.payload.room_statuses[0].id;
				if (!state.byRoomId[roomId]) {
					state.byRoomId[roomId] = [];
				}
				if (!state.byRoomStatusId[roomStatusId]) {
					state.byRoomStatusId[roomStatusId] = [];
				}
				state.byRoomId[roomId].push(action.payload);
				state.byRoomStatusId[roomStatusId].push(action.payload);
				// console.log('createTicket', action.payload);
				state.byId[action.payload.id] = action.payload;
				state.status.create[roomId] = 'succeeded';
			})
			.addCase(createTicket.rejected, (state, action) => {
				state.status.create[action.meta.arg.roomId] = 'failed';
				state.error.create[action.meta.arg.roomId] = action.error.message;
			})
			.addCase(updateTicket.pending, (state, action) => {
				state.status.update[action.meta.arg.roomId] = 'loading';
			})
			.addCase(updateTicket.fulfilled, (state, action) => {
				const roomId = action.payload.room_statuses[0].room_id;
				const roomStatusId = action.payload.room_statuses[0].id;
				const index = state.byRoomId[roomId].findIndex((ticket) => ticket.id === action.payload.id);
				if (index !== -1) {
					state.byRoomId[roomId][index] = action.payload;
				}
				const statusIndex = state.byRoomStatusId[roomStatusId].findIndex((ticket) => ticket.id === action.payload.id);
				if (statusIndex !== -1) {
					state.byRoomStatusId[roomStatusId][statusIndex] = action.payload;
				}
				state.byId[action.payload.id] = action.payload;
				state.status.update[roomId] = 'succeeded';
			})
			.addCase(updateTicket.rejected, (state, action) => {
				state.status.update[action.meta.arg.roomId] = 'failed';
				state.error.update[action.meta.arg.roomId] = action.error.message;
			})
			.addCase(deleteTicket.pending, (state, action) => {
				state.status.delete[action.meta.arg.roomId] = 'loading';
			})
			.addCase(deleteTicket.fulfilled, (state, action) => {
				const { roomId, ticketId } = action.payload;
				state.status.delete[roomId] = 'succeeded';
				// console.log('deleteTicket fulfilled: ', action.payload, roomId, ticketId, state.byRoomId, state.byRoomId[roomId]);
				if (state.byRoomId[roomId]) {
					state.byRoomId[roomId] = [];
					state.byRoomId[roomId] = state.byRoomId[roomId].filter((ticket) => ticket.id !== ticketId);
					Object.keys(state.byRoomStatusId).forEach((roomStatusId) => {
						state.byRoomStatusId[roomStatusId] = state.byRoomStatusId[roomStatusId].filter((ticket) => ticket.id !== ticketId);
					});
				}
				delete state.byId[ticketId];
			})
			.addCase(deleteTicket.rejected, (state, action) => {
				state.status.delete[action.meta.arg.roomId] = 'failed';
				state.error.delete[action.meta.arg.roomId] = action.error.message;
			});
	}
});

export default roomTicketsSlice.reducer;
