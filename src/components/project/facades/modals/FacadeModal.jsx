import React, { useState, useEffect } from 'react';
import { Modal, Button, Form, Spinner, Alert, Accordion } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { updateFacade, createFacade, fetchFacadeById, selectFacadeById } from '@slices/facades/facadesSlice';
import { useNotification } from '@contexts/application/NotificationContext';
import { useFacadesProject } from '@contexts/facades_project/FacadesProjectContext';
import SelectFacadeDirection from '@components/common/select/simple/SelectFacadeDirection';
import SelectFacadeGroup from '@components/common/select/SelectFacadeGroup';
import { CheckCircleFill, XCircleFill } from 'react-bootstrap-icons';
import IconOnly from '@components/common/icon/IconOnly';
import RedAsterisk from '@components/common/basic/RedAsterisk';

const FacadeModal = ({ show, onHide, facadeId, groupFacadeIdProp, isCreating }) => {
	const { t } = useTranslation('translation', { keyPrefix: 'components.project.facades.modals.facade_edit_modal' });
	const dispatch = useDispatch();
	const { addNotification } = useNotification();
	const { project } = useFacadesProject();
	const facade = useSelector((state) => (facadeId ? selectFacadeById(state, facadeId) : null));
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(null);
	const [accordionKey, setAccordionKey] = useState(null);

	const [title, setTitle] = useState('');
	const [groupFacadeId, setGroupFacadeId] = useState(null);
	const [direction, setDirection] = useState('');
	const [properties, setProperties] = useState({ min: '', max: '', current: '', lifting_point: '' });

	const isTitleValid = title.trim() !== '';
	const isGroupFacadeIdValid = groupFacadeId && groupFacadeId !== '';
	const isDirectionValid = direction && direction.trim() !== '';
	const isPropertieMinValid = properties.min !== '';
	const isPropertieMaxValid = properties.max !== '';
	const isPropertieCurrentValid = properties.current !== '';
	const isPropertieLiftingPointValid = properties.lifting_point !== '';

	const isFormValid = isTitleValid && isGroupFacadeIdValid && isDirectionValid;

	useEffect(() => {
		if (isCreating) {
			setTitle('');
			setGroupFacadeId(groupFacadeIdProp);
			setDirection('north');
			setProperties({ min: '', max: '', current: '', lifting_point: '' });
			setAccordionKey(null);
		} else {
			if (facadeId && !facade) {
				dispatch(fetchFacadeById({ projectId: project.id, facadeId }));
			} else if (facade) {
				setTitle(facade.title);
				setGroupFacadeId(facade.group_facade_id);
				setDirection(facade.direction);
				setProperties({
					min: facade.properties?.min ?? '',
					max: facade.properties?.max ?? '',
					current: facade.properties?.current ?? '',
					lifting_point: facade.properties?.lifting_point ?? ''
				});
				setAccordionKey(null);
			}
		}
	}, [facadeId, facade, dispatch, project.id, groupFacadeIdProp, isCreating]);

	const handleSave = async () => {
		if (!isFormValid) return;

		try {
			setLoading(true);
			const data = { title, group_facade_id: groupFacadeId, direction };
			const validatedProperties = {};

			if (isPropertieMinValid) {
				validatedProperties.min = properties.min;
			}
			if (isPropertieMaxValid) {
				validatedProperties.max = properties.max;
			}
			if (isPropertieCurrentValid) {
				validatedProperties.current = properties.current;
			}
			if (isPropertieLiftingPointValid) {
				validatedProperties.lifting_point = properties.lifting_point;
			}

			data.properties = validatedProperties;

			if (isCreating) {
				await dispatch(createFacade({ projectId: project.id, data })).unwrap();
				addNotification(t('facade_created'), 'success');
			} else {
				await dispatch(updateFacade({ projectId: project.id, id: facadeId, data })).unwrap();
				addNotification(t('facade_updated'), 'success');
			}
			handleHide();
		} catch (err) {
			addNotification(err.message || t('error_occurred'), 'danger');
			setError(err.message);
		} finally {
			setLoading(false);
		}
	};

	const handleHide = () => {
		setTitle('');
		setGroupFacadeId('');
		setDirection('north');
		setProperties({ min: '', max: '', current: '' });
		setError(null);
		setAccordionKey(null);
		onHide();
	};

	if (loading) {
		return <Spinner animation="border" />;
	}

	if (error) {
		return <Alert variant="danger">{error}</Alert>;
	}

	return (
		<Modal show={show} onHide={handleHide}>
			<Modal.Header closeButton>
				<Modal.Title>{facadeId ? t('header_update') : t('header_create')}</Modal.Title>
			</Modal.Header>
			<Modal.Body>
				<Form className="d-flex flex-column gap-2">
					<Form.Group controlId="formFacadeTitle">
						<Form.Label className="m-0">
							{t('title')}
							<RedAsterisk />
						</Form.Label>
						<div className="d-flex flex-row justify-content-between align-items-center gap-2">
							<Form.Control type="text" className="px-3 py-1px no-spinner" value={title} onChange={(e) => setTitle(e.target.value)} placeholder={t('title_placeholder')} required autoComplete="off" />
							<IconOnly icon={isTitleValid ? CheckCircleFill : XCircleFill} variant={isTitleValid ? 'success' : 'danger'} className="wh-resize-button-sm" />
						</div>
					</Form.Group>
					<Form.Group controlId="formFacadeGroup">
						<Form.Label className="m-0">
							{t('group_facade')}
							<RedAsterisk />
						</Form.Label>
						<div className="d-flex flex-row justify-content-between align-items-center gap-2">
							<SelectFacadeGroup value={groupFacadeId} onChange={setGroupFacadeId} className="w-fill-available" />
							<IconOnly icon={isGroupFacadeIdValid ? CheckCircleFill : XCircleFill} variant={isGroupFacadeIdValid ? 'success' : 'danger'} className="wh-resize-button-sm" />
						</div>
					</Form.Group>
					<Form.Group controlId="formFacadeDirection">
						<Form.Label className="m-0">
							{t('direction')}
							<RedAsterisk />
						</Form.Label>
						<div className="d-flex flex-row justify-content-between align-items-center gap-2">
							<SelectFacadeDirection value={direction} onChange={setDirection} className="w-fill-available" />
							<IconOnly icon={isDirectionValid ? CheckCircleFill : XCircleFill} variant={isDirectionValid ? 'success' : 'danger'} className="wh-resize-button-sm" />
						</div>
					</Form.Group>
					<Accordion activeKey={accordionKey} onSelect={(key) => setAccordionKey(key)} className="p-0 w-100">
						<Accordion.Item eventKey="0">
							<Accordion.Header>
								<Form.Label className="px-2 m-0 lh-lg">{t('properties.accordion_properties_title')}</Form.Label>
							</Accordion.Header>
							<Accordion.Body className="p-2 w-min-content w-100">
								<div className="d-grid w-100 gap-2" style={{ gridTemplateColumns: 'auto 1fr', gap: '2px' }}>
									<Form.Label className={`m-0 ${isPropertieMinValid ? '' : 'text-decoration-line-through'}`}>{t('properties.min')}</Form.Label>
									<Form.Control type="number" className="px-3 py-1px no-spinner" value={properties.min} onChange={(e) => setProperties({ ...properties, min: e.target.value })} placeholder={t('properties.min_placeholder')} />

									<Form.Label className={`m-0 ${isPropertieMaxValid ? '' : 'text-decoration-line-through'}`}>{t('properties.max')}</Form.Label>
									<Form.Control type="number" className="px-3 py-1px no-spinner" value={properties.max} onChange={(e) => setProperties({ ...properties, max: e.target.value })} placeholder={t('properties.max_placeholder')} />

									<Form.Label className={`m-0 ${isPropertieCurrentValid ? '' : 'text-decoration-line-through'}`}>{t('properties.current')}</Form.Label>
									<Form.Control type="number" className="px-3 py-1px no-spinner" value={properties.current} onChange={(e) => setProperties({ ...properties, current: e.target.value })} placeholder={t('properties.current_placeholder')} />

									<Form.Label className={`m-0 ${isPropertieLiftingPointValid ? '' : 'text-decoration-line-through'}`}>{t('properties.lifting_point')}</Form.Label>
									<Form.Control type="number" className="px-3 py-1px no-spinner" value={properties.lifting_point} onChange={(e) => setProperties({ ...properties, lifting_point: e.target.value })} placeholder={t('properties.lifting_point_placeholder')} />
								</div>
							</Accordion.Body>
						</Accordion.Item>
					</Accordion>
				</Form>
			</Modal.Body>
			<Modal.Footer>
				<Button variant="secondary" onClick={handleHide}>
					{t('button_cancel')}
				</Button>
				<Button variant="primary" onClick={handleSave} disabled={!isFormValid}>
					{t('button_save')}
				</Button>
			</Modal.Footer>
		</Modal>
	);
};

export default FacadeModal;
