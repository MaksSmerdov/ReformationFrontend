import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Button, Form, Modal, Alert, Spinner } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { updatePermission, fetchPermissions } from '@slices/users/permissionsSlice';

const PermissionModal = ({ permission = null, show, onHide, onSuccess }) => {
	const dispatch = useDispatch();
	const [description, setDescription] = useState('');
	const { t } = useTranslation('translation', { keyPrefix: 'components.admin.permission_modal' });
	const permissionsStatus = useSelector((state) => state.permissions.status.fetchAll);
	const permissionsError = useSelector((state) => state.permissions.error.fetchAll);

	useEffect(() => {
		if (permissionsStatus === 'idle') {
			dispatch(fetchPermissions());
		}
	}, [dispatch, permissionsStatus]);

	useEffect(() => {
		if (permission) {
			setDescription(permission.description || '');
		} else {
			setDescription('');
		}
	}, [permission]);

	const handleSubmit = (e) => {
		e.preventDefault();
		const data = { description };
		if (permission) {
			dispatch(updatePermission({ id: permission.id, ...data })).then((response) => {
				if (response.error) {
					onSuccess(t('permission_update_failed'));
				} else {
					onSuccess(t('permission_updated'));
				}
			});
		}
	};

	if (!show) {
		return null;
	}

	if (permissionsStatus === 'loading') {
		return <Spinner animation="border" />;
	}

	if (permissionsStatus === 'failed') {
		return (
			<Alert variant="danger">
				{t('error_loading_permissions')}: {permissionsError}
			</Alert>
		);
	}

	if (!permission) {
		return <Alert variant="warning">{t('no_permission_selected')}</Alert>;
	}

	return (
		<Modal show={show} onHide={onHide}>
			<Modal.Header closeButton>
				<Modal.Title>{t('header_update')}</Modal.Title>
			</Modal.Header>
			<Modal.Body>
				<Form onSubmit={handleSubmit} className="d-flex flex-column gap-2">
					<Form.Group controlId="formPermissionName" className="d-flex flex-column">
						<Form.Label className="m-0">{t('name')}</Form.Label>
						<Form.Label className="ms-3 m-0 fw-bold">{permission.name}</Form.Label>
					</Form.Group>
					<Form.Group controlId="formPermissionDescription" className="">
						<Form.Label className="m-0">{t('description')}</Form.Label>
						<Form.Control type="text" value={description} onChange={(e) => setDescription(e.target.value)} placeholder={t('description_placeholder')} maxLength={1024} className="px-2 py-1px lh-1" />
					</Form.Group>
					<Form.Group className="text-center">
						<Button variant="primary" type="submit">
							{t('button_update')}
						</Button>
					</Form.Group>
				</Form>
			</Modal.Body>
		</Modal>
	);
};

export default PermissionModal;
