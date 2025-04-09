import React from 'react';
import { useSelector } from 'react-redux';
import { Card } from 'react-bootstrap';
import FacadesContainer from '@components/project/facades/facades/FacadesContainer';
import { useFacadeProjectModals } from '@contexts/facades_project/FacadeProjectModalsContext';
import FacadeGroupCardButtons from '@components/project/facades/group_facades/FacadeGroupCardButtons';
import { useTranslation } from 'react-i18next';

const FacadeGroupCard = ({ groupFacadeId }) => {
	const groupFacade = useSelector((state) => state.groupFacades.byId[groupFacadeId]);
	const { t } = useTranslation('translation', { keyPrefix: 'components.project.facades.group_facades' });

	return (
		<div>
			<Card className="border-emphasis overflow-hidden rounded-top-2 rounded-bottom-0">
				<Card.Header className="border-emphasis p-1px">
					<div className="p-0 ps-2 gap-2 d-flex justify-content-between align-items-center">
						<span>{groupFacade.title}</span>
						<FacadeGroupCardButtons groupFacade={groupFacade} />
					</div>
				</Card.Header>
				<Card.Body className="p-0">
					<FacadesContainer groupFacadeId={groupFacade.id} />
				</Card.Body>
			</Card>
		</div>
	);
};

export default FacadeGroupCard;
