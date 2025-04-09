import { createContext, useContext, useState } from 'react';

const RoomProjectModalsContext = createContext();

export const RoomProjectModalsProvider = ({ children }) => {
	const [currentStaircaseId, setCurrentStaircaseId] = useState(null);
	const [showStaircaseModal, setShowStaircaseModal] = useState(false);

	const [currentStaircaseLayoutId, setCurrentStaircaseLayoutId] = useState(null);
	const [showStaircaseLayoutModal, setShowStaircaseLayoutModal] = useState(false);

	const [currentApartmentId, setCurrentApartmentId] = useState(null);
	const [showApartmentModal, setShowApartmentModal] = useState(false);

	const [currentRoomId, setCurrentRoomId] = useState(null);
	const [showRoomModal, setShowRoomModal] = useState(false);

	const handleEditStaircase = async (staircaseId) => {
		setCurrentStaircaseId(staircaseId);
		setShowStaircaseModal(true);
	};

	const handleEditStaircaseLayout = async (layoutId) => {
		setCurrentStaircaseLayoutId(layoutId);
		setShowStaircaseLayoutModal(true);
	};

	const handleEditApartment = async (apartmentId) => {
		setCurrentApartmentId(apartmentId);
		setShowApartmentModal(true);
	};

	const handleEditRoom = async (roomId) => {
		setCurrentRoomId(roomId);
		setShowRoomModal(true);
	};

	return (
		<RoomProjectModalsContext.Provider
			value={{
				handleEditStaircase,
				currentStaircaseId,
				showStaircaseModal,
				setShowStaircaseModal,

				handleEditStaircaseLayout,
				currentStaircaseLayoutId,
				showStaircaseLayoutModal,
				setShowStaircaseLayoutModal,

				handleEditApartment,
				currentApartmentId,
				showApartmentModal,
				setShowApartmentModal,

				handleEditRoom,
				currentRoomId,
				showRoomModal,
				setShowRoomModal
			}}>
			{children}
		</RoomProjectModalsContext.Provider>
	);
};

export const useRoomProjectModals = () => useContext(RoomProjectModalsContext);
