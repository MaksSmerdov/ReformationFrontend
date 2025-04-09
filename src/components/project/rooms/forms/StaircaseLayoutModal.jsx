import { useTranslation } from 'react-i18next';
import { useState, useEffect } from 'react';
import { Modal, Button, Form, Spinner, Alert } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { updateStaircaseLayout, fetchStaircaseLayoutById } from '@slices/rooms/staircaseLayoutsSlice';
import { useNotification } from '@contexts/application/NotificationContext';
import { useRoomProjectModals } from '@contexts/rooms_project/RoomProjectModalsContext';

const StaircaseLayoutModal = () => {
	const { t } = useTranslation('translation', { keyPrefix: 'components.project.rooms.modals.edit_layout_staircase_modal' });
	const dispatch = useDispatch();
	const { addNotification } = useNotification();
	const { showStaircaseLayoutModal, setShowStaircaseLayoutModal, currentStaircaseLayoutId } = useRoomProjectModals();
	const staircaseLayoutObject = useSelector((state) => (currentStaircaseLayoutId ? state.currentProject.staircaseLayouts.byId[currentStaircaseLayoutId] : null));
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(null);

	const [title, setTitle] = useState('');

	useEffect(() => {
		if (currentStaircaseLayoutId && !staircaseLayoutObject) {
			dispatch(fetchStaircaseLayoutById({ staircaseId: staircaseLayoutObject.staircase_id, layoutId: currentStaircaseLayoutId }));
		} else if (staircaseLayoutObject) {
			setTitle(staircaseLayoutObject.title);
		}
	}, [currentStaircaseLayoutId, staircaseLayoutObject, dispatch]);

	const handleClose = () => {
		setShowStaircaseLayoutModal(false);
	};

	const handleSave = async () => {
		try {
			setLoading(true);
			await dispatch(updateStaircaseLayout({ id: currentStaircaseLayoutId, title, staircase_id: staircaseLayoutObject.staircase_id })).unwrap();
			addNotification(t('layout_updated'), 'success');
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
		<Modal show={showStaircaseLayoutModal} onHide={handleClose}>
			<Modal.Header closeButton>
				<Modal.Title>{t('header_update')}</Modal.Title>
			</Modal.Header>
			<Modal.Body>
				<Form>
					<Form.Group controlId="formLayoutTitle">
						<Form.Label className="m-0">{t('title')}</Form.Label>
						<Form.Control type="text" value={title} onChange={(e) => setTitle(e.target.value)} />
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

export default StaircaseLayoutModal;
