import React from 'react';
import { useSelector } from 'react-redux';
import { ListGroup } from 'react-bootstrap';
import RCS_T_StatusContainer from '@components/project/rooms/rcs/tickets/RCS_T_StatusContainer';
import { useRoomCell } from '@contexts/rooms_project/cell_system/RoomCellContext';

const RCS_T_StatusGroupContainer = ({ statusGroupId, statusObjects }) => {
	const roomId = useRoomCell();
	const statusGroup = useSelector((state) => state.currentProject.statusGroups.byId[statusGroupId]);
	const statuses = useSelector((state) => state.currentProject.statuses.byId);

	return (
		<ListGroup className="p-0 border border-1 border-secondary overflow-hidden">
			<div className="p-1 bg-body-secondary border-bottom border-secondary fw-bold text-center">{statusGroup.title}</div>
			{statusObjects.map((statusObject) => (
				<RCS_T_StatusContainer key={statusObject.status.id} statusObject={statusObject} />
			))}
		</ListGroup>
	);
};

export default React.memo(RCS_T_StatusGroupContainer);
