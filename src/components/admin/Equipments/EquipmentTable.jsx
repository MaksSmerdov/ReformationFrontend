import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Table } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { fetchEquipments, deleteEquipment } from '@slices/teams/equipmentsSlice';
import EquipmentModal from '@components/admin/Equipments/EquipmentModal';
import { useNotification } from '@contexts/application/NotificationContext';
import { useConfirmation } from '@contexts/application/ConfirmationContext';
import IconButton from '@components/common/icon/IconButton';
import { Pencil, Trash, PlusLg } from 'react-bootstrap-icons';

const EquipmentTable = () => {
	const dispatch = useDispatch();
	const equipments = useSelector((state) => state.equipments.items);
	const { t } = useTranslation('translation', { keyPrefix: 'components.admin.equipment_table' });
	const [showModal, setShowModal] = useState(false);
	const [selectedEquipment, setSelectedEquipment] = useState(null);
	const { addNotification } = useNotification();
	const { showConfirmation } = useConfirmation();
	const [error, setError] = useState(null);
	const [errorDisplayed, setErrorDisplayed] = useState(false);

	useEffect(() => {
		dispatch(fetchEquipments());
	}, [dispatch]);

	const handleCreate = () => {
		setSelectedEquipment(null);
		setShowModal(true);
	};

	const handleEdit = (equipment) => {
		setSelectedEquipment(equipment);
		setShowModal(true);
	};

	const handleDelete = (id) => {
		showConfirmation(t('confirm_delete_message'), () => {
			dispatch(deleteEquipment(id)).then((result) => {
				if (result.type === 'equipments/deleteEquipment/fulfilled') {
					addNotification(t('equipment_deleted'), 'success');
				} else {
					setError(t('equipment_delete_failed'));
					setErrorDisplayed(false);
				}
			});
		});
	};

	useEffect(() => {
		if (error && !errorDisplayed) {
			addNotification(error, 'error');
			setErrorDisplayed(true);
		}
	}, [error, errorDisplayed, addNotification]);

	const handleCloseModal = () => {
		setShowModal(false);
	};

	const handleSuccess = (message) => {
		addNotification(message, 'success');
		setShowModal(false);
		dispatch(fetchEquipments());
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
							<th className="px-2 text-center text-break">{t('table_column_name')}</th>
							<th className="px-2 text-center text-break">{t('table_column_model')}</th>
							<th className="px-2 text-center text-break">{t('table_column_serial_number')}</th>
							<th className="px-2 text-center text-break">{t('table_column_description')}</th>
							<th className="w-1px"></th>
						</tr>
					</thead>
					<tbody>
						{equipments && equipments.length > 0 ? (
							equipments.map((equipment) => (
								<tr key={equipment.id}>
									<td>
										<IconButton icon={Pencil} variant="outline-primary" onClick={() => handleEdit(equipment)} className="w-resize-button h-100 h-min-resize-button" />
									</td>
									<td className="px-2 text-center">{equipment.name}</td>
									<td className="px-2 text-center">{equipment.model}</td>
									<td className="px-2 text-center">{equipment.serial_number}</td>
									<td className="px-2 text-center">{equipment.description}</td>
									<td>
										<IconButton icon={Trash} variant="outline-danger" onClick={() => handleDelete(equipment.id)} className="w-resize-button h-100 h-min-resize-button" />
									</td>
								</tr>
							))
						) : (
							<tr>
								<td colSpan="6" className="text-center">
									{t('no_equipments')}
								</td>
							</tr>
						)}
					</tbody>
				</Table>
			</div>

			<EquipmentModal equipment={selectedEquipment} show={showModal} onHide={handleCloseModal} onSuccess={handleSuccess} />
		</div>
	);
};

export default EquipmentTable;
