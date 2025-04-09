import React from 'react';
import FacadeGroupsContainer from '@components/project/facades/group_facades/FacadeGroupsContainer';
import { FacadeProjectModalsProvider } from '@contexts/facades_project/FacadeProjectModalsContext';
import { FacadesProjectProvider } from '@contexts/facades_project/FacadesProjectContext';
import FacadePageMenu from '@components/project/facades/main/FacadePageMenu';

const FacadesProjectComponent = ({ projectId, project }) => {
	return (
		<FacadesProjectProvider projectId={projectId} project={project}>
			<FacadeProjectModalsProvider>
				<FacadePageMenu />
				<FacadeGroupsContainer />
			</FacadeProjectModalsProvider>
		</FacadesProjectProvider>
	);
};

export default FacadesProjectComponent;
