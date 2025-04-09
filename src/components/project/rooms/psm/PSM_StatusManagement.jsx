import React, { useEffect, useMemo, useCallback, useState } from 'react';
import { useSelector } from 'react-redux';
import { Button } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import PSM_StatusAssignmentControls from '@components/project/rooms/psm/PSM_StatusAssignmentControls';
import PSM_GroupsContainer from '@components/project/rooms/psm/PSM_GroupsContainer';
import { usePSMStatus } from '@contexts/rooms_project/PSMStatusContext';
import { useRoomsProject } from '@contexts/rooms_project/RoomsProjectContext';
import SwitchStaircaseDrawTypeComponent from '@components/project/rooms/main/SwitchStaircaseDrawTypeComponent';

const PSM_StatusManagement = () => {
	const { t } = useTranslation('translation', { keyPrefix: 'components.project.rooms.psmstatus_management' });
	const { deadline, dateStart, setDateStart, timeStart, dateEnd, setDateEnd, timeEnd, handleAssignClick, userIds, authorId, isCreateTicketWithStatus } = usePSMStatus();
	const { selectedStatus, selectedRooms, selectedApartments, switchStaircaseDrawMode, setSwitchStaircaseDrawMode } = useRoomsProject();
	const statusGroups = useSelector((state) => state.currentProject.statusGroups.items);

	const handleAssignAndShiftDateClick = useCallback(async () => {
		const selectedIds = switchStaircaseDrawMode ? selectedApartments : selectedRooms;
		await handleAssignClick(selectedIds);
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
	}, [handleAssignClick, selectedRooms, selectedApartments, switchStaircaseDrawMode, setDateStart, setDateEnd]);

	const isAssignButtonDisabled = useMemo(() => {
		const someObjectSelected = switchStaircaseDrawMode ? selectedApartments.length > 0 : selectedRooms.length > 0;
		if (isCreateTicketWithStatus) {
			return !selectedStatus || !someObjectSelected || !deadline || !dateStart || !timeStart || !dateEnd || !timeEnd || authorId == null;
		} else {
			return !selectedStatus || !someObjectSelected;
		}
	}, [selectedStatus, switchStaircaseDrawMode, selectedApartments, selectedRooms, userIds, deadline, dateStart, timeStart, dateEnd, timeEnd, authorId, isCreateTicketWithStatus]);

	return (
		<>
			<PSM_StatusAssignmentControls />
			{statusGroups.length > 0 && <PSM_GroupsContainer statusGroups={statusGroups} />}
			<div className="overflow-hidden">
				<div className="d-flex gap-2px overflow-auto justify-content-center ">
					{/* <div className="d-flex align-items-center">
						<SwitchStaircaseDrawTypeComponent switchStaircaseDrawMode={switchStaircaseDrawMode} setSwitchStaircaseDrawMode={setSwitchStaircaseDrawMode} />
					</div> */}
					<div className="d-flex gap-2">
						<Button className={`fs-4 px-4 py-1 ${isAssignButtonDisabled ? 'invisible' : ''}`} style={{ backgroundColor: '#18AB00' }} variant="success" onClick={handleAssignAndShiftDateClick}>
							{t('save_and_next_day')}
						</Button>
						<Button className={`fs-4 px-4 py-1 ${isAssignButtonDisabled ? 'invisible' : ''}`} style={{ backgroundColor: '#18AB00' }} variant="success" onClick={() => handleAssignClick(switchStaircaseDrawMode ? selectedApartments : selectedRooms)}>
							{t('save_and_close')}
						</Button>
					</div>
					<div className="d-flex flex-column gap-0 justify-content-center">
						{/* <div>
							{t('selected_rooms')}: {selectedRooms.length}
						</div> */}
						<div>
							{t('selected_apartments')}: {selectedApartments.length}
						</div>
					</div>
				</div>
			</div>
		</>
	);
};

export default React.memo(PSM_StatusManagement);
