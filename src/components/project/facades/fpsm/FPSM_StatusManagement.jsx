import React, { useMemo, useCallback } from 'react';
import { Button } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import FPSM_StatusAssignmentControls from '@components/project/facades/fpsm/FPSM_StatusAssignmentControls';
import FPSM_GroupsContainer from '@components/project/facades/fpsm/FPSM_GroupsContainer';
import { useFPSM } from '@contexts/facades_view/FPSMContext';
import { useFacadeViewPage } from '@contexts/facades_view/FacadeViewPageContext';

const FPSM_StatusManagement = () => {
	const { t } = useTranslation('translation', { keyPrefix: 'components.project.facades.fpsmstatus_management' });
	const { handleAssignClick, setDateStart, setDateEnd, isCreateTicketWithStatus } = useFPSM();
	const { viewMode, selectedStatus, selectedElementIds, projectTypeId } = useFacadeViewPage();

	const handleAssignAndShiftDateClick = useCallback(async () => {
		await handleAssignClick();
		setDateStart((prev) => {
			const newDate = new Date(prev);
			newDate.setDate(newDate.getDate() + 1);
			return newDate.toISOString().slice(0, 10);
		});
		setDateEnd((prev) => {
			const newDate = new Date(prev);
			newDate.setDate(newDate.getDate() + 1);
			return newDate.toISOString().slice(0, 10);
		});
	}, [handleAssignClick, setDateStart, setDateEnd]);

	const isAssignButtonDisabled = useMemo(() => {
		return !selectedStatus || selectedElementIds.length === 0;
	}, [selectedStatus, selectedElementIds]);

	if (viewMode !== 'view') {
		return null;
	}

	return (
		<>
			<FPSM_StatusAssignmentControls />
			{projectTypeId && <FPSM_GroupsContainer projectTypeId={projectTypeId} />}
			<div className="overflow-hidden">
				<div className="d-flex gap-2px overflow-auto justify-content-center">
					<div className="d-flex gap-2">
						<Button className={`fs-4 px-4 py-1 ${isAssignButtonDisabled ? 'invisible' : ''}`} style={{ backgroundColor: '#18AB00' }} variant="success" onClick={handleAssignAndShiftDateClick}>
							{t('save_and_next_day')}
						</Button>
						<Button className={`fs-4 px-4 py-1 ${isAssignButtonDisabled ? 'invisible' : ''}`} style={{ backgroundColor: '#18AB00' }} variant="success" onClick={handleAssignClick}>
							{t('save_and_close')}
						</Button>
					</div>
					<div className="d-flex flex-column gap-0 justify-content-center">
						<div>
							{t('selected_elements')}: {selectedElementIds.length}
						</div>
					</div>
				</div>
			</div>
		</>
	);
};

export default React.memo(FPSM_StatusManagement);
