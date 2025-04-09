import React, { useState, useEffect } from 'react';
import TicketTeamUserRow from '@components/common/advanced/TicketTeamUserRow/TicketTeamUserRow';
import TicketTeamEquipmentRow from '@components/common/advanced/TicketTeamEquipmentRow';
import IconSpecialization from '@components/common/icon/IconSpecialization';
import { useTranslation } from 'react-i18next';
import { Form, Button } from 'react-bootstrap';

const TicketTeamComponent = ({ teamObject, onUserChange, onEquipmentChange }) => {
  const { t } = useTranslation('translation', { keyPrefix: 'components.common.select' });
  const [commonHoursWorked, setCommonHoursWorked] = useState('');

  useEffect(() => {
    const userHours = teamObject.users.map((u) => u.hours_worked);
    const equipmentHours = teamObject.equipments.map((e) => e.hours_worked);
    const allHours = [...userHours, ...equipmentHours];

    const isCommon = allHours.every((h) => h === allHours[0]);
    setCommonHoursWorked(isCommon ? allHours[0] || 0 : '');
  }, [teamObject.users, teamObject.equipments]);

  const handleUserChange = (userId, updatedUser) => {
    const updatedUsers = teamObject.users.map((userObject) =>
      userObject.user.id === userId ? updatedUser : userObject
    );
    onUserChange(teamObject.team.id, updatedUsers);
  };

  const handleEquipmentChange = (equipmentId, updatedEquipment) => {
   //  console.log('handleEquipmentChange', equipmentId, updatedEquipment);
    const updatedEquipments = teamObject.equipments.map((equipmentObject) =>
      equipmentObject.equipment.id === equipmentId ? updatedEquipment : equipmentObject
    );
    onEquipmentChange(teamObject.team.id, updatedEquipments);
  };

  const handleCommonHoursChange = (e) => {
    let value = parseInt(e.target.value, 10);
    if (isNaN(value)) {
      value = 0;
    }
    setCommonHoursWorked(value);

    const updatedUsers = teamObject.users.map((userObject) => ({ ...userObject, hours_worked: value }));
    const updatedEquipments = teamObject.equipments.map((equipmentObject) => ({
      ...equipmentObject,
      hours_worked: value,
    }));

    onUserChange(teamObject.team.id, updatedUsers);
    onEquipmentChange(teamObject.team.id, updatedEquipments);
  };

  const handleAddUser = () => {
    const newUser = {
      user: { id: null },
      team_role: null,
      specialization_id: null,
      hours_worked: 0,
      isEditable: true,
      isSelected: true,
    };
    onUserChange(teamObject.team.id, [...teamObject.users, newUser]);
  };

  const handleAddEquipment = () => {
    const newEquipment = { equipment: { id: null }, hours_worked: 0, isEditable: true, isSelected: true };
    onEquipmentChange(teamObject.team.id, [...teamObject.equipments, newEquipment]);
  };

  const excludedUserIds = teamObject.users.map((user) => user.user.id);
  const excludedEquipmentIds = teamObject.equipments.map((equipment) => equipment.equipment.id);

  return (
    <div
      className="px-2 py-2px w-min d-flex flex-column gap-4 ticket-team-object"
      style={{ borderBottom: '1px solid black', paddingBottom: '10px', paddingTop: '10px' }}
    >
      <div className="d-flex flex-row align-items-center justify-content-between gap-1px">
        <IconSpecialization id={teamObject.team.specialization_id} title={teamObject.team.title} />
        <u>{teamObject.team.title}</u>
        <div className="d-flex flex-row align-items-center gap-1px">
          <div style={{ width: '30px' }}>
            <Form.Control
              type="number"
              step="1"
              min="0"
              max="999"
              value={commonHoursWorked || 0}
              onChange={handleCommonHoursChange}
              placeholder={t('hours')}
              className="px-1 py-1px no-spinner"
            />
          </div>
          h
        </div>
      </div>
      <div className="d-flex flex-column gap-4">
        <div className="d-flex flex-row justify-content-between align-items-center gap-1px">
          <div>{t('users')}</div>
          <div>
            <Button variant="outline-primary" className="px-2px py-1px" onClick={handleAddUser}>
              {t('plus_user')}
            </Button>
          </div>
        </div>
        {teamObject.users.map((user, userIndex) => (
          <TicketTeamUserRow
            key={`user${userIndex}`}
            ticketTeamUser={user}
            onTicketTeamUserChange={handleUserChange}
            excludedUserIds={excludedUserIds}
          />
        ))}
      </div>
      <div className="d-flex flex-column gap-4">
        <div className="d-flex flex-row justify-content-between align-items-center gap-1px">
          <div>{t('equipments')}</div>
          <div>
            <Button variant="outline-primary" className="px-2px py-1px" onClick={handleAddEquipment}>
              {t('plus_equipment')}
            </Button>
          </div>
        </div>
        {teamObject.equipments.map((equipment, equipmentIndex) => (
          <TicketTeamEquipmentRow
            key={`equipment${equipmentIndex}`}
            ticketTeamEquipment={equipment}
            onTicketTeamEquipmentChange={handleEquipmentChange}
            excludedEquipmentIds={excludedEquipmentIds}
          />
        ))}
      </div>
    </div>
  );
};

export default TicketTeamComponent;
