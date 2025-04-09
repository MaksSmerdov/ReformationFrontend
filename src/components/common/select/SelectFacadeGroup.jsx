import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import CustomSelect from '@components/common/basic/CustomSelect';
import { fetchGroupFacades } from '@slices/facades/groupFacadesSlice';
import { Spinner } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';

const SelectFacadeGroup = ({ value, onChange, isMulti = false, className, ...props }) => {
	const dispatch = useDispatch();
	const groupFacades = useSelector((state) => state.groupFacades.byId);
	const groupFacadesStatus = useSelector((state) => state.groupFacades.statuses.fetchAll);
	const groupFacadesError = useSelector((state) => state.groupFacades.errors.fetchAll);
	const { t } = useTranslation('translation', { keyPrefix: 'components.common.select' });

	useEffect(() => {
		if (groupFacadesStatus === 'idle') {
			dispatch(fetchGroupFacades());
		}
	}, [dispatch, groupFacadesStatus]);

	if (groupFacadesStatus === 'loading') {
		return <Spinner animation="border" />;
	}

	if (groupFacadesStatus === 'failed') {
		return <div>Error: {groupFacadesError}</div>;
	}

	const options = Object.values(groupFacades).map((groupFacade) => ({
		value: groupFacade.id,
		label: groupFacade.title
	}));

	const handleChange = (selectedOption) => {
		if (isMulti) {
			onChange(selectedOption ? selectedOption.map((option) => option.value) : []);
		} else {
			onChange(selectedOption ? selectedOption.value : null);
		}
	};

	const selectedValue = isMulti ? options.filter((option) => value.includes(option.value)) : options.find((option) => option.value === value);

	return <CustomSelect value={selectedValue} onChange={handleChange} options={options} isMulti={isMulti} placeholder={t('facade_group_select.placeholder')} className={className} {...props} />;
};

export default SelectFacadeGroup;
