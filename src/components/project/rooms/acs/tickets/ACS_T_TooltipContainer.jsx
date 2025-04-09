import React, { forwardRef } from 'react';
import { Popover } from 'react-bootstrap';
import ACS_T_StatusGroupContainer from '@components/project/rooms/acs/tickets/ACS_T_StatusGroupContainer';

const ACS_T_TooltipContainer = forwardRef(({ groupStatuses, ...props }, ref) => {
	const handleClick = (e) => {
		e.stopPropagation();
	};

	return (
		<Popover ref={ref} {...props} onClick={handleClick}>
			<Popover.Body className="p-2px pe-auto">
				<div className="d-flex flex-column gap-2px lh-sm">
					{Object.keys(groupStatuses).map((statusGroupId) => (
						<ACS_T_StatusGroupContainer key={statusGroupId} statusGroupId={statusGroupId} statusObjects={groupStatuses[statusGroupId]} />
					))}
				</div>
			</Popover.Body>
		</Popover>
	);
});

export default React.memo(ACS_T_TooltipContainer);
