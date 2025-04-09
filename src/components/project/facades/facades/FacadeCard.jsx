import React from 'react';
import { useSelector } from 'react-redux';
import { Card } from 'react-bootstrap';
import FacadeDataLoader from '@components/project/facades/facades/FacadeDataLoader';
import { selectFacadeById } from '@slices/facades/facadesSlice';
import FacadeCardButtons from '@components/project/facades/facades/FacadeCardButtons';

const FacadeCard = React.memo(({ facadeId }) => {
	const facade = useSelector((state) => selectFacadeById(state, facadeId));

	return (
		<Card className="border-emphasis overflow-hidden rounded-top-2 rounded-bottom-0">
			<Card.Header className="border-emphasis p-1px">
				<div className="p-0 ps-2 gap-2 d-flex justify-content-between align-items-center">
					<span>{facade.title}</span>
					<FacadeCardButtons facade={facade} />
				</div>
			</Card.Header>
			<Card.Body className="d-flex flex-row justify-content-around align-items-center p-2px gap-2px">
				<FacadeDataLoader facadeId={facade.id} />
			</Card.Body>
		</Card>
	);
});

export default FacadeCard;
