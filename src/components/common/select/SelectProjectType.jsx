import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import CustomSelect from '@components/common/basic/CustomSelect';
import { fetchProjectTypes } from '@slices/projects/projectTypesSlice';
import { Spinner } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';

const SelectProjectType = ({ value, onChange, isDisabled }) => {
	const dispatch = useDispatch();
	const projectTypes = useSelector((state) => state.projectTypes.items);
	const projectTypesStatus = useSelector((state) => state.projectTypes.status.fetchAll);
	const projectTypesError = useSelector((state) => state.projectTypes.error.fetchAll);
	const { t } = useTranslation('translation', { keyPrefix: 'components.common.select' });

	useEffect(() => {
		if (projectTypesStatus === 'idle') {
			dispatch(fetchProjectTypes());
		}
	}, [dispatch, projectTypesStatus]);

	if (projectTypesStatus === 'loading') {
		return <Spinner animation="border" />;
	}

	if (projectTypesStatus === 'failed') {
		return <div>Error: {projectTypesError}</div>;
	}

	const options = projectTypes.map((type) => ({
		value: type.id,
		label: type.title
	}));

	const selectedType = options.find((option) => option.value === value);

	return <CustomSelect value={selectedType} onChange={(option) => onChange(option.value)} options={options} placeholder={t('select_project_type.placeholder')} isDisabled={isDisabled} />;
};

export default SelectProjectType;
