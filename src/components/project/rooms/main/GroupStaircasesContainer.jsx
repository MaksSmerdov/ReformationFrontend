import { Spinner, Alert } from 'react-bootstrap';
import OneStaircaseContainer from '@components/project/rooms/main/OneStaircaseContainer';
import { useSelector } from 'react-redux';

const GroupStaircasesContainer = () => {
	const staircases = useSelector((state) => state.currentProject.staircases.items);

	return (
		<div className="d-flex flex-row justify-content-between overflow-x-auto" style={{ gap: '80px' }}>
			{staircases.map((staircase) => (
				<OneStaircaseContainer key={staircase.id} staircaseId={staircase.id} />
			))}
		</div>
	);
};

export default GroupStaircasesContainer;
