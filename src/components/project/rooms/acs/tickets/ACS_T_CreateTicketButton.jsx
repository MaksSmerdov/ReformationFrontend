import React, { useState, useCallback, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { OverlayTrigger, Popover, Button } from 'react-bootstrap';
import TF_FormEdit from '@components/project/rooms/tf/TF_FormEdit';
import { createTicket } from '@slices/tickets/apartmentTicketsSlice';
import { ChatLeftDotsFill } from 'react-bootstrap-icons';
import IconButton from '@components/common/icon/IconButton';

const ACS_T_CreateTicketButton = ({ apartmentId, apartmentStatusId }) => {
	const [showTicketTooltip, setShowTicketTooltip] = useState(false);
	const ticketTooltipTarget = useRef(null);
	const dispatch = useDispatch();

	const handleTicketTooltipClick = useCallback(
		(e) => {
			e.preventDefault();
			e.stopPropagation();
			setShowTicketTooltip(!showTicketTooltip);
		},
		[showTicketTooltip]
	);

	const handleCreate = useCallback(
		async (newTicket) => {
			newTicket.apartment_statuses = [{ id: apartmentStatusId }];
			await dispatch(createTicket({ apartmentId, ticket: newTicket }));
			setShowTicketTooltip(false);
		},
		[dispatch, apartmentId, apartmentStatusId]
	);

	return (
		<OverlayTrigger
			trigger="click"
			placement="bottom"
			show={showTicketTooltip}
			overlay={
				<Popover id={`ticket-popover-create`} ref={ticketTooltipTarget} className="pe-auto max-w-fit-content">
					<Popover.Body className="p-0 overflow-hidden">
						<TF_FormEdit onCreate={handleCreate} mode="create" />
					</Popover.Body>
				</Popover>
			}
			rootClose={false}>
			<IconButton ref={ticketTooltipTarget} icon={ChatLeftDotsFill} variant="outline-success" onClick={handleTicketTooltipClick} className="square-element h-100 rounded-1 wh-resize-button" />
		</OverlayTrigger>
	);
};

export default React.memo(ACS_T_CreateTicketButton);
