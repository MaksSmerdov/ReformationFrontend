import React, { useMemo } from 'react';
import { ListGroup, Spinner } from 'react-bootstrap';
import StatusInfoTooltipButton from '@components/project/rooms/statuses/StatusInfoTooltipButton';
import ACS_T_TicketRow from '@components/project/rooms/acs/tickets/ACS_T_TicketRow';
import { useSelector } from 'react-redux';
import ACS_T_CreateTicketButton from '@components/project/rooms/acs/tickets/ACS_T_CreateTicketButton';
import { useApartmentCell } from '@contexts/rooms_project/cell_system/ApartmentCellContext';

const ACS_T_StatusContainer = ({ statusObject }) => {
	const apartmentId = useApartmentCell();
	const tickets = statusObject.tickets;
	const apartmentStatusId = tickets[0].apartment_statuses[0].id;

	const ticketItems = useMemo(() => {
		return tickets ? tickets.map((ticket) => <ACS_T_TicketRow key={ticket.id} ticket={ticket} apartmentId={apartmentId} />) : null;
	}, [tickets, apartmentId]);

	return (
		<>
			<ListGroup.Item variant="secondary" className="p-1px d-flex flex-row gap-1 align-items-center" style={{ borderWidth: '0 0 1px 0' }}>
				<StatusInfoTooltipButton statusId={statusObject.status.id} className="wh-resize-button" />
				<div className="h-100 border-bottom flex-grow-1 nowrap text-truncate pe-auto text-center align-content-center" title={statusObject.status.title}>
					{statusObject.status.title}
				</div>
				<ACS_T_CreateTicketButton apartmentId={apartmentId} apartmentStatusId={apartmentStatusId} />
			</ListGroup.Item>
			{ticketItems}
		</>
	);
};

export default React.memo(ACS_T_StatusContainer);
