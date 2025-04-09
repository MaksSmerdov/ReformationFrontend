import React, { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchGroupFacades } from '@slices/facades/groupFacadesSlice';
import { fetchAllFacades } from '@slices/facades/facadesSlice';
import { Spinner, Alert, Button } from 'react-bootstrap';
import FacadeGroupCard from '@components/project/facades/group_facades/FacadeGroupCard';
import { useFacadesProject } from '@contexts/facades_project/FacadesProjectContext';
import { useFacadeProjectModals } from '@contexts/facades_project/FacadeProjectModalsContext';
import { PlusLg } from 'react-bootstrap-icons';
import { useTranslation } from 'react-i18next';
import { resetGroupFacades } from '@slices/facades/groupFacadesSlice';

const FacadeGroupsContainer = () => {
	const { t } = useTranslation('translation', { keyPrefix: 'components.project.facades.group_facades' });
	const dispatch = useDispatch();
	const { project, mode } = useFacadesProject();
	const { handleCreateGroupFacade } = useFacadeProjectModals();
	const projectId = project.id;

	const groupFacades = useSelector((state) => state.groupFacades.byProjectId[projectId]);
	const groupFacadesStatus = useSelector((state) => state.groupFacades.statuses.fetchAll);
	const groupFacadesError = useSelector((state) => state.groupFacades.errors.fetchAll);

	const hasFetchedGroupFacades = useRef(false);

	useEffect(() => {
		if (!hasFetchedGroupFacades.current && groupFacadesStatus === 'idle') {
			dispatch(fetchGroupFacades(projectId));
			dispatch(fetchAllFacades(projectId));
			hasFetchedGroupFacades.current = true;
		}
	}, [dispatch, projectId, groupFacadesStatus]);

	useEffect(() => {
		return () => {
			dispatch(resetGroupFacades());
		};
	}, [dispatch]);

	if (groupFacadesStatus === 'loading') {
		return <Spinner animation="border" />;
	} else if (groupFacadesStatus === 'failed') {
		return <Alert variant="danger">{groupFacadesError}</Alert>;
	}

	return (
		<div className="d-flex flex-row justify-content-around align-items-center flex-wrap gap-2">
			{groupFacades ? groupFacades.map((groupFacade) => <FacadeGroupCard key={groupFacade.id} groupFacadeId={groupFacade.id} />) : null}
			{mode === 'edit' && (
				<Button variant="outline-success" className="d-flex flex-column align-items-center justify-content-center" style={{ width: '100px', height: '100px' }} onClick={handleCreateGroupFacade}>
					<div className="text-wrap">{t('new_facade_group_label')}</div>
					<PlusLg size={48} />
				</Button>
			)}
		</div>
	);
};

export default FacadeGroupsContainer;
