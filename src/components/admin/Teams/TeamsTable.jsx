import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Table } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { fetchAllTeams, deleteTeam } from '@slices/teams/teamsSlice';
import TeamModal from '@components/admin/Teams/TeamModal';
import { useNotification } from '@contexts/application/NotificationContext';
import { useConfirmation } from '@contexts/application/ConfirmationContext';
import IconButton from '@components/common/icon/IconButton';
import { Pencil, Trash, PlusLg } from 'react-bootstrap-icons';
import IconSpecialization from '@components/common/icon/IconSpecialization';
import TeamUsersViewer from '@components/admin/Teams/TeamUsersViewer';
import TeamEquipmentsViewer from '@components/admin/Teams/TeamEquipmentsViewer';

const TeamsTable = () => {
	const dispatch = useDispatch();
	const teams = useSelector((state) => state.teams.items);
	const { t } = useTranslation('translation', { keyPrefix: 'components.admin.teams_table' });
	const [showModal, setShowModal] = useState(false);
	const [selectedTeam, setSelectedTeam] = useState(null);
	const { addNotification } = useNotification();
	const { showConfirmation } = useConfirmation();

	useEffect(() => {
		dispatch(fetchAllTeams());
	}, [dispatch]);

	const handleCreate = () => {
		setSelectedTeam(null);
		setShowModal(true);
	};

	const handleEdit = (team) => {
		setSelectedTeam(team);
		setShowModal(true);
	};

	const handleDelete = (id) => {
		showConfirmation(t('confirm_delete_message'), async () => {
			try {
				await dispatch(deleteTeam(id)).unwrap();
				addNotification(t('team_deleted'), 'success');
			} catch (error) {
				addNotification(error.message || t('error_occurred'), 'danger');
			}
		});
	};

	const handleCloseModal = () => {
		setShowModal(false);
	};

	const handleSuccess = (message) => {
		addNotification(message, 'success');
		setShowModal(false);
		dispatch(fetchAllTeams());
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
							<th className="px-2 text-center overflow-wrap-anywhere">{t('table_column_title')}</th>
							<th className="px-2 text-center overflow-wrap-anywhere">{t('table_column_description')}</th>
							<th className="px-2 text-center overflow-wrap-anywhere">{t('table_column_specialization')}</th>
							<th className="px-2 text-center overflow-wrap-anywhere">{t('table_column_users')}</th>
							<th className="px-2 text-center overflow-wrap-anywhere">{t('table_column_equipments')}</th>
							<th className="w-1px"></th>
						</tr>
					</thead>
					<tbody>
						{teams.map((teamObject) => (
							<tr key={teamObject.team.id}>
								<td>
									<IconButton icon={Pencil} variant="outline-primary" onClick={() => handleEdit(teamObject)} className="w-resize-button h-100 h-min-resize-button" />
								</td>
								<td className="px-2 text-center">{teamObject.team.title}</td>
								<td className="px-2 text-center">{teamObject.team.description}</td>
								<td className="px-2 text-center">
									<IconSpecialization id={teamObject.team.specialization_id} title={teamObject.team.specialization_id} />
								</td>
								<td className="p-0 text-center">
									<TeamUsersViewer users={teamObject.users} showRole={true} className="rounded-0 border-0" />
								</td>
								<td className="p-0 text-center">
									<TeamEquipmentsViewer equipments={teamObject.equipments} className="rounded-0 border-0" />
								</td>
								<td>
									<IconButton icon={Trash} variant="outline-danger" onClick={() => handleDelete(teamObject.team.id)} className="w-resize-button h-100 h-min-resize-button" />
								</td>
							</tr>
						))}
					</tbody>
				</Table>
			</div>

			<TeamModal teamObject={selectedTeam} show={showModal} onHide={handleCloseModal} onSuccess={handleSuccess} />
		</div>
	);
};

export default TeamsTable;
