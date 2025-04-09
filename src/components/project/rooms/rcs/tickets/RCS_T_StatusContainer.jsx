import React, { useMemo } from 'react';
import { ListGroup, Spinner } from 'react-bootstrap';
import StatusInfoTooltipButton from '@components/project/rooms/statuses/StatusInfoTooltipButton';
import RCS_T_TicketRow from '@components/project/rooms/rcs/tickets/RCS_T_TicketRow';
import { useSelector } from 'react-redux';
import RCS_T_CreateTicketButton from '@components/project/rooms/rcs/tickets/RCS_T_CreateTicketButton';
import { useRoomCell } from '@contexts/rooms_project/cell_system/RoomCellContext';

const RCS_T_StatusContainer = ({ statusObject }) => {
	const roomId = useRoomCell();
	// console.log('RCS_T_StatusContainer', statusObject);
	const tickets = statusObject.tickets;
	const roomStatusId = tickets[0].room_statuses[0].id;

	const ticketItems = useMemo(() => {
		return tickets ? tickets.map((ticket) => <RCS_T_TicketRow key={ticket.id} ticket={ticket} roomId={roomId} />) : null;
	}, [tickets, roomId]);

	return (
		<>
			<ListGroup.Item variant="secondary" className="p-1px d-flex flex-row gap-1 align-items-center" style={{ borderWidth: '0 0 1px 0' }}>
				<StatusInfoTooltipButton statusId={statusObject.status.id} className="wh-resize-button" />
				<div className="h-100 border-bottom flex-grow-1 nowrap text-truncate pe-auto text-center align-content-center" title={statusObject.status.title}>
					{statusObject.status.title}
				</div>
				<RCS_T_CreateTicketButton roomId={roomId} roomStatusId={roomStatusId} />
			</ListGroup.Item>
			{ticketItems}
		</>
	);
};

export default React.memo(RCS_T_StatusContainer);
