import React from 'react';
import { ListGroup } from 'react-bootstrap';
import RCS_T_ViewTicketButton from '@components/project/rooms/rcs/tickets/RCS_T_ViewTicketButton';
import { useRoomCell } from '@contexts/rooms_project/cell_system/RoomCellContext';

const RCS_T_TicketRow = ({ ticket, roomId }) => {
	return (
		<ListGroup.Item className="p-1px">
			<div className="d-flex gap-1px justify-content-between align-items-center">
				<div className="lh-1">
					<div>{ticket.title}</div>
					<div>{ticket.deadline && new Date(ticket.deadline).toLocaleDateString()}</div>
				</div>
				<RCS_T_ViewTicketButton ticketId={ticket.id} roomId={roomId} />
			</div>
		</ListGroup.Item>
	);
};

export default React.memo(RCS_T_TicketRow);
