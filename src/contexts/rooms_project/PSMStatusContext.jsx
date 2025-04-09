import { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { startSavingApartment, finishSavingApartment, failSavingApartment } from '@slices/rooms/apartmentsSlice';
import { fetchTicket as fetchApartmentTicket, createTicket as createApartmentTicket, deleteTicket as deleteApartmentTicket } from '@slices/tickets/apartmentTicketsSlice';
import { createApartmentStatus } from '@slices/statuses/apartmentStatusesSlice';

import { startSavingRoom, finishSavingRoom, failSavingRoom } from '@slices/rooms/roomsSlice';
import { createRoomStatus } from '@slices/statuses/roomStatusesSlice';
import { fetchTicket as fetchRoomTicket, createTicket as createRoomTicket, deleteTicket as deleteRoomTicket } from '@slices/tickets/roomTicketsSlice';

import { uploadTicketFiles } from '@slices/tickets/ticketFilesSlice';

import { useTranslation } from 'react-i18next';
import { useNotification } from '@contexts/application/NotificationContext';
import { useRoomsProject } from '@contexts/rooms_project/RoomsProjectContext';
import StatusDuplicateModal from '@components/project/rooms/modals/StatusDuplicateModal';
import { fetchProjectRooms } from '@slices/rooms/currentProjectSlice';

const PSMStatusContext = createContext();

export const PSMStatusProvider = ({ children }) => {
	const dispatch = useDispatch();
	const roomsById = useSelector((state) => state.rooms.byId);
	const roomStatuses_byId = useSelector((state) => state.currentProject.roomStatuses.byId);
	const roomStatuses_byRoomId = useSelector((state) => state.currentProject.roomStatuses.byRoomId);
	const apartmentStatuses_byId = useSelector((state) => state.currentProject.apartmentStatuses.byId);
	const apartmentStatuses_byApartmentId = useSelector((state) => state.currentProject.apartmentStatuses.byApartmentId);
	const currentUser = JSON.parse(localStorage.getItem('user'));
	const { t } = useTranslation('translation', { keyPrefix: 'components.project.rooms.psm' });
	const { addNotification } = useNotification();
	const { selectedRooms, setSelectedRooms, selectedStatus, setSelectedStatus, selectedApartments, setSelectedApartments, switchStaircaseDrawMode } = useRoomsProject();

	const [title, setTitle] = useState('');
	const [content, setContent] = useState('');
	const [messageClients, setMessageClients] = useState('');
	const [criticality, setCriticality] = useState(0);
	const [dateStart, setDateStart] = useState(() => {
		const now = new Date();
		const offset = now.getTimezoneOffset() * 60000;
		const localTime = new Date(now.getTime() - offset);
		return localTime.toISOString().slice(0, 10);
	});
	const [timeStart, setTimeStart] = useState(() => {
		const now = new Date();
		now.setHours(7, 0, 0, 0);
		const offset = now.getTimezoneOffset() * 60000;
		const localTime = new Date(now.getTime() - offset);
		return localTime.toISOString().slice(11, 16);
	});
	const [dateEnd, setDateEnd] = useState(() => {
		const now = new Date();
		const offset = now.getTimezoneOffset() * 60000;
		const localTime = new Date(now.getTime() - offset);
		return localTime.toISOString().slice(0, 10);
	});
	const [timeEnd, setTimeEnd] = useState(() => {
		const now = new Date();
		now.setHours(18, 0, 0, 0);
		const offset = now.getTimezoneOffset() * 60000;
		const localTime = new Date(now.getTime() - offset);
		return localTime.toISOString().slice(11, 16);
	});
	const [deadline, setDeadline] = useState(() => {
		const now = new Date();
		const offset = now.getTimezoneOffset() * 60000;
		return new Date(now - offset).toISOString().slice(0, 10);
	});
	const [sellerPromise, setSellerPromise] = useState('');
	const [readiness, setReadiness] = useState(0);
	const [tt, setTt] = useState(0);
	const [ata, setAta] = useState(0);
	const [tja, setTja] = useState(0);
	const [tta, setTta] = useState(0);
	const [weekEstimate, setWeekEstimate] = useState(0);
	const [hourEstimate, setHourEstimate] = useState(0);
	const [authorId, setAuthorId] = useState(currentUser.id);
	const [userIds, setUserIds] = useState([]);
	const [statusType, setStatusType] = useState(null);
	const [files, setFiles] = useState([]);
	const [isCreateTicketWithStatus, setIsCreateTicketWithStatus] = useState(true);
	const [ticketTeams, setTicketTeams] = useState([]);

	const [roomsWithExistingStatus, setRoomsWithExistingStatus] = useState([]);
	const [apartmentsWithExistingStatus, setApartmentsWithExistingStatus] = useState([]);
	const [actionOption, setActionOption] = useState(null);
	const [showActionModal, setShowActionModal] = useState(false);

	const handleStatusSelect = useCallback((statusId) => {
		setSelectedStatus(statusId);
	}, []);

	const createTicketData = (statusId, isRoom) => ({
		title,
		content,
		message_clients: messageClients,
		criticality,
		datetime_start: `${dateStart} ${timeStart}`,
		datetime_end: `${dateEnd} ${timeEnd}`,
		deadline,
		seller_promise: sellerPromise,
		readiness,
		tt,
		ata,
		tja,
		tta,
		week_estimate: weekEstimate,
		hour_estimate: hourEstimate,
		author: { id: authorId },
		users: userIds.map((id) => ({ id })),
		ticket_status: { id: 1 },
		[isRoom ? 'room_statuses' : 'apartment_statuses']: [{ id: statusId }],
		teams: ticketTeams.map((teamObject) => ({
			team: teamObject.team,
			users: teamObject.users.filter((userObject) => userObject.isSelected && userObject.user.id != null && userObject.team_role && userObject.specialization_id),
			equipments: teamObject.equipments.filter((equipmentObject) => equipmentObject.isSelected && equipmentObject.equipment.id != null)
		}))
	});

	const createNewTicket = async (id, statusId, isRoom) => {
		const ticketData = createTicketData(statusId, isRoom);

		// console.log('PSMStatusProvider', 'createNewTicket', 'ticketData', ticketData);
		const ticket = await dispatch(isRoom ? createRoomTicket({ roomId: id, ticket: ticketData }) : createApartmentTicket({ apartmentId: id, ticket: ticketData })).unwrap();

		if (files.length > 0) {
			const formData = new FormData();
			files.forEach((file) => {
				formData.append('files[]', file.file);
			});
			await dispatch(uploadTicketFiles({ ticketId: ticket.id, formData }));
			dispatch(isRoom ? fetchRoomTicket({ roomId: id, ticketId: ticket.id }) : fetchApartmentTicket({ apartmentId: id, ticketId: ticket.id }));
		}
	};

	const handleAssignClick = useCallback(async () => {
		let createdStatusesCount = 0;
		let existingStatusesCount = 0;
		let createdTicketsCount = 0;
		const idsWithExistingStatusTemp = [];

		const selectedIds = switchStaircaseDrawMode ? selectedApartments : selectedRooms;
		const statuses_byId = switchStaircaseDrawMode ? apartmentStatuses_byId : roomStatuses_byId;
		const statuses_byEntityId = switchStaircaseDrawMode ? apartmentStatuses_byApartmentId : roomStatuses_byRoomId;

		selectedIds.forEach((id) => {
			switchStaircaseDrawMode ? dispatch(startSavingApartment(id)) : dispatch(startSavingRoom(id));
		});

		for (const id of selectedIds) {
			try {
				const statuses = statuses_byEntityId[id];

				const existingStatus = statuses.find((status) => status.status_id === selectedStatus);
				let statusId;
				var createTicket = true;

				if (!existingStatus) {
					const newStatus = await dispatch(switchStaircaseDrawMode ? createApartmentStatus({ apartmentId: id, status: { apartment_id: id, status_id: selectedStatus } }) : createRoomStatus({ roomId: id, status: { room_id: id, status_id: selectedStatus } })).unwrap();
					// console.log('PSMStatusProvider', 'handleAssignClick', 'newStatus', newStatus);
					statusId = newStatus.id;
					createdStatusesCount++;
				} else {
					statusId = existingStatus.id;
					existingStatusesCount++;
					idsWithExistingStatusTemp.push(id);
					createTicket = false;
				}

				if (createTicket && isCreateTicketWithStatus) {
					await createNewTicket(id, statusId, !switchStaircaseDrawMode);
					createdTicketsCount++;
				}

				switchStaircaseDrawMode ? dispatch(finishSavingApartment(id)) : dispatch(finishSavingRoom(id));
			} catch (error) {
				console.error('Failed to save data:', error);
				switchStaircaseDrawMode ? dispatch(failSavingApartment(id)) : dispatch(failSavingRoom(id));
			}
		}

		if (idsWithExistingStatusTemp.length > 0) {
			switchStaircaseDrawMode ? setApartmentsWithExistingStatus(idsWithExistingStatusTemp) : setRoomsWithExistingStatus(idsWithExistingStatusTemp);
			setShowActionModal(true);
		} else {
			addNotification(
				t('Messages.assign_summary', {
					createdStatusesCount,
					existingStatusesCount,
					createdTicketsCount
				}),
				'success'
			);
			switchStaircaseDrawMode ? setSelectedApartments([]) : setSelectedRooms([]);
		}
	}, [dispatch, selectedStatus, title, content, messageClients, criticality, dateStart, timeStart, dateEnd, timeEnd, deadline, sellerPromise, readiness, tt, ata, tja, tta, userIds, files, isCreateTicketWithStatus, weekEstimate, hourEstimate, authorId, currentUser.id, t, addNotification, setSelectedRooms, setSelectedApartments, roomStatuses_byRoomId, apartmentStatuses_byApartmentId, selectedRooms, selectedApartments, switchStaircaseDrawMode]);

	const createTicketsForExistingStatuses = async (deleteOldTickets) => {
		let createdTicketsCount = 0;

		const idsWithExistingStatus = switchStaircaseDrawMode ? apartmentsWithExistingStatus : roomsWithExistingStatus;
		const statuses_byEntityId = switchStaircaseDrawMode ? apartmentStatuses_byApartmentId : roomStatuses_byRoomId;

		for (const id of idsWithExistingStatus) {
			try {
				if (deleteOldTickets) {
					const statuses = statuses_byEntityId[id];
					const existingStatus = statuses.find((status) => status.status_id === selectedStatus);
					if (existingStatus) {
						const tickets = existingStatus.tickets;
						for (const ticket of tickets) {
							await dispatch(switchStaircaseDrawMode ? deleteApartmentTicket({ apartmentId: id, ticketId: ticket.id }) : deleteRoomTicket({ roomId: id, ticketId: ticket.id }));
						}
					}
				}

				const statuses = statuses_byEntityId[id];
				const existingStatus = statuses.find((status) => status.status_id === selectedStatus);
				if (existingStatus) {
					await createNewTicket(id, existingStatus.id, !switchStaircaseDrawMode);
					createdTicketsCount++;
				}
			} catch (error) {
				console.error('Failed to create new tickets:', error);
			}
		}

		addNotification(
			t('Messages.assign_summary', {
				createdStatusesCount: 0,
				existingStatusesCount: idsWithExistingStatus.length,
				createdTicketsCount
			}),
			'success'
		);
	};

	const getDeadlineAttributes = () => {
		return {
			min: statusType === 'type1' ? new Date().toISOString().slice(0, 10) : undefined,
			max: statusType === 'type2' ? new Date().toISOString().slice(0, 10) : undefined
		};
	};

	const getBorderColorClass = () => {
		switch (statusType) {
			case 'type1':
				return 'border-color-type1';
			case 'type2':
				return 'border-color-type2';
			default:
				return 'border-color-type-black';
		}
	};

	const handleSelectOption = async (option) => {
		setActionOption(option);
		setShowActionModal(false);

		if (option === 1) {
			addNotification(
				t('Messages.assign_summary', {
					createdStatusesCount: 0,
					existingStatusesCount: switchStaircaseDrawMode ? apartmentsWithExistingStatus.length : roomsWithExistingStatus.length,
					createdTicketsCount: 0
				}),
				'success'
			);
		} else if (option === 2) {
			await createTicketsForExistingStatuses(false);
		} else if (option === 3) {
			await createTicketsForExistingStatuses(true);
		}

		switchStaircaseDrawMode ? setSelectedApartments([]) : setSelectedRooms([]);
	};

	useEffect(() => {
		const now = new Date().toISOString().slice(0, 10);
		if (statusType === 'type2' && deadline > now) {
			setDeadline(now);
		} else if (statusType === 'type1' && deadline < now) {
			setDeadline(now);
		}
	}, [statusType, deadline]);

	return (
		<PSMStatusContext.Provider value={{ title, setTitle, content, setContent, messageClients, setMessageClients, criticality, setCriticality, dateStart, setDateStart, timeStart, setTimeStart, dateEnd, setDateEnd, timeEnd, setTimeEnd, deadline, setDeadline, sellerPromise, setSellerPromise, readiness, setReadiness, tt, setTt, ata, setAta, tja, setTja, tta, setTta, userIds, setUserIds, statusType, setStatusType, files, setFiles, isCreateTicketWithStatus, setIsCreateTicketWithStatus, weekEstimate, setWeekEstimate, hourEstimate, setHourEstimate, authorId, setAuthorId, handleStatusSelect, handleAssignClick, getDeadlineAttributes, getBorderColorClass, ticketTeams, setTicketTeams }}>
			{children}
			<StatusDuplicateModal show={showActionModal} onHide={() => setShowActionModal(false)} onSelectOption={handleSelectOption} />
		</PSMStatusContext.Provider>
	);
};

export const usePSMStatus = () => useContext(PSMStatusContext);
