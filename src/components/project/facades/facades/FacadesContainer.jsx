import React from 'react';
import { useSelector } from 'react-redux';
import FacadeCard from '@components/project/facades/facades/FacadeCard';
import { selectFacadesByGroupFacadeId } from '@slices/facades/facadesSlice';
import { Button } from 'react-bootstrap';
import { PlusLg } from 'react-bootstrap-icons';
import { useFacadeProjectModals } from '@contexts/facades_project/FacadeProjectModalsContext';
import { useFacadesProject } from '@contexts/facades_project/FacadesProjectContext';
import { useTranslation } from 'react-i18next';

const FacadesContainer = ({ groupFacadeId }) => {
	const facades = useSelector((state) => selectFacadesByGroupFacadeId(state, groupFacadeId));
	const { handleCreateFacade } = useFacadeProjectModals();
	const { mode } = useFacadesProject();
	const { t } = useTranslation('translation', { keyPrefix: 'components.project.facades.group_facades' });

	if (!facades) {
		return null;
	}

	return (
		<div className="d-flex flex-column align-items-center p-2px gap-2px">
			<div className="d-flex flex-row justify-content-around align-items-center gap-2px">
				{facades.map((facade) => (
					<FacadeCard key={facade.id} facadeId={facade.id} />
				))}
			</div>
			{mode === 'edit' && (
				<Button variant="outline-success" onClick={() => handleCreateFacade(groupFacadeId)}>
					<PlusLg size={20} />
					{t('button_create_facade')}
				</Button>
			)}
		</div>
	);
};

export default FacadesContainer;
