import React from 'react';
import { useTranslation } from 'react-i18next';
import CustomSelect from '@components/common/basic/CustomSelect';

const directions = ['north', 'north_east', 'east', 'south_east', 'south', 'south_west', 'west', 'north_west'];

const SelectFacadeDirection = ({ value, onChange, ...props }) => {
	const { t } = useTranslation('translation', { keyPrefix: 'components.common.select.facade_direction' });

	const options = directions.map((direction) => ({
		value: direction,
		label: t('direction_' + direction)
	}));

	const selectedOption = options.find((option) => option.value === value);

	const handleChange = (selectedOption) => {
		onChange(selectedOption ? selectedOption.value : null);
	};

	return <CustomSelect value={selectedOption} onChange={handleChange} options={options} placeholder={t('placeholder')} {...props} />;
};

export default SelectFacadeDirection;
