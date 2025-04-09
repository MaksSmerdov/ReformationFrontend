import React, { useCallback } from 'react';
import { Pencil, Trash } from 'react-bootstrap-icons';
import IconButton from '@components/common/icon/IconButton';
import { useConfirmation } from '@contexts/application/ConfirmationContext';
import { useNotification } from '@contexts/application/NotificationContext';
import { useTranslation } from 'react-i18next';
import { useFacadeProjectModals } from '@contexts/facades_project/FacadeProjectModalsContext';

const FacadeCardButtons = React.memo(({ facade }) => {
	const { handleEditFacade, handleDeleteFacade } = useFacadeProjectModals();
	const { showConfirmation } = useConfirmation();
	const { addNotification } = useNotification();
	const { t } = useTranslation('translation', { keyPrefix: 'components.project.facades.facade_card' });

	const handleDelete = useCallback(() => {
		showConfirmation(t('confirm_delete_message'), async () => {
			try {
				await handleDeleteFacade(facade.project_id, facade.id);
				addNotification(t('facade_deleted'), 'success');
			} catch (error) {
				addNotification(t('delete_error'), 'danger');
			}
		});
	}, [handleDeleteFacade, facade.project_id, facade.id, showConfirmation, t, addNotification]);

	return (
		<div className="d-flex gap-2">
			<IconButton icon={Pencil} variant="outline-primary" onClick={() => handleEditFacade(facade)} className="wh-resize-button" />
			<IconButton icon={Trash} variant="outline-danger" onClick={handleDelete} className="wh-resize-button" />
		</div>
	);
});

export default FacadeCardButtons;
