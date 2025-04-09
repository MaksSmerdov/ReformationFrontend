import React from 'react';
import { useSelector } from 'react-redux';
import CustomSelect from '@components/common/basic/CustomSelect';
import { Spinner } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';

const SelectUserInProject = ({ selectedUserIds, onChange, showPhonesAsLinks = false, isMulti = false, className }) => {
	const projectUsers = useSelector((state) => state.currentProject.users.items);
	const { t } = useTranslation('translation', { keyPrefix: 'components.common.select' });

	if (!projectUsers.length) {
		return (
			<Spinner animation="border" role="status">
				<span className="visually-hidden">Loading...</span>
			</Spinner>
		);
	}

	const userImageSrc = '/images/roles/others.png'; // userRecord.index_icon

	const options = projectUsers.map((userRecord) => ({
		value: userRecord.id,
		label: userRecord
	}));

	const selectedOptions = options.filter((option) => selectedUserIds.includes(option.value));

	const handleChange = (selected) => {
		if (isMulti) {
			onChange(selected.map((option) => option.value));
		} else {
			onChange(selected ? selected.value : null);
		}
	};

	const formatOptionLabel = ({ value, label: userRecord }, { context }) => (
		<div className="d-flex flex-row gap-2 align-items-center">
			{/* <img src={userImageSrc} className="" style={{ width: '24px', height: '24px' }} /> */}
			<div className="d-flex flex-column justify-content-between gap-2px lh-1">
				<div className="fw-bold">{`${userRecord.first_name} ${userRecord.last_name}`}</div>
				<div className="text-muted">{userRecord.role.name}</div>
				<div className="text-muted d-flex flex-column">{userRecord.phones && userRecord.phones.length > 0 ? userRecord.phones.map((phone) => <React.Fragment key={phone.phone}>{context != 'menu' && showPhonesAsLinks ? <a href={`tel:+358${phone.phone}`}>{`+358${phone.phone}`}</a> : <div>+358{phone.phone}</div>}</React.Fragment>) : ' '}</div>
			</div>
		</div>
	);

	return <CustomSelect value={selectedOptions} onChange={handleChange} options={options} isMulti={isMulti} className={className} placeholder={t('user_select_project_page.placeholder')} classNamePrefix="react-select" formatOptionLabel={formatOptionLabel} />;
};

export default SelectUserInProject;
