import React from 'react';
import { Form } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import SelectUserInProject from '@components/common/select/SelectUserInProject';
import SelectTicketTeamComponent from '@components/common/advanced/SelectTicketTeamComponent/SelectTicketTeamComponent';

const FPSM_TicketMenu = ({
  isCreateTicketWithStatus = false,
  userIds = [],
  setUserIds = () => {},
  ticketTeams = [],
  setTicketTeams = () => {},
  dateStart = '',
  setDateStart = () => {},
  timeStart = '',
  setTimeStart = () => {},
  dateEnd = '',
  setDateEnd = () => {},
  timeEnd = '',
  setTimeEnd = () => {},
  deadline = '',
  setDeadline = () => {},
  statusType = '',
}) => {
  const { t } = useTranslation('translation', { keyPrefix: 'components.project.rooms.psm' });

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
          </div>
          {isCreateTicketWithStatus && (
            <SelectUserInProject
              selectedUserIds={userIds}
              onChange={setUserIds}
              showPhonesAsLinks={true}
              isMulti={true}
              className="w-100 team-input"
            />
          )}
        </Form.Group>
      </div>
      <div className="mb-2 mb-md-0 mt-0">
        <Form.Group className="d-flex flex-column">
          <Form.Label className="m-0 w-100">
            <b className="d-flex justify-content-center">{t('status_assignment_controls.team')}</b>
          </Form.Label>
          {isCreateTicketWithStatus && (
            <div className="d-flex flex-column align-items-center justify-content-center gap-2 w-100">
              <SelectTicketTeamComponent ticketTeams={ticketTeams} setTicketTeams={setTicketTeams} />
            </div>
          )}
        </Form.Group>
      </div>
    </div>
  );
};

export default FPSM_TicketMenu;
