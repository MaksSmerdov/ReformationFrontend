import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import FPSM_StatusTypeSelector from './FPSM_StatusTypeSelector';
import FPSM_TicketMenu from './FPSM_TicketMenu';
import FPSM_RaportMenu from './FPSM_RaportMenu';

const FPSM_StatusAssignmentControls = () => {
  const { t } = useTranslation('translation', {
    keyPrefix: 'components.project.rooms.psm',
  });

  const [statusType, setStatusType] = useState(null);

  // Mock states
  const [userIds, setUserIds] = useState([]);
  const [ticketTeams, setTicketTeams] = useState([]);
  const [dateStart, setDateStart] = useState('');
  const [timeStart, setTimeStart] = useState('');
  const [dateEnd, setDateEnd] = useState('');
  const [timeEnd, setTimeEnd] = useState('');
  const [deadline, setDeadline] = useState('');
  const [datetimeStart, setDatetimeStart] = useState('');
  const [datetimeEnd, setDatetimeEnd] = useState('');

  const renderContent = () => {
    switch (statusType) {
      case 'type1':
      case 'type2':
        return (
          <FPSM_TicketMenu
            isCreateTicketWithStatus={true}
            userIds={userIds}
            setUserIds={setUserIds}
            ticketTeams={ticketTeams}
            setTicketTeams={setTicketTeams}
            dateStart={dateStart}
            setDateStart={setDateStart}
            timeStart={timeStart}
            setTimeStart={setTimeStart}
            dateEnd={dateEnd}
            setDateEnd={setDateEnd}
            timeEnd={timeEnd}
            setTimeEnd={setTimeEnd}
            deadline={deadline}
            setDeadline={setDeadline}
            statusType={statusType}
          />
        );
      case 'type3':
      case 'type4':
      case 'type5':
      case 'type6':
        return (
          <FPSM_RaportMenu
            isCreateTicketWithStatus={true}
            userIds={userIds}
            setUserIds={setUserIds}
            datetimeStart={datetimeStart}
            setDatetimeStart={setDatetimeStart}
            datetimeEnd={datetimeEnd}
            setDatetimeEnd={setDatetimeEnd}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="overflow-hidden">
      <div className="d-flex gap-2px overflow-auto flex-row align-items-start">
        <div>
          <FPSM_StatusTypeSelector statusType={statusType} setStatusType={setStatusType} />
        </div>
        <div>{renderContent()}</div>
      </div>
    </div>
  );
};

export default React.memo(FPSM_StatusAssignmentControls);
