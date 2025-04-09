import React, { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { useRoomsProject } from '@contexts/rooms_project/RoomsProjectContext';
import RCS_T_TooltipButton from '@components/project/rooms/rcs/tickets/RCS_T_TooltipButton';
import { useRoomCell } from '@contexts/rooms_project/cell_system/RoomCellContext';

const RCS_TicketsTopContainer = ({ sortParameter = 'datetime_end', sortOrder = 'asc' }) => {
	const roomId = useRoomCell();
	const { openStatusGroups } = useRoomsProject();

	// console.log('RCS_TicketsTopContainer', roomId, sortParameter, sortOrder, openStatusGroups);

	const roomStatuses = useSelector((state) => state.currentProject.roomStatuses.byRoomId[roomId]);
	const tickets = useSelector((state) => state.currentProject.tickets.byRoomId[roomId]);
	const statusesById = useSelector((state) => state.currentProject.statuses.byId);

	// console.log('RCS_TicketsTopContainer', roomStatuses, tickets, statusesById);

	const filteredTopStatuses = useMemo(() => {
		if (!roomStatuses || !tickets) return {};

		const statusGroups = {};

		// Группировка тикетов по статусам
		tickets.forEach((ticket) => {
			ticket.room_statuses.forEach((roomStatus) => {
				const status = statusesById[roomStatus.status_id];
				if (!status || !openStatusGroups.includes(status.status_group_id)) return;

				const statusGroupId = status.status_group_id;
				if (!statusGroups[statusGroupId]) {
					statusGroups[statusGroupId] = {};
				}
				if (!statusGroups[statusGroupId][status.id]) {
					statusGroups[statusGroupId][status.id] = {
						status,
						tickets: []
					};
				}
				statusGroups[statusGroupId][status.id].tickets.push(ticket);
			});
		});

		const topStatuses = {};

		// Разделение на topStatuses
		Object.keys(statusGroups).forEach((groupId) => {
			const statuses = Object.values(statusGroups[groupId]);
			const latestStatus = statuses.reduce((prev, current) => (prev.status.index_ingroup > current.status.index_ingroup ? prev : current), statuses[0]);

			topStatuses[groupId] = [latestStatus];
		});

		return topStatuses;
	}, [roomStatuses, tickets, statusesById, openStatusGroups]);

	const earliestTicket = useMemo(() => {
		return Object.values(filteredTopStatuses).reduce((selected, current) => {
			const currentEndTime = new Date(current[0].tickets[0][sortParameter]).getTime();
			if (!selected || selected.length < 1 || (sortOrder === 'asc' && currentEndTime < selected[0].endTime) || (sortOrder === 'desc' && currentEndTime > selected[0].endTime)) {
				return [{ ...current, endTime: currentEndTime }];
			}
			return selected;
		}, null);
	}, [filteredTopStatuses, sortOrder, sortParameter]);

	const showDate = earliestTicket ? new Date(earliestTicket[0][0].tickets[0][sortParameter]).toLocaleDateString('ru-RU') : '';

	return (
		<div className="d-flex flex-row p-0 m-0 gap-1px align-items-center">
			{!earliestTicket ? (
				<div className="wh-resize-button"></div>
			) : (
				<>
					<RCS_T_TooltipButton groupStatuses={filteredTopStatuses} showStatusId={earliestTicket[0][0].status.id} />
					<div className="fw-bold room-cell-show-date" style={{ fontSize: '0.65rem' }}>
						{showDate}
					</div>
				</>
			)}
		</div>
	);
};

export default React.memo(RCS_TicketsTopContainer);
