import React, { useCallback } from 'react';
import { Pencil, Trash } from 'react-bootstrap-icons';
import IconButton from '@components/common/icon/IconButton';
import { useConfirmation } from '@contexts/application/ConfirmationContext';
import { useNotification } from '@contexts/application/NotificationContext';
import { useTranslation } from 'react-i18next';
import { useFacadeProjectModals } from '@contexts/facades_project/FacadeProjectModalsContext';
import { useFacadesProject } from '@contexts/facades_project/FacadesProjectContext';

const FacadeGroupCardButtons = React.memo(({ groupFacade }) => {
	const { handleEditGroupFacade, handleDeleteGroupFacade } = useFacadeProjectModals();
	const { mode } = useFacadesProject();
	const { showConfirmation } = useConfirmation();
	const { addNotification } = useNotification();
	const { t } = useTranslation('translation', { keyPrefix: 'components.project.facades.group_facades' });

	const handleDelete = useCallback(() => {
		showConfirmation(t('confirm_delete_message'), async () => {
			try {
				await handleDeleteGroupFacade(groupFacade.project_id, groupFacade.id);
				addNotification(t('group_facade_deleted'), 'success');
			} catch (error) {
				addNotification(t('delete_error'), 'danger');
			}
		});
	}, [handleDeleteGroupFacade, groupFacade.project_id, groupFacade.id, showConfirmation, t, addNotification]);

	return (
		<div className="d-flex gap-2">
			{mode === 'edit' && (
				<>
					<IconButton icon={Pencil} variant="outline-primary" onClick={() => handleEditGroupFacade(groupFacade.id)} className="wh-resize-button" />
					<IconButton icon={Trash} variant="outline-danger" onClick={handleDelete} className="wh-resize-button" />
				</>
			)}
		</div>
	);
});

export default FacadeGroupCardButtons;
