import React, { useState } from 'react';
import { Form } from 'react-bootstrap';
import FPSM_GroupsContainer from '@components/project/facades/fpsm/FPSM_GroupsContainer';

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
				<FPSM_GroupsContainer projectTypeId={2} />
			</div>
		</div>
	);
};

export default TestPage;
