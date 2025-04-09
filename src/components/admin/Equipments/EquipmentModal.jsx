import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Button, Form, Modal, Alert, Spinner } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { createEquipment, updateEquipment, fetchEquipments } from '@slices/teams/equipmentsSlice';
import { useNotification } from '@contexts/application/NotificationContext';

const EquipmentModal = ({ equipment = null, show, onHide, onSuccess }) => {
	const dispatch = useDispatch();
	const { t } = useTranslation('translation', { keyPrefix: 'components.admin.equipment_modal' });
	const { addNotification } = useNotification();

	const [name, setName] = useState('');
	const [model, setModel] = useState('');
	const [serialNumber, setSerialNumber] = useState('');
	const [description, setDescription] = useState('');
	const [error, setError] = useState(null);
	const [errorDisplayed, setErrorDisplayed] = useState(false);

	const equipmentsStatus = useSelector((state) => state.equipments.status.fetchAll);
	const equipmentsError = useSelector((state) => state.equipments.error.fetchAll);

	useEffect(() => {
		if (show) {
			dispatch(fetchEquipments());
		}
	}, [dispatch, show]);

	useEffect(() => {
		if (equipment) {
			setName(equipment.name || '');
			setModel(equipment.model || '');
			setSerialNumber(equipment.serial_number || '');
			setDescription(equipment.description || '');
		} else {
			setName('');
			setModel('');
			setSerialNumber('');
			setDescription('');
		}
	}, [equipment]);

	useEffect(() => {
		if (error && !errorDisplayed) {
			addNotification(error, 'error');
			setErrorDisplayed(true);
		}
	}, [error, errorDisplayed, addNotification]);

	const handleSubmit = (e) => {
		e.preventDefault();
		const data = {
			name,
			model,
			serial_number: serialNumber,
			description
		};
		if (equipment) {
			dispatch(updateEquipment({ id: equipment.id, ...data })).then((result) => {
				if (result.type === 'equipments/updateEquipment/fulfilled') {
					onSuccess(t('equipment_updated'));
				} else {
					setError(t('equipment_update_failed'));
					setErrorDisplayed(false);
				}
			});
		} else {
			dispatch(createEquipment(data)).then((result) => {
				if (result.type === 'equipments/createEquipment/fulfilled') {
					onSuccess(t('equipment_created'));
				} else {
					setError(t('equipment_create_failed'));
					setErrorDisplayed(false);
				}
			});
		}
	};

	if (!show) {
		return null;
	}

	if (equipmentsStatus === 'loading') {
		return <Spinner animation="border" />;
	}

	if (equipmentsStatus === 'failed') {
		return (
			<Alert variant="danger">
				{t('error_loading_equipments')}: {equipmentsError}
			</Alert>
		);
	}

	return (
		<Modal show={show} onHide={onHide}>
			<Modal.Header closeButton>
				<Modal.Title>{equipment ? t('header_update') : t('header_create')}</Modal.Title>
			</Modal.Header>
			<Modal.Body>
				<Form onSubmit={handleSubmit} className="d-flex flex-column gap-2">
					<Form.Group controlId="formEquipmentName">
						<Form.Label className="m-0">{t('name')}</Form.Label>
						<Form.Control type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder={t('name_placeholder')} required autoComplete="off" className="px-2 py-1px lh-1" />
					</Form.Group>
					<Form.Group controlId="formEquipmentModel">
						<Form.Label className="m-0">{t('model')}</Form.Label>
						<Form.Control type="text" value={model} onChange={(e) => setModel(e.target.value)} placeholder={t('model_placeholder')} maxLength={255} className="px-2 py-1px lh-1" />
					</Form.Group>
					<Form.Group controlId="formEquipmentSerialNumber">
						<Form.Label className="m-0">{t('serial_number')}</Form.Label>
						<Form.Control type="text" value={serialNumber} onChange={(e) => setSerialNumber(e.target.value)} placeholder={t('serial_number_placeholder')} maxLength={255} className="px-2 py-1px lh-1" />
					</Form.Group>
					<Form.Group controlId="formEquipmentDescription">
						<Form.Label className="m-0">{t('description')}</Form.Label>
						<Form.Control as="textarea" value={description} onChange={(e) => setDescription(e.target.value)} placeholder={t('description_placeholder')} className="px-2 py-1px lh-1" />
					</Form.Group>
					<Form.Group className="text-center">
						<Button variant="primary" type="submit">
							{equipment ? t('button_update') : t('button_create')}
						</Button>
					</Form.Group>
				</Form>
			</Modal.Body>
		</Modal>
	);
};

export default EquipmentModal;
