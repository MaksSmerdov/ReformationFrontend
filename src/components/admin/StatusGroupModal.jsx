import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Button, Form, Modal } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { createStatusGroup, updateStatusGroup } from '@slices/projects/statusGroupsSlice';
import { fetchProjectTypes } from '@slices/projects/projectTypesSlice';

const StatusGroupModal = ({ statusGroup = null, show, onHide, onSuccess }) => {
	const dispatch = useDispatch();
	const { t } = useTranslation('translation', { keyPrefix: 'components.admin.status_group_modal' });
	const [title, setTitle] = useState('');
	const [color, setColor] = useState('#000000');
	const [projectTypeId, setProjectTypeId] = useState('');
	const [error, setError] = useState(null);
	const projectTypes = useSelector((state) => state.projectTypes.items);

	useEffect(() => {
		dispatch(fetchProjectTypes());
	}, [dispatch]);

	useEffect(() => {
		if (statusGroup) {
			setTitle(statusGroup.title);
			setColor(statusGroup.color || '#000000');
			setProjectTypeId(statusGroup.project_type_id);
		} else {
			setTitle('');
			setColor('#000000');
			setProjectTypeId('');
		}
	}, [statusGroup]);

	const handleSubmit = (e) => {
		e.preventDefault();
		const data = {
			title,
			color,
			project_type_id: projectTypeId
		};
		if (statusGroup) {
			dispatch(updateStatusGroup({ id: statusGroup.id, ...data })).then((result) => {
				if (result.type === 'statusGroups/updateStatusGroup/fulfilled') {
					onSuccess(t('status_group_updated'));
				} else {
					setError(t('status_group_update_failed'));
				}
			});
		} else {
			dispatch(createStatusGroup(data)).then((result) => {
				if (result.type === 'statusGroups/createStatusGroup/fulfilled') {
					onSuccess(t('status_group_created'));
				} else {
					setError(t('status_group_create_failed'));
				}
			});
		}
	};

	return (
		<Modal show={show} onHide={onHide}>
			<Modal.Header closeButton>
				<Modal.Title>{statusGroup ? t('header_update') : t('header_create')}</Modal.Title>
			</Modal.Header>
			<Modal.Body>
				<Form onSubmit={handleSubmit} className="d-flex flex-column gap-2">
					<Form.Group controlId="formStatusGroupTitle">
						<Form.Label className="m-0">{t('title')}</Form.Label>
						<Form.Control type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder={t('title_placeholder')} required autoComplete="off" />
					</Form.Group>
					<Form.Group controlId="formStatusGroupColor" className="mt-3">
						<Form.Label className="m-0">{t('color')}</Form.Label>
						<Form.Control type="color" value={color} onChange={(e) => setColor(e.target.value)} />
					</Form.Group>
					<Form.Group controlId="formStatusGroupProjectType" className="mt-3">
						<Form.Label className="m-0">{t('project_type')}</Form.Label>
						<Form.Control as="select" value={projectTypeId} onChange={(e) => setProjectTypeId(e.target.value)} required>
							<option value="" disabled>
								{t('select_project_type')}
							</option>
							{projectTypes.map((type) => (
								<option key={type.id} value={type.id}>
									{type.title}
								</option>
							))}
						</Form.Control>
					</Form.Group>
					<Form.Group>
						<Button variant="primary" type="submit">
							{statusGroup ? t('button_update') : t('button_create')}
						</Button>
					</Form.Group>
				</Form>
			</Modal.Body>
		</Modal>
	);
};

export default StatusGroupModal;
