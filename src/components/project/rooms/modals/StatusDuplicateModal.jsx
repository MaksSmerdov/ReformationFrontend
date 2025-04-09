import { Modal, Button } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';

const StatusDuplicateModal = ({ show, onHide, onSelectOption }) => {
	const { t } = useTranslation('translation', { keyPrefix: 'components.project.rooms.modals.status_duplicate_modal' });

	return (
		<Modal show={show} onHide={onHide}>
			<Modal.Header closeButton>
				<Modal.Title>{t('title')}</Modal.Title>
			</Modal.Header>
			<Modal.Body className="d-flex flex-column gap-2">
				<Button variant="secondary" onClick={() => onSelectOption(1)}>
					{t('option_no_new_tickets')}
				</Button>
				<Button variant="primary" onClick={() => onSelectOption(2)}>
					{t('option_create_new_tickets')}
				</Button>
				<Button variant="danger" onClick={() => onSelectOption(3)}>
					{t('option_delete_old_create_new')}
				</Button>
			</Modal.Body>
		</Modal>
	);
};

export default StatusDuplicateModal;
