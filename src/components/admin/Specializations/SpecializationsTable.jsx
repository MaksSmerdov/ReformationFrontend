import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Table } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { fetchSpecializations, deleteSpecialization } from '@slices/teams/specializationsSlice';
import SpecializationModal from '@components/admin/Specializations/SpecializationModal';
import IconSpecialization from '@components/common/icon/IconSpecialization';
import { useNotification } from '@contexts/application/NotificationContext';
import { useConfirmation } from '@contexts/application/ConfirmationContext';
import IconButton from '@components/common/icon/IconButton';
import { Pencil, Trash, PlusLg } from 'react-bootstrap-icons';

const SpecializationsTable = () => {
	const dispatch = useDispatch();
	const specializations = useSelector((state) => state.specializations.items);
	const { t } = useTranslation('translation', { keyPrefix: 'components.admin.specializations_manager' });
	const [showModal, setShowModal] = useState(false);
	const [selectedSpecialization, setSelectedSpecialization] = useState(null);
	const { addNotification } = useNotification();
	const { showConfirmation } = useConfirmation();

	useEffect(() => {
		dispatch(fetchSpecializations());
	}, [dispatch]);

	const handleCreate = () => {
		setSelectedSpecialization(null);
		setShowModal(true);
	};

	const handleEdit = (specialization) => {
		setSelectedSpecialization(specialization);
		setShowModal(true);
	};

	const handleDelete = (id) => {
		showConfirmation(t('confirm_delete_message'), async () => {
			try {
				await dispatch(deleteSpecialization(id)).unwrap();
				addNotification(t('specialization_deleted'), 'success');
			} catch (error) {
				addNotification(error.message || t('error_occurred'), 'danger');
			}
		});
	};

	const handleCloseModal = () => {
		setShowModal(false);
	};

	const handleSuccess = () => {
		dispatch(fetchSpecializations());
		setShowModal(false);
	};

	return (
		<div className="w-100 d-flex flex-column align-items-center justify-content-center">
			<h1>{t('component_title')}</h1>

			<div className="d-flex w-100 overflow-auto justify-content-around">
				<Table striped bordered hover className="m-0 w-max-content">
					<thead>
						<tr>
							<th className="w-1px">
								<IconButton icon={PlusLg} variant="success" onClick={handleCreate} className="w-resize-button h-100 h-min-resize-button" />
							</th>
							<th className="px-2 text-center">{t('table_column_icon_index')}</th>
							<th className="px-2 text-center">{t('table_column_title')}</th>
							<th className="w-1px"></th>
						</tr>
					</thead>
					<tbody>
						{specializations.map((specialization) => (
							<tr key={specialization.id}>
								<td>
									<IconButton icon={Pencil} variant="outline-primary" onClick={() => handleEdit(specialization)} className="w-resize-button h-100 h-min-resize-button" />
								</td>
								<td className="px-2 text-center">
									<IconSpecialization id={specialization.icon_index} title={specialization.title} />
								</td>
								<td className="px-2 text-center">{specialization.title}</td>
								<td>
									<IconButton icon={Trash} variant="outline-danger" onClick={() => handleDelete(specialization.id)} className="w-resize-button h-100 h-min-resize-button" />
								</td>
							</tr>
						))}
					</tbody>
				</Table>
			</div>

			<SpecializationModal specialization={selectedSpecialization} show={showModal} onHide={handleCloseModal} onSuccess={handleSuccess} />
		</div>
	);
};

export default SpecializationsTable;
