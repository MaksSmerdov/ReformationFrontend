// import React, { useEffect, useState } from 'react';
// import { Form, Button, Spinner } from 'react-bootstrap';
// import { useDispatch, useSelector } from 'react-redux';
// import { useFacadeViewPage } from '@contexts/facades_view/FacadeViewPageContext';
// import SelectElementType from '@components/common/select/SelectElementType';
// import { selectElementsByIds, deleteElement, massUpdateElements, fetchElementsByFacadeId, selectElementsByFacadeId } from '@slices/facades/elementsSlice';
// import { fetchElementGroupsByFacadeId } from '@slices/facades/elementGroupsSlice';
// import { getAffectedElements } from '@utils/facades/facadeUtils';
// import { useTranslation } from 'react-i18next';

// const ElementChangePanel = () => {
// 	const { t } = useTranslation('translation', { keyPrefix: 'components.project.facades.facade_view_page.element_inspector_form' });
// 	const { selectedElementIds, facadeId, setSelectedElementIds, direction } = useFacadeViewPage();
// 	const selectedElements = useSelector((state) => selectElementsByIds(state, selectedElementIds));
// 	const elements = useSelector((state) => selectElementsByFacadeId(state, facadeId));
// 	const dispatch = useDispatch();

// 	const [formData, setFormData] = useState({
// 		title: '',
// 		width: '',
// 		height: '',
// 		left: '',
// 		bottom: '',
// 		element_type_id: ''
// 	});

// 	const [isLoading, setIsLoading] = useState(false);

// 	useEffect(() => {
// 		if (selectedElements.length > 0) {
// 			setFormData({
// 				title: getCommonValue('title'),
// 				width: getCommonValue('width'),
// 				height: getCommonValue('height'),
// 				left: getCommonValue('left'),
// 				bottom: getCommonValue('bottom'),
// 				element_type_id: getCommonValue('element_type_id')
// 			});
// 		} else {
// 			setFormData({
// 				title: '',
// 				width: '',
// 				height: '',
// 				left: '',
// 				bottom: '',
// 				element_type_id: ''
// 			});
// 		}
// 	}, [selectedElementIds, selectedElements]);

// 	const getCommonValue = (key) => {
// 		if (selectedElements.length === 0) {
// 			return '';
// 		}
// 		const firstValue = selectedElements[0][key];
// 		return selectedElements.every((element) => element[key] === firstValue) ? firstValue : '';
// 	};

// 	const handleChange = (e) => {
// 		const { name, value } = e.target;
// 		setFormData((prevData) => ({
// 			...prevData,
// 			[name]: value
// 		}));
// 	};

// 	const handleDeleteElements = async () => {
// 		setIsLoading(true);
// 		try {
// 			await Promise.all(selectedElementIds.map((id) => dispatch(deleteElement({ facadeId, id })).unwrap()));
// 			setSelectedElementIds([]);
// 			await dispatch(fetchElementsByFacadeId(facadeId)).unwrap();
// 			await dispatch(fetchElementGroupsByFacadeId(facadeId)).unwrap();
// 		} catch (error) {
// 			console.error('Error deleting elements:', error);
// 		} finally {
// 			setIsLoading(false);
// 		}
// 	};

// 	const handleMassUpdate = async () => {
// 		setIsLoading(true);
// 		const data = {
// 			element_ids: selectedElementIds
// 		};

// 		Object.keys(formData).forEach((key) => {
// 			if (formData[key] !== '') {
// 				data[key] = formData[key];
// 			}
// 		});

// 		try {
// 			if (direction === 'vertical' && selectedElements[0].height !== formData.height) {
// 				const affectedRows = getAffectedElements(elements, selectedElements, 'height');
// 				const heightDiff = parseInt(selectedElements[0].height) - parseInt(formData.height);

// 				await Promise.all(
// 					affectedRows.map((row) => {
// 						const higherElementsIds = row.map((el) => el.id);
// 						return dispatch(
// 							massUpdateElements({
// 								facadeId,
// 								data: {
// 									element_ids: higherElementsIds,
// 									bottom: heightDiff > 0 ? (parseInt(row[0].bottom) - Math.abs(heightDiff)).toString() : (parseInt(row[0].bottom) + Math.abs(heightDiff)).toString()
// 								}
// 							})
// 						).unwrap();
// 					})
// 				);
// 			}

// 			if (direction === 'horizontal' && selectedElements[0].width !== formData.width) {
// 				const affectedColumns = getAffectedElements(elements, selectedElements, 'width');
// 				const widthDiff = parseInt(selectedElements[0].width) - parseInt(formData.width);

// 				await Promise.all(
// 					affectedColumns.map((column) => {
// 						const rightElementsIds = column.map((el) => el.id);
// 						return dispatch(
// 							massUpdateElements({
// 								facadeId,
// 								data: {
// 									element_ids: rightElementsIds,
// 									left: widthDiff > 0 ? (parseInt(column[0].left) - Math.abs(widthDiff)).toString() : (parseInt(column[0].left) + Math.abs(widthDiff)).toString()
// 								}
// 							})
// 						).unwrap();
// 					})
// 				);
// 			}

// 			await dispatch(massUpdateElements({ facadeId, data })).unwrap();
// 			await dispatch(fetchElementsByFacadeId(facadeId)).unwrap();
// 		} catch (error) {
// 			console.error('Error updating elements:', error);
// 		} finally {
// 			setIsLoading(false);
// 		}
// 	};

// 	return (
// 		<>
// 			<Form.Group controlId="formElementId">
// 				<Form.Label>{t('id')}</Form.Label>
// 				<Form.Control type="text" value={getCommonValue('id')} readOnly disabled />
// 			</Form.Group>
// 			<Form.Group controlId="formElementTitle">
// 				<Form.Label>{t('title')}</Form.Label>
// 				<Form.Control type="text" name="title" value={formData.title} onChange={handleChange} disabled={isLoading} />
// 			</Form.Group>
// 			<div className="d-flex flex-row justify-content-between gap-2">
// 				<Form.Group controlId="formElementX">
// 					<Form.Label>{t('x')}</Form.Label>
// 					<Form.Control type="number" name="left" size="1" value={formData.left} disabled={true} />
// 				</Form.Group>
// 				<Form.Group controlId="formElementY">
// 					<Form.Label>{t('y')}</Form.Label>
// 					<Form.Control type="number" name="bottom" size="1" value={formData.bottom} disabled={true} />
// 				</Form.Group>
// 			</div>
// 			<div className="d-flex flex-row justify-content-between gap-2">
// 				<Form.Group controlId="formElementWidth">
// 					<Form.Label>{t('width')}</Form.Label>
// 					<Form.Control type="number" name="width" size="1" value={formData.width} onChange={handleChange} />
// 				</Form.Group>
// 				<Form.Group controlId="formElementHeight">
// 					<Form.Label>{t('height')}</Form.Label>
// 					<Form.Control type="number" name="height" size="1" value={formData.height} onChange={handleChange} />
// 				</Form.Group>
// 			</div>
// 			<Form.Group controlId="formElementType">
// 				<Form.Label>{t('type')}</Form.Label>
// 				<SelectElementType value={formData.element_type_id} onChange={(value) => setFormData((prev) => ({ ...prev, element_type_id: value }))} disabled={isLoading} />
// 			</Form.Group>
// 			<div className="d-flex flex-column justify-content-between align-items-center gap-2">
// 				{selectedElementIds.length > 0 &&
// 					(isLoading ? (
// 						<div className="d-flex align-items-center">
// 							<Spinner animation="border" size="sm" role="status" className="me-2" />
// 							<span>{t('loading')}</span>
// 						</div>
// 					) : (
// 						<>
// 							<Button variant="success" onClick={handleMassUpdate}>
// 								{t('updateElements')}
// 							</Button>
// 							<Button variant="danger" onClick={handleDeleteElements}>
// 								{t('deleteElements')}
// 							</Button>
// 						</>
// 					))}
// 			</div>
// 		</>
// 	);
// };

// export default ElementChangePanel;
