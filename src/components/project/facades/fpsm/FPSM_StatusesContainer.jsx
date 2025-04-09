import React, { useState, useCallback } from 'react';
import { Card } from 'react-bootstrap';
import { Eye, EyeSlash } from 'react-bootstrap-icons';
import FPSM_StatusRow from './FPSM_StatusRow';
import IconButton from '@components/common/icon/IconButton';
import { useFacadeViewPage } from '@contexts/facades_view/FacadeViewPageContext';
import { useSelector } from 'react-redux';

const FPSM_StatusesContainer = ({ statusGroup }) => {
	const { openStatusGroups, handleToggleVisibility, selectedStatus, handleStatusSelect } = useFacadeViewPage();
	const [visible, setVisible] = useState(openStatusGroups.includes(statusGroup.id));
	const statuses = statusGroup.statuses;

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
				<div className="d-grid gap-2px wh-min-resize-button" style={{ gridTemplateColumns: '1fr auto' }}>
					<div className="px-2 py-0 d-flex align-items-center justify-content-around text-truncate text-black fw-bold border border-secondary rounded-2 lh-1 fs-6" style={{ backgroundColor: statusGroup.color }}>
						<div className="text-truncate">{statusGroup.title}</div>
					</div>
					<IconButton icon={visible ? EyeSlash : Eye} variant={visible ? 'primary' : 'outline-primary'} onClick={handleToggleVisibility2} className="wh-resize-button" />
				</div>
			</Card.Header>
			<Card.Body className={`p-0 ${visible ? '' : 'invisible'}`}>
				<div className="d-flex flex-column gap-4px pt-4px pb-3px px-1px">
					{statuses.map((status) => (
						<FPSM_StatusRow key={status.id} status={status} />
					))}
				</div>
			</Card.Body>
		</Card>
	);
};

export default React.memo(FPSM_StatusesContainer);
