import React, { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Spinner, Alert } from 'react-bootstrap';
import { fetchElementsByFacadeId, selectElementsByFacadeId } from '@slices/facades/elementsSlice';
import { fetchGuidesByFacadeId, selectGuidesByFacadeId } from '@slices/facades/guidesSlice';
import FacadeMiniatureCanvas from '@components/project/facades/elements/FacadeMiniatureCanvas';
import FacadeDetails from '@components/project/facades/facades/FacadeDetails';

const FacadeDataLoader = ({ facadeId }) => {
	const dispatch = useDispatch();

	const elements = useSelector((state) => selectElementsByFacadeId(state, facadeId));
	const elementsStatus = useSelector((state) => state.elements.statuses.byFacadeId[facadeId]?.fetchAll);
	const elementsError = useSelector((state) => state.elements.errors.byFacadeId[facadeId]?.fetchAll);

	const guides = useSelector((state) => selectGuidesByFacadeId(state, facadeId));
	const guidesStatus = useSelector((state) => state.guides.statuses.byFacadeId[facadeId]?.fetchAll);
	const guidesError = useSelector((state) => state.guides.errors.byFacadeId[facadeId]?.fetchAll);

	const hasFetched = useRef(false);

	useEffect(() => {
		if (!hasFetched.current) {
			if (elementsStatus !== 'succeeded') {
				dispatch(fetchElementsByFacadeId(facadeId));
			}
			if (guidesStatus !== 'succeeded') {
				dispatch(fetchGuidesByFacadeId(facadeId));
			}
			hasFetched.current = true;
		}
	}, [dispatch, facadeId, elementsStatus, guidesStatus]);

	if (elementsStatus === 'loading' || guidesStatus === 'loading') {
		return <Spinner animation="border" />;
	} else if (elementsStatus === 'failed') {
		return <Alert variant="danger">{elementsError}</Alert>;
	} else if (guidesStatus === 'failed') {
		return <Alert variant="danger">{guidesError}</Alert>;
	} else if (elementsStatus === 'succeeded' && guidesStatus === 'succeeded') {
		return (
			<div>
				<FacadeMiniatureCanvas elements={elements} guides={guides} />
				<FacadeDetails elements={elements} facadeId={facadeId} />
			</div>
		);
	}

	return null;
};

export default FacadeDataLoader;
