import React, { useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import SelectUser from '@components/common/select/SelectUser';
import SelectRole from '@components/common/select/SelectRole';
import IconButton from '@components/common/icon/IconButton';
import { PlusLg, Trash, ArrowCounterclockwise } from 'react-bootstrap-icons';
import { useTranslation } from 'react-i18next';
import IconEvent from '@components/common/icon/IconEvent';
import { Card, Spinner } from 'react-bootstrap';
import { fetchRoles } from '@slices/users/rolesSlice';
import { fetchUsers } from '@slices/users/usersSlice';

const ProjectUsersRolesComponent = ({ userRoles, setUserRoles, className }) => {
	const { t } = useTranslation('translation', { keyPrefix: 'components.common.select' });
	const dispatch = useDispatch();

	const rolesStatus = useSelector((state) => state.roles.status.fetchAll);
	const usersStatus = useSelector((state) => state.users.fetchAllStatus);

	useEffect(() => {
		if (rolesStatus === 'idle') {
			dispatch(fetchRoles());
		}
		if (usersStatus === 'idle') {
			dispatch(fetchUsers());
		}
	}, [dispatch, rolesStatus, usersStatus]);

	const handleUserChange = useCallback(
		(index, selectedUserId) => {
			const updatedUserRoles = [...userRoles];
			updatedUserRoles[index].userId = selectedUserId;
			updatedUserRoles[index].isUpdated = true;
			setUserRoles(updatedUserRoles);
		},
		[userRoles, setUserRoles]
	);

	const handleRoleChange = useCallback(
		(index, selectedRole) => {
			const updatedUserRoles = [...userRoles];
			updatedUserRoles[index].roleId = selectedRole.value;
			updatedUserRoles[index].roleName = selectedRole.label;
			updatedUserRoles[index].isUpdated = true;
			setUserRoles(updatedUserRoles);
		},
		[userRoles, setUserRoles]
	);

	const handleAddRow = useCallback(() => {
		setUserRoles([...userRoles, { userId: null, roleId: null, userName: '', roleName: '', isCreating: true }]);
	}, [userRoles, setUserRoles]);

	const handleRemoveRow = useCallback(
		(index) => {
			const updatedUserRoles = [...userRoles];
			if (updatedUserRoles[index].isCreating) {
				updatedUserRoles.splice(index, 1);
			} else {
				updatedUserRoles[index].isDeleting = !updatedUserRoles[index].isDeleting;
			}
			setUserRoles(updatedUserRoles);
		},
		[userRoles, setUserRoles]
	);

	const excludedUserIds = userRoles.map((userRole) => userRole.userId);

	if (rolesStatus !== 'succeeded' || usersStatus !== 'succeeded') {
		return (
			<Card className={className}>
				<Card.Body className="p-0 overflow-hidden">
					<div className="d-flex justify-content-center align-items-center" style={{ height: '300px' }}>
						<Spinner animation="border" />
					</div>
				</Card.Body>
			</Card>
		);
	}

	return (
		<Card className={className}>
			<Card.Body className="p-0 overflow-hidden">
				<div className="p-2px d-grid gap-2px align-items-center overflow-auto" style={{ gridTemplateColumns: 'min-content 1fr 1fr min-content', maxHeight: '300px' }}>
					{userRoles.map((userRole, index) => (
						<React.Fragment key={index}>
							<IconEvent className="wh-resize-button" isCreating={userRole.isCreating} isDeleting={userRole.isDeleting} isUpdated={userRole.isUpdated} isValid={userRole.userId && userRole.roleId} />
							<SelectUser className="w-100" value={userRole.userId} onChange={(selectedUserId) => handleUserChange(index, selectedUserId)} excludedUserIds={excludedUserIds} />
							<SelectRole className="w-100" value={{ value: userRole.roleId, label: userRole.roleName }} onChange={(selectedRole) => handleRoleChange(index, selectedRole)} />
							<IconButton className="wh-resize-button" icon={userRole.isDeleting ? ArrowCounterclockwise : Trash} variant={userRole.isDeleting ? 'warning' : 'danger'} onClick={() => handleRemoveRow(index)} />
						</React.Fragment>
					))}
					<div className="d-flex justify-content-center" style={{ gridColumn: 'span 4' }}>
						<IconButton className="w-100 h-resize-button" icon={PlusLg} variant="success" onClick={handleAddRow} />
					</div>
				</div>
			</Card.Body>
		</Card>
	);
};

export default React.memo(ProjectUsersRolesComponent);
