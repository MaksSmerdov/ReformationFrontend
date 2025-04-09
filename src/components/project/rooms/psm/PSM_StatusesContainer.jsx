import React, { useState, useCallback } from 'react';
import { Card, Badge } from 'react-bootstrap';
import { Eye, EyeSlash } from 'react-bootstrap-icons';
import PSM_StatusRow from '@components/project/rooms/psm/PSM_StatusRow';
import IconButton from '@components/common/icon/IconButton';
import { useRoomsProject } from '@contexts/rooms_project/RoomsProjectContext';
import { useSelector } from 'react-redux';

const PSM_StatusesContainer = ({ statusGroup }) => {
	const { openStatusGroups, handleToggleVisibility, selectedStatus, handleStatusSelect } = useRoomsProject();
	const [visible, setVisible] = useState(statusGroup.id === 1 || openStatusGroups.includes(statusGroup.id));
	const isAlwaysVisible = statusGroup.id === 1;
	const statuses = useSelector((state) => state.currentProject.statuses.byStatusGroupId[statusGroup.id]);

	const handleToggleVisibility2 = useCallback(() => {
		if (visible && selectedStatus && statuses.some((status) => status.id === selectedStatus)) {
			handleStatusSelect(null);
		}
		setVisible(!visible);
		handleToggleVisibility(statusGroup.id, !visible);
	}, [visible, selectedStatus, statuses, handleStatusSelect, handleToggleVisibility, statusGroup.id]);

	return (
		<Card className="status-group border-dark rounded-0 border-0" style={{ width: '180px', minWidth: '180px' }}>
			<Card.Header className="p-2px border border-2 border-secondary bg-body">
				<div className="d-grid gap-2px wh-min-resize-button" style={{ gridTemplateColumns: isAlwaysVisible ? '1fr' : '1fr auto' }}>
					<div className="p-0 d-flex align-items-center justify-content-center text-truncate text-black fw-bold border border-secondary rounded-2 lh-1 fs-6" style={{ backgroundColor: statusGroup.color }}>
						{statusGroup.title}
					</div>
					{!isAlwaysVisible && statusGroup.id !== 1 && <IconButton icon={visible ? EyeSlash : Eye} variant={visible ? 'primary' : 'outline-primary'} onClick={handleToggleVisibility2} className="wh-resize-button" />}
				</div>
			</Card.Header>
			<Card.Body className={`p-0 ${visible ? '' : 'invisible'}`}>
				<div className="d-flex flex-column gap-4px pt-4px pb-3px px-1px">
					{statuses.map((statusId) => (
						<PSM_StatusRow key={statusId} statusId={statusId} onSelect={() => handleStatusSelect(statusId)} />
					))}
				</div>
			</Card.Body>
		</Card>
	);
};

export default React.memo(PSM_StatusesContainer);
