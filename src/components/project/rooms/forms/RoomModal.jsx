import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Modal, Button, Form, Spinner, Alert } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { updateRoom, fetchRoomById } from '@slices/rooms/roomsSlice';
import { useNotification } from '@contexts/application/NotificationContext';
import { useRoomProjectModals } from '@contexts/rooms_project/RoomProjectModalsContext';

const RoomModal = () => {
	const { t } = useTranslation('translation', { keyPrefix: 'components.project.rooms.modals.edit_room_modal' });
	const dispatch = useDispatch();
	const { addNotification } = useNotification();
	const { showRoomModal, setShowRoomModal, currentRoomId } = useRoomProjectModals();
	const room = useSelector((state) => state.currentProject.rooms.byId[currentRoomId]);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(null);

	const [title, setTitle] = useState('');

	useEffect(() => {
		if (currentRoomId && !room) {
			dispatch(fetchRoomById({ apartmentId: room.apartment_id, roomId: currentRoomId }));
		} else if (room) {
			setTitle(room.title);
		}
	}, [currentRoomId, room, dispatch]);

	const handleClose = () => {
		setShowRoomModal(false);
	};

	const handleSave = async () => {
		try {
			setLoading(true);
			await dispatch(updateRoom({ apartmentId: room.apartment_id, room: { id: currentRoomId, title } })).unwrap();
			addNotification(t('room_updated'), 'success');
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
		<Modal show={showRoomModal} onHide={handleClose}>
			<Modal.Header closeButton>
				<Modal.Title>{t('header_update')}</Modal.Title>
			</Modal.Header>
			<Modal.Body>
				<Form>
					<Form.Group controlId="formRoomTitle">
						<Form.Label className="m-0">{t('room_name')}</Form.Label>
						<Form.Control type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder={t('room_name_placeholder')} required autoComplete="off" />
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

export default RoomModal;
