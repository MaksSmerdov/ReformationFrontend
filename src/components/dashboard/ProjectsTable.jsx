import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Table, Spinner, Button } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { fetchProjects, clearError } from '@slices/projects/projectsSlice';
import { fetchProjectTypes } from '@slices/projects/projectTypesSlice';
import projectTypes from '@utils/static_keys/project_types';

const ProjectsTable = () => {
	const dispatch = useDispatch();
	const projects = useSelector((state) => state.projects.items);
	const projectStatus = useSelector((state) => state.projects.status);
	const error = useSelector((state) => state.projects.error);
	const projectTypesStatus = useSelector((state) => state.projectTypes.status.fetchAll);
	const { t } = useTranslation('translation', { keyPrefix: 'components.dashboard.projects_table' });
	const projectTypeNames = projectTypes();

	useEffect(() => {
		dispatch(fetchProjects());
		if (projectTypesStatus === 'idle') {
			dispatch(fetchProjectTypes());
		}
	}, [dispatch, projectTypesStatus]);

	useEffect(() => {
		if (projectStatus === 'failed' && error) {
			dispatch(clearError());
		}
	}, [projectStatus, error, dispatch]);

	const renderTableBody = () => {
		if (projectStatus === 'loading') {
			return (
				<tr>
					<td colSpan="5" className="text-center">
						<Spinner animation="border" role="status">
							<span className="visually-hidden">Loading...</span>
						</Spinner>
					</td>
				</tr>
			);
		}

		if (projectStatus === 'failed') {
			return (
				<tr>
					<td colSpan="5" className="text-center">
						No projects found.
					</td>
				</tr>
			);
		}

		if (projectStatus === 'succeeded') {
			if (projects.length > 0) {
				return projects.map((project) => (
					<tr key={project.id}>
						<td>
							<div className="d-flex h-100 align-items-center justify-content-left px-2">{new Date(project.created_at).toLocaleDateString()}</div>
						</td>
						<td>
							<div className="d-flex h-100 align-items-center justify-content-left px-2">{project.title}</div>
						</td>
						<td>
							<div className="d-flex h-100 align-items-center justify-content-left px-2">{projectTypeNames[project.type.id]}</div>
						</td>
						<td>
							<div className="d-flex h-100 align-items-center justify-content-left px-2">{t('no_tickets')}</div>
						</td>
						<td>
							<div className="d-flex h-100 align-items-center justify-content-center">
								<Button variant="link" href={`/project/${project.id}`} className="m-0 p-0 lh-1 border-0">
									{t('table_column_view')}
								</Button>
							</div>
						</td>
					</tr>
				));
			} else {
				return (
					<tr>
						<td colSpan="5" className="text-center">
							{t('no_projects')}
						</td>
					</tr>
				);
			}
		}

		return null;
	};

	return (
		<div style={{ width: 'min-content' }}>
			<Table striped bordered hover>
				<thead>
					<tr>
						<th style={{ width: '150px', minWidth: '10%' }}>
							<div className="d-flex h-100 align-items-center justify-content-center px-2">{t('table_column_created_at')}</div>
						</th>
						<th style={{ width: '150px', minWidth: '45%' }}>
							<div className="d-flex h-100 align-items-center justify-content-center px-2">{t('table_column_name')}</div>
						</th>
						<th style={{ width: '150px', minWidth: '20%' }}>
							<div className="d-flex h-100 align-items-center justify-content-center px-2">{t('table_column_type')}</div>
						</th>
						<th style={{ width: '150px', minWidth: '15%' }}>
							<div className="d-flex h-100 align-items-center justify-content-center px-2">{t('table_column_tickets')}</div>
						</th>
						<th style={{ width: '150px', minWidth: '10%' }}>
							<div className="d-flex h-100 align-items-center justify-content-center px-2">{t('table_column_view')}</div>
						</th>
					</tr>
				</thead>
				<tbody>{renderTableBody()}</tbody>
			</Table>
		</div>
	);
};

export default ProjectsTable;
