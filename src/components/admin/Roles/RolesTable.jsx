import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Table } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { fetchRoles, deleteRole } from '@slices/users/rolesSlice';
import RoleModal from '@components/admin/Roles/RoleModal';
import { useNotification } from '@contexts/application/NotificationContext';
import { useConfirmation } from '@contexts/application/ConfirmationContext';
import IconButton from '@components/common/icon/IconButton';
import { Pencil, Trash, PlusLg } from 'react-bootstrap-icons';

const RolesTable = () => {
	const dispatch = useDispatch();
	const roles = useSelector((state) => state.roles.items);
	const { t } = useTranslation('translation', { keyPrefix: 'components.admin.roles_table' });
	const [showModal, setShowModal] = useState(false);
	const [selectedRole, setSelectedRole] = useState(null);
	const { addNotification } = useNotification();
	const { showConfirmation } = useConfirmation();
	const [error, setError] = useState(null);
	const [errorDisplayed, setErrorDisplayed] = useState(false);

	useEffect(() => {
		dispatch(fetchRoles());
	}, [dispatch]);

	const handleCreate = () => {
		setSelectedRole(null);
		setShowModal(true);
	};

	const handleEdit = (role) => {
		setSelectedRole(role);
		setShowModal(true);
	};

	const handleDelete = (id) => {
		showConfirmation(t('confirm_delete_message'), () => {
			dispatch(deleteRole(id)).then((result) => {
				if (result.type === 'roles/deleteRole/fulfilled') {
					addNotification(t('role_deleted'), 'success');
				} else {
					setError(t('role_delete_failed'));
					setErrorDisplayed(false);
				}
			});
		});
	};

	useEffect(() => {
		if (error && !errorDisplayed) {
			addNotification(error, 'error');
			setErrorDisplayed(true);
		}
	}, [error, errorDisplayed, addNotification]);

	const handleCloseModal = () => {
		setShowModal(false);
	};

	const handleSuccess = (message) => {
		addNotification(message, 'success');
		setShowModal(false);
		dispatch(fetchRoles());
	};

	return (
		<div className="w-100 d-flex flex-column align-items-center justify-content-center">
			<h1>{t('component_title')}</h1>

			<div className="d-flex w-100 overflow-auto justify-content-around">
				<Table striped bordered hover className="m-0 w-max-content">
					<thead>
						<tr>
							<th className="w-1px">
								<IconButton icon={PlusLg} variant="success" onClick={handleCreate} className="w-resize-button h-100 h-min-resize-button" />
							</th>
							<th className="px-2 text-center">{t('table_column_name')}</th>
							<th className="px-2 text-center">{t('table_column_description')}</th>
							<th className="px-2 text-center">{t('table_column_permissions')}</th>
							<th className="w-1px"></th>
						</tr>
					</thead>
					<tbody>
						{roles.map((role) => (
							<tr key={role.id}>
								<td>
									<IconButton icon={Pencil} variant="outline-primary" onClick={() => handleEdit(role)} className="w-resize-button h-100 h-min-resize-button" />
								</td>
								<td className="px-2 text-center">{role.name}</td>
								<td className="px-2 text-center">{role.description}</td>
								<td className="px-2 text-center">{role.permissions ? role.permissions.map((perm) => perm.name).join(', ') : ''}</td>
								<td>
									<IconButton icon={Trash} variant="outline-danger" onClick={() => handleDelete(role.id)} className="w-resize-button h-100 h-min-resize-button" />
								</td>
							</tr>
						))}
					</tbody>
				</Table>
			</div>

			<RoleModal role={selectedRole} show={showModal} onHide={handleCloseModal} onSuccess={handleSuccess} />
		</div>
	);
};

export default RolesTable;
