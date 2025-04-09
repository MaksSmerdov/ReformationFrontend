import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import CustomSelect from '@components/common/basic/CustomSelect';
import { fetchUsers } from '@slices/users/usersSlice';
import { Spinner } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';

const TF_SelectAuthor = ({ value, onChange, isMulti = false, excludedUserIds = [], style, className }) => {
	const dispatch = useDispatch();
	const users = useSelector((state) => state.users.items);
	const usersStatus = useSelector((state) => state.users.status);
	const usersError = useSelector((state) => state.users.error);
	const { t } = useTranslation('translation', { keyPrefix: 'components.common.select' });

	useEffect(() => {
		if (usersStatus === 'idle') {
			dispatch(fetchUsers());
		}
	}, [dispatch, usersStatus]);

	if (usersStatus === 'loading') {
		return <Spinner animation="border" />;
	}

	if (usersStatus === 'failed') {
		return <div>Error: {usersError}</div>;
	}

	const options = users
		.filter((userRecord) => !excludedUserIds.includes(userRecord.id))
		.map((userRecord) => ({
			value: userRecord.id,
			label: `${userRecord.first_name} ${userRecord.last_name}`
		}));

	const selectedValue = value ? options.find((option) => option.value === value.value) : null;

	return <CustomSelect style={{ ...style, minWidth: '100px' }} className={className} value={selectedValue} onChange={onChange} options={options} isMulti={isMulti} placeholder={t('select_author.placeholder')} />;
};

export default TF_SelectAuthor;
