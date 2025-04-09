import React, { useState, useCallback, useRef, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { OverlayTrigger, Popover, Button, Spinner } from 'react-bootstrap';
import TF_FormEdit from '@components/project/rooms/tf/TF_FormEdit';
import { fetchTicket, updateTicket, deleteTicket } from '@slices/tickets/apartmentTicketsSlice';
import { ChatDots } from 'react-bootstrap-icons';

const ACS_T_ViewTicketButton = ({ ticketId, apartmentId }) => {
	const [showTicketTooltip, setShowTicketTooltip] = useState(false);
	const ticketTooltipTarget = useRef(null);
	const dispatch = useDispatch();
	const ticket = useSelector((state) => state.apartmentTickets.byId[ticketId]);
	const fetchStatus = useSelector((state) => state.apartmentTickets.status.fetch[ticketId]);

	const handleTicketTooltipClick = useCallback(
		(e) => {
			e.preventDefault();
			e.stopPropagation();
			setShowTicketTooltip(!showTicketTooltip);
		},
		[showTicketTooltip]
	);

	useEffect(() => {
		if (showTicketTooltip && !ticket && fetchStatus !== 'loading') {
			dispatch(fetchTicket({ apartmentId, ticketId }));
		}
	}, [showTicketTooltip, ticket, fetchStatus, dispatch, apartmentId, ticketId]);

	const handleSave = useCallback(
		(updatedTicket) => {
			dispatch(updateTicket({ apartmentId, ticket: updatedTicket }));
			// setShowTicketTooltip(false);
		},
		[dispatch, apartmentId]
	);

	const handleDelete = useCallback(() => {
		dispatch(deleteTicket({ apartmentId, ticketId }));
		setShowTicketTooltip(false);
	}, [dispatch, apartmentId, ticketId]);

	return (
		<OverlayTrigger
			trigger="click"
			placement="bottom"
			show={showTicketTooltip}
			overlay={
				<Popover id={`ticket-popover-${ticketId}`} ref={ticketTooltipTarget} className="pe-auto max-w-fit-content">
					<Popover.Body className="p-0 overflow-hidden">{fetchStatus === 'loading' ? <Spinner animation="border" /> : <TF_FormEdit ticket={ticket} onSave={handleSave} onDelete={handleDelete} mode="edit" />}</Popover.Body>
				</Popover>
			}
			rootClose={false}>
			<Button variant="outline-primary" className="d-flex p-0 m-0 square-element h-100 wh-resize-button" onClick={handleTicketTooltipClick} ref={ticketTooltipTarget}>
				<ChatDots className="w-100 h-100 p-1" />
			</Button>
		</OverlayTrigger>
	);
};

export default React.memo(ACS_T_ViewTicketButton);
