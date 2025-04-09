import React from 'react';
import { usePSMStatus } from '@contexts/rooms_project/PSMStatusContext';
import TF_FormView from '@components/project/rooms/tf/TF_FormView';

const TF_FormSynthetic = ({ customControls, customAttributes }) => {
	const { title, setTitle, content, setContent, messageClients, setMessageClients, criticality, setCriticality, dateStart, setDateStart, timeStart, setTimeStart, dateEnd, setDateEnd, timeEnd, setTimeEnd, deadline, setDeadline, sellerPromise, setSellerPromise, readiness, setReadiness, tt, setTt, ata, setAta, tja, setTja, tta, setTta, weekEstimate, setWeekEstimate, hourEstimate, setHourEstimate, authorId, setAuthorId, userIds, setUserIds, ticketStatusId, setTicketStatusId, files, setFiles, ticketTeams, setTicketTeams, handleCreate, handleSave, handleDelete, statusType, now } = usePSMStatus();

	return <TF_FormView title={title} setTitle={setTitle} content={content} setContent={setContent} messageClients={messageClients} setMessageClients={setMessageClients} criticality={criticality} setCriticality={setCriticality} dateStart={dateStart} setDateStart={setDateStart} timeStart={timeStart} setTimeStart={setTimeStart} dateEnd={dateEnd} setDateEnd={setDateEnd} timeEnd={timeEnd} setTimeEnd={setTimeEnd} deadline={deadline} setDeadline={setDeadline} sellerPromise={sellerPromise} setSellerPromise={setSellerPromise} readiness={readiness} setReadiness={setReadiness} tt={tt} setTt={setTt} ata={ata} setAta={setAta} tja={tja} setTja={setTja} tta={tta} setTta={setTta} weekEstimate={weekEstimate} setWeekEstimate={setWeekEstimate} hourEstimate={hourEstimate} setHourEstimate={setHourEstimate} authorId={authorId} setAuthorId={setAuthorId} userIds={userIds} setUserIds={setUserIds} ticketStatusId={ticketStatusId} setTicketStatusId={setTicketStatusId} handleCreate={handleCreate} handleSave={handleSave} handleDelete={handleDelete} mode="synthetic" statusType={statusType} ticketTeams={ticketTeams} setTicketTeams={setTicketTeams} now={now} files={files} setFiles={setFiles} customControls={customControls} customAttributes={customAttributes} />;
};

export default React.memo(TF_FormSynthetic);
