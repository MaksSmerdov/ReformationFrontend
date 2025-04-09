import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Button, Modal, Spinner, Alert } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { fetchStatusGroups, selectStatusGroupsByProjectTypeId, deleteStatusGroup } from '@slices/projects/statusGroupsSlice';
import StatusGroupModal from '@components/admin/StatusGroupModal';
import StatusGroupCard from '@components/admin/StatusGroupCard';
import { useNotification } from '@contexts/application/NotificationContext';

const StatusGroupsManager = ({ projectTypeId }) => {
	const dispatch = useDispatch();
	const statusGroups = useSelector((state) => selectStatusGroupsByProjectTypeId(state, projectTypeId));
	const { t } = useTranslation('translation', { keyPrefix: 'components.admin.status_groups_manager' });
	const [showModal, setShowModal] = useState(false);
	const [selectedStatusGroup, setSelectedStatusGroup] = useState(null);
	const [showConfirmDelete, setShowConfirmDelete] = useState(false);
	const [deleteId, setDeleteId] = useState(null);
	const { addNotification } = useNotification();
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);

	useEffect(() => {
		if (projectTypeId && !statusGroups.length) {
			setLoading(true);
			dispatch(fetchStatusGroups(projectTypeId))
				.unwrap()
				.catch((error) => {
					setError(t('fetch_error'));
					addNotification(t('fetch_error'), 'error');
				})
				.finally(() => setLoading(false));
		} else {
			setLoading(false);
		}
	}, [dispatch, projectTypeId, statusGroups.length, addNotification, t]);

	const handleCreate = () => {
		setSelectedStatusGroup(null);
		setShowModal(true);
	};

	const handleEdit = (statusGroup) => {
		setSelectedStatusGroup(statusGroup);
		setShowModal(true);
	};

	const handleDelete = (id) => {
		setDeleteId(id);
		setShowConfirmDelete(true);
	};

	const confirmDelete = () => {
		dispatch(deleteStatusGroup({ id: deleteId, projectTypeId }))
			.then(() => {
				addNotification(t('status_group_deleted'), 'success');
				setShowConfirmDelete(false);
			})
			.catch((error) => {
				addNotification(t('delete_error'), 'error');
			});
	};

	const handleCloseModal = () => {
		setShowModal(false);
		setSelectedStatusGroup(null);
	};

	const handleSuccess = (message) => {
		addNotification(message, 'success');
		setShowModal(false);
		setSelectedStatusGroup(null);
	};

	if (loading) {
		return <Spinner animation="border" />;
	}

	if (error) {
		return <Alert variant="danger">{error}</Alert>;
	}

	return (
		<div>
			<h1>{t('component_title')}</h1>
			<Button variant="primary" onClick={handleCreate}>
				{t('button_create')}
			</Button>
			<div className="mt-3">
				{statusGroups.map((group) => (
					<StatusGroupCard key={group.id} statusGroup={group} onEdit={handleEdit} onDelete={handleDelete} />
				))}
			</div>

			<StatusGroupModal statusGroup={selectedStatusGroup} show={showModal} onHide={handleCloseModal} onSuccess={handleSuccess} />

			<Modal show={showConfirmDelete} onHide={() => setShowConfirmDelete(false)}>
				<Modal.Header closeButton>
					<Modal.Title>{t('confirm_delete_title')}</Modal.Title>
				</Modal.Header>
				<Modal.Body>{t('confirm_delete_message')}</Modal.Body>
				<Modal.Footer>
					<Button variant="secondary" onClick={() => setShowConfirmDelete(false)}>
						{t('button_cancel')}
					</Button>
					<Button variant="danger" onClick={confirmDelete}>
						{t('button_confirm')}
					</Button>
				</Modal.Footer>
			</Modal>
		</div>
	);
};

export default StatusGroupsManager;
