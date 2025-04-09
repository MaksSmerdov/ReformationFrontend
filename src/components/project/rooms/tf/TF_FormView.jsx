import React from 'react';
import { Form, Button, Accordion, OverlayTrigger, Tooltip, Row, Col } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import SelectUserInProject from '@components/common/select/SelectUserInProject';
import TF_SelectAuthor from '@components/project/rooms/tf/TF_SelectAuthor';
import { ArrowDownCircle, ArrowRightCircle } from 'react-bootstrap-icons';
import TF_Files from '@components/project/rooms/tf/TF_Files';
import { QuestionCircle } from 'react-bootstrap-icons';
import SelectTicketTeamComponent from '@components/common/advanced/SelectTicketTeamComponent/SelectTicketTeamComponent';

const ReadinessCheckbox = ({ readiness, setReadiness, ...props }) => {
	const { t } = useTranslation('translation', { keyPrefix: 'components.project.rooms.tf' });
	return <Form.Check type="checkbox" label={t('Form.readiness')} checked={readiness === 1} onChange={(e) => setReadiness(e.target.checked ? 1 : 0)} {...props} />;
};

const CriticalitySelect = ({ criticality, setCriticality, ...props }) => {
	const { t } = useTranslation('translation', { keyPrefix: 'components.project.rooms.tf' });
	return (
		<Form.Control as="select" value={criticality} onChange={(e) => setCriticality(parseInt(e.target.value))} className="px-2 py-1px lh-1 min-h-auto" {...props}>
			<option value="0">{t('Form.no_problem')}</option>
			<option value="1">{t('Form.problem')}</option>
			<option value="2">{t('Form.critical_problem')}</option>
		</Form.Control>
	);
};

const TicketStatusSelect = ({ ticketStatusId, setTicketStatusId, ...props }) => {
	const { t } = useTranslation('translation', { keyPrefix: 'components.project.rooms.tf' });
	return (
		<Form.Control as="select" value={ticketStatusId} onChange={(e) => setTicketStatusId(parseInt(e.target.value))} className="p-1px min-h-auto" {...props}>
			<option value={1}>{t('Form.opened')}</option>
			<option value={2}>{t('Form.in_progress')}</option>
			<option value={3}>{t('Form.closed')}</option>
		</Form.Control>
	);
};

const TF_FormView = ({ title, setTitle, content, setContent, messageClients, setMessageClients, criticality, setCriticality, dateStart, setDateStart, timeStart, setTimeStart, dateEnd, setDateEnd, timeEnd, setTimeEnd, deadline, setDeadline, sellerPromise, setSellerPromise, readiness, setReadiness, tt, setTt, ata, setAta, tja, setTja, tta, setTta, weekEstimate, setWeekEstimate, hourEstimate, setHourEstimate, authorId, setAuthorId, userIds, setUserIds, ticketStatusId, setTicketStatusId, handleCreate, handleSave, handleDelete, mode, statusType, now, files, setFiles, ticketTeams, setTicketTeams, customControls, customAttributes = {} }) => {
	const { t } = useTranslation('translation', { keyPrefix: 'components.project.rooms.tf' });

	return (
		<Form className="d-flex flex-column p-1 gap-2px lh-1" style={{ width: 'fit-content' }} autoComplete="off">
			<Form.Group controlId="formTitle">
				<Form.Label className="mb-1 ps-2">{t('Form.title')}</Form.Label>
				<Form.Control type="text" size="sm" value={title} onChange={(e) => setTitle(e.target.value)} className="px-2 py-1px min-h-auto" {...customAttributes.title} />
			</Form.Group>
			<Form.Group controlId="formContent1">
				<Form.Label className="mb-1 ps-2">{t('Form.content')}</Form.Label>
				<Form.Control as="textarea" size="sm" rows={2} value={content} onChange={(e) => setContent(e.target.value)} className="px-2 py-1px min-h-auto" {...customAttributes.content} />
			</Form.Group>
			<Form.Group controlId="formContent2">
				<Form.Label className="mb-1 ps-2">{t('Form.message_client')}</Form.Label>
				<Form.Control as="textarea" size="sm" rows={2} value={messageClients} onChange={(e) => setMessageClients(e.target.value)} className="px-2 py-1px min-h-auto" {...customAttributes.messageClients} autoComplete="on" />
			</Form.Group>
			<Accordion defaultActiveKey="0" className="p-0 w-100">
				<Accordion.Item eventKey="0">
					<Accordion.Header>
						<div className="ps-2"></div>
						{t('Form.accordion_title_times')}
					</Accordion.Header>
					<Accordion.Body className="p-2px d-flex flex-column align-items-center gap-2 w-min-content w-100">
						<div className="d-flex flex-row justify-content-between w-100 gap-2px">
							<Form.Group controlId="formStartDate" className="d-flex flex-column align-items-center flex-grow-1">
								<Form.Label className="mb-1 ps-2">{t('Form.start')}*</Form.Label>
								<div className="d-flex flex-row gap-2px">
									<Form.Control type="date" size="sm" value={dateStart || ''} onChange={(e) => setDateStart(e.target.value)} className="px-2 py-1px w-min-content min-h-auto border-bottom" required {...customAttributes.dateStart} />
									<Form.Control type="time" size="sm" value={timeStart || ''} onChange={(e) => setTimeStart(e.target.value)} className="px-2 py-1px w-min-content min-h-auto border-bottom" required {...customAttributes.timeStart} />
								</div>
							</Form.Group>
							<Form.Group controlId="formCriticality" className="d-flex flex-column align-items-center flex-grow-1">
								<Form.Label className="mb-1 ps-2">{t('Form.criticality')}</Form.Label>
								<CriticalitySelect criticality={criticality} setCriticality={setCriticality} {...customAttributes.criticality} />
							</Form.Group>
						</div>

						<div className="d-flex flex-row justify-content-between w-100 gap-2px">
							<Form.Group controlId="formEndDate" className="d-flex flex-column align-items-center flex-grow-1">
								<Form.Label className="mb-1 ps-2">{t('Form.end')}*</Form.Label>
								<div className="d-flex flex-row gap-2px">
									<Form.Control type="date" size="sm" value={dateEnd || ''} onChange={(e) => setDateEnd(e.target.value)} className="px-2 py-1px w-min-content min-h-auto border-bottom" required {...customAttributes.dateEnd} />
									<Form.Control type="time" size="sm" value={timeEnd || ''} onChange={(e) => setTimeEnd(e.target.value)} className="px-2 py-1px w-min-content min-h-auto border-bottom" required {...customAttributes.timeEnd} />
								</div>
							</Form.Group>
							<Form.Group controlId="formDeadline" className="d-flex flex-column align-items-center flex-grow-1">
								<Form.Label className="mb-1 ps-2">{t('Form.deadline')}*</Form.Label>
								<Form.Control type="date" size="sm" value={deadline} onChange={(e) => setDeadline(e.target.value)} className="px-2 py-1px w-min-content min-h-auto border-bottom" required {...customAttributes.deadline} />
							</Form.Group>
						</div>
						{/* <div className="d-flex flex-row justify-content-between w-100">
							<Form.Group controlId="formSellerPromise" className="d-flex flex-column align-items-center flex-grow-1">
								<Form.Label className="mb-1 ps-2">{t('Form.seller_promise')}</Form.Label>
								<Form.Control type="date" size="sm" value={sellerPromise} onChange={(e) => setSellerPromise(e.target.value)} className="px-2 py-1px w-min-content min-h-auto border-bottom" required {...customAttributes.sellerPromise} />
							</Form.Group>
						</div> */}
						<div className="d-flex flex-row justify-content-between w-100">
							<Form.Group controlId="formWeekEstimate" className="d-flex flex-column align-items-center">
								<Form.Label className="mb-1 ps-2">{t('Form.week_estimate')}</Form.Label>
								<Form.Control type="number" size="sm" value={weekEstimate} onChange={(e) => setWeekEstimate(e.target.value)} className="px-2 py-1px min-h-auto no-spinner text-center" min="0" max="52" required {...customAttributes.weekEstimate} />
							</Form.Group>
							<Form.Group controlId="formHourEstimate" className="d-flex flex-column align-items-center">
								<Form.Label className="mb-1 ps-2">{t('Form.hour_estimate')}</Form.Label>
								<Form.Control type="number" size="sm" value={hourEstimate} onChange={(e) => setHourEstimate(e.target.value)} className="px-2 py-1px min-h-auto no-spinner text-center" style={{ width: '40px' }} {...customAttributes.hourEstimate} />
							</Form.Group>
							<Form.Group controlId="formTT" className="d-flex flex-column align-items-center">
								<Form.Label className="mb-1 ps-2">{t('Form.tt')}</Form.Label>
								<Form.Control type="number" size="sm" value={tt} onChange={(e) => setTt(e.target.value)} className="px-2 py-1px min-h-auto no-spinner text-center" style={{ width: '40px' }} {...customAttributes.tt} />
							</Form.Group>
							<Form.Group controlId="formTja" className="d-flex flex-column align-items-center">
								<Form.Label className="mb-1 ps-2">{t('Form.tja')}</Form.Label>
								<Form.Control type="number" size="sm" value={tja} onChange={(e) => setTja(e.target.value)} className="px-2 py-1px min-h-auto no-spinner text-center" style={{ width: '40px' }} {...customAttributes.tja} />
							</Form.Group>
							<Form.Group controlId="formTta" className="d-flex flex-column align-items-center">
								<Form.Label className="mb-1 ps-2">{t('Form.tta')}</Form.Label>
								<Form.Control type="number" size="sm" value={tta} onChange={(e) => setTta(e.target.value)} className="px-2 py-1px min-h-auto no-spinner text-center" style={{ width: '40px' }} {...customAttributes.tta} />
							</Form.Group>
							{/* <Form.Group controlId="formReadiness">
								<Form.Label className="mb-1 ps-2">{t('Form.readiness')}</Form.Label>
								<ReadinessCheckbox readiness={readiness} setReadiness={setReadiness} {...customAttributes.readiness} />
							</Form.Group> */}
							<div className="d-flex gap-1 align-items-center justify-content-between">
								<OverlayTrigger
									placement="left"
									overlay={
										<Tooltip id="tooltip-tta">
											<div style={{ whiteSpace: 'pre-line' }}>{t('Form.tooltip_text')}</div>
										</Tooltip>
									}>
									<QuestionCircle className="wh-resize-button" />
								</OverlayTrigger>
							</div>
						</div>
					</Accordion.Body>
				</Accordion.Item>
			</Accordion>
			<Accordion defaultActiveKey="0" className="p-0 w-100">
				<Accordion.Item eventKey="0">
					<Accordion.Header>
						<div className="ps-2"></div>
						{t('Form.accordion_title_users')}
					</Accordion.Header>
					<Accordion.Body className="p-2px d-flex flex-column align-items-center gap-2 w-min-content w-100">
						<div className="d-flex flex-row gap-2px align-items-center">
							<div className="d-flex flex-row gap-2px align-items-center justify-content-center">
								<Form.Group controlId="formAuthor" className="d-flex flex-column align-items-center gap-1" style={{ minWidth: '125px' }}>
									<Form.Label className="mb-1 ps-2">{t('Form.author')}</Form.Label>
									<TF_SelectAuthor value={authorId ? { value: authorId, label: '' } : null} onChange={(selected) => setAuthorId(selected ? selected.value : null)} isMulti={false} required {...customAttributes.authorId} style={{ width: '100px' }} />
								</Form.Group>
							</div>
							<Form.Group controlId="formUserIds" className="d-flex flex-column align-items-center justify-content-center">
								<div style={{ minWidth: '150px', maxWidth: '150px' }}>
									<Form.Label className="mb-1 ps-2">{t('Form.user_ids')}</Form.Label>
									<SelectUserInProject selectedUserIds={userIds} onChange={setUserIds} isMulti={true} required {...customAttributes.userIds} className="w-min-content w-100" />
								</div>
							</Form.Group>
						</div>
						<div className="d-flex flex-row gap-2px align-items-start justify-content-between">
							<Form.Group controlId="formTeams" className="d-flex flex-column align-items-center flex-grow-1">
								<Form.Label className="mb-1 ps-2">{t('Form.teams')}</Form.Label>
								<SelectTicketTeamComponent ticketTeams={ticketTeams} setTicketTeams={setTicketTeams} />
							</Form.Group>
						</div>
					</Accordion.Body>
				</Accordion.Item>
			</Accordion>
			<Accordion defaultActiveKey="0" className="p-0 w-100">
				<Accordion.Item eventKey="0">
					<Accordion.Header>
						<div className="ps-2"></div>
						{t('Form.accordion_title_files')}
					</Accordion.Header>
					<Accordion.Body className="p-2px d-flex flex-column align-items-center gap-2 w-min-content w-100">
						<div>
							<TF_Files files={files} setFiles={setFiles} {...customAttributes.files} />
						</div>
					</Accordion.Body>
				</Accordion.Item>
			</Accordion>
			{customControls}
			{mode === 'create' && (
				<Button variant="primary" onClick={handleCreate}>
					{t('Form.create')}
				</Button>
			)}
			{mode === 'edit' && (
				<div className="d-flex justify-content-between">
					<Button variant="danger" onClick={handleDelete}>
						{t('Form.delete')}
					</Button>
					<Button variant="primary" onClick={handleSave}>
						{t('Form.save')}
					</Button>
				</div>
			)}
		</Form>
	);
};

export default TF_FormView;
