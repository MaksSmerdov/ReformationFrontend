import React, { useCallback } from 'react';
import SelectUser from '@components/common/select/SelectUser';
import SelectSpecialization from '@components/common/select/SelectSpecialization';
import SelectTeamRole from '@components/common/select/SelectTeamRole';
import IconButton from '@components/common/icon/IconButton';
import { PlusLg, Trash, ArrowCounterclockwise } from 'react-bootstrap-icons';
import { useTranslation } from 'react-i18next';
import IconEvent from '@components/common/icon/IconEvent';
import { Card } from 'react-bootstrap';

const TeamUsersChanger = ({ users, setUsers, className }) => {
	const { t } = useTranslation('translation', { keyPrefix: 'components.common.select' });

	const handleUserChange = useCallback(
		(index, selectedUserId) => {
			const updatedUsers = [...users];
			const updatedUser = { ...updatedUsers[index], user: { ...updatedUsers[index].user, id: selectedUserId } };
			updatedUsers[index] = updatedUser;
			setUsers(updatedUsers);
		},
		[users, setUsers]
	);

	const handleRoleChange = useCallback(
		(index, selectedRole) => {
			const updatedUsers = [...users];
			const updatedUser = { ...updatedUsers[index], team_role: selectedRole.target.value };
			updatedUsers[index] = updatedUser;
			setUsers(updatedUsers);
		},
		[users, setUsers]
	);

	const handleSpecializationChange = useCallback(
		(index, specializationId) => {
			const updatedUsers = [...users];
			const updatedUser = { ...updatedUsers[index], specialization_id: specializationId };
			updatedUsers[index] = updatedUser;
			setUsers(updatedUsers);
		},
		[users, setUsers]
	);

	const handleAddRow = useCallback(() => {
		setUsers([...users, { user: { id: null }, team_role: null, specialization_id: null }]);
	}, [users, setUsers]);

	const handleRemoveRow = useCallback(
		(index) => {
			const updatedUsers = [...users];
			updatedUsers.splice(index, 1);
			setUsers(updatedUsers);
		},
		[users, setUsers]
	);

	const excludedUserIds = users.map((user) => user.user.id);

	return (
		<Card className={className}>
			<Card.Body className="p-0 overflow-hidden">
				<div className="p-2px d-grid gap-2px align-items-center overflow-auto" style={{ gridTemplateColumns: 'min-content 1fr 1fr 1fr min-content', maxHeight: '300px' }}>
					{users.map((user, index) => (
						<React.Fragment key={index}>
							<IconEvent className="wh-resize-button" isValid={user.user.id && user.team_role && user.specialization_id} />
							<SelectSpecialization className="w-100" value={user.specialization_id} onChange={(specializationId) => handleSpecializationChange(index, specializationId)} />
							<SelectTeamRole className="w-100" value={user.team_role} onChange={(selectedRole) => handleRoleChange(index, selectedRole)} isEditable={true} />
							<SelectUser className="w-100" value={user.user.id} onChange={(selectedUserId) => handleUserChange(index, selectedUserId)} excludedUserIds={excludedUserIds} />
							<IconButton className="wh-resize-button" icon={Trash} variant="danger" onClick={() => handleRemoveRow(index)} />
						</React.Fragment>
					))}
					<div className="d-flex justify-content-center" style={{ gridColumn: 'span 5' }}>
						<IconButton className="w-100 h-resize-button" icon={PlusLg} variant="success" onClick={handleAddRow} />
					</div>
				</div>
			</Card.Body>
		</Card>
	);
};

export default React.memo(TeamUsersChanger);
