import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { Button, Form, Modal } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { createTeam, updateTeam } from '@slices/teams/teamsSlice';
import SelectSpecialization from '@components/common/select/SelectSpecialization';
import TeamUsersChanger from '@components/admin/Teams/TeamUsersChanger';
import TeamEquipmentsChanger from '@components/admin/Teams/TeamEquipmentsChanger';

const TeamModal = ({ teamObject = null, show, onHide, onSuccess }) => {
	const dispatch = useDispatch();
	const { t } = useTranslation('translation', { keyPrefix: 'components.admin.team_modal' });

	const [title, setTitle] = useState('');
	const [description, setDescription] = useState('');
	const [specializationId, setSpecializationId] = useState('');
	const [users, setUsers] = useState([]);
	const [equipments, setEquipments] = useState([]);

	useEffect(() => {
		if (teamObject) {
			setTitle(teamObject.team.title || '');
			setDescription(teamObject.team.description || '');
			setSpecializationId(teamObject.team.specialization_id || '');
			setUsers(teamObject.users || []);
			setEquipments(teamObject.equipments || []);
		} else {
			setTitle('');
			setDescription('');
			setSpecializationId('');
			setUsers([]);
			setEquipments([]);
		}
	}, [teamObject]);

	const handleSubmit = async (e) => {
		e.preventDefault();
		const teamData = {
			team: {
				id: teamObject ? teamObject.team.id : null,
				title,
				description,
				specialization_id: specializationId
			},
			users: users
				.filter((userObject) => userObject.user && userObject.user.id && userObject.team_role && userObject.specialization_id)
				.map((userObject) => ({
					user: { id: userObject.user.id },
					team_role: userObject.team_role,
					specialization_id: userObject.specialization_id
				})),
			equipments: equipments
				.filter((equipmentObject) => equipmentObject.equipment && equipmentObject.equipment.id)
				.map((equipmentObject) => ({
					equipment: { id: equipmentObject.equipment.id }
				}))
		};

		try {
			if (teamObject) {
				await dispatch(updateTeam(teamData)).unwrap();
				onSuccess(t('team_updated'));
			} else {
				await dispatch(createTeam(teamData)).unwrap();
				onSuccess(t('team_created'));
			}
			onHide();
		} catch (error) {
			console.error(error);
		}
	};

	return (
		<Modal show={show} onHide={onHide}>
			<Modal.Header closeButton>
				<Modal.Title>{teamObject ? t('header_update') : t('header_create')}</Modal.Title>
			</Modal.Header>
			<Modal.Body>
				<Form onSubmit={handleSubmit} className="d-flex flex-column gap-2">
					<Form.Group controlId="formTeamTitle">
						<Form.Label className="m-0">{t('title')}</Form.Label>
						<Form.Control type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder={t('title_placeholder')} required autoComplete="off" className="px-2 py-1px lh-1" />
					</Form.Group>
					<Form.Group controlId="formTeamDescription">
						<Form.Label className="m-0">{t('description')}</Form.Label>
						<Form.Control type="text" value={description} onChange={(e) => setDescription(e.target.value)} placeholder={t('description_placeholder')} maxLength={1024} className="px-2 py-1px lh-1" />
					</Form.Group>
					<Form.Group controlId="formTeamSpecialization">
						<Form.Label className="m-0">{t('specialization')}</Form.Label>
						<SelectSpecialization value={specializationId} onChange={setSpecializationId} />
					</Form.Group>
					<Form.Group controlId="formTeamUsers">
						<Form.Label className="m-0">{t('users')}</Form.Label>
						<TeamUsersChanger users={users} setUsers={setUsers} />
					</Form.Group>
					<Form.Group controlId="formTeamEquipments">
						<Form.Label className="m-0">{t('equipments')}</Form.Label>
						<TeamEquipmentsChanger equipments={equipments} setEquipments={setEquipments} />
					</Form.Group>
					<Form.Group className="text-center">
						<Button variant="primary" type="submit">
							{teamObject ? t('button_update') : t('button_create')}
						</Button>
					</Form.Group>
				</Form>
			</Modal.Body>
		</Modal>
	);
};

export default TeamModal;
