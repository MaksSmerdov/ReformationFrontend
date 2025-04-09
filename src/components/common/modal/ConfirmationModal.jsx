import { Modal, Button } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';

const ConfirmationModal = ({ show, onHide, onConfirm, message }) => {
	const { t } = useTranslation('translation', { keyPrefix: 'components.modal.confirmation_modal' });

	return (
		<Modal show={show} onHide={onHide}>
			<Modal.Header closeButton>
				<Modal.Title>{t('confirm_action')}</Modal.Title>
			</Modal.Header>
			<Modal.Body>{message}</Modal.Body>
			<Modal.Footer>
				<Button variant="secondary" onClick={onHide}>
					{t('button_cancel')}
				</Button>
				<Button variant="danger" onClick={onConfirm}>
					{t('button_confirm')}
				</Button>
			</Modal.Footer>
		</Modal>
	);
};

export default ConfirmationModal;
