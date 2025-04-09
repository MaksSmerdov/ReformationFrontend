import { useSelector } from 'react-redux';
import RCS_RoomCell from '@components/project/rooms/rcs/cell/RCS_RoomCell';
import { useDrawGrid } from '@contexts/rooms_project/cell_system/DrawGridContext';

const RCS_ApartmentContainer = ({ apartmentId }) => {
	const roomIds = useSelector((state) => state.currentProject.apartments.byId[apartmentId].rooms);

	return (
		<>
			{roomIds.map((roomId) => (
				<RCS_RoomCell key={roomId} roomId={roomId} />
			))}
		</>
	);
};

export default RCS_ApartmentContainer;
