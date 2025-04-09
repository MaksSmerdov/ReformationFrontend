import { createContext, useContext, useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setStatusGroups } from '@slices/projects/statusGroupsSlice';

const RoomsProjectContext = createContext();

export const RoomsProjectProvider = ({ projectId, children }) => {
	const dispatch = useDispatch();
	const project = useSelector((state) => state.projects.items.find((p) => p.id === parseInt(projectId)));

	const [selectedStatus, setSelectedStatus] = useState(null);
	const [openStatusGroups, setOpenStatusGroups] = useState([]);

	const [switchStaircaseDrawMode, setSwitchStaircaseDrawMode] = useState(true);
	const [selectedRooms, setSelectedRooms] = useState([]);
	const [selectedApartments, setSelectedApartments] = useState([]);

	useEffect(() => {
		if (project && project.status_groups) {
			dispatch(setStatusGroups(project.status_groups));
		}
	}, [dispatch, project]);

	const handleRoomSelect = (roomId, isSelected) => {
		setSelectedRooms((prevSelectedRooms) => (isSelected ? [...prevSelectedRooms, roomId] : prevSelectedRooms.filter((id) => id !== roomId)));
	};

	const handleApartmentSelect = (apartmentId, isSelected) => {
		setSelectedApartments((prevSelectedApartments) => (isSelected ? [...prevSelectedApartments, apartmentId] : prevSelectedApartments.filter((id) => id !== apartmentId)));
	};

	const handleMultipleApartmentSelect = (apartmentIds, isSelected) => {
		setSelectedApartments((prevSelectedApartments) => {
			const newSelectedApartments = new Set(prevSelectedApartments);
			apartmentIds.forEach((id) => {
				if (isSelected) {
					newSelectedApartments.add(id);
				} else {
					newSelectedApartments.delete(id);
				}
			});
			return Array.from(newSelectedApartments);
		});
	};

	const handleStatusSelect = (statusId) => {
		setSelectedStatus(statusId);
	};

	const handleToggleVisibility = (groupId, isVisible) => {
		setOpenStatusGroups((prev) => {
			if (isVisible) {
				return [...prev, groupId];
			} else {
				return prev.filter((id) => id !== groupId);
			}
		});
	};

	return (
		<RoomsProjectContext.Provider
			value={{
				project,
				selectedRooms,
				selectedApartments,
				selectedStatus,
				openStatusGroups,
				switchStaircaseDrawMode,
				setSwitchStaircaseDrawMode,
				setSelectedRooms,
				setSelectedApartments,
				setSelectedStatus,
				setOpenStatusGroups,
				handleRoomSelect,
				handleApartmentSelect,
				handleMultipleApartmentSelect,
				handleStatusSelect,
				handleToggleVisibility
			}}>
			{children}
		</RoomsProjectContext.Provider>
	);
};

export const useRoomsProject = () => useContext(RoomsProjectContext);
