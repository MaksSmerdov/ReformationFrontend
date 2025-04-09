import React, { createContext, useContext } from 'react';

const DrawGridContext = createContext();

export const DrawGridProvider = ({ maxX, maxY, children }) => {
	return <DrawGridContext.Provider value={{ maxX, maxY }}>{children}</DrawGridContext.Provider>;
};

export const useDrawGrid = () => useContext(DrawGridContext);
