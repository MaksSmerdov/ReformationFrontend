import React from 'react';
import IconSpecialization from '@components/common/icon/IconSpecialization';
import SelectTeamRole from '@components/common/select/SelectTeamRole';
import { useTranslation } from 'react-i18next';

const TeamUsersViewer = ({ users, showRole = false, className, ...props }) => {
	const { t } = useTranslation('translation', { keyPrefix: 'components.common.select.team_role' });

	if (!Array.isArray(users) || users.length === 0) {
		return null;
	}

	return (
		<table className={`table table-bordered m-0 ${className}`} {...props}>
			<tbody>
				{users.map((user, index) => (
					<tr key={index}>
						<td className="bg-transparent">
							<IconSpecialization id={user.specialization_id} title={user.specialization_id} />
						</td>
						{showRole && <td className="bg-transparent">{t(user.team_role)}</td>}
						<td className="bg-transparent">{`${user.user.first_name} ${user.user.last_name}`}</td>
					</tr>
				))}
			</tbody>
		</table>
	);
};

export default React.memo(TeamUsersViewer);
