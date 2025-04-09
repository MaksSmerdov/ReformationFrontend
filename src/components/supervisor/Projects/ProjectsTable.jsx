import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Table } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { fetchProjects, clearError, fetchProjectById, deleteProject, deleteProjectHard, restoreProject } from '@slices/projects/projectsSlice';
import { useNotification } from '@contexts/application/NotificationContext';
import { useConfirmation } from '@contexts/application/ConfirmationContext';
import ProjectModal from '@components/supervisor/Projects/ProjectModal';
import IconButton from '@components/common/icon/IconButton';
import { Pencil, Trash, PlusLg, ArrowCounterclockwise, XLg } from 'react-bootstrap-icons';
import projectTypes from '@utils/static_keys/project_types';

const ProjectsTable = () => {
	const dispatch = useDispatch();
	const { t } = useTranslation('translation', { keyPrefix: 'components.supervisor.projects_manager' });
	const { addNotification } = useNotification();
	const { showConfirmation } = useConfirmation();

	const projects = useSelector((state) => state.projects.items);
	const projectStatus = useSelector((state) => state.projects.status);
	const error = useSelector((state) => state.projects.error);

	const [hasErrorNotification, setHasErrorNotification] = useState(false);
	const [showModal, setShowModal] = useState(false);
	const [selectedProjectId, setSelectedProjectId] = useState(null);

	const projectTypesArray = projectTypes();

	useEffect(() => {
		dispatch(fetchProjects());
	}, [dispatch]);

	useEffect(() => {
		if (projectStatus === 'failed' && error && !hasErrorNotification) {
			addNotification(error, 'danger');
			setHasErrorNotification(true);
			dispatch(clearError());
		}
	}, [projectStatus, error, addNotification, hasErrorNotification, dispatch]);

	const handleCreateProject = () => {
		setSelectedProjectId(null);
		setShowModal(true);
		setHasErrorNotification(false);
		dispatch(clearError());
	};

	const handleEditProject = (projectId) => {
		dispatch(fetchProjectById(projectId)).then(() => {
			setSelectedProjectId(projectId);
			setShowModal(true);
		});
	};

	const handleCloseModal = () => {
		setShowModal(false);
	};

	const handleSuccess = (message) => {
		addNotification(message, 'success');
		setShowModal(false);
	};

	const handleDeleteProject = async (projectId) => {
		showConfirmation(t('confirm_delete_message'), async () => {
			try {
				await dispatch(deleteProject(projectId)).unwrap();
				addNotification(t('project_deleted'), 'success');
				dispatch(fetchProjects());
			} catch (error) {
				addNotification(error.message, 'danger');
			}
		});
	};

	const handleDeleteProjectHard = async (projectId) => {
		showConfirmation(t('confirm_delete_hard_message'), async () => {
			try {
				await dispatch(deleteProjectHard(projectId)).unwrap();
				addNotification(t('project_deleted_hard'), 'success');
				dispatch(fetchProjects());
			} catch (error) {
				addNotification(error.message, 'danger');
			}
		});
	};

	const handleRestoreProject = async (projectId) => {
		showConfirmation(t('confirm_restore_message'), async () => {
			try {
				await dispatch(restoreProject(projectId)).unwrap();
				addNotification(t('project_restored'), 'success');
				dispatch(fetchProjects());
			} catch (error) {
				addNotification(error.message, 'danger');
			}
		});
	};

	return (
		<div className="w-100 d-flex flex-column align-items-center justify-content-center">
			<h1>{t('component_title')}</h1>
			<Table striped bordered hover className="w-max-content">
				<thead>
					<tr>
						<th className="w-1px">
							<IconButton icon={PlusLg} variant="success" onClick={handleCreateProject} className="wh-resize-button" />
						</th>
						<th className="px-2 text-center">{t('table_column_title')}</th>
						<th className="px-2 text-center">{t('table_column_type')}</th>
						<th className="px-2 text-center">{t('table_column_deleted')}</th>
						<th className="w-1px"></th>
					</tr>
				</thead>
				<tbody>
					{projects.map((project) => (
						<tr key={project.id}>
							<td>{!project.deleted_at ? <IconButton icon={Pencil} variant="outline-primary" onClick={() => handleEditProject(project.id)} className="wh-resize-button" /> : <IconButton icon={ArrowCounterclockwise} variant="outline-primary" onClick={() => handleRestoreProject(project.id)} className="wh-resize-button" />}</td>
							<td className="px-2 text-center">{project.title}</td>
							<td className="px-2 text-center">{projectTypesArray[project.type.id]}</td>
							<td className="px-2 text-center">{project.deleted_at ? t('project_status_deleted') : t('project_status_active')}</td>
							<td>
								<div className="d-flex justify-content-center gap-2">{!project.deleted_at ? <IconButton icon={Trash} variant="outline-danger" onClick={() => handleDeleteProject(project.id)} className="wh-resize-button" /> : <IconButton icon={XLg} variant="outline-danger" onClick={() => handleDeleteProjectHard(project.id)} className="wh-resize-button" />}</div>
							</td>
						</tr>
					))}
				</tbody>
			</Table>

			<ProjectModal projectId={selectedProjectId} show={showModal} onHide={handleCloseModal} onSuccess={handleSuccess} />
		</div>
	);
};

export default ProjectsTable;
