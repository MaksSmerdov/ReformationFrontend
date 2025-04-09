import React, { useState } from 'react';
import SelectSiteLanguage from '@components/common/select/SelectSiteLanguage';
import SelectStatus from '@components/common/select/SelectStatus';
import ThemeSwitcher from '@components/common/switcher/ThemeSwitcher';
import { Form } from 'react-bootstrap';

const TestPage = () => {
	const [specialization, setSpecialization] = useState(1);
	const [teams, setTeams] = useState([]);
	const [selectedStatuses, setSelectedStatuses] = useState([]);

	const handleSetSpecialization = (specialization) => {
		console.log('TestPage handleSetSpecialization:', specialization);
		setSpecialization(specialization);
	};

	const handleStatusChange = (statuses) => {
		console.log('Selected statuses:', statuses);
		setSelectedStatuses(statuses);
	};

	return (
		<div className="d-flex flex-column gap-4 p-4">
			<div>
				<SelectSiteLanguage />
			</div>
			<div>
				<ThemeSwitcher />
			</div>
			<div>
				<SelectStatus projectTypeId={2} value={selectedStatuses} onChange={handleStatusChange} isMulti={true} />
			</div>
		</div>
	);
};

export default TestPage;
