import React, { useMemo } from 'react';
import { useSelector } from 'react-redux';
import ACS_T_TooltipButton from '@components/project/rooms/acs/tickets/ACS_T_TooltipButton';
import { useRoomsProject } from '@contexts/rooms_project/RoomsProjectContext';
import { useApartmentCell } from '@contexts/rooms_project/cell_system/ApartmentCellContext';

const ACS_TicketsBottomContainer = ({ sortParameter = 'datetime_end', sortOrder = 'asc' }) => {
	const apartmentId = useApartmentCell();
	const { openStatusGroups } = useRoomsProject();

	const apartmentStatuses = useSelector((state) => state.currentProject.apartmentStatuses.byApartmentId[apartmentId]);
	const tickets = useSelector((state) => state.currentProject.tickets.byApartmentId[apartmentId]);
	const statusesById = useSelector((state) => state.currentProject.statuses.byId);

	const filteredGroupedStatuses = useMemo(() => {
		if (!apartmentStatuses || !tickets) return [];

		const statusGroups = {};

		tickets.forEach((ticket) => {
			ticket.apartment_statuses.forEach((apartmentStatus) => {
				const status = statusesById[apartmentStatus.status_id];
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
	}, [apartmentStatuses, tickets, statusesById, openStatusGroups]);

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

	return <>{earliestTicket.length == 0 ? <div className="wh-resize-button"></div> : earliestTicket.map((statusGroup) => <ACS_T_TooltipButton key={statusGroup.statusGroupId} groupStatuses={{ [statusGroup.statusGroupId]: statusGroup.groupStatuses }} showStatusId={statusGroup.earliestTicket.status.id} />)}</>;
};

export default React.memo(ACS_TicketsBottomContainer);
