import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import CustomSelect from '@components/common/basic/CustomSelect';
import { fetchElementTypes } from '@slices/facades/elementTypesSlice';
import { Spinner } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';

const SelectElementType = ({ value, onChange, isMulti = false, ...props }) => {
	const dispatch = useDispatch();
	const elementTypes = useSelector((state) => state.elementTypes.items);
	const elementTypesStatus = useSelector((state) => state.elementTypes.status.fetchAll);
	const elementTypesError = useSelector((state) => state.elementTypes.error.fetchAll);
	const { t } = useTranslation('translation', { keyPrefix: 'components.common.select' });

	useEffect(() => {
		if (elementTypesStatus === 'idle') {
			dispatch(fetchElementTypes());
		}
	}, [dispatch, elementTypesStatus]);

	if (elementTypesStatus === 'loading') {
		return <Spinner animation="border" />;
	}

	if (elementTypesStatus === 'failed') {
		return <div>Error: {elementTypesError}</div>;
	}

	const options = elementTypes.map((type) => ({
		value: type.id,
		label: type.title
	}));

	const handleChange = (selectedOption) => {
		if (isMulti) {
			onChange(selectedOption ? selectedOption.map((option) => option.value) : []);
		} else {
			onChange(selectedOption ? selectedOption.value : null);
		}
	};

	const selectedValue = isMulti ? options.filter((option) => value.includes(option.value)) : options.find((option) => option.value === value);

	return <CustomSelect value={selectedValue} onChange={handleChange} options={options} isMulti={isMulti} placeholder={t('element_type_select.placeholder')} {...props} />;
};

export default SelectElementType;
