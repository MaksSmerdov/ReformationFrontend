import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Table } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { fetchRoles } from '@slices/users/rolesSlice';
import { fetchPermissions } from '@slices/users/permissionsSlice';
import PermissionModal from '@components/admin/Permissions/PermissionModal';
import { useNotification } from '@contexts/application/NotificationContext';
import IconButton from '@components/common/icon/IconButton';
import { Pencil } from 'react-bootstrap-icons';

const PermissionsTable = () => {
	const dispatch = useDispatch();
	const permissions = useSelector((state) => state.permissions.items);
	const { t } = useTranslation('translation', { keyPrefix: 'components.admin.permissions_table' });
	const [showModal, setShowModal] = useState(false);
	const [selectedPermission, setSelectedPermission] = useState(null);
	const { addNotification } = useNotification();

	useEffect(() => {
		dispatch(fetchPermissions());
	}, [dispatch]);

	const handleEdit = (permission) => {
		setSelectedPermission(permission);
		setShowModal(true);
	};

	const handleCloseModal = () => {
		setShowModal(false);
	};

	const handleSuccess = (message) => {
		addNotification(message, 'success');
		setShowModal(false);
		dispatch(fetchPermissions());
		dispatch(fetchRoles());
	};

	return (
		<div className="w-100 d-flex flex-column align-items-center justify-content-center">
			<h1>{t('component_title')}</h1>

			<div className="d-flex w-100 overflow-auto justify-content-around">
				<Table striped bordered hover className="m-0 w-max-content">
					<thead>
						<tr>
							<th className="w-1px"></th>
							<th className="px-2 text-center">{t('table_column_name')}</th>
							<th className="px-2 text-center">{t('table_column_description')}</th>
						</tr>
					</thead>
					<tbody>
						{permissions.map((permission) => (
							<tr key={permission.id}>
								<td>
									<IconButton icon={Pencil} variant="outline-primary" onClick={() => handleEdit(permission)} className="w-resize-button h-100 h-min-resize-button" />
								</td>
								<td className="px-2 text-center">{permission.name}</td>
								<td className="px-2 text-center">{permission.description}</td>
							</tr>
						))}
					</tbody>
				</Table>
			</div>

			<PermissionModal permission={selectedPermission} show={showModal} onHide={handleCloseModal} onSuccess={handleSuccess} />
		</div>
	);
};

export default PermissionsTable;
