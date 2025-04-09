import React, { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Spinner, Alert } from 'react-bootstrap';
import { fetchElementsByFacadeId, selectElementsByFacadeId } from '@slices/facades/elementsSlice';
import { fetchGuidesByFacadeId, selectGuidesByFacadeId } from '@slices/facades/guidesSlice';
import { fetchElementGroupsByFacadeId, selectElementGroupsByFacadeId } from '@slices/facades/elementGroupsSlice';
import FacadeViewFacadeCanvasWrapper from '@components/project/facades/facade_view_page/components/canvas/FacadeViewFacadeCanvasWrapper';
import NewTreeViewMainComponent from '@components/project/facades/facade_view_page/components/new_tree_view/NewTreeViewMainComponent';
import ObjectInspector from '@components/project/facades/facade_view_page/components/object_inspector/ObjectInspector';
import { reset as ResetOrdersTable } from '@slices/facades/elementOrdersSlice';

const FacadeViewFacadeContainer = ({ facadeId }) => {
	const dispatch = useDispatch();

	const elements = useSelector((state) => selectElementsByFacadeId(state, facadeId));
	const elementsStatus = useSelector((state) => state.elements.statuses.byFacadeId[facadeId]?.fetchAll);
	const elementsError = useSelector((state) => state.elements.errors.byFacadeId[facadeId]?.fetchAll);

	const guides = useSelector((state) => selectGuidesByFacadeId(state, facadeId));
	const guidesStatus = useSelector((state) => state.guides.statuses.byFacadeId[facadeId]?.fetchAll);
	const guidesError = useSelector((state) => state.guides.errors.byFacadeId[facadeId]?.fetchAll);

	const elementGroups = useSelector((state) => selectElementGroupsByFacadeId(state, facadeId));
	const elementGroupsStatus = useSelector((state) => state.elementGroups.statuses.byFacadeId[facadeId]?.fetchAll);
	const elementGroupsError = useSelector((state) => state.elementGroups.errors.byFacadeId[facadeId]?.fetchAll);

	// Отдельные useRef для каждого типа данных
	const hasFetchedElements = useRef(false);
	const hasFetchedGuides = useRef(false);
	const hasFetchedElementGroups = useRef(false);

	useEffect(() => {
		if (!hasFetchedElements.current && elementsStatus !== 'succeeded') {
			dispatch(fetchElementsByFacadeId(facadeId));
			hasFetchedElements.current = true;
		}
	}, [dispatch, facadeId, elementsStatus]);

	useEffect(() => {
		if (!hasFetchedGuides.current && guidesStatus !== 'succeeded') {
			dispatch(fetchGuidesByFacadeId(facadeId));
			hasFetchedGuides.current = true;
		}
	}, [dispatch, facadeId, guidesStatus]);

	useEffect(() => {
		if (!hasFetchedElementGroups.current && elementGroupsStatus !== 'succeeded') {
			dispatch(fetchElementGroupsByFacadeId(facadeId));
			hasFetchedElementGroups.current = true;
		}
	}, [dispatch, facadeId, elementGroupsStatus]);

	// Сброс таблицы заказов
	useEffect(() => {
		dispatch(ResetOrdersTable());
	}, [dispatch]);

	if (elementsStatus === 'loading' || guidesStatus === 'loading' || elementGroupsStatus === 'loading') {
		return <Spinner animation="border" />;
	} else if (elementsStatus === 'failed') {
		return <Alert variant="danger">{elementsError}</Alert>;
	} else if (guidesStatus === 'failed') {
		return <Alert variant="danger">{guidesError}</Alert>;
	} else if (elementGroupsStatus === 'failed') {
		return <Alert variant="danger">{elementGroupsError}</Alert>;
	} else if (elementsStatus === 'succeeded' && guidesStatus === 'succeeded' && elementGroupsStatus === 'succeeded') {
		return (
			<div className="w-fill d-flex justify-content-between gap-2">
				<NewTreeViewMainComponent guides={guides} elementGroups={elementGroups} elements={elements} />
				<FacadeViewFacadeCanvasWrapper guides={guides} elementGroups={elementGroups} elements={elements} />
				<ObjectInspector />
			</div>
		);
	}

	return null;
};

export default FacadeViewFacadeContainer;
