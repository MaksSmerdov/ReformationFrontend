import { createContext, useContext, useEffect, useState } from 'react';

const FacadesProjectContext = createContext();

export const FacadesProjectProvider = ({ projectId, project, children }) => {
	const [mode, setMode] = useState('view');

	return (
		<FacadesProjectContext.Provider
			value={{
				project,
				mode,
				setMode
			}}>
			{children}
		</FacadesProjectContext.Provider>
	);
};

export const useFacadesProject = () => useContext(FacadesProjectContext);
