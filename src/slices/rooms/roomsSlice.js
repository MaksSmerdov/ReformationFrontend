import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '@services/api';

export const fetchRoomById = createAsyncThunk('rooms/fetchRoomById', async ({ apartmentId, roomId }) => {
	const response = await api.get(`/apartments/${apartmentId}/rooms/${roomId}`);
	return response.data;
});

export const fetchRooms = createAsyncThunk('rooms/fetchRooms', async (apartmentId) => {
	const response = await api.get(`/apartments/${apartmentId}/rooms`);
	return { apartmentId, rooms: response.data.data };
});

export const createRoom = createAsyncThunk('rooms/createRoom', async ({ apartmentId, room }, { rejectWithValue }) => {
	try {
		const response = await api.post(`/apartments/${apartmentId}/rooms`, room);
		return response.data;
	} catch (error) {
		return rejectWithValue(error.response.data);
	}
});

export const updateRoom = createAsyncThunk('rooms/updateRoom', async ({ apartmentId, room }, { rejectWithValue }) => {
	try {
		const response = await api.put(`/apartments/${apartmentId}/rooms/${room.id}`, room);
		return response.data;
	} catch (error) {
		return rejectWithValue(error.response.data);
	}
});

export const deleteRoom = createAsyncThunk('rooms/deleteRoom', async ({ apartmentId, roomId }, { rejectWithValue }) => {
	try {
		await api.delete(`/apartments/${apartmentId}/rooms/${roomId}`);
		return roomId;
	} catch (error) {
		return rejectWithValue(error.response.data);
	}
});

const roomsSlice = createSlice({
	name: 'rooms',
	initialState: {
		items: [],
		byId: {},
		byApartmentId: {},
		status: 'idle',
		error: null,
		createStatus: 'idle',
		createError: null,
		updateStatus: 'idle',
		updateError: null,
		deleteStatus: 'idle',
		deleteError: null,
		loadingRooms: {},
		savingRooms: {}
	},
	reducers: {
		startLoadingRoom: (state, action) => {
			state.loadingRooms[action.payload] = true;
		},
		finishLoadingRoom: (state, action) => {
			state.loadingRooms[action.payload] = false;
		},
		failLoadingRoom: (state, action) => {
			state.loadingRooms[action.payload] = false;
		},
		startSavingRoom: (state, action) => {
			state.savingRooms[action.payload] = true;
		},
		finishSavingRoom: (state, action) => {
			state.savingRooms[action.payload] = false;
		},
		failSavingRoom: (state, action) => {
			state.savingRooms[action.payload] = false;
		}
	},
	extraReducers: (builder) => {
		builder
			.addCase(fetchRooms.pending, (state) => {
				state.status = 'loading';
			})
			.addCase(fetchRooms.fulfilled, (state, action) => {
				state.status = 'succeeded';
				const { apartmentId, rooms } = action.payload;
				state.byApartmentId[apartmentId] = rooms.map((room) => room.id);
				rooms.forEach((room) => {
					if (room && room.id) {
						state.byId[room.id] = room;
						if (!state.items.includes(room.id)) {
							state.items.push(room.id);
						}
					}
				});
			})
			.addCase(fetchRooms.rejected, (state, action) => {
				state.status = 'failed';
				state.error = action.error.message;
			})
			.addCase(fetchRoomById.fulfilled, (state, action) => {
				if (action.payload && action.payload.id) {
					state.byId[action.payload.id] = action.payload;
					if (!state.items.includes(action.payload.id)) {
						state.items.push(action.payload.id);
					}
				}
			})
			.addCase(createRoom.fulfilled, (state, action) => {
				if (action.payload && action.payload.id) {
					state.byId[action.payload.id] = action.payload;
					state.items.push(action.payload.id);
					const apartmentId = action.payload.apartment_id;
					if (!state.byApartmentId[apartmentId]) {
						state.byApartmentId[apartmentId] = [];
					}
					state.byApartmentId[apartmentId].push(action.payload.id);
				}
			})
			.addCase(updateRoom.fulfilled, (state, action) => {
				if (action.payload && action.payload.id) {
					state.byId[action.payload.id] = action.payload;
				}
			})
			.addCase(deleteRoom.fulfilled, (state, action) => {
				const roomId = action.payload;
				const apartmentId = state.byId[roomId].apartment_id;
				delete state.byId[roomId];
				state.items = state.items.filter((id) => id !== roomId);
				state.byApartmentId[apartmentId] = state.byApartmentId[apartmentId].filter((id) => id !== roomId);
			});
	}
});

export const { startLoadingRoom, finishLoadingRoom, failLoadingRoom, startSavingRoom, finishSavingRoom, failSavingRoom } = roomsSlice.actions;

export default roomsSlice.reducer;
