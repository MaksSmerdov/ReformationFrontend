import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import CustomSelect from '@components/common/basic/CustomSelect';
import { fetchRoles } from '@slices/users/rolesSlice';
import { Spinner } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';

const SelectRole = ({ value, onChange, guardName, isMulti = false, showDescription = false, ...props }) => {
	const dispatch = useDispatch();
	const roles = useSelector((state) => state.roles.items);
	const rolesStatus = useSelector((state) => state.roles.status.fetchAll);
	const rolesError = useSelector((state) => state.roles.error.fetchAll);
	const { t } = useTranslation('translation', { keyPrefix: 'components.common.select' });

	useEffect(() => {
		if (rolesStatus === 'idle' && roles.length === 0) {
			dispatch(fetchRoles());
		}
	}, [dispatch, rolesStatus, roles.length]);

	if (rolesStatus === 'loading') {
		return <Spinner animation="border" />;
	}

	if (rolesStatus === 'failed') {
		return <div>Error: {rolesError}</div>;
	}

	const filteredRoles = guardName ? roles.filter((role) => role.guard_name === guardName) : roles;

	const options = filteredRoles.map((role) => ({
		value: role.id,
		label: role.name,
		description: role.description
	}));

	const formatOptionLabel = ({ value: valueLocal, label, description }, { context }) => {
		const isSelected = Array.isArray(value) ? value.includes(valueLocal) : value === valueLocal;
		return (
			<div className="d-flex flex-column">
				<div title={description}>{label}</div>
				{showDescription && !isSelected && context === 'menu' && <div className="lh-1 text-smaller text-muted">{description}</div>}
			</div>
		);
	};

	return <CustomSelect value={value} onChange={onChange} options={options} isMulti={isMulti} placeholder={t('role_select.placeholder')} formatOptionLabel={formatOptionLabel} {...props} />;
};

export default SelectRole;
