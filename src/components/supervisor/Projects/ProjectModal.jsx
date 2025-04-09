import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { Button, Form, Modal } from 'react-bootstrap';
import { createProject, updateProject, fetchProjectById, clearError } from '@slices/projects/projectsSlice';
import { useNotification } from '@contexts/application/NotificationContext';
import ProjectUsersRolesComponent from '@components/common/advanced/ProjectUsersRolesComponent';
import SelectProjectType from '@components/common/select/SelectProjectType';

const ProjectModal = ({ projectId = null, show, onHide, onSuccess }) => {
	const dispatch = useDispatch();
	const [title, setTitle] = useState('');
	const [description, setDescription] = useState('');
	const [projectTypeId, setProjectTypeId] = useState(0);
	const [userRoles, setUserRoles] = useState([]);
	const project = useSelector((state) => state.projects.byId[projectId]);
	const error = useSelector((state) => state.projects.error);
	const { t } = useTranslation('translation', { keyPrefix: 'components.supervisor.project_modal' });
	const { addNotification } = useNotification();
	const [hasErrorNotification, setHasErrorNotification] = useState(false);

	useEffect(() => {
		if (projectId) {
			dispatch(fetchProjectById(projectId));
		} else {
			setTitle('');
			setDescription('');
			setProjectTypeId(0);
			setUserRoles([]);
		}
	}, [dispatch, projectId, show]);

	useEffect(() => {
		if (project) {
			setTitle(project.title);
			setDescription(project.description);
			setProjectTypeId(project.project_type_id);
			setUserRoles(
				project.users.map((user) => ({
					userId: user.id,
					roleId: user.role.id,
					roleName: user.role.name,
					roleCreatedAt: user.role.created_at,
					isDeleting: false
				}))
			);
		}
	}, [project]);

	useEffect(() => {
		if (error && !hasErrorNotification) {
			addNotification(error, 'danger');
			setHasErrorNotification(true);
			dispatch(clearError());
		}
	}, [error, addNotification, hasErrorNotification, dispatch]);

	const handleSubmit = async (e) => {
		e.preventDefault();
		const action = projectId ? updateProject : createProject;
		const payload = {
			id: projectId,
			title,
			description,
			project_type_id: projectTypeId,
			users: userRoles
				.filter((userRole) => !userRole.isDeleting)
				.map((userRole) => ({
					id: userRole.userId,
					role: { id: userRole.roleId }
				}))
		};

		try {
			const resultAction = await dispatch(action(payload)).unwrap();
			onHide();
			onSuccess(t(projectId ? 'project_updated' : 'project_created'), resultAction);
			dispatch(clearError());
			setHasErrorNotification(false);
		} catch (err) {
			addNotification(err.message, 'danger');
		}
	};

	return (
		<Modal show={show} onHide={onHide}>
			<Modal.Header closeButton>
				<Modal.Title>{projectId ? t('header_update') : t('header_create')}</Modal.Title>
			</Modal.Header>
			<Modal.Body>
				<Form onSubmit={handleSubmit} className="w-100 d-flex flex-column justify-content-stretch gap-2">
					<Form.Group controlId="formProjectTitle">
						<Form.Label className="m-0">{t('title')}</Form.Label>
						<Form.Control className="px-2 py-0" type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder={t('title_placeholder')} required autoComplete="off" />
					</Form.Group>

					<Form.Group controlId="formProjectDescription">
						<Form.Label className="m-0">{t('description')}</Form.Label>
						<Form.Control className="px-2 py-0" as="textarea" value={description} onChange={(e) => setDescription(e.target.value)} placeholder={t('description_placeholder')} autoComplete="off" />
					</Form.Group>

					<Form.Group controlId="formProjectType">
						<Form.Label className="m-0">{t('type')}</Form.Label>
						<SelectProjectType value={projectTypeId} onChange={setProjectTypeId} isDisabled={!!projectId} />
					</Form.Group>

					<Form.Group controlId="formProjectUserRoles">
						<Form.Label className="m-0">{t('users_roles')}</Form.Label>
						<ProjectUsersRolesComponent className="" userRoles={userRoles} setUserRoles={setUserRoles} />
					</Form.Group>

					<Form.Group className="text-center">
						<Button variant="primary" type="submit">
							{projectId ? t('button_update') : t('button_create')}
						</Button>
					</Form.Group>
				</Form>
			</Modal.Body>
		</Modal>
	);
};

export default ProjectModal;
