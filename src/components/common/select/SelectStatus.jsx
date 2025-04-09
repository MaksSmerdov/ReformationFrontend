import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchStatusGroups } from '@slices/projects/statusGroupsSlice';
import { fetchStatuses } from '@slices/projects/statusesSlice';
import CustomSelect from '@components/common/basic/CustomSelect';
import { Spinner } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import StatusIconById from '@components/project/rooms/statuses/StatusIconById';

const SelectStatus = ({ projectTypeId, value, onChange, isMulti = false, ...props }) => {
	const { t } = useTranslation('translation', { keyPrefix: 'components.common.select' });
	const dispatch = useDispatch();
	const statusGroups = useSelector((state) => state.statusGroups.items[projectTypeId] || []);
	const statuses = useSelector((state) => state.statuses.items);
	const statusGroupsStatus = useSelector((state) => state.statusGroups.status);
	const statusesStatus = useSelector((state) => state.statuses.status);

	const [options, setOptions] = useState([]);
	const [selectedOptions, setSelectedOptions] = useState([]);

	useEffect(() => {
		if (statusGroupsStatus !== 'succeeded') {
			dispatch(fetchStatusGroups(projectTypeId));
		}
	}, [dispatch, projectTypeId, statusGroupsStatus]);

	useEffect(() => {
		if (statusGroupsStatus === 'succeeded') {
			statusGroups.forEach((group) => {
				if (statusesStatus[group.id] !== 'succeeded') {
					dispatch(fetchStatuses({ groupId: group.id, projectTypeId }));
				}
			});
		}
	}, [dispatch, projectTypeId, statusGroups, statusGroupsStatus, statusesStatus]);

	useEffect(() => {
		if (statusGroupsStatus === 'succeeded' && Object.keys(statuses).length > 0) {
			const newOptions = statusGroups.flatMap((group) => {
				const groupStatuses = statuses[group.id] || [];
				return groupStatuses.map((status) => ({
					value: status.id,
					label: status.title,
					group: group.title
				}));
			});
			setOptions(newOptions);
		}
	}, [statusGroupsStatus, statuses, statusGroups]);

	useEffect(() => {
		const selected = options.filter((option) => (Array.isArray(value) ? value.includes(option.value) : value === option.value));
		setSelectedOptions(selected);
	}, [options, value]);

	if (statusGroupsStatus !== 'succeeded' || Object.keys(statuses).some((groupId) => statusesStatus[groupId] !== 'succeeded')) {
		return <Spinner animation="border" />;
	}

	const handleChange = (selectedOptions) => {
		setSelectedOptions(selectedOptions);
		if (onChange) {
			onChange(isMulti ? selectedOptions.map((option) => option.value) : selectedOptions.value);
		}
	};

	const groupedOptions = statusGroups.map((group) => ({
		label: group.title,
		options: options.filter((option) => option.group === group.title)
	}));

	const formatOptionLabel = ({ value, label }) => (
		<div className="d-flex align-items-center gap-2px">
			<StatusIconById id={value} className="wh-min-resize-button" />
			<span className="text-nowrap">{label}</span>
		</div>
	);

	return <CustomSelect value={selectedOptions} onChange={handleChange} options={groupedOptions} isMulti={isMulti} placeholder={t('select_status.placeholder')} formatOptionLabel={formatOptionLabel} closeMenuOnSelect={false} {...props} />;
};

export default SelectStatus;
