import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Table } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { fetchUsers, deleteUser } from '@slices/users/usersSlice';
import UserModal from '@components/admin/Users/UserModal';
import { useNotification } from '@contexts/application/NotificationContext';
import { useConfirmation } from '@contexts/application/ConfirmationContext';
import IconButton from '@components/common/icon/IconButton';
import { Pencil, Trash, PlusLg } from 'react-bootstrap-icons';

const UsersTable = () => {
	const dispatch = useDispatch();
	const users = useSelector((state) => state.users.items);
	const { t } = useTranslation('translation', { keyPrefix: 'components.admin.users_manager' });
	const [showModal, setShowModal] = useState(false);
	const [selectedUser, setSelectedUser] = useState(null);
	const { addNotification } = useNotification();
	const { showConfirmation } = useConfirmation();

	useEffect(() => {
		dispatch(fetchUsers());
	}, [dispatch]);

	const handleCreate = () => {
		setSelectedUser(null);
		setShowModal(true);
	};

	const handleEdit = (userRecord) => {
		setSelectedUser(userRecord);
		setShowModal(true);
	};

	const handleDelete = (id) => {
		showConfirmation(t('confirm_delete_message'), async () => {
			try {
				await dispatch(deleteUser(id)).unwrap();
				addNotification(t('user_deleted'), 'success');
			} catch (error) {
				addNotification(error.message || t('error_occurred'), 'danger');
			}
		});
	};

	const handleCloseModal = () => {
		setShowModal(false);
	};

	const handleSuccess = () => {
		dispatch(fetchUsers());
		setShowModal(false);
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
							<th className="px-2 text-center">{t('table_column_login')}</th>
							<th className="px-2 text-center">{t('table_column_email')}</th>
							<th className="px-2 text-center">{t('table_column_roles')}</th>
							<th className="px-2 text-center">{t('table_column_permissions')}</th>
							<th className="px-2 text-center">{t('table_column_phones')}</th>
							<th className="w-1px"></th>
						</tr>
					</thead>
					<tbody>
						{users.map((userRecord) => (
							<tr key={userRecord.id}>
								<td>
									<IconButton icon={Pencil} variant="outline-primary" onClick={() => handleEdit(userRecord)} className="w-resize-button h-100 h-min-resize-button" />
								</td>
								<td className="px-2 text-center">
									{userRecord.first_name} {userRecord.last_name}
								</td>
								<td className="px-2 text-center">{userRecord.login}</td>
								<td className="px-2 text-center">{userRecord.email}</td>
								<td className="px-2 text-center">{userRecord.roles.map((role) => role.name).join(', ')}</td>
								<td className="px-2 text-center">{userRecord.permissions.map((permission) => permission.name).join(', ')}</td>
								<td className="px-2 text-center">{userRecord.phones.map((phone) => '+358' + phone.phone).join(', ')}</td>
								<td>
									<IconButton icon={Trash} variant="outline-danger" onClick={() => handleDelete(userRecord.id)} className="w-resize-button h-100 h-min-resize-button" />
								</td>
							</tr>
						))}
					</tbody>
				</Table>
			</div>

			<UserModal userRecord={selectedUser} show={showModal} onHide={handleCloseModal} onSuccess={handleSuccess} />
		</div>
	);
};

export default UsersTable;
