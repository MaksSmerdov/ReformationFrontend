import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import CustomSelect from '@components/common/basic/CustomSelect';
import { fetchPermissions } from '@slices/users/permissionsSlice';
import { Spinner } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';

const SelectPermission = ({ value, onChange, guardName, isMulti = false, showDescription = false, ...props }) => {
	const dispatch = useDispatch();
	const permissions = useSelector((state) => state.permissions.items);
	const permissionsStatus = useSelector((state) => state.permissions.status.fetchAll);
	const permissionsError = useSelector((state) => state.permissions.error.fetchAll);
	const { t } = useTranslation('translation', { keyPrefix: 'components.common.select' });

	useEffect(() => {
		if (permissionsStatus === 'idle' && permissions.length === 0) {
			dispatch(fetchPermissions());
		}
	}, [dispatch, permissionsStatus, permissions.length]);

	if (permissionsStatus === 'loading') {
		return <Spinner animation="border" />;
	}

	if (permissionsStatus === 'failed') {
		return <div>Error: {permissionsError}</div>;
	}

	const filteredPermissions = guardName ? permissions.filter((perm) => perm.guard_name === guardName) : permissions;

	const options = filteredPermissions.map((perm) => ({
		value: perm.id,
		label: perm.name,
		description: perm.description
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

	return <CustomSelect value={value} onChange={onChange} options={options} isMulti={isMulti} placeholder={t('permission_select.placeholder')} formatOptionLabel={formatOptionLabel} {...props} />;
};

export default SelectPermission;
