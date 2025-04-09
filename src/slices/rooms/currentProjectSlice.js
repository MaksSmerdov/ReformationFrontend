import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '@services/api';

export const fetchCurrentProject = createAsyncThunk('currentProject/fetchCurrentProject', async (id) => {
	const response = await api.get(`/projects/${id}`);
	console.log('fetchCurrentProject response:', response.data);
	return response.data;
});

export const fetchProjectRooms = createAsyncThunk('currentProject/fetchProjectRooms', async (projectId) => {
	const response = await api.get(`/projects/${projectId}/rooms`);
	// console.log('fetchProjectRooms response:', response.data);
	return response.data;
});

const currentProjectSlice = createSlice({
	name: 'currentProject',
	initialState: {
		status: {
			fetchProject: 'idle',
			fetchRooms: 'idle'
		},
		error: {
			fetchProject: null,
			fetchRooms: null
		},
		project: {},
		statusGroups: {
			items: [],
			byId: {}
		},
		statuses: {
			items: [],
			byId: {},
			byStatusGroupId: {}
		},
		users: {
			items: [],
			byId: {}
		},
		staircases: {
			items: [],
			byId: {}
		},
		staircaseLayouts: {
			items: [],
			byId: {},
			byStaircaseId: {}
		},
		apartments: {
			items: [],
			byId: {},
			byStaircaseId: {}
		},
		apartmentStatuses: {
			items: [],
			byId: {},
			byApartmentId: {}
		},
		rooms: {
			items: [],
			byId: {},
			byApartmentId: {},
			byStaircaseId: {}
		},
		roomStatuses: {
			items: [],
			byId: {},
			byRoomId: {}
		},
		tickets: {
			items: [],
			byId: {},
			byApartmentId: {},
			byApartmentStatusId: {},
			byRoomId: {},
			byRoomStatusId: {}
		}
	},
	reducers: {
		updateCurrentProjectRoomTickets: (state, action) => {
			const { id, delete: isDelete } = action.payload;
			if (isDelete) {
				// Удаление тикета
				delete state.tickets.byId[id];
				Object.keys(state.tickets.byRoomId).forEach((roomId) => {
					state.tickets.byRoomId[roomId] = state.tickets.byRoomId[roomId].filter((ticket) => ticket.id !== id);
				});
				Object.keys(state.tickets.byRoomStatusId).forEach((roomStatusId) => {
					state.tickets.byRoomStatusId[roomStatusId] = state.tickets.byRoomStatusId[roomStatusId].filter((ticket) => ticket.id !== id);
				});
			} else {
				// Добавление или обновление тикета
				const ticket = action.payload;
				state.tickets.byId[ticket.id] = ticket;
				const roomId = ticket.room_statuses[0].room_id;
				const roomStatusId = ticket.room_statuses[0].id;

				if (!state.tickets.byRoomId[roomId]) {
					state.tickets.byRoomId[roomId] = [];
				}
				if (!state.tickets.byRoomStatusId[roomStatusId]) {
					state.tickets.byRoomStatusId[roomStatusId] = [];
				}

				const roomIndex = state.tickets.byRoomId[roomId].findIndex((t) => t.id === ticket.id);
				if (roomIndex !== -1) {
					state.tickets.byRoomId[roomId][roomIndex] = ticket;
				} else {
					state.tickets.byRoomId[roomId].push(ticket);
				}

				const statusIndex = state.tickets.byRoomStatusId[roomStatusId].findIndex((t) => t.id === ticket.id);
				if (statusIndex !== -1) {
					state.tickets.byRoomStatusId[roomStatusId][statusIndex] = ticket;
				} else {
					state.tickets.byRoomStatusId[roomStatusId].push(ticket);
				}
			}
		},
		updateCurrentProjectApartmentTickets: (state, action) => {
			const { id, delete: isDelete } = action.payload;
			if (isDelete) {
				// Удаление тикета
				delete state.tickets.byId[id];
				Object.keys(state.tickets.byApartmentId).forEach((apartmentId) => {
					state.tickets.byApartmentId[apartmentId] = state.tickets.byApartmentId[apartmentId].filter((ticket) => ticket.id !== id);
				});
				Object.keys(state.tickets.byApartmentStatusId).forEach((apartmentStatusId) => {
					state.tickets.byApartmentStatusId[apartmentStatusId] = state.tickets.byApartmentStatusId[apartmentStatusId].filter((ticket) => ticket.id !== id);
				});
			} else {
				// Добавление или обновление тикета
				const ticket = action.payload;
				state.tickets.byId[ticket.id] = ticket;
				const apartmentId = ticket.apartment_statuses[0].apartment_id;
				const apartmentStatusId = ticket.apartment_statuses[0].id;

				if (!state.tickets.byApartmentId[apartmentId]) {
					state.tickets.byApartmentId[apartmentId] = [];
				}
				if (!state.tickets.byApartmentStatusId[apartmentStatusId]) {
					state.tickets.byApartmentStatusId[apartmentStatusId] = [];
				}

				const apartmentIndex = state.tickets.byApartmentId[apartmentId].findIndex((t) => t.id === ticket.id);
				if (apartmentIndex !== -1) {
					state.tickets.byApartmentId[apartmentId][apartmentIndex] = ticket;
				} else {
					state.tickets.byApartmentId[apartmentId].push(ticket);
				}

				const statusIndex = state.tickets.byApartmentStatusId[apartmentStatusId].findIndex((t) => t.id === ticket.id);
				if (statusIndex !== -1) {
					state.tickets.byApartmentStatusId[apartmentStatusId][statusIndex] = ticket;
				} else {
					state.tickets.byApartmentStatusId[apartmentStatusId].push(ticket);
				}
			}
		},
		addRoomStatusToCurrentProject: (state, action) => {
			const status = action.payload;
			state.roomStatuses.byId[status.id] = status;
			if (!state.roomStatuses.byRoomId[status.room_id]) {
				state.roomStatuses.byRoomId[status.room_id] = [];
			}
			state.roomStatuses.byRoomId[status.room_id].push(status);
		},
		updateRoomStatusInCurrentProject: (state, action) => {
			const status = action.payload;
			state.roomStatuses.byId[status.id] = status;
			const statuses = state.roomStatuses.byRoomId[status.room_id];
			const index = statuses.findIndex((s) => s.id === status.id);
			if (index !== -1) {
				statuses[index] = status;
			}
		},
		deleteRoomStatusInCurrentProject: (state, action) => {
			const { roomId, statusId } = action.payload;
			state.roomStatuses.byRoomId[roomId] = state.roomStatuses.byRoomId[roomId].filter((status) => status.id !== statusId);
			delete state.roomStatuses.byId[statusId];
		},
		updateStaircaseInCurrentProject: (state, action) => {
			const staircase = action.payload;
			state.staircases.byId[staircase.id] = staircase;
			const index = state.staircases.items.findIndex((s) => s.id === staircase.id);
			if (index !== -1) {
				state.staircases.items[index] = staircase;
			}
		},
		updateStaircaseLayoutInCurrentProject: (state, action) => {
			const layout = action.payload;
			state.staircaseLayouts.byId[layout.id] = layout;
			const index = state.staircaseLayouts.byStaircaseId[layout.staircase_id].findIndex((l) => l.id === layout.id);
			if (index !== -1) {
				state.staircaseLayouts.byStaircaseId[layout.staircase_id][index] = layout;
			}
		},
		addApartmentStatusToCurrentProject: (state, action) => {
			const status = action.payload;
			state.apartmentStatuses.byId[status.id] = status;
			if (!state.apartmentStatuses.byApartmentId[status.apartment_id]) {
				state.apartmentStatuses.byApartmentId[status.apartment_id] = [];
			}
			state.apartmentStatuses.byApartmentId[status.apartment_id].push(status);
		},
		updateApartmentStatusInCurrentProject: (state, action) => {
			const status = action.payload;
			state.apartmentStatuses.byId[status.id] = status;
			const statuses = state.apartmentStatuses.byApartmentId[status.apartment_id];
			const index = statuses.findIndex((s) => s.id === status.id);
			if (index !== -1) {
				statuses[index] = status;
			}
		},
		deleteApartmentStatusInCurrentProject: (state, action) => {
			const { apartmentId, statusId } = action.payload;
			state.apartmentStatuses.byApartmentId[apartmentId] = state.apartmentStatuses.byApartmentId[apartmentId].filter((status) => status.id !== statusId);
			delete state.apartmentStatuses.byId[statusId];
		}
	},
	extraReducers: (builder) => {
		builder
			.addCase(fetchCurrentProject.pending, (state) => {
				state.status.fetchProject = 'loading';
			})
			.addCase(fetchCurrentProject.fulfilled, (state, action) => {
				const project = action.payload;
				state.project = {
					id: project.id,
					project_type_id: project.project_type_id,
					title: project.title,
					description: project.description,
					type: project.type
				};

				state.statusGroups.items = project.status_groups;
				state.statusGroups.byId = state.statusGroups.items.reduce((acc, group) => {
					acc[group.id] = {
						...group,
						statuses: group.statuses.map((status) => status.id)
					};
					return acc;
				}, {});

				state.statuses.items = state.statusGroups.items
					.flatMap((group) => group.statuses)
					.map((status) => ({
						...status,
						color: state.statusGroups.byId[status.status_group_id].color
					}));
				state.statuses.byId = state.statuses.items.reduce((acc, status) => {
					acc[status.id] = status;
					return acc;
				}, {});
				state.statuses.byStatusGroupId = state.statusGroups.items.reduce((acc, group) => {
					acc[group.id] = group.statuses.map((status) => status.id);
					return acc;
				}, {});

				state.users.items = project.users;
				state.users.byId = state.users.items.reduce((acc, user) => {
					acc[user.id] = user;
					return acc;
				}, {});

				// console.log('fetchCurrentProject project:', state.project);

				// console.log('fetchCurrentProject statusGroups:', state.statusGroups.items);
				// console.log('fetchCurrentProject statusGroups byId:', state.statusGroups.byId);

				// console.log('fetchCurrentProject statuses:', state.statuses.items);
				// console.log('fetchCurrentProject statuses byId:', state.statuses.byId);
				// console.log('fetchCurrentProject statuses byStatusGroupId:', state.statuses.byStatusGroupId);

				// console.log('fetchCurrentProject users:', state.users.items);
				// console.log('fetchCurrentProject users byId:', state.users.byId);

				state.status.fetchProject = 'succeeded';
			})
			.addCase(fetchCurrentProject.rejected, (state, action) => {
				state.error.fetchProject = action.error.message;
				state.status.fetchProject = 'failed';
			})
			.addCase(fetchProjectRooms.pending, (state) => {
				state.status.fetchRooms = 'loading';
			})
			.addCase(fetchProjectRooms.fulfilled, (state, action) => {
				const staircases = action.payload.staircases;
				state.staircases.items = staircases.map((staircase) => ({
					...staircase,
					apartments: staircase.apartments.map((apartment) => apartment.id),
					layouts: staircase.layouts.map((layout) => layout.id)
				}));
				state.staircases.byId = staircases.reduce((acc, staircase) => {
					acc[staircase.id] = {
						...staircase,
						apartments: staircase.apartments.map((apartment) => apartment.id),
						layouts: staircase.layouts.map((layout) => layout.id)
					};
					return acc;
				}, {});

				const layouts = staircases.flatMap((staircase) => staircase.layouts);
				state.staircaseLayouts.items = layouts;
				state.staircaseLayouts.byId = layouts.reduce((acc, layout) => {
					acc[layout.id] = layout;
					return acc;
				}, {});
				state.staircaseLayouts.byStaircaseId = staircases.reduce((acc, staircase) => {
					acc[staircase.id] = staircase.layouts;
					return acc;
				}, {});

				const apartments = staircases.flatMap((staircase) => staircase.apartments);
				state.apartments.items = apartments.map((apartment) => ({
					...apartment,
					rooms: apartment.rooms.map((room) => room.id),
					statuses: apartment.statuses?.map((status) => status.id) || []
				}));
				state.apartments.byId = apartments.reduce((acc, apartment) => {
					acc[apartment.id] = {
						...apartment,
						rooms: apartment.rooms.map((room) => room.id),
						statuses: apartment.statuses?.map((status) => status.id) || []
					};
					return acc;
				}, {});
				state.apartments.byStaircaseId = staircases.reduce((acc, staircase) => {
					acc[staircase.id] = staircase.apartments;
					return acc;
				}, {});

				const apartmentStatuses = apartments.flatMap((apartment) => apartment.statuses).filter((status) => status);
				state.apartmentStatuses.items = apartmentStatuses ?? [];
				state.apartmentStatuses.byId = state.apartmentStatuses.items.reduce((acc, status) => {
					acc[status.id] = status;
					return acc;
				}, {});
				state.apartmentStatuses.byApartmentId = apartments.reduce((acc, apartment) => {
					acc[apartment.id] = apartment.statuses?.map((status) => state.apartmentStatuses.byId[status.id]) || [];
					return acc;
				}, {});

				const rooms = apartments.flatMap((apartment) => apartment.rooms);
				state.rooms.items = rooms.map((room) => ({
					...room,
					statuses: room.statuses.map((status) => status.id)
				}));
				state.rooms.byId = rooms.reduce((acc, room) => {
					acc[room.id] = {
						...room,
						statuses: room.statuses.map((status) => status.id)
					};
					return acc;
				}, {});
				state.rooms.byApartmentId = apartments.reduce((acc, apartment) => {
					acc[apartment.id] = apartment.rooms;
					return acc;
				}, {});
				state.rooms.byStaircaseId = staircases.reduce((acc, staircase) => {
					acc[staircase.id] = staircase.apartments.flatMap((apartment) => apartment.rooms);
					return acc;
				}, {});

				const roomStatuses = rooms.flatMap((room) => room.statuses).filter((status) => status);
				state.roomStatuses.items = roomStatuses ?? [];
				state.roomStatuses.byId = state.roomStatuses.items.reduce((acc, status) => {
					acc[status.id] = status;
					return acc;
				}, {});
				state.roomStatuses.byRoomId = rooms.reduce((acc, room) => {
					acc[room.id] = room.statuses?.map((status) => state.roomStatuses.byId[status.id]) || [];
					return acc;
				}, {});

				const tickets = [...roomStatuses.flatMap((roomStatus) => roomStatus.tickets).filter((ticket) => ticket), ...apartmentStatuses.flatMap((apartmentStatus) => apartmentStatus.tickets).filter((ticket) => ticket)];
				// console.log(
				// 	'fetchProjectRooms awefawefwefwfe:',
				// 	roomStatuses.flatMap((roomStatus) => roomStatus.tickets).filter((ticket) => ticket)
				// );
				state.tickets.items = tickets;
				state.tickets.byId = tickets.reduce((acc, ticket) => {
					acc[ticket.id] = ticket;
					return acc;
				}, {});
				state.tickets.byRoomId = rooms.reduce((acc, room) => {
					acc[room.id] = room.statuses.flatMap((status) => status.tickets);
					return acc;
				}, {});
				state.tickets.byRoomStatusId = state.roomStatuses?.items.reduce((acc, status) => {
					acc[status.id] = status.tickets;
					return acc;
				}, {});
				state.tickets.byApartmentId = apartments.reduce((acc, apartment) => {
					acc[apartment.id] = apartment.statuses?.flatMap((status) => status.tickets).filter((ticket) => ticket) || [];
					return acc;
				});
				state.tickets.byApartmentStatusId = state.apartmentStatuses?.items.reduce((acc, status) => {
					acc[status.id] = status.tickets || [];
					return acc;
				}, {});

				// console.log('fetchProjectRooms staircases:', state.staircases.items);
				// console.log('fetchProjectRooms staircases byId:', state.staircases.byId);

				// console.log('fetchProjectRooms layouts:', state.staircaseLayouts.items);
				// console.log('fetchProjectRooms layouts byId:', state.staircaseLayouts.byId);
				// console.log('fetchProjectRooms layouts byStaircaseId:', state.staircaseLayouts.byStaircaseId);

				// console.log('fetchProjectRooms apartments:', state.apartments.items);
				// console.log('fetchProjectRooms apartments byId:', state.apartments.byId);
				// console.log('fetchProjectRooms apartments byStaircaseId:', state.apartments.byStaircaseId);

				// console.log('fetchProjectRooms apartmentStatuses:', state.apartmentStatuses.items);
				// console.log('fetchProjectRooms apartmentStatuses byId:', state.apartmentStatuses.byId);
				// console.log('fetchProjectRooms apartmentStatuses byApartmentId:', state.apartmentStatuses.byApartmentId);

				// console.log('fetchProjectRooms rooms:', state.rooms.items);
				// console.log('fetchProjectRooms rooms byId:', state.rooms.byId);
				// console.log('fetchProjectRooms rooms byApartmentId:', state.rooms.byApartmentId);
				// console.log('fetchProjectRooms rooms byStaircaseId:', state.rooms.byStaircaseId);

				// console.log('fetchProjectRooms roomStatuses:', state.roomStatuses.items);
				// console.log('fetchProjectRooms roomStatuses byId:', state.roomStatuses.byId);
				// console.log('fetchProjectRooms roomStatuses byRoomId:', state.roomStatuses.byRoomId);

				// console.log('fetchProjectRooms tickets:', state.tickets.items);
				// console.log('fetchProjectRooms tickets byId:', state.tickets.byId);
				// console.log('fetchProjectRooms tickets byApartmentId:', state.tickets.byApartmentId);
				// console.log('fetchProjectRooms tickets byApartmentStatusId:', state.tickets.byApartmentStatusId);
				// console.log('fetchProjectRooms tickets byRoomId:', state.tickets.byRoomId);
				// console.log('fetchProjectRooms tickets byRoomStatusId:', state.tickets.byRoomStatusId);

				state.status.fetchRooms = 'succeeded';
			})
			.addCase(fetchProjectRooms.rejected, (state, action) => {
				state.error.fetchRooms = action.error.message;
				state.status.fetchRooms = 'failed';
			});
	}
});

export const { updateCurrentProjectRoomTickets, updateCurrentProjectApartmentTickets, addRoomStatusToCurrentProject, updateRoomStatusInCurrentProject, deleteRoomStatusInCurrentProject, updateStaircaseInCurrentProject, updateStaircaseLayoutInCurrentProject, addApartmentStatusToCurrentProject, updateApartmentStatusInCurrentProject, deleteApartmentStatusInCurrentProject } = currentProjectSlice.actions;

export default currentProjectSlice.reducer;
