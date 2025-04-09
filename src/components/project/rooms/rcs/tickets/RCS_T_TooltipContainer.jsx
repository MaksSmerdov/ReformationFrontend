import React, { forwardRef } from 'react';
import { Popover } from 'react-bootstrap';
import RCS_T_StatusGroupContainer from '@components/project/rooms/rcs/tickets/RCS_T_StatusGroupContainer';

const RCS_T_TooltipContainer = forwardRef(({ groupStatuses, ...props }, ref) => {
	const handleClick = (e) => {
		e.stopPropagation();
	};

	return (
		<Popover ref={ref} {...props} onClick={handleClick}>
			<Popover.Body className="p-2px pe-auto">
				<div className="d-flex flex-column gap-2px lh-sm">
					{Object.keys(groupStatuses).map((statusGroupId) => (
						<RCS_T_StatusGroupContainer key={statusGroupId} statusGroupId={statusGroupId} statusObjects={groupStatuses[statusGroupId]} />
					))}
				</div>
			</Popover.Body>
		</Popover>
	);
});

export default React.memo(RCS_T_TooltipContainer);
