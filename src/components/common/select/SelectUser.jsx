import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import CustomSelect from '@components/common/basic/CustomSelect';
import { fetchUsers } from '@slices/users/usersSlice';
import { Spinner } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';

const SelectUser = ({ value, onChange, isMulti = false, excludedUserIds = [], className, ...props }) => {
	const dispatch = useDispatch();
	const users = useSelector((state) => state.users.items);
	const usersStatus = useSelector((state) => state.users.fetchAllStatus);
	const usersError = useSelector((state) => state.users.error);
	const { t } = useTranslation('translation', { keyPrefix: 'components.common.select' });

	useEffect(() => {
		if (usersStatus === 'idle' && users.length === 0) {
			dispatch(fetchUsers());
		}
	}, [dispatch, usersStatus, users.length]);

	if (usersStatus === 'loading') {
		return <Spinner animation="border" />;
	}

	if (usersStatus === 'failed') {
		return <div>Error: {usersError}</div>;
	}

	const options = users
		.filter((userRecord) => !excludedUserIds.includes(userRecord.id) || userRecord.id === value || (Array.isArray(value) && value.includes(userRecord.id)))
		.map((userRecord) => ({
			value: userRecord.id,
			label: `${userRecord.first_name} ${userRecord.last_name}`
		}));

	const handleChange = (selectedOption) => {
		if (isMulti) {
			onChange(selectedOption ? selectedOption.map((option) => option.value) : []);
		} else {
			onChange(selectedOption ? selectedOption.value : null);
		}
	};

	const selectedValue = isMulti ? options.filter((option) => value.includes(option.value)) : options.find((option) => option.value === value);

	return <CustomSelect value={selectedValue} onChange={handleChange} options={options} isMulti={isMulti} placeholder={t('user_select.placeholder')} className={className} {...props} />;
};

export default SelectUser;
