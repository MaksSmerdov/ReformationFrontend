import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '@services/api';

export const fetchPermissions = createAsyncThunk('permissions/fetchPermissions', async () => {
    const response = await api.get('/permissions');
    return response.data;
});

export const updatePermission = createAsyncThunk('permissions/updatePermission', async (permission, { rejectWithValue }) => {
    try {
        const response = await api.put(`/permissions/${permission.id}`, permission);
        return response.data;
    } catch (error) {
        return rejectWithValue(error.response.data);
    }
});

const permissionsSlice = createSlice({
    name: 'permissions',
    initialState: {
        items: [],
        status: {
            fetchAll: 'idle',
            update: 'idle'
        },
        error: {
            fetchAll: null,
            update: null
        }
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchPermissions.pending, (state) => {
                state.status.fetchAll = 'loading';
                state.error.fetchAll = null;
            })
            .addCase(fetchPermissions.fulfilled, (state, action) => {
                state.status.fetchAll = 'succeeded';
                state.items = action.payload.data;
            })
            .addCase(fetchPermissions.rejected, (state, action) => {
                state.status.fetchAll = 'failed';
                state.error.fetchAll = action.error.message;
            })
            .addCase(updatePermission.pending, (state) => {
                state.status.update = 'loading';
                state.error.update = null;
            })
            .addCase(updatePermission.fulfilled, (state, action) => {
                state.status.update = 'succeeded';
                const index = state.items.findIndex((permission) => permission.id === action.payload.permission.id);
                if (index !== -1) {
                    state.items[index] = action.payload.permission;
                }
            })
            .addCase(updatePermission.rejected, (state, action) => {
                state.status.update = 'failed';
                state.error.update = action.error.message;
            });
    }
});

export default permissionsSlice.reducer;