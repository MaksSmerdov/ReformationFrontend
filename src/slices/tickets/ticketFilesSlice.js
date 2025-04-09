import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '@services/api';

export const uploadTicketFiles = createAsyncThunk('ticketFiles/uploadTicketFiles', async ({ ticketId, formData }) => {
	const response = await api.post(`/tickets/${ticketId}/files`, formData, {
		headers: {
			'Content-Type': 'multipart/form-data'
		}
	});
	return { ticketId, files: response.data.files };
});

export const deleteTicketFile = createAsyncThunk('ticketFiles/deleteTicketFile', async ({ ticketId, fileId }) => {
	await api.delete(`/tickets/${ticketId}/files/${fileId}`);
	return { ticketId, fileId };
});

const ticketFilesSlice = createSlice({
	name: 'ticketFiles',
	initialState: {
		items: [],
		byTicketId: {},
		status: 'idle',
		error: null
	},
	reducers: {},
	extraReducers: (builder) => {
		builder
			.addCase(uploadTicketFiles.pending, (state) => {
				state.status = 'loading';
			})
			.addCase(uploadTicketFiles.fulfilled, (state, action) => {
				state.status = 'succeeded';
				state.items.push(...action.payload.files);
				state.byTicketId[action.payload.ticketId] = action.payload.files;
			})
			.addCase(uploadTicketFiles.rejected, (state, action) => {
				state.status = 'failed';
				state.error = action.error.message;
			})
			.addCase(deleteTicketFile.fulfilled, (state, action) => {
				state.items = state.items.filter((file) => file.id !== action.payload.fileId);
				if (state.byTicketId[action.payload.ticketId]) {
					state.byTicketId[action.payload.ticketId] = state.byTicketId[action.payload.ticketId].filter((file) => file.id !== action.payload.fileId);
				}
			});
	}
});

export default ticketFilesSlice.reducer;
