import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import CustomSelect from '@components/common/basic/CustomSelect';
import { fetchEquipments } from '@slices/teams/equipmentsSlice';
import { Spinner } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';

const SelectEquipment = ({ value, onChange, excludedEquipmentIds = [], ...props }) => {
	const dispatch = useDispatch();
	const equipments = useSelector((state) => state.equipments.items);
	const status = useSelector((state) => state.equipments.status.fetch);
	const { t } = useTranslation('translation', { keyPrefix: 'components.common.select' });

	useEffect(() => {
		if (status === 'idle') {
			dispatch(fetchEquipments());
		}
	}, [dispatch, status]);

	const options = equipments
		.filter((equipmentObject) => !excludedEquipmentIds.includes(equipmentObject.id) || equipmentObject.id === value)
		.map((equipmentObject) => ({
			value: equipmentObject.id,
			label: `${equipmentObject.model} ${equipmentObject.name}`,
			equipmentObject
		}));

	const selectedOption = options.find((option) => option.value === value);

	const handleChange = (selectedOption) => {
		if (onChange) {
			onChange(selectedOption ? selectedOption.value : null);
		}
	};

	if (status === 'loading') {
		return <Spinner animation="border" />;
	}

	if (status === 'failed') {
		return <div>{t('error_loading_equipments')}</div>;
	}

	return <CustomSelect value={selectedOption} onChange={handleChange} options={options} placeholder={t('equipment_select.placeholder')} {...props} />;
};

export default SelectEquipment;
