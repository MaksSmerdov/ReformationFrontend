import React, { useCallback } from 'react';
import StatusInfoTooltipButton from '@components/project/rooms/statuses/StatusInfoTooltipButton';
import PSM_TicketTooltipButton from '@components/project/rooms/psm/PSM_TicketTooltipButton';
import { usePSMStatus } from '@contexts/rooms_project/PSMStatusContext';
import { useRoomsProject } from '@contexts/rooms_project/RoomsProjectContext';
import { useSelector } from 'react-redux';

const PSM_StatusRow = ({ statusId, onSelect, statusColor }) => {
	const { selectedStatus } = useRoomsProject();
	const { isCreateTicketWithStatus, getBorderColorClass, setTitle } = usePSMStatus();
	const status = useSelector((state) => state.currentProject.statuses.byId[statusId]);

	const isSelected = selectedStatus === statusId;

	const handleSelect = useCallback(() => {
		onSelect(statusId);
		setTitle(status.title);
	}, [onSelect, statusId, setTitle, status.title]);

	const handleButtonClick = useCallback((e) => {
		e.stopPropagation();
	}, []);

	const borderColorClass = isSelected ? getBorderColorClass() : '';

	return (
		<div className={`p-0 status-row ${borderColorClass}`}>
			<div className="d-grid align-items-center gap-2 cursor-pointer" style={{ gridTemplateColumns: isCreateTicketWithStatus ? 'auto 1fr auto' : 'auto 1fr', gridTemplateRows: '100%' }} onClick={handleSelect}>
				<div className="h-100" onClick={handleButtonClick}>
					<StatusInfoTooltipButton statusId={statusId} />
				</div>
				<div className="h-100 border-bottom flex-grow-1 nowrap text-truncate pe-auto" title={status.title}>
					{status.title}
				</div>
				{isCreateTicketWithStatus && (
					<div className="h-100" onClick={handleButtonClick}>
						<PSM_TicketTooltipButton status={status} isSelected={isSelected} />
					</div>
				)}
			</div>
		</div>
	);
};

export default React.memo(PSM_StatusRow);
