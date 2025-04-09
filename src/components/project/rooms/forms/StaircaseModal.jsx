import React, { useState, useEffect } from 'react';
import { Modal, Button, Form, Spinner, Alert } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { updateStaircase, fetchStaircaseById } from '@slices/rooms/staircasesSlice';
import { useNotification } from '@contexts/application/NotificationContext';
import { useRoomProjectModals } from '@contexts/rooms_project/RoomProjectModalsContext';

const StaircaseModal = () => {
	const { t } = useTranslation('translation', { keyPrefix: 'components.project.rooms.modals.edit_staircase_modal' });
	const dispatch = useDispatch();
	const { addNotification } = useNotification();
	const { showStaircaseModal, setShowStaircaseModal, currentStaircaseId } = useRoomProjectModals();
	const staircaseObject = useSelector((state) => (currentStaircaseId ? state.currentProject.staircases.byId[currentStaircaseId] : null));
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(null);

	const [title, setTitle] = useState('');

	useEffect(() => {
		if (currentStaircaseId && !staircaseObject) {
			dispatch(fetchStaircaseById({ projectId: staircaseObject.project_id, staircaseId: currentStaircaseId }));
		} else if (staircaseObject) {
			setTitle(staircaseObject.title);
		}
	}, [currentStaircaseId, staircaseObject, dispatch]);

	const handleClose = () => {
		setShowStaircaseModal(false);
	};

	const handleSave = async () => {
		try {
			setLoading(true);
			await dispatch(updateStaircase({ id: currentStaircaseId, title, project_id: staircaseObject.project_id })).unwrap();
			addNotification(t('staircase_updated'), 'success');
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
		<Modal show={showStaircaseModal} onHide={handleClose}>
			<Modal.Header closeButton>
				<Modal.Title>{t('header_update')}</Modal.Title>
			</Modal.Header>
			<Modal.Body>
				<Form>
					<Form.Group controlId="formStaircaseTitle">
						<Form.Label className="m-0">{t('title')}</Form.Label>
						<Form.Control type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder={t('title_placeholder')} required autoComplete="off" />
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

export default StaircaseModal;
