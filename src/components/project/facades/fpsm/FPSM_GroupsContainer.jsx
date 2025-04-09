import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import FPSM_StatusesContainer from './FPSM_StatusesContainer';
import { fetchStatusGroups, selectStatusGroupsByProjectTypeId } from '@slices/projects/statusGroupsSlice';
import { useFacadeViewPage } from '@contexts/facades_view/FacadeViewPageContext';

const FPSM_GroupsContainer = ({ projectTypeId }) => {
	const dispatch = useDispatch();
	const statusGroups = useSelector((state) => selectStatusGroupsByProjectTypeId(state, projectTypeId));
	const status = useSelector((state) => state.statusGroups.status);

	// console.log('FPSM_GroupsContainer:', statusGroups, status);

	// useEffect(() => {
	// 	if (status === 'idle') {
	// 		dispatch(fetchStatusGroups({ projectTypeId }));
	// 	}
	// }, [dispatch, projectTypeId, status]);

	if (status === 'loading') {
		return <div>Loading...</div>;
	}
	if (status === 'failed') {
		return <div>Error loading status groups</div>;
	}
	if (!statusGroups || statusGroups.length === 0) {
		return <div>No status groups available</div>;
	}

	return (
		<div className="overflow-hidden">
			<div className="d-flex gap-2px overflow-auto flex-row justify-content-evenly p-2px">
				{statusGroups.map((statusGroup) => (
					<FPSM_StatusesContainer key={statusGroup.id} statusGroup={statusGroup} />
				))}
			</div>
		</div>
	);
};

export default React.memo(FPSM_GroupsContainer);
