import { configureStore } from '@reduxjs/toolkit';

// Core
import authReducer from '@slices/core/authSlice';
import themeReducer from '@slices/local/themeSlice';

// Projects
import projectsReducer from '@slices/projects/projectsSlice';
import currentProjectReducer from '@slices/rooms/currentProjectSlice';
import projectTypesReducer from '@slices/projects/projectTypesSlice';
import statusesReducer from '@slices/projects/statusesSlice';
import statusGroupsReducer from '@slices/projects/statusGroupsSlice';

// Users
import usersReducer from '@slices/users/usersSlice';
import rolesReducer from '@slices/users/rolesSlice';
import permissionsReducer from '@slices/users/permissionsSlice';

// Rooms
import staircasesReducer from '@slices/rooms/staircasesSlice';
import apartmentsReducer from '@slices/rooms/apartmentsSlice';
import staircaseLayoutsReducer from '@slices/rooms/staircaseLayoutsSlice';
import roomsReducer from '@slices/rooms/roomsSlice';

// Statuses
import roomStatusesReducer from '@slices/statuses/roomStatusesSlice';
import apartmentStatusesReducer from '@slices/statuses/apartmentStatusesSlice';
import elementStatusesReducer from '@slices/statuses/elementStatusesSlice';

// Tickets
import roomTicketsReducer from '@slices/tickets/roomTicketsSlice';
import apartmentTicketsReducer from '@slices/tickets/apartmentTicketsSlice';
import elementTicketsReducer from '@slices/tickets/elementTicketsSlice';

// Teams
import teamsReducer from '@slices/teams/teamsSlice';
import specializationsReducer from '@slices/teams/specializationsSlice';
import equipmentsReducer from '@slices/teams/equipmentsSlice';

// Facades
import groupFacadesReducer from '@slices/facades/groupFacadesSlice';
import facadesReducer from '@slices/facades/facadesSlice';
import elementsReducer from '@slices/facades/elementsSlice';
import guidesReducer from '@slices/facades/guidesSlice';
import elementGroupsReducer from '@slices/facades/elementGroupsSlice';
import elementGroupsAdditionalReducer from '@slices/facades/elementGroupsAdditionalSlice';
import elementOrdersSlice from '@slices/facades/elementOrdersSlice';
import elementTypesReducer from '@slices/facades/elementTypesSlice';

const isDevelopment = import.meta.env.MODE === 'development';

const store = configureStore({
	reducer: {
		auth: authReducer,
		theme: themeReducer,
		projects: projectsReducer,
		currentProject: currentProjectReducer,
		projectTypes: projectTypesReducer,
		statuses: statusesReducer,
		statusGroups: statusGroupsReducer,
		users: usersReducer,
		roles: rolesReducer,
		permissions: permissionsReducer,
		staircases: staircasesReducer,
		staircaseLayouts: staircaseLayoutsReducer,
		apartments: apartmentsReducer,
		rooms: roomsReducer,
		roomStatuses: roomStatusesReducer,
		roomTickets: roomTicketsReducer,
		teams: teamsReducer,
		specializations: specializationsReducer,
		equipments: equipmentsReducer,
		apartmentTickets: apartmentTicketsReducer,
		apartmentStatuses: apartmentStatusesReducer,
		groupFacades: groupFacadesReducer,
		facades: facadesReducer,
		elements: elementsReducer,
		elementStatuses: elementStatusesReducer,
		elementTickets: elementTicketsReducer,
		guides: guidesReducer,
		elementGroups: elementGroupsReducer,
		elementGroupsAdditional: elementGroupsAdditionalReducer,
		elementTypes: elementTypesReducer,
		elementOrders: elementOrdersSlice,
	},
	middleware: (getDefaultMiddleware) =>
		getDefaultMiddleware({
			serializableCheck: isDevelopment ? false : true
		})
});

export default store;
