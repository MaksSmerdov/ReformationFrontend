import React from 'react';
import { Row, Col, Form, Button, OverlayTrigger, Tooltip } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import SelectUserInProject from '@components/common/select/SelectUserInProject';
import SelectTicketTeamComponent from '@components/common/advanced/SelectTicketTeamComponent/SelectTicketTeamComponent';
import { useSelector } from 'react-redux';

const PSM_TicketMenu = ({
  isCreateTicketWithStatus,
  userIds,
  setUserIds,
  ticketTeams,
  setTicketTeams,
  dateStart,
  setDateStart,
  timeStart,
  setTimeStart,
  dateEnd,
  setDateEnd,
  timeEnd,
  setTimeEnd,
  deadline,
  setDeadline,
  statusType,
}) => {
  const { t } = useTranslation('translation', { keyPrefix: 'components.project.rooms.psm' });

  // Получаем доступные команды и пользователей из Redux
  const availableTeams = useSelector((state) => state.teams.items);
  const teamsStatus = useSelector((state) => state.teams.status.fetchAll);
  const availableUsers = useSelector((state) => state.users.items);
  const usersStatus = useSelector((state) => state.users.fetchAllStatus);

  // Обработчик для кнопки "Выбрать все команды"
  const handleToggleAllTeams = () => {
    if (ticketTeams.length === 0) {
      setTicketTeams([...availableTeams]);
    } else {
      setTicketTeams([]);
    }
  };

  // Обработчик для кнопки "Выбрать всех пользователей"
  const handleToggleAllUsers = () => {
    if (userIds.length === 0) {
      // Получаем массив всех ID пользователей
      const allUserIds = availableUsers.map(user => user.id);
      setUserIds(allUserIds);
    } else {
      setUserIds([]);
    }
  };

  const isTeamsLoading = teamsStatus === 'loading';
  const isUsersLoading = usersStatus === 'loading';

  return (
    <div className="d-flex flex-row gap-2 g-2 m-0">
      <div className="mb-2 mb-md-0 mt-0">
        <Form.Label className="m-0 w-100">
          <b className="d-flex justify-content-center">{t('status_assignment_controls.start')}*</b>
        </Form.Label>
        <div className="d-flex flex-row gap-1px">
          <Form.Control
            type="date"
            value={dateStart}
            onChange={(e) => setDateStart(e.target.value)}
            className="p-1px text-center"
          />
          <Form.Control
            type="time"
            value={timeStart}
            onChange={(e) => setTimeStart(e.target.value)}
            className="p-1px text-center"
          />
        </div>
        <Form.Label className="m-0 w-100">
          <b className="d-flex justify-content-center">{t('status_assignment_controls.end')}*</b>
        </Form.Label>
        <div className="d-flex flex-row gap-1px">
          <Form.Control
            type="date"
            value={dateEnd}
            onChange={(e) => setDateEnd(e.target.value)}
            className="p-1px text-center"
          />
          <Form.Control
            type="time"
            value={timeEnd}
            onChange={(e) => setTimeEnd(e.target.value)}
            className="p-1px text-center"
          />
        </div>
        {statusType === 'type1' && (
          <>
            <Form.Label className="m-0 w-100">
              <b className="d-flex justify-content-center">{t('status_assignment_controls.deadline')}*</b>
            </Form.Label>
            <Form.Control
              type="date"
              value={deadline}
              onChange={(e) => setDeadline(e.target.value)}
              className="p-1px text-center"
            />
          </>
        )}
        <Form.Group
          className="d-flex flex-column align-items-center justify-content-center"
          style={{ maxWidth: '300px' }}
        >
          <div className="d-flex flex-row justify-content-between w-100">
            <Form.Label className="m-0 w-100">
              <b className="d-flex justify-content-center">{t('status_assignment_controls.user')}</b>
            </Form.Label>
            <OverlayTrigger placement="top" overlay={<Tooltip>{t('status_assignment_controls.markall')}</Tooltip>}>
              <Button
                variant="link"
                size="sm"
                className="p-0"
                onClick={handleToggleAllUsers}
                disabled={isUsersLoading || !availableUsers?.length}
              >
                {userIds.length === 0 ? 'Выбрать всех' : 'Очистить'}
              </Button>
            </OverlayTrigger>
          </div>
          {/* Убрали условие isCreateTicketWithStatus для SelectUserInProject */}
          <SelectUserInProject
            selectedUserIds={userIds}
            onChange={setUserIds}
            showPhonesAsLinks={true}
            isMulti={true}
            className="w-100 team-input"
          />
        </Form.Group>
      </div>
      <div className="mb-2 mb-md-0 mt-0">
        <Form.Group className="d-flex flex-column">
          <div className="d-flex justify-content-between align-items-center">
            <Form.Label className="m-0">
              <b>{t('status_assignment_controls.team')}</b>
            </Form.Label>
            <OverlayTrigger placement="top" overlay={<Tooltip>{t('status_assignment_controls.markall')}</Tooltip>}>
              <Button
                variant="link"
                size="sm"
                className="p-0"
                onClick={handleToggleAllTeams}
                disabled={isTeamsLoading || !availableTeams?.length}
              >
                {ticketTeams.length === 0
                  ? t('status_assignment_controls.markall')
                  : t('status_assignment_controls.clearall')}
              </Button>
            </OverlayTrigger>
          </div>
          {isCreateTicketWithStatus && (
            <div className="d-flex flex-column align-items-center justify-content-center gap-2 w-100" style={{maxWidth: '600px'}}>
              <SelectTicketTeamComponent ticketTeams={ticketTeams} setTicketTeams={setTicketTeams} />
            </div>
          )}
        </Form.Group>
      </div>
    </div>
  );
};

export default PSM_TicketMenu;