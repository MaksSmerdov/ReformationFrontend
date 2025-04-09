import { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { startSavingElement, finishSavingElement, failSavingElement } from '@slices/facades/elementsSlice';
import { fetchTicket as fetchElementTicket, createTicket as createElementTicket, deleteTicket as deleteElementTicket } from '@slices/tickets/elementTicketsSlice';
import { createElementStatus } from '@slices/statuses/elementStatusesSlice';

import { uploadTicketFiles } from '@slices/tickets/ticketFilesSlice';

import { useTranslation } from 'react-i18next';
import { useNotification } from '@contexts/application/NotificationContext';
import { useFacadeViewPage } from '@contexts/facades_view/FacadeViewPageContext';
import StatusDuplicateModal from '@components/project/rooms/modals/StatusDuplicateModal';

const FPSMContext = createContext();

export const FPSMProvider = ({ children }) => {
	const dispatch = useDispatch();
	const elementsById = useSelector((state) => state.elements.byId);
	const elementStatuses_byElementId = useSelector((state) => state.elementStatuses.byElementId);
	const currentUser = JSON.parse(localStorage.getItem('user'));
	const { t } = useTranslation('translation', { keyPrefix: 'components.project.elements.fpsm' });
	const { addNotification } = useNotification();
	const { selectedElementIds, setSelectedElementIds, selectedStatus } = useFacadeViewPage();
	const [isCreateTicketWithStatus, setIsCreateTicketWithStatus] = useState(false);

	// State variables
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
	const [ticketTeams, setTicketTeams] = useState([]);

	const [elementsWithExistingStatus, setElementsWithExistingStatus] = useState([]);
	const [actionOption, setActionOption] = useState(null);
	const [showActionModal, setShowActionModal] = useState(false);

	const createTicketData = (statusId) => ({
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
		element_statuses: [{ id: statusId }],
		teams: ticketTeams.map((teamObject) => ({
			team: teamObject.team,
			users: teamObject.users.filter((userObject) => userObject.isSelected && userObject.user.id != null && userObject.team_role && userObject.specialization_id),
			equipments: teamObject.equipments.filter((equipmentObject) => equipmentObject.isSelected && equipmentObject.equipment.id != null)
		}))
	});

	const createNewTicket = async (id, statusId) => {
		const ticketData = createTicketData(statusId);

		const ticket = await dispatch(createElementTicket({ elementId: id, ticket: ticketData })).unwrap();

		if (files.length > 0) {
			const formData = new FormData();
			files.forEach((file) => {
				formData.append('files[]', file.file);
			});
			await dispatch(uploadTicketFiles({ ticketId: ticket.id, formData }));
			dispatch(fetchElementTicket({ elementId: id, ticketId: ticket.id }));
		}
	};

	const handleAssignClick = useCallback(async () => {
		let createdStatusesCount = 0;
		let existingStatusesCount = 0;
		let createdTicketsCount = 0;
		const idsWithExistingStatusTemp = [];

		selectedElementIds.forEach((id) => {
			dispatch(startSavingElement(id));
		});

		for (const id of selectedElementIds) {
			try {
				const statuses = elementStatuses_byElementId[id];

				const existingStatus = statuses.find((status) => status.status_id === selectedStatus);
				if (!existingStatus) {
					const newStatus = await dispatch(createElementStatus({ elementId: id, status: { element_id: id, status_id: selectedStatus } })).unwrap();
					createdStatusesCount++;
				} else {
					existingStatusesCount++;
					idsWithExistingStatusTemp.push(id);
				}

				dispatch(finishSavingElement(id));
			} catch (error) {
				console.error('Failed to save data:', error);
				dispatch(failSavingElement(id));
			}
		}

		if (idsWithExistingStatusTemp.length > 0) {
			setElementsWithExistingStatus(idsWithExistingStatusTemp);
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
			setSelectedElementIds([]);
		}
	}, [dispatch, selectedStatus, selectedElementIds]);

	const createTicketsForExistingStatuses = async (deleteOldTickets) => {
		let createdTicketsCount = 0;

		const idsWithExistingStatus = elementsWithExistingStatus;
		const statuses_byEntityId = elementStatuses_byElementId;

		for (const id of idsWithExistingStatus) {
			try {
				if (deleteOldTickets) {
					const statuses = statuses_byEntityId[id];
					const existingStatus = statuses.find((status) => status.status_id === selectedStatus);
					if (existingStatus) {
						const tickets = existingStatus.tickets;
						for (const ticket of tickets) {
							await dispatch(deleteElementTicket({ elementId: id, ticketId: ticket.id }));
						}
					}
				}

				const statuses = statuses_byEntityId[id];
				const existingStatus = statuses.find((status) => status.status_id === selectedStatus);
				if (existingStatus) {
					await createNewTicket(id, existingStatus.id);
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
					existingStatusesCount: elementsWithExistingStatus.length,
					createdTicketsCount: 0
				}),
				'success'
			);
		} else if (option === 2) {
			// TEMPORARY: Uncomment when the function is ready
			// await createTicketsForExistingStatuses(false);
		} else if (option === 3) {
			// TEMPORARY: Uncomment when the function is ready
			// await createTicketsForExistingStatuses(true);
		}

		setSelectedElementIds([]);
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
		<FPSMContext.Provider value={{ title, setTitle, content, setContent, messageClients, setMessageClients, criticality, setCriticality, dateStart, setDateStart, timeStart, setTimeStart, dateEnd, setDateEnd, timeEnd, setTimeEnd, deadline, setDeadline, sellerPromise, setSellerPromise, readiness, setReadiness, tt, setTt, ata, setAta, tja, setTja, tta, setTta, userIds, setUserIds, statusType, setStatusType, files, setFiles, isCreateTicketWithStatus, setIsCreateTicketWithStatus, weekEstimate, setWeekEstimate, hourEstimate, setHourEstimate, authorId, setAuthorId, handleAssignClick, getDeadlineAttributes, getBorderColorClass, ticketTeams, setTicketTeams }}>
			{children}
			<StatusDuplicateModal show={showActionModal} onHide={() => setShowActionModal(false)} onSelectOption={handleSelectOption} />
		</FPSMContext.Provider>
	);
};

export const useFPSM = () => useContext(FPSMContext);
