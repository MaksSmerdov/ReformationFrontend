import React, { useCallback, useContext } from 'react';
import StatusInfoTooltipButtonSimple from '@components/project/rooms/statuses/StatusInfoTooltipButtonSimple';
import FPSM_TicketTooltipButton from './FPSM_TicketTooltipButton';
import { useFPSM } from '@contexts/facades_view/FPSMContext';
import { useFacadeViewPage } from '@contexts/facades_view/FacadeViewPageContext';

const FPSM_StatusRow = ({ status }) => {
	const { getBorderColorClass, setTitle, isCreateTicketWithStatus } = useFPSM();
	const { selectedStatus, handleStatusSelect, setSelectedStatus } = useFacadeViewPage();
	const isSelected = selectedStatus === status.id;

	const handleSelect = useCallback(() => {
		handleStatusSelect(status.id);
		setTitle(status.title);
	}, [handleStatusSelect, status.id, setTitle, status.title]);

	const handleButtonClick = useCallback((e) => {
		e.stopPropagation();
	}, []);

	const borderColorClass = isSelected ? getBorderColorClass() : '';

	return (
		<div className={`p-0 status-row ${borderColorClass}`}>
			<div
				className="d-grid align-items-center gap-2 cursor-pointer"
				style={{
					gridTemplateColumns: isCreateTicketWithStatus ? 'auto 1fr auto' : 'auto 1fr',
					gridTemplateRows: '100%'
				}}
				onClick={handleSelect}>
				<div className="h-100" onClick={handleButtonClick}>
					<StatusInfoTooltipButtonSimple statusId={status.id} />
				</div>
				<div className="h-100 border-bottom flex-grow-1 nowrap text-truncate pe-auto" title={status.title}>
					{status.title}
				</div>
				{isCreateTicketWithStatus && (
					<div className="h-100" onClick={handleButtonClick}>
						<FPSM_TicketTooltipButton status={status} isSelected={isSelected} />
					</div>
				)}
			</div>
		</div>
	);
};

export default React.memo(FPSM_StatusRow);
