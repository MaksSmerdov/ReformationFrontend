import React, { createContext, useContext } from 'react';

const RoomCellContext = createContext();

export const RoomCellProvider = ({ roomId, children }) => {
	return <RoomCellContext.Provider value={roomId}>{children}</RoomCellContext.Provider>;
};

export const useRoomCell = () => {
	return useContext(RoomCellContext);
};
