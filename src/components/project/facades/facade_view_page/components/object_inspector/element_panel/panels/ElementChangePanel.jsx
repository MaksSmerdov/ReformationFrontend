import React, { useEffect, useState, useMemo } from 'react';
import { Form, Button, Spinner, Card } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { useFacadeViewPage } from '@contexts/facades_view/FacadeViewPageContext';
import SelectElementType from '@components/common/select/SelectElementType';
import { selectElementsByIds, deleteElement, massUpdateElementsArray, fetchElementsByFacadeId } from '@slices/facades/elementsSlice';
import { fetchElementGroupsByFacadeId } from '@slices/facades/elementGroupsSlice';
import { useTranslation } from 'react-i18next';
import { generateElementTitle } from '@utils/facades/elementUtils';

const ELEMENT_PROPS = ['left', 'bottom', 'width', 'height'];

const ElementChangePanel = () => {
	const { t } = useTranslation('translation', { keyPrefix: 'components.project.facades.facade_view_page.element_inspector_form' });
	const { selectedElementIds, facadeId, setSelectedElementIds } = useFacadeViewPage();
	const selectedElements = useSelector((state) => selectElementsByIds(state, selectedElementIds));
	const dispatch = useDispatch();

	const [formData, setFormData] = useState({
		title: '',
		element_type_id: '',
		...ELEMENT_PROPS.reduce((acc, prop) => {
			acc[prop] = '';
			acc[`${prop}Delta`] = '';
			return acc;
		}, {})
	});

	const [propEnabledStates, setPropEnabledStates] = useState(
		ELEMENT_PROPS.reduce((acc, prop) => {
			acc[prop] = true;
			return acc;
		}, {})
	);

	const [propModeStates, setPropModeStates] = useState(
		ELEMENT_PROPS.reduce((acc, prop) => {
			acc[prop] = true;
			return acc;
		}, {})
	);

	const [isLoading, setIsLoading] = useState(false);

	useEffect(() => {
		if (selectedElements.length > 0) {
			setFormData((prevData) => ({
				...prevData,
				title: getCommonValue('title'),
				element_type_id: getCommonValue('element_type_id'),
				...ELEMENT_PROPS.reduce((acc, prop) => {
					acc[prop] = getCommonValue(prop);
					return acc;
				}, {})
			}));
		} else {
			setFormData({
				title: '',
				element_type_id: '',
				...ELEMENT_PROPS.reduce((acc, prop) => {
					acc[prop] = '';
					acc[`${prop}Delta`] = '';
					return acc;
				}, {})
			});
		}
	}, [selectedElementIds, selectedElements]);

	const getCommonValue = (key) => {
		if (selectedElements.length === 0) {
			return '';
		}
		const firstValue = selectedElements[0][key];
		return selectedElements.every((element) => element[key] === firstValue) ? firstValue : '';
	};

	const handleChange = (e) => {
		const { name, value } = e.target;
		setFormData((prevData) => ({
			...prevData,
			[name]: value
		}));
	};

	const handleModeChange = (field) => {
		setPropModeStates((prevStates) => ({
			...prevStates,
			[field]: !prevStates[field]
		}));
	};

	const handleEnabledChange = (field) => {
		setPropEnabledStates((prevStates) => ({
			...prevStates,
			[field]: !prevStates[field]
		}));
	};

	const handleDeleteElements = async () => {
		setIsLoading(true);
		try {
			const selectedElementIdsTemporary = selectedElements.map((element) => element.id);
			setSelectedElementIds([]);
			await Promise.all(selectedElementIdsTemporary.map((id) => dispatch(deleteElement({ facadeId, id })).unwrap()));
			await dispatch(fetchElementsByFacadeId(facadeId)).unwrap();
			await dispatch(fetchElementGroupsByFacadeId(facadeId)).unwrap();
		} catch (error) {
			console.error('Error deleting elements:', error);
		} finally {
			setIsLoading(false);
		}
	};

	const handleMassUpdate = async () => {
		setIsLoading(true);

		const elementChanges = selectedElements.map((element) => {
			const updatedElement = { id: element.id };

			ELEMENT_PROPS.forEach((field) => {
				if (propEnabledStates[field]) {
					const deltaValue = propModeStates[field] ? formData[`${field}Delta`] : formData[field];
					if (deltaValue !== '') {
						let newPropertieValue = propModeStates[field] ? parseInt(element[field]) + parseInt(deltaValue) : parseInt(deltaValue);

						if (['left', 'bottom'].includes(field)) {
							updatedElement[field] = newPropertieValue; // Math.max(0, newPropertieValue);
						} else if (field === 'width') {
							updatedElement[field] = Math.max(1, newPropertieValue);
						} else if (field === 'height') {
							updatedElement[field] = Math.max(0, newPropertieValue);
						}
					}
				}
			});

			if (formData.element_type_id !== '') {
				if (formData.element_type_id !== element.element_type_id) {
					updatedElement.element_type_id = formData.element_type_id;
				}
			}

			if (formData.title !== '') {
				updatedElement.title = formData.title;
			} else {
				updatedElement.title = generateElementTitle(element, updatedElement);
			}

			return updatedElement;
		});

		const data = {
			elements: elementChanges
		};

		try {
			await dispatch(massUpdateElementsArray({ facadeId, data })).unwrap();
			await dispatch(fetchElementsByFacadeId(facadeId)).unwrap();
			setFormData({
				...formData,
				...ELEMENT_PROPS.reduce((acc, prop) => {
					acc[prop] = '';
					acc[`${prop}Delta`] = '';
					return acc;
				}, {})

				// .map((prop) => ({
				// 	[prop]: '',
				// 	[`${prop}Delta`]: ''
				// }))
			});
		} catch (error) {
			console.error('Error updating elements:', error);
		} finally {
			setIsLoading(false);
		}
	};

	const uniqueValues = useMemo(() => {
		const values = {};
		ELEMENT_PROPS.forEach((key) => {
			values[key] = [...new Set(selectedElements.map((element) => element[key]))].filter((value) => value !== undefined && value !== null).sort((a, b) => a - b);
		});
		return values;
	}, [selectedElements]);

	const handleSetFieldValue = (field, value) => {
		setFormData((prevData) => ({
			...prevData,
			[field]: value
		}));
	};

	return (
		<>
			<Form.Group controlId="formElementId">
				<Form.Label>{t('id')}</Form.Label>
				<Form.Control type="text" value={getCommonValue('id')} readOnly disabled />
			</Form.Group>
			<Form.Group controlId="formElementTitle">
				<Form.Label>{t('title')}</Form.Label>
				<Form.Control type="text" name="title" value={formData.title} onChange={handleChange} disabled={isLoading} />
			</Form.Group>
			<div className="d-grid gap-2 mt-2" style={{ gridTemplateColumns: 'repeat(2, 1fr)' }}>
				{ELEMENT_PROPS.map((field) => {
					const isDisabled = isLoading || !propEnabledStates[field];
					const isModeAdd = propModeStates[field];
					const elementPropertiesSuffix = isModeAdd ? 'Delta' : '';
					return (
						<Card className="p-0" key={field} style={{ maxWidth: '200px' }}>
							<Card.Header className="px-2 py-0 d-flex flex-row align-items-center gap-2px">
								<Form.Check type="checkbox" checked={propEnabledStates[field]} onChange={() => handleEnabledChange(field)} disabled={isLoading} />
								<Form.Label className="w-fill-available fw-bold text-center">{t(`label_${field}`)}</Form.Label>
							</Card.Header>
							<Card.Header className="px-2 py-0 d-flex flex-row align-items-center gap-2px">
								<Form.Check type="switch" checked={isModeAdd} onChange={() => handleModeChange(field)} disabled={isDisabled} />
								<Form.Label className={`w-fill-available text-center ${isDisabled ? `text-decoration-line-through` : ''}`}>{!isModeAdd ? t('value_set') : t('value_add')}:</Form.Label>
							</Card.Header>
							<Card.Body className={`w-fill-available p-2 d-flex flex-column align-items-center gap-2 ${isDisabled ? 'disabled' : ''}`}>
								<Form.Control type="number" name={`${field}${elementPropertiesSuffix}`} placeholder={t(`placeholder_${field}${elementPropertiesSuffix}`)} value={formData[`${field}${elementPropertiesSuffix}`]} onChange={handleChange} disabled={isDisabled} className="px-0 py-0 no-spinner" step="1" />
								{!isModeAdd && (
									<div className="d-flex flex-row flex-wrap justify-content-center gap-1">
										{uniqueValues[field].map((value, index) => (
											<Button key={index} variant="outline-primary" size="sm" className="px-1 py-0" onClick={() => handleSetFieldValue(field, value)}>
												{value}
											</Button>
										))}
									</div>
								)}
							</Card.Body>
						</Card>
					);
				})}
			</div>
			<Form.Group controlId="formElementType">
				<Form.Label>{t('type')}</Form.Label>
				<SelectElementType value={formData.element_type_id} onChange={(value) => setFormData((prev) => ({ ...prev, element_type_id: value }))} disabled={isLoading} />
			</Form.Group>
			<div className="d-flex flex-column justify-content-between align-items-center gap-2">
				{selectedElementIds.length > 0 &&
					(isLoading ? (
						<div className="d-flex align-items-center">
							<Spinner animation="border" size="sm" role="status" className="me-2" />
							<span>{t('loading')}</span>
						</div>
					) : (
						<>
							<Button variant="success" onClick={handleMassUpdate}>
								{t('updateElements')}
							</Button>
							<Button variant="danger" onClick={handleDeleteElements}>
								{t('deleteElements')}
							</Button>
						</>
					))}
			</div>
		</>
	);
};

export default ElementChangePanel;
