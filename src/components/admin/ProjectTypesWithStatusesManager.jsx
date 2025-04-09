import { useEffect, useState } from 'react';
import { Tabs, Tab, Spinner, Alert } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProjectTypes } from '@slices/projects/projectTypesSlice';
import { fetchStatusGroups } from '@slices/projects/statusGroupsSlice';
import StatusGroupsManager from '@components/admin/StatusGroupsManager';
import { useTranslation } from 'react-i18next';
import { useNotification } from '@contexts/application/NotificationContext';

const ProjectTypesWithStatusesManager = () => {
	const dispatch = useDispatch();
	const { t } = useTranslation('translation', { keyPrefix: 'components.admin.project_types_with_statuses_manager' });
	const projectTypes = useSelector((state) => state.projectTypes.items);
	const statusGroups = useSelector((state) => state.statusGroups.items);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	const { addNotification } = useNotification();

	useEffect(() => {
		const loadProjectTypesAndStatuses = async () => {
			try {
				await dispatch(fetchProjectTypes()).unwrap();
				setLoading(false);
			} catch (error) {
				setError(t('fetch_error'));
				addNotification(t('fetch_error'), 'error');
				setLoading(false);
			}
		};

		loadProjectTypesAndStatuses();
	}, [dispatch, addNotification, t]);

	const handleTabSelect = async (projectTypeId) => {
		if (!statusGroups[projectTypeId]) {
			try {
				await dispatch(fetchStatusGroups(projectTypeId)).unwrap();
			} catch (error) {
				addNotification(t('fetch_error'), 'error');
			}
		}
	};

	if (loading) {
		return <Spinner animation="border" />;
	}

	if (error) {
		return <Alert variant="danger">{error}</Alert>;
	}

	if (!projectTypes.length) {
		return <div>{t('no_project_types')}</div>;
	}

	return (
		<Tabs defaultActiveKey={projectTypes[0]?.id} id="project-types-tabs" className="mb-3" onSelect={handleTabSelect}>
			{projectTypes.map((projectType) => (
				<Tab eventKey={projectType.id} title={projectType.title} key={projectType.id}>
					<StatusGroupsManager projectTypeId={projectType.id} />
				</Tab>
			))}
		</Tabs>
	);
};

export default ProjectTypesWithStatusesManager;
