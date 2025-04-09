import React, { useState, useEffect } from 'react';
import { Modal, Button, Form, Spinner, Alert } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { updateGroupFacade, createGroupFacade, fetchGroupFacadeById, selectGroupFacadeById } from '@slices/facades/groupFacadesSlice';
import { useNotification } from '@contexts/application/NotificationContext';
import { useFacadesProject } from '@contexts/facades_project/FacadesProjectContext';
import { CheckCircleFill, XCircleFill } from 'react-bootstrap-icons';
import IconOnly from '@components/common/icon/IconOnly';
import RedAsterisk from '@components/common/basic/RedAsterisk';

const FacadeGroupModal = ({ show, onHide, groupFacadeId, isCreating }) => {
	const { t } = useTranslation('translation', { keyPrefix: 'components.project.facades.modals.facade_group_edit_modal' });
	const dispatch = useDispatch();
	const { addNotification } = useNotification();
	const { project } = useFacadesProject();
	const groupFacade = useSelector((state) => (groupFacadeId ? selectGroupFacadeById(state, groupFacadeId) : null));
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(null);

	const [title, setTitle] = useState('');

	const isTitleValid = title.trim() !== '';

	const isFormValid = isTitleValid;

	useEffect(() => {
		if (isCreating) {
			setTitle('');
		} else {
			if (groupFacadeId && !groupFacade) {
				dispatch(fetchGroupFacadeById({ projectId: project.id, groupFacadeId }));
			} else if (groupFacade) {
				setTitle(groupFacade.title);
			}
		}
	}, [groupFacadeId, groupFacade, dispatch, project.id]);

	const handleSave = async () => {
		if (!isFormValid) return;

		try {
			setLoading(true);
			const data = { title };
			if (isCreating) {
				await dispatch(createGroupFacade({ projectId: project.id, data })).unwrap();
				addNotification(t('group_facade_created'), 'success');
			} else {
				await dispatch(updateGroupFacade({ projectId: project.id, id: groupFacadeId, data })).unwrap();
				addNotification(t('group_facade_updated'), 'success');
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
		setError(null);
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
				<Modal.Title>{groupFacadeId ? t('header_update') : t('header_create')}</Modal.Title>
			</Modal.Header>
			<Modal.Body>
				<Form>
					<Form.Group controlId="formGroupFacadeTitle">
						<Form.Label className="m-0">{t('title')}<RedAsterisk /></Form.Label>
						<div className="d-flex flex-row justify-content-between align-items-center gap-2">
							<Form.Control type="text" className="px-3 py-1px no-spinner" value={title} onChange={(e) => setTitle(e.target.value)} placeholder={t('title_placeholder')} required autoComplete="off" />
							<IconOnly icon={isTitleValid ? CheckCircleFill : XCircleFill} variant={isTitleValid ? 'success' : 'danger'} className="wh-resize-button-sm" />
						</div>
					</Form.Group>
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

export default FacadeGroupModal;
