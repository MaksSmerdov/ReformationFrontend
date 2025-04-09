import { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCurrentProject } from '@slices/rooms/currentProjectSlice';
import { setStatusGroups } from '@slices/projects/statusGroupsSlice';
import { setStatuses } from '@slices/projects/statusesSlice';
import RoomsProjectComponent from '@components/project/rooms/main/RoomsProjectComponent';
import FacadesProjectComponent from '@components/project/facades/main/FacadesProjectComponent';
import { useTranslation } from 'react-i18next';
import IconButton from '@components/common/icon/IconButton';
import { Gear } from 'react-bootstrap-icons';
import ProjectModal from '@components/supervisor/Projects/ProjectModal';

const ProjectPage = () => {
	const { t } = useTranslation('translation', { keyPrefix: 'pages.project_page' });
	const { projectId } = useParams();
	const dispatch = useDispatch();
	const project = useSelector((state) => state.currentProject.project);
	const statusFetchProject = useSelector((state) => state.currentProject.status.fetchProject);
	const error = useSelector((state) => state.currentProject.error);
	const statusGroups = useSelector((state) => state.currentProject.statusGroups.items);
	const statuses = useSelector((state) => state.currentProject.statuses.items);
	const hasFetched = useRef(false);
	const [showModal, setShowModal] = useState(false);

	useEffect(() => {
		if (statusFetchProject === 'idle' && !hasFetched.current) {
			dispatch(fetchCurrentProject(projectId));
			hasFetched.current = true;
		}
	}, [dispatch, projectId]);

	useEffect(() => {
		if (statusFetchProject === 'succeeded') {
			// console.log('ProjectPage:', statusGroups, statuses);
			//
			if (project?.project_type_id === 2) {
				dispatch(setStatusGroups(statusGroups));
			}
			dispatch(setStatuses(statuses));
		}
	}, [dispatch, statusFetchProject, statusGroups, statuses]);

	if (statusFetchProject === 'loading' || statusFetchProject === 'idle') {
		return <div>{t('loading')}</div>;
	} else if (statusFetchProject === 'failed') {
		return (
			<div>
				<div>{t('error_loading_project')}</div>
				<div>{error.fetchProject}</div>
			</div>
		);
	}

	if (!project) {
		return <div>{t('project_not_found')}</div>;
	}

	const renderProjectContent = () => {
		switch (project.type.id) {
			case 1:
				return <FacadesProjectComponent projectId={projectId} project={project} />;
			case 2:
				return <RoomsProjectComponent projectId={projectId} />;
			default:
				return <div>{/* Unknown project type */}</div>;
		}
	};

	return (
		<div className="d-flex flex-column gap-4px p-4px page-container">
			<div className="d-flex align-items-stretch justify-content-start w-max-100 gap-4">
				<div className="fs-1 fw-bold lh-sm">
					{t('project')} {project.title}
				</div>
				{/* <div className="d-flex justify-content-start align-items-center">
					<IconButton icon={Gear} variant="outline-secondary" onClick={() => setShowModal(true)} className="wh-resize-button" />
				</div> */}
			</div>
			{renderProjectContent()}
			<ProjectModal projectId={projectId} show={showModal} onHide={() => setShowModal(false)} onSuccess={() => dispatch(fetchCurrentProject(projectId))} />
		</div>
	);
};

export default ProjectPage;
