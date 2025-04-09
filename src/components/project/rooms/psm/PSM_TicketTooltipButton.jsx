import React, { useState, useRef, useCallback, useEffect } from 'react';
import { OverlayTrigger, Popover } from 'react-bootstrap';
import TF_FormSynthetic from '@components/project/rooms/tf/TF_FormSynthetic';
import { usePSMStatus } from '@contexts/rooms_project/PSMStatusContext';
import { ChatLeftDotsFill } from 'react-bootstrap-icons';
import IconButton from '@components/common/icon/IconButton';

const PSM_TicketTooltipButton = ({ status, isSelected }) => {
	const [showTicketTooltip, setShowTicketTooltip] = useState(false);
	const ticketTooltipTarget = useRef(null);
	const { selectedStatus, deadline, setDeadline, getDeadlineAttributes } = usePSMStatus();

	const handleTicketTooltipClick = useCallback((e) => {
		e.preventDefault();
		e.stopPropagation();
		setShowTicketTooltip((prev) => !prev);
	}, []);

	const customAttributes = {
		deadline: getDeadlineAttributes(),
		files: {
			isEditable: true
		}
	};

	return (
		isSelected && (
			<OverlayTrigger
				trigger="click"
				placement="bottom"
				show={showTicketTooltip}
				overlay={
					<Popover id={`ticket-popover-${status.id}`} ref={ticketTooltipTarget} className="pe-auto max-w-fit-content">
						<Popover.Body className="p-0 overflow-hidden">
							<TF_FormSynthetic customAttributes={customAttributes} />
						</Popover.Body>
					</Popover>
				}
				rootClose={false}>
				<IconButton ref={ticketTooltipTarget} icon={ChatLeftDotsFill} variant="outline-success" onClick={handleTicketTooltipClick} className="square-element h-100 rounded-1" />
			</OverlayTrigger>
		)
	);
};

export default React.memo(PSM_TicketTooltipButton);
