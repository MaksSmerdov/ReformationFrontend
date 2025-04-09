import React, { useMemo } from 'react';
import { useSelector } from 'react-redux';
import RCS_T_TooltipButton from '@components/project/rooms/rcs/tickets/RCS_T_TooltipButton';
import { useRoomsProject } from '@contexts/rooms_project/RoomsProjectContext';
import { useRoomCell } from '@contexts/rooms_project/cell_system/RoomCellContext';

const RCS_TicketsBottomContainer = ({ sortParameter = 'datetime_end', sortOrder = 'asc' }) => {
	const roomId = useRoomCell();
	const { openStatusGroups } = useRoomsProject();

	const roomStatuses = useSelector((state) => state.currentProject.roomStatuses.byRoomId[roomId]);
	const tickets = useSelector((state) => state.currentProject.tickets.byRoomId[roomId]);
	const statusesById = useSelector((state) => state.currentProject.statuses.byId);

	const filteredGroupedStatuses = useMemo(() => {
		if (!roomStatuses || !tickets) return [];

		const statusGroups = {};

		// Группировка тикетов по статусам
		tickets.forEach((ticket) => {
			ticket.room_statuses.forEach((roomStatus) => {
				const status = statusesById[roomStatus.status_id];
				if (!status) return;

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

		// Фильтрация и сортировка статус-групп
		const filteredStatuses = Object.keys(statusGroups)
			.filter((statusGroupId) => openStatusGroups.includes(parseInt(statusGroupId)))
			.reduce((acc, statusGroupId) => {
				const statuses = Object.values(statusGroups[statusGroupId]);
				const remainingStatuses = statuses.filter((status) => status.status.index_ingroup !== Math.max(...statuses.map((s) => s.status.index_ingroup)));
				if (remainingStatuses.length > 0) {
					acc[statusGroupId] = remainingStatuses;
				}
				return acc;
			}, {});

		// Сортировка статус-групп по приоритету
		const groupedStatusArray = Object.keys(filteredStatuses).map((statusGroupId) => ({
			statusGroupId,
			groupStatuses: filteredStatuses[statusGroupId]
		}));

		const sortedGroupedStatusArray = groupedStatusArray
			.sort((a, b) => {
				if (parseInt(a.statusGroupId) === 1) return -1;
				if (parseInt(b.statusGroupId) === 1) return 1;
				return 0;
			})
			.slice(0, 3);

		return sortedGroupedStatusArray;
	}, [roomStatuses, tickets, statusesById, openStatusGroups]);

	const earliestTicket = useMemo(() => {
		return filteredGroupedStatuses.map((group) => {
			const highestIndex = group.groupStatuses.reduce((selected, current) => {
				const currentIndex = current.status.index_ingroup;
				if (!selected || currentIndex > selected.index) {
					return { ...current, index: currentIndex };
				}
				return selected;
			}, null);
			return { ...group, earliestTicket: highestIndex };
		});
	}, [filteredGroupedStatuses]);

	return <>{earliestTicket.length == 0 ? <div className="wh-resize-button"></div> : earliestTicket.map((statusGroup) => <RCS_T_TooltipButton key={statusGroup.statusGroupId} groupStatuses={{ [statusGroup.statusGroupId]: statusGroup.groupStatuses }} showStatusId={statusGroup.earliestTicket.status.id} />)}</>;
};

export default React.memo(RCS_TicketsBottomContainer);
