import { useSelector } from 'react-redux';
import { Card } from 'react-bootstrap';
import { Pencil } from 'react-bootstrap-icons';
import IconButton from '@components/common/icon/IconButton';
import { useRoomsProject } from '@contexts/rooms_project/RoomsProjectContext';
import { useRoomProjectModals } from '@contexts/rooms_project/RoomProjectModalsContext';
import ACS_Grid from '@components/project/rooms/acs/grid/ACS_Grid';
import RCS_Grid from '@components/project/rooms/rcs/grid/RCS_Grid';

const OneStaircaseContainer = ({ staircaseId }) => {
	const staircase = useSelector((state) => state.currentProject.staircases.byId[staircaseId]);
	const { switchStaircaseDrawMode } = useRoomsProject();
	const { handleEditStaircase } = useRoomProjectModals();

	return (
		<div>
			<Card className="border-emphasis overflow-hidden rounded-top-2 rounded-bottom-0">
				<Card.Header className="border-emphasis p-1px">
					<div className="p-0 ps-2 gap-2 d-flex justify-content-between align-items-center">
						<span>{staircase.title}</span>
						<IconButton icon={Pencil} variant="outline-primary" onClick={() => handleEditStaircase(staircase.id)} className="wh-resize-button" />
					</div>
				</Card.Header>
				<Card.Body className="p-0">{switchStaircaseDrawMode ? <ACS_Grid staircaseId={staircaseId} /> : <RCS_Grid staircaseId={staircaseId} />}</Card.Body>
			</Card>
		</div>
	);
};

export default OneStaircaseContainer;
