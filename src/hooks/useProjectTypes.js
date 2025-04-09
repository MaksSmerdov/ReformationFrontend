import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProjectTypes } from '@slices/projects/projectTypesSlice';

const useProjectTypes = () => {
	const dispatch = useDispatch();
	const projectTypes = useSelector((state) => state.projectTypes.items);
	const projectTypesStatus = useSelector((state) => state.projectTypes.status);
	const error = useSelector((state) => state.projectTypes.error);

	useEffect(() => {
		if (projectTypesStatus === 'idle') {
			dispatch(fetchProjectTypes());
		}
	}, [dispatch, projectTypesStatus]);

	return { projectTypes, projectTypesStatus, error };
};

export default useProjectTypes;
