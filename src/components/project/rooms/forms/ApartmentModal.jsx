import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Modal, Button, Form, Spinner, Alert } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { updateApartment, fetchApartmentById } from '@slices/rooms/apartmentsSlice';
import { useNotification } from '@contexts/application/NotificationContext';
import { useRoomProjectModals } from '@contexts/rooms_project/RoomProjectModalsContext';

const ApartmentModal = () => {
	const { t } = useTranslation('translation', { keyPrefix: 'components.project.rooms.modals.edit_apartment_modal' });
	const dispatch = useDispatch();
	const { addNotification } = useNotification();
	const { showApartmentModal, setShowApartmentModal, currentApartmentId } = useRoomProjectModals();
	const apartment = useSelector((state) => state.currentProject.apartments.byId[currentApartmentId]);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(null);

	const [number, setNumber] = useState('');
	const [mailboxName, setMailboxName] = useState('');

	useEffect(() => {
		if (currentApartmentId && !apartment) {
			dispatch(fetchApartmentById({ staircaseId: apartment.staircase_id, apartmentId: currentApartmentId }));
		} else if (apartment) {
			setNumber(apartment.number);
			setMailboxName(apartment.mailbox_name);
		}
	}, [currentApartmentId, apartment, dispatch]);

	const handleClose = () => {
		setShowApartmentModal(false);
	};

	const handleSave = async () => {
		try {
			setLoading(true);
			await dispatch(updateApartment({ staircaseId: apartment.staircase_id, apartment: { id: currentApartmentId, number, mailbox_name: mailboxName } })).unwrap();
			addNotification(t('apartment_updated'), 'success');
			handleClose();
		} catch (err) {
			addNotification(err.message || t('error_occurred'), 'danger');
			setError(err.message);
		} finally {
			setLoading(false);
		}
	};

	if (loading) {
		return <Spinner animation="border" />;
	}

	if (error) {
		return <Alert variant="danger">{error}</Alert>;
	}

	return (
		<Modal show={showApartmentModal} onHide={handleClose}>
			<Modal.Header closeButton>
				<Modal.Title>{t('header_update')}</Modal.Title>
			</Modal.Header>
			<Modal.Body>
				<Form>
					<Form.Group controlId="formApartmentNumber">
						<Form.Label className="m-0">{t('apartment_number')}</Form.Label>
						<Form.Control type="text" value={number} onChange={(e) => setNumber(e.target.value)} placeholder={t('apartment_number_placeholder')} required autoComplete="off" />
					</Form.Group>
					<Form.Group controlId="formApartmentMailboxName">
						<Form.Label className="m-0">{t('mailbox_name')}</Form.Label>
						<Form.Control type="text" value={mailboxName} onChange={(e) => setMailboxName(e.target.value)} placeholder={t('mailbox_name_placeholder')} autoComplete="off" />
					</Form.Group>
				</Form>
			</Modal.Body>
			<Modal.Footer>
				<Button variant="secondary" onClick={handleClose}>
					{t('button_cancel')}
				</Button>
				<Button variant="primary" onClick={handleSave}>
					{t('button_save')}
				</Button>
			</Modal.Footer>
		</Modal>
	);
};

export default ApartmentModal;
