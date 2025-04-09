import React from 'react';
import { ListGroup } from 'react-bootstrap';
import ACS_T_ViewTicketButton from '@components/project/rooms/acs/tickets/ACS_T_ViewTicketButton';
import { useApartmentCell } from '@contexts/rooms_project/cell_system/ApartmentCellContext';

const ACS_T_TicketRow = ({ ticket, apartmentId }) => {
	return (
		<ListGroup.Item className="p-1px">
			<div className="d-flex gap-1px justify-content-between align-items-center">
				<div className="lh-1">
					<div>{ticket.title}</div>
					<div>{ticket.deadline && new Date(ticket.deadline).toLocaleDateString()}</div>
				</div>
				<ACS_T_ViewTicketButton ticketId={ticket.id} apartmentId={apartmentId} />
			</div>
		</ListGroup.Item>
	);
};

export default React.memo(ACS_T_TicketRow);
