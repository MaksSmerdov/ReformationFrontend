import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { uploadTicketFiles, deleteTicketFile } from '@slices/tickets/ticketFilesSlice';
import { updateTicketFiles } from '@slices/tickets/apartmentTicketsSlice';
import { useTranslation } from 'react-i18next';
import { useNotification } from '@contexts/application/NotificationContext';
import { fetchTicket } from '@slices/tickets/apartmentTicketsSlice';
import TF_FormView from '@components/project/rooms/tf/TF_FormView';

const TF_FormEdit = ({ ticket, onSave, onDelete, onCreate, mode, customControls, customAttributes }) => {
	const now = new Date().toISOString().slice(0, 10);
	const dispatch = useDispatch();
	const { t } = useTranslation('translation', { keyPrefix: 'components.project.rooms.tf' });
	const { addNotification } = useNotification();
	const currentUser = JSON.parse(localStorage.getItem('user'));

	const [title, setTitle] = useState('');
	const [content, setContent] = useState('');
	const [messageClients, setMessageClients] = useState('');
	const [criticality, setCriticality] = useState(0);
	const [dateStart, setDateStart] = useState('');
	const [timeStart, setTimeStart] = useState('');
	const [dateEnd, setDateEnd] = useState('');
	const [timeEnd, setTimeEnd] = useState('');
	const [deadline, setDeadline] = useState(now);
	const [sellerPromise, setSellerPromise] = useState('');
	const [readiness, setReadiness] = useState(0);
	const [tt, setTt] = useState(0);
	const [ata, setAta] = useState(0);
	const [tja, setTja] = useState(0);
	const [tta, setTta] = useState(0);
	const [weekEstimate, setWeekEstimate] = useState(0);
	const [hourEstimate, setHourEstimate] = useState(0);
	const [authorId, setAuthorId] = useState(currentUser.id);
	const [userIds, setUserIds] = useState([]);
	const [ticketStatusId, setTicketStatusId] = useState(1);
	const [ticketTeams, setTicketTeams] = useState([]);
	const [files, setFiles] = useState([]);

	useEffect(() => {
		if (ticket) {
			setTitle(ticket.title || '');
			setContent(ticket.content || '');
			setMessageClients(ticket.message_clients || '');
			setCriticality(ticket.criticality || 0);
			setDateStart(ticket.datetime_start ? ticket.datetime_start.split(' ')[0] : '');
			setTimeStart(ticket.datetime_start ? ticket.datetime_start.split(' ')[1] : '');
			setDateEnd(ticket.datetime_end ? ticket.datetime_end.split(' ')[0] : '');
			setTimeEnd(ticket.datetime_end ? ticket.datetime_end.split(' ')[1] : '');
			setDeadline(ticket.deadline || now);
			setSellerPromise(ticket.seller_promise || '');
			setReadiness(ticket.readiness || 0);
			setTt(ticket.tt || 0);
			setAta(ticket.ata || 0);
			setTja(ticket.tja || 0);
			setTta(ticket.tta || 0);
			setWeekEstimate(ticket.week_estimate || 0);
			setHourEstimate(ticket.hour_estimate || 0);
			setAuthorId(ticket.author?.id || currentUser.id);
			setUserIds(ticket.users.map((userRecord) => userRecord.id) || []);
			setTicketStatusId(ticket.ticket_status.id || 1);
			setTicketTeams(
				ticket.teams.map((teamObject) => ({
					team: teamObject.team,
					users: teamObject.users.map((userObject) => ({ ...userObject, isSelected: true })),
					equipments: teamObject.equipments.map((equipmentObject) => ({ ...equipmentObject, isSelected: true }))
				})) || []
			);
			setFiles(ticket.files || []);
		}
	}, [ticket, currentUser.id, now]);

	const validateForm = () => {
		return deadline && authorId;
	};

	const handleSave = async () => {
		if (!validateForm()) return;

		const updatedTicket = {
			...ticket,
			title,
			content,
			message_clients: messageClients,
			criticality,
			datetime_start: `${dateStart} ${timeStart}`,
			datetime_end: `${dateEnd} ${timeEnd}`,
			deadline,
			seller_promise: sellerPromise,
			readiness,
			tt,
			ata,
			tja,
			tta,
			week_estimate: weekEstimate,
			hour_estimate: hourEstimate,
			author: { id: authorId },
			users: userIds.map((id) => ({ id })),
			ticket_status: { id: ticketStatusId },
			teams: ticketTeams.map((teamObject) => ({
				team: teamObject.team,
				users: teamObject.users.filter((userObject) => userObject.isSelected && userObject.user.id != null && userObject.team_role != null && userObject.specialization_id != null),
				equipments: teamObject.equipments.filter((equipmentObject) => equipmentObject.isSelected && equipmentObject.equipment.id)
			}))
		};

		try {
			await onSave(updatedTicket);
			addNotification(t('Messages.update_success'), 'success');

			console.log('Files:', files);

			const formData = new FormData();
			files.forEach((file) => {
				if (file.isCreating) {
					formData.append('files[]', file.file);
					// console.log('Adding file:', file.file, formData.getAll('files[]'));
				}
			});
			if (formData.has('files[]')) {
				// console.log('Uploading files:', formData.getAll('files[]'));
				dispatch(uploadTicketFiles({ ticketId: updatedTicket.id, formData }))
					.unwrap()
					.then((uploadedFiles) => {
						console.log('Uploaded files:', uploadedFiles);
						// uploadedFiles.files.forEach((uploadedFile) => {
						// 	setFiles(files.map((file) => (file.isCreating ? uploadedFile : file)));
						// });
						setFiles([...files.filter((file) => !file.isCreating, ...uploadedFiles.files)]);

						dispatch(updateTicketFiles({ ticketId: updatedTicket.id, files }));
					})
					.catch((err) => {
						console.error('Failed to upload files:', err);
					});
			}

			files.forEach((file) => {
				// console.log('File:', file);
				if (file.isDeleting) {
					dispatch(deleteTicketFile({ ticketId: updatedTicket.id, fileId: file.id }))
						.unwrap()
						.then((deletedFile) => {
							console.log('Deleted files:', deletedFile);
							setFiles(files.filter((file) => file.id !== deletedFile.fileId));
							dispatch(updateTicketFiles({ ticketId: updatedTicket.id, files }));
						})
						.catch((err) => {
							console.error('Failed to delete file:', err);
						});
				}
			});

			dispatch(fetchTicket({ apartmentId: updatedTicket.apartment.id, ticketId: updatedTicket.id }));
		} catch (error) {
			addNotification(t('Messages.update_failure'), 'danger');
		}
	};

	const handleCreate = async () => {
		if (!validateForm()) return;

		const newTicket = {
			title,
			content,
			message_clients: messageClients,
			criticality,
			datetime_start: `${dateStart} ${timeStart}`,
			datetime_end: `${dateEnd} ${timeEnd}`,
			deadline,
			seller_promise: sellerPromise,
			readiness,
			tt,
			ata,
			tja,
			tta,
			week_estimate: weekEstimate,
			hour_estimate: hourEstimate,
			author: { id: authorId },
			users: userIds.map((id) => ({ id })),
			ticket_status: { id: ticketStatusId },
			teams: ticketTeams
		};

		try {
			const createdTicket = await onCreate(newTicket);
			console.log('Created ticket:', createdTicket);
			addNotification(t('Messages.create_success'), 'success');

			const formData = new FormData();
			files.forEach((file) => {
				if (file.isCreating) {
					formData.append('files[]', file);
				}
			});
			if (formData.has('files[]')) {
				dispatch(uploadTicketFiles({ ticketId: createdTicket.id, formData }))
					.unwrap()
					.then((uploadedFiles) => {
						setFiles([...files, ...uploadedFiles]);
					})
					.catch((err) => {
						console.error('Failed to upload files:', err);
					});
			}
		} catch (error) {
			addNotification(t('Messages.create_failure'), 'danger');
			console.error('Failed to create ticket:', error);
		}
	};

	const handleDelete = () => {
		try {
			onDelete();
			addNotification(t('Messages.delete_success'), 'success');

			files.forEach((file) => {
				if (file.isDeleting) {
					dispatch(deleteTicketFile({ ticketId: ticket.id, fileId: file.id }))
						.unwrap()
						.then(() => {
							setFiles(files.filter((f) => f.id !== file.id));
						})
						.catch((err) => {
							console.error('Failed to delete file:', err);
						});
				}
			});
		} catch (error) {
			addNotification(t('Messages.delete_failure'), 'danger');
		}
	};

	return <TF_FormView title={title} setTitle={setTitle} content={content} setContent={setContent} messageClients={messageClients} setMessageClients={setMessageClients} criticality={criticality} setCriticality={setCriticality} dateStart={dateStart} setDateStart={setDateStart} timeStart={timeStart} setTimeStart={setTimeStart} dateEnd={dateEnd} setDateEnd={setDateEnd} timeEnd={timeEnd} setTimeEnd={setTimeEnd} deadline={deadline} setDeadline={setDeadline} sellerPromise={sellerPromise} setSellerPromise={setSellerPromise} readiness={readiness} setReadiness={setReadiness} tt={tt} setTt={setTt} ata={ata} setAta={setAta} tja={tja} setTja={setTja} tta={tta} setTta={setTta} weekEstimate={weekEstimate} setWeekEstimate={setWeekEstimate} hourEstimate={hourEstimate} setHourEstimate={setHourEstimate} authorId={authorId} setAuthorId={setAuthorId} userIds={userIds} setUserIds={setUserIds} ticketStatusId={ticketStatusId} setTicketStatusId={setTicketStatusId} handleCreate={handleCreate} handleSave={handleSave} handleDelete={handleDelete} mode={mode} files={files} setFiles={setFiles} customControls={customControls} customAttributes={customAttributes} ticketTeams={ticketTeams} setTicketTeams={setTicketTeams} />;
};

export default React.memo(TF_FormEdit);
