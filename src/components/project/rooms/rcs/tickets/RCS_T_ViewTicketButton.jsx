import React, { useState, useCallback, useRef, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { OverlayTrigger, Popover, Button, Spinner } from 'react-bootstrap';
import TF_FormEdit from '@components/project/rooms/tf/TF_FormEdit';
import { fetchTicket, updateTicket, deleteTicket } from '@slices/tickets/roomTicketsSlice';
import { ChatDots } from 'react-bootstrap-icons';

const RCS_T_ViewTicketButton = ({ ticketId, roomId }) => {
	const [showTicketTooltip, setShowTicketTooltip] = useState(false);
	const ticketTooltipTarget = useRef(null);
	const dispatch = useDispatch();
	const ticket = useSelector((state) => state.roomTickets.byId[ticketId]);
	const fetchStatus = useSelector((state) => state.roomTickets.status.fetch[ticketId]);

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
			dispatch(fetchTicket({ roomId, ticketId }));
		}
	}, [showTicketTooltip, ticket, fetchStatus, dispatch, roomId, ticketId]);

	const handleSave = useCallback(
		(updatedTicket) => {
			dispatch(updateTicket({ roomId, ticket: updatedTicket }));
			setShowTicketTooltip(false);
		},
		[dispatch, roomId]
	);

	const handleDelete = useCallback(() => {
		dispatch(deleteTicket({ roomId, ticketId }));
		setShowTicketTooltip(false);
	}, [dispatch, roomId, ticketId]);

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

export default React.memo(RCS_T_ViewTicketButton);
