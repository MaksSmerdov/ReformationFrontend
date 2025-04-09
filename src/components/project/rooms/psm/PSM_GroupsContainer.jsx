import React, { useEffect, useCallback, useRef } from 'react';
import PSM_StatusesContainer from '@components/project/rooms/psm/PSM_StatusesContainer';
import { usePSMStatus } from '@contexts/rooms_project/PSMStatusContext';
import { useRoomsProject } from '@contexts/rooms_project/RoomsProjectContext';
import { useSelector } from 'react-redux';

const PSM_GroupsContainer = ({ statusGroups }) => {
	const { statusType, handleStatusSelect } = usePSMStatus();
	const { openStatusGroups, handleToggleVisibility } = useRoomsProject();
	const hasEffectRun = useRef(false);

	useEffect(() => {
		if (!hasEffectRun.current) {
			if (statusGroups.length > 0) {
				const groupWithIndex1 = statusGroups.find((group) => group.id === 1);
				if (groupWithIndex1 && !openStatusGroups.includes(groupWithIndex1.id)) {
					handleToggleVisibility(groupWithIndex1.id, true);
				}
			}
			hasEffectRun.current = true;
		}
	}, [statusGroups, openStatusGroups, handleToggleVisibility]);

	const handleSelectStatus = useCallback(
		(statusId) => {
			setSelectedStatus((prevSelectedStatus) => (prevSelectedStatus === statusId ? null : statusId));
			handleStatusSelect(statusId);
		},
		[handleStatusSelect]
	);

	const statusColorClass = statusType === 'type1' ? 'c-status-future-color' : statusType === 'type2' ? 'c-status-past-color' : '';

	return (
		<div className={`overflow-hidden ${statusColorClass}`}>
			<div className="d-flex gap-2px overflow-auto flex-row justify-content-between p-2px">
				{statusGroups.map((statusGroup) => (
					<PSM_StatusesContainer key={statusGroup.id} statusGroup={statusGroup} />
				))}
			</div>
		</div>
	);
};

export default React.memo(PSM_GroupsContainer);
