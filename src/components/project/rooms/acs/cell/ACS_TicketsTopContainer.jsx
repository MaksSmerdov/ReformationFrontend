import React, { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { useRoomsProject } from '@contexts/rooms_project/RoomsProjectContext';
import ACS_T_TooltipButton from '@components/project/rooms/acs/tickets/ACS_T_TooltipButton';
import { useApartmentCell } from '@contexts/rooms_project/cell_system/ApartmentCellContext';

const ACS_TicketsTopContainer = ({ sortParameter = 'datetime_end', sortOrder = 'asc' }) => {
	const apartmentId = useApartmentCell();
	const { openStatusGroups } = useRoomsProject();

	const apartmentStatuses = useSelector((state) => state.currentProject.apartmentStatuses.byApartmentId[apartmentId]);
	const tickets = useSelector((state) => state.currentProject.tickets.byApartmentId[apartmentId]);
	const statusesById = useSelector((state) => state.currentProject.statuses.byId);

	const filteredTopStatuses = useMemo(() => {
		if (!apartmentStatuses || !tickets) return {};

		const statusGroups = {};

		tickets.forEach((ticket) => {
			ticket.apartment_statuses.forEach((apartmentStatus) => {
				const status = statusesById[apartmentStatus.status_id];
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

		Object.keys(statusGroups).forEach((groupId) => {
			const statuses = Object.values(statusGroups[groupId]);
			const latestStatus = statuses.reduce((prev, current) => (prev.status.index_ingroup > current.status.index_ingroup ? prev : current), statuses[0]);

			topStatuses[groupId] = [latestStatus];
		});

		return topStatuses;
	}, [apartmentStatuses, tickets, statusesById, openStatusGroups]);

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
					<ACS_T_TooltipButton groupStatuses={filteredTopStatuses} showStatusId={earliestTicket[0][0].status.id} />
					<div className="fw-bold room-cell-show-date" style={{ fontSize: '0.65rem' }}>
						{showDate}
					</div>
				</>
			)}
		</div>
	);
};

export default React.memo(ACS_TicketsTopContainer);
