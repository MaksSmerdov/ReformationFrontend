import { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RoomsProjectProvider, useRoomsProject } from '@contexts/rooms_project/RoomsProjectContext';
import { PSMStatusProvider } from '@contexts/rooms_project/PSMStatusContext';
import { RoomProjectModalsProvider, useRoomProjectModals } from '@contexts/rooms_project/RoomProjectModalsContext';
import GroupStaircasesContainer from '@components/project/rooms/main/GroupStaircasesContainer';
import PSM_StatusManagement from '@components/project/rooms/psm/PSM_StatusManagement';
import StaircaseLayoutModal from '@components/project/rooms/forms/StaircaseLayoutModal';
import StaircaseModal from '@components/project/rooms/forms/StaircaseModal';
import ApartmentModal from '@components/project/rooms/forms/ApartmentModal';
import RoomModal from '@components/project/rooms/forms/RoomModal';
import { fetchProjectRooms, fetchCurrentProject } from '@slices/rooms/currentProjectSlice';
import { fetchStaircases } from '@slices/rooms/staircasesSlice';
import { fetchProjectById } from '@slices/projects/projectsSlice';
import { Spinner } from 'react-bootstrap';

const RoomsProjectComponent = ({ projectId }) => {
	const dispatch = useDispatch();
	const { showPanel, viewRoom, viewApartment, viewStaircase, setShowPanel } = useRoomsProject();
	const { showApartmentModal, showRoomModal } = useRoomProjectModals();
	const statusProjectRooms = useSelector((state) => state.currentProject.status.fetchRooms);
	const errorProjectRooms = useSelector((state) => state.currentProject.error.fetchRooms);
	const hasFetched = useRef(false);

	useEffect(() => {
		if (!hasFetched.current) {
			dispatch(fetchProjectById(projectId));
			dispatch(fetchProjectRooms(projectId));
			// dispatch(fetchStaircases(projectId));
			hasFetched.current = true;
		}
	}, [dispatch, projectId]);

	if (statusProjectRooms === 'loading' || statusProjectRooms === 'idle') {
		return (
			<Spinner animation="border" role="status">
				<span className="visually-hidden">Loading...</span>
			</Spinner>
		);
	} else if (statusProjectRooms === 'failed') {
		return <div>{errorProjectRooms}</div>;
	}

	return (
		<PSMStatusProvider>
			<PSM_StatusManagement />
			<GroupStaircasesContainer />
			<StaircaseModal />
			<StaircaseLayoutModal />
			{showApartmentModal && <ApartmentModal />}
			{showRoomModal && <RoomModal />}
		</PSMStatusProvider>
	);
};

const RoomsProjectComponentWithProvider = ({ projectId }) => (
	<RoomsProjectProvider projectId={projectId}>
		<RoomProjectModalsProvider>
			<RoomsProjectComponent projectId={projectId} />
		</RoomProjectModalsProvider>
	</RoomsProjectProvider>
);

export default RoomsProjectComponentWithProvider;
