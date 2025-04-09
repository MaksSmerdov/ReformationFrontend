import React, { createContext, useContext } from 'react';

const ApartmentCellContext = createContext();

export const ApartmentCellProvider = ({ apartmentId, children }) => {
	return <ApartmentCellContext.Provider value={apartmentId}>{children}</ApartmentCellContext.Provider>;
};

export const useApartmentCell = () => {
	return useContext(ApartmentCellContext);
};
