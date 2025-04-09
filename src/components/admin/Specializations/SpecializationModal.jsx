import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { Button, Form, Modal } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { createSpecialization, updateSpecialization } from '@slices/teams/specializationsSlice';
import { useNotification } from '@contexts/application/NotificationContext';
import SelectSpecialization from '@components/common/select/SelectSpecialization';

const SpecializationModal = ({ specialization = null, show, onHide, onSuccess }) => {
	const dispatch = useDispatch();
	const [title, setTitle] = useState('');
	const [iconIndex, setIconIndex] = useState('');
	const { t } = useTranslation('translation', { keyPrefix: 'components.admin.specialization_modal' });
	const { addNotification } = useNotification();

	useEffect(() => {
		if (specialization) {
			setTitle(specialization.title);
			setIconIndex(specialization.icon_index);
		} else {
			setTitle('');
			setIconIndex('');
		}
	}, [specialization]);

	const handleSubmit = async (e) => {
		e.preventDefault();
		try {
			if (specialization) {
				const update_specialization_data = {
					id: specialization.id,
					title,
					icon_index: iconIndex
				};
				await dispatch(updateSpecialization(update_specialization_data)).unwrap();
				addNotification(t('specialization_updated'), 'success');
			} else {
				const create_specialization_data = {
					title,
					icon_index: iconIndex
				};
				await dispatch(createSpecialization(create_specialization_data)).unwrap();
				addNotification(t('specialization_created'), 'success');
			}
			onHide();
			onSuccess();
		} catch (error) {
			addNotification(error.message || t('error_occurred'), 'danger');
		}
	};

	return (
		<Modal show={show} onHide={onHide}>
			<Modal.Header closeButton>
				<Modal.Title>{specialization ? t('header_update') : t('header_create')}</Modal.Title>
			</Modal.Header>
			<Modal.Body>
				<Form onSubmit={handleSubmit} autoComplete="off" className="d-flex flex-column gap-2">
					<Form.Group controlId="formSpecializationTitle">
						<Form.Label className="m-0">{t('title')}</Form.Label>
						<Form.Control type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder={t('title_placeholder')} required autoComplete="off" />
					</Form.Group>

					<Form.Group controlId="formSpecializationIconIndex">
						<Form.Label className="m-0">{t('icon_index')}</Form.Label>
						<SelectSpecialization value={iconIndex} onChange={setIconIndex} />
					</Form.Group>

					<Form.Group className="text-center">
						<Button variant="primary" type="submit">
							{specialization ? t('button_update') : t('button_create')}
						</Button>
					</Form.Group>
				</Form>
			</Modal.Body>
		</Modal>
	);
};

export default SpecializationModal;
