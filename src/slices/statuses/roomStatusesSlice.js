import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '@services/api';
import { updateRoomStatusInCurrentProject, deleteRoomStatusInCurrentProject, addRoomStatusToCurrentProject } from '@slices/rooms/currentProjectSlice';

export const fetchRoomStatuses = createAsyncThunk('roomStatuses/fetchRoomStatuses', async (roomId) => {
	const response = await api.get(`/rooms/${roomId}/statuses`);
	return { roomId, statuses: response.data.data };
});

export const createRoomStatus = createAsyncThunk('roomStatuses/createRoomStatus', async ({ roomId, status }, { rejectWithValue, dispatch }) => {
	try {
		const response = await api.post(`/rooms/${roomId}/statuses`, status);
		const newStatus = response.data.data;
		dispatch(addRoomStatusToCurrentProject(newStatus));
		return newStatus;
	} catch (error) {
		return rejectWithValue(error.response.data);
	}
});

export const updateRoomStatus = createAsyncThunk('roomStatuses/updateRoomStatus', async ({ roomId, statusId, status }, { rejectWithValue, dispatch }) => {
	try {
		const response = await api.put(`/rooms/${roomId}/statuses/${statusId}`, status);
		const updatedStatus = response.data;
		dispatch(updateRoomStatusInCurrentProject(updatedStatus));
		return updatedStatus;
	} catch (error) {
		return rejectWithValue(error.response.data);
	}
});

export const deleteRoomStatus = createAsyncThunk('roomStatuses/deleteRoomStatus', async ({ roomId, statusId }, { rejectWithValue, dispatch }) => {
	try {
		await api.delete(`/rooms/${roomId}/statuses/${statusId}`);
		dispatch(deleteRoomStatusInCurrentProject({ roomId, statusId }));
		return statusId;
	} catch (error) {
		return rejectWithValue(error.response.data);
	}
});

const roomStatusesSlice = createSlice({
	name: 'roomStatuses',
	initialState: {
		byRoomId: {},
		status: {},
		error: {},
		createStatus: {},
		createError: {},
		updateStatus: {},
		updateError: {},
		deleteStatus: {},
		deleteError: {}
	},
	reducers: {},
	extraReducers: (builder) => {
		builder
			.addCase(fetchRoomStatuses.pending, (state, action) => {
				state.status[action.meta.arg] = 'loading';
			})
			.addCase(fetchRoomStatuses.fulfilled, (state, action) => {
				state.status[action.payload.roomId] = 'succeeded';
				const { roomId, statuses } = action.payload;
				state.byRoomId[roomId] = statuses;
			})
			.addCase(fetchRoomStatuses.rejected, (state, action) => {
				state.status[action.meta.arg] = 'failed';
				state.error[action.meta.arg] = action.error.message;
			})
			.addCase(createRoomStatus.pending, (state, action) => {
				state.createStatus[action.meta.arg.roomId] = 'loading';
			})
			.addCase(createRoomStatus.fulfilled, (state, action) => {
				state.createStatus[action.payload.room_id] = 'succeeded';
				const { room_id, ...status } = action.payload;
				if (!state.byRoomId[room_id]) {
					state.byRoomId[room_id] = [];
				}
				state.byRoomId[room_id].push(status);
			})
			.addCase(createRoomStatus.rejected, (state, action) => {
				state.createStatus[action.meta.arg.roomId] = 'failed';
				state.createError[action.meta.arg.roomId] = action.error.message;
			})
			.addCase(updateRoomStatus.pending, (state, action) => {
				state.updateStatus[action.meta.arg.roomId] = 'loading';
			})
			.addCase(updateRoomStatus.fulfilled, (state, action) => {
				state.updateStatus[action.payload.room_id] = 'succeeded';
				const { room_id, id, ...updatedStatus } = action.payload;
				const statuses = state.byRoomId[room_id];
				const index = statuses.findIndex((status) => status.id === id);
				if (index !== -1) {
					statuses[index] = { id, ...updatedStatus };
				}
			})
			.addCase(updateRoomStatus.rejected, (state, action) => {
				state.updateStatus[action.meta.arg.roomId] = 'failed';
				state.updateError[action.meta.arg.roomId] = action.error.message;
			})
			.addCase(deleteRoomStatus.pending, (state, action) => {
				state.deleteStatus[action.meta.arg.roomId] = 'loading';
			})
			.addCase(deleteRoomStatus.fulfilled, (state, action) => {
				state.deleteStatus[action.meta.arg.roomId] = 'succeeded';
				const roomId = action.meta.arg.roomId;
				const statusId = action.payload;
				state.byRoomId[roomId] = state.byRoomId[roomId].filter((status) => status.id !== statusId);
			})
			.addCase(deleteRoomStatus.rejected, (state, action) => {
				state.deleteStatus[action.meta.arg.roomId] = 'failed';
				state.deleteError[action.meta.arg.roomId] = action.error.message;
			});
	}
});

export default roomStatusesSlice.reducer;
