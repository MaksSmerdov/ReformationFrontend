import React, { useState, useCallback } from 'react';
import { Button, OverlayTrigger } from 'react-bootstrap';
import RCS_T_TooltipContainer from '@components/project/rooms/rcs/tickets/RCS_T_TooltipContainer';
import StatusIconById from '@components/project/rooms/statuses/StatusIconById';

const RCS_T_TooltipButton = ({ groupStatuses, showStatusId }) => {
	// console.log('RCS_T_TooltipButton', groupStatuses, showStatusId);
	const [visibleTooltip, setVisibleTooltip] = useState(false);

	const handleClick = useCallback(
		(e) => {
			e.stopPropagation();
			setVisibleTooltip(!visibleTooltip);
		},
		[visibleTooltip]
	);

	return (
		<OverlayTrigger trigger="click" placement="bottom" show={visibleTooltip} overlay={(props) => <RCS_T_TooltipContainer groupStatuses={groupStatuses} {...props} />} rootClose={false} onClick={handleClick}>
			<Button variant="secondary" className="p-0 rounded-1 top-0 border-0 rounder-0 bg-transparent text-black wh-resize-button" onClick={handleClick}>
				{showStatusId && <StatusIconById id={showStatusId} />}
			</Button>
		</OverlayTrigger>
	);
};

export default React.memo(RCS_T_TooltipButton);
