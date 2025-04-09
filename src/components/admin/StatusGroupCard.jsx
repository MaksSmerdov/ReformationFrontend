import { Card, Button } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';

const StatusGroupCard = ({ statusGroup, onEdit, onDelete }) => {
	const { t } = useTranslation('translation', { keyPrefix: 'components.admin.status_group_card' });

	if (!statusGroup) {
		return null;
	}

	const { title, color } = statusGroup;
	if (!title || !color) {
		console.error('StatusGroupCard: Missing required status group data', statusGroup);
		return null;
	}

	return (
		<Card className="mb-3">
			<Card.Header>
				<div className="d-flex justify-content-between align-items-center">
					<div className="d-flex align-items-center">
						<div className="px-2 py-0 rounded-2 border border-4 fw-bold" style={{ '--bs-border-color': color }} title={title}>
							{title}
						</div>
					</div>
					<div>
						<Button variant="warning" onClick={() => onEdit(statusGroup)} className="me-2">
							{t('button_edit')}
						</Button>
						<Button variant="danger" onClick={() => onDelete(statusGroup.id)}>
							{t('button_delete')}
						</Button>
					</div>
				</div>
			</Card.Header>
			<Card.Body>{/* Здесь будут отображаться статусы */}</Card.Body>
		</Card>
	);
};

export default StatusGroupCard;
