import React from 'react';
import { useSelector } from 'react-redux';
import { ListGroup } from 'react-bootstrap';
import ACS_T_StatusContainer from '@components/project/rooms/acs/tickets/ACS_T_StatusContainer';
import { useApartmentCell } from '@contexts/rooms_project/cell_system/ApartmentCellContext';

const ACS_T_StatusGroupContainer = ({ statusGroupId, statusObjects }) => {
	const apartmentId = useApartmentCell();
	const statusGroup = useSelector((state) => state.currentProject.statusGroups.byId[statusGroupId]);
	const statuses = useSelector((state) => state.currentProject.statuses.byId);

	return (
		<ListGroup className="p-0 border border-1 border-secondary overflow-hidden">
			<div className="p-1 bg-body-secondary border-bottom border-secondary fw-bold text-center">{statusGroup.title}</div>
			{statusObjects.map((statusObject) => (
				<ACS_T_StatusContainer key={statusObject.status.id} statusObject={statusObject} />
			))}
		</ListGroup>
	);
};

export default React.memo(ACS_T_StatusGroupContainer);
