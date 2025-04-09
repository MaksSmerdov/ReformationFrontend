import React, { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchFacadeById, selectFacadeById } from '@slices/facades/facadesSlice';
import { fetchProjectById } from '@slices/projects/projectsSlice';
import { fetchStatusGroups } from '@slices/projects/statusGroupsSlice'; // Импортируем fetchStatusGroups
import FacadeViewBreadcrumb from '@components/project/facades/facade_view_page/components/onpage/FacadeViewBreadcrumb';
import { FacadeNavigationBar } from '@components/project/facades/facade_view_page/components/facade_navigation_bar';
import FacadeViewFacadeContainer from '@components/project/facades/facade_view_page/components/onpage/FacadeViewFacadeContainer';
import { FacadeViewPageProvider } from '@contexts/facades_view/FacadeViewPageContext';
import FacadeViewModeSwitcher from '@components/project/facades/facade_view_page/components/onpage/FacadeViewModeSwitcher';
import FPSM_StatusManagement from '@components/project/facades/fpsm/FPSM_StatusManagement';
import { FPSMProvider } from '@contexts/facades_view/FPSMContext';

const FacadeViewMainComponent = ({ projectId, facadeId }) => {
	const dispatch = useDispatch();

	const project = useSelector((state) => state.projects.byId[projectId]);
	const projectStatus = useSelector((state) => state.projects.status);
	const projectError = useSelector((state) => state.projects.error);

	const facade = useSelector((state) => selectFacadeById(state, facadeId));
	const facadeStatus = useSelector((state) => state.facades.statuses.statusFetchFacadeById[facadeId]);
	const facadeError = useSelector((state) => state.facades.errors.statusFetchFacadeById[facadeId]);

	const statusGroupsStatus = useSelector((state) => state.statusGroups.status); // Статус загрузки статус-групп

	// Используем useRef для предотвращения повторных запросов
	const hasFetchedProject = useRef(false);
	const hasFetchedStatusGroups = useRef(false);

	useEffect(() => {
		// Всегда выполняем запрос fetchFacadeById при открытии страницы
		dispatch(fetchFacadeById({ projectId, facadeId }));
	}, [dispatch, projectId, facadeId]);

	useEffect(() => {
		if (!hasFetchedProject.current && projectStatus === 'idle') {
			dispatch(fetchProjectById(projectId));
			hasFetchedProject.current = true;
		}
	}, [dispatch, projectId, projectStatus]);

	useEffect(() => {
		if (!hasFetchedStatusGroups.current && statusGroupsStatus === 'idle' && project?.project_type_id) {
			dispatch(fetchStatusGroups({ projectTypeId: project.project_type_id }));
			hasFetchedStatusGroups.current = true;
		}
	}, [dispatch, project?.project_type_id, statusGroupsStatus]);

	if (facadeStatus === 'loading' || projectStatus === 'loading' || statusGroupsStatus === 'loading') {
		return <div>Loading...</div>;
	}

	if (facadeStatus === 'failed') {
		return <div>Error: {facadeError}</div>;
	}

	if (projectStatus === 'failed') {
		return <div>Error: {projectError}</div>;
	}

	if (statusGroupsStatus === 'failed') {
		return <div>Error loading status groups</div>;
	}

	if (!facade) {
		return <div>Facade not found</div>;
	}

	return (
		<FacadeViewPageProvider facadeIdProp={facadeId} projectIdProp={projectId}>
			<FPSMProvider>
				<div className="d-flex flex-column gap-3 p-3">
					<FacadeViewBreadcrumb projectId={projectId} facadeTitle={facade.title} />
					<FacadeViewModeSwitcher />
					<FPSM_StatusManagement projectId={projectId} />
					<FacadeNavigationBar projectId={projectId} />
					<FacadeViewFacadeContainer facadeId={facadeId} />
					<FacadeNavigationBar projectId={projectId} />
				</div>
			</FPSMProvider>
		</FacadeViewPageProvider>
	);
};

export default FacadeViewMainComponent;
