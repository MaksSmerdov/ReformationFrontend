import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Button, Form, Modal, Alert, Spinner } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { createRole, updateRole, fetchRoles } from '@slices/users/rolesSlice';
import { fetchPermissions } from '@slices/users/permissionsSlice';
import { useNotification } from '@contexts/application/NotificationContext';
import SelectPermission from '@components/common/select/SelectPermission';

const RoleModal = ({ role = null, show, onHide, onSuccess }) => {
	const dispatch = useDispatch();
	const { t } = useTranslation('translation', { keyPrefix: 'components.admin.role_modal' });
	const { addNotification } = useNotification();

	const [name, setName] = useState('');
	const [description, setDescription] = useState('');
	const [selectedPermissions, setSelectedPermissions] = useState([]);
	const [error, setError] = useState(null);
	const [errorDisplayed, setErrorDisplayed] = useState(false);

	const rolesStatus = useSelector((state) => state.roles.status.fetchAll);
	const rolesError = useSelector((state) => state.roles.error.fetchAll);

	useEffect(() => {
		if (show) {
			dispatch(fetchPermissions());
			dispatch(fetchRoles());
		}
	}, [dispatch, show]);

	useEffect(() => {
		if (role) {
			setName(role.name || '');
			setDescription(role.description || '');
			setSelectedPermissions(role.permissions ? role.permissions.map((perm) => ({ value: perm.id, label: perm.name })) : []);
		} else {
			setName('');
			setDescription('');
			setSelectedPermissions([]);
		}
	}, [role]);

	useEffect(() => {
		if (error && !errorDisplayed) {
			addNotification(error, 'error');
			setErrorDisplayed(true);
		}
	}, [error, errorDisplayed, addNotification]);

	const handleSubmit = (e) => {
		e.preventDefault();
		const data = {
			name,
			description,
			permissions: selectedPermissions.map((perm) => ({ id: perm.value }))
		};
		if (role) {
			dispatch(updateRole({ id: role.id, ...data })).then((result) => {
				if (result.type === 'roles/updateRole/fulfilled') {
					onSuccess(t('role_updated'));
				} else {
					setError(t('role_update_failed'));
					setErrorDisplayed(false);
				}
			});
		} else {
			dispatch(createRole(data)).then((result) => {
				if (result.type === 'roles/createRole/fulfilled') {
					onSuccess(t('role_created'));
				} else {
					setError(t('role_create_failed'));
					setErrorDisplayed(false);
				}
			});
		}
	};

	if (!show) {
		return null;
	}

	if (rolesStatus === 'loading') {
		return <Spinner animation="border" />;
	}

	if (rolesStatus === 'failed') {
		return (
			<Alert variant="danger">
				{t('error_loading_roles')}: {rolesError}
			</Alert>
		);
	}

	return (
		<Modal show={show} onHide={onHide}>
			<Modal.Header closeButton>
				<Modal.Title>{role ? t('header_update') : t('header_create')}</Modal.Title>
			</Modal.Header>
			<Modal.Body>
				<Form onSubmit={handleSubmit} className="d-flex flex-column gap-2">
					<Form.Group controlId="formRoleName">
						<Form.Label className="m-0">{t('name')}</Form.Label>
						<Form.Control type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder={t('name_placeholder')} required autoComplete="off" className="px-2 py-1px lh-1" />
					</Form.Group>
					<Form.Group controlId="formRoleDescription">
						<Form.Label className="m-0">{t('description')}</Form.Label>
						<Form.Control type="text" value={description} onChange={(e) => setDescription(e.target.value)} placeholder={t('description_placeholder')} maxLength={1024} className="px-2 py-1px lh-1" />
					</Form.Group>
					<Form.Group controlId="formRolePermissions">
						<Form.Label className="m-0">{t('permissions')}</Form.Label>
						<SelectPermission value={selectedPermissions} onChange={setSelectedPermissions} guardName={role ? role.guard_name : 'sanctum'} isMulti />
					</Form.Group>
					<Form.Group className="text-center">
						<Button variant="primary" type="submit">
							{role ? t('button_update') : t('button_create')}
						</Button>
					</Form.Group>
				</Form>
			</Modal.Body>
		</Modal>
	);
};

export default RoleModal;
