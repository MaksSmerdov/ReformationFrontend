import React from 'react';
import { Form, InputGroup } from 'react-bootstrap';
import SelectUser from '@components/common/select/SelectUser';
import SelectSpecialization from '@components/common/select/SelectSpecialization';
import SelectTeamRole from '@components/common/select/SelectTeamRole';
import { useTranslation } from 'react-i18next';
import styles from './TicketTeamUserRow.module.scss'

const TicketTeamUserRow = ({ ticketTeamUser, onTicketTeamUserChange, excludedUserIds }) => {
  const { t } = useTranslation('translation', { keyPrefix: 'components.common.select' });

  const handleIsSelectChange = () => {
    onTicketTeamUserChange(ticketTeamUser.user.id, { ...ticketTeamUser, isSelected: !ticketTeamUser.isSelected });
  };

  const handleRoleChange = (e) => {
    onTicketTeamUserChange(ticketTeamUser.user.id, { ...ticketTeamUser, team_role: e.target.value });
  };

  const handleSpecializationChange = (specializationId) => {
    onTicketTeamUserChange(ticketTeamUser.user.id, { ...ticketTeamUser, specialization_id: specializationId });
  };

  const handleHoursChange = (e) => {
    let value = parseInt(e.target.value, 10);
    if (isNaN(value)) value = 0;
    if (value > 999) value = 999;
    if (value < 0) value = 0;
    onTicketTeamUserChange(ticketTeamUser.user.id, { ...ticketTeamUser, hours_worked: value });
  };

  const handleUserChange = (userId) => {
    onTicketTeamUserChange(ticketTeamUser.user.id, { ...ticketTeamUser, user: { ...ticketTeamUser.user, id: userId } });
  };

  return (
    <div className={`${styles['ticket-team-user-row']}`}>
      <div className={`${styles['ticket-team-user-row__select']}`}>
        <Form.Check>
          <Form.Check.Input
            className="m-0"
            type="checkbox"
            checked={ticketTeamUser.isSelected ?? false}
            onChange={handleIsSelectChange}
          />
        </Form.Check>
        <SelectSpecialization
          value={ticketTeamUser.specialization_id}
          onChange={handleSpecializationChange}
          className=""
          onlyIcon={false}
          isDisabled={!ticketTeamUser.isEditable}
        />
      </div>
      <div className={`${styles['ticket-team-user-row__select']}`}>
        <div className={`${styles['ticket-team-user-row__select-user']}`}>
          <SelectUser
            value={ticketTeamUser.user.id}
            onChange={handleUserChange}
            isDisabled={!ticketTeamUser.isEditable}
            excludedUserIds={excludedUserIds}
          />
        </div>
        <div className={`${styles['ticket-team-user-row__select-team-role']} ${!ticketTeamUser.isEditable ? 'd-none' : ''}`} >
          <SelectTeamRole
            value={ticketTeamUser.team_role}
            onChange={handleRoleChange}
            isEditable={ticketTeamUser.isEditable}
          />
        </div>
      </div>
      <div className={`${styles['ticket-team-user-row__select']}`}>
        <div className={`${styles['ticket-team-user-row__select-hour']}`}>
          <Form.Control
            type="number"
            step="1"
            min="0"
            max="999"
            size="2"
            value={ticketTeamUser.hours_worked}
            onChange={handleHoursChange}
            placeholder={t('hours')}
            className="px-1 py-1px no-spinner"
          />
        </div>
        h
      </div>
    </div>
  );
};

export default TicketTeamUserRow;
