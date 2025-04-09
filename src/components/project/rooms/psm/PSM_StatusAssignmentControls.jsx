import React, { useRef, useCallback } from 'react';
import { Row, Col } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { usePSMStatus } from '@contexts/rooms_project/PSMStatusContext';
import { useRoomsProject } from '@contexts/rooms_project/RoomsProjectContext';
import PSM_StatusTypeSelector from '@components/project/rooms/psm/PSM_StatusTypeSelector';
import PSM_TicketMenu from '@components/project/rooms/psm/PSM_TicketMenu/PSM_TicketMenu';
import PSM_RaportMenu from '@components/project/rooms/psm/PSM_RaportMenu/PSM_RaportMenu';

const PSM_StatusAssignmentControls = () => {
  const { t } = useTranslation('translation', { keyPrefix: 'components.project.rooms.psm' });
  const { project } = useRoomsProject();
  const {
    deadline,
    setDeadline,
    dateStart,
    setDateStart,
    timeStart,
    setTimeStart,
    dateEnd,
    setDateEnd,
    timeEnd,
    setTimeEnd,
    userIds,
    setUserIds,
    statusType,
    setStatusType,
    isCreateTicketWithStatus,
    ticketTeams,
    setTicketTeams,
  } = usePSMStatus();
  const dateInputRef = useRef(null);

  const handleDateInputClick = useCallback(() => {
    dateInputRef.current.focus();
    dateInputRef.current.showPicker();
  }, []);

  const renderContent = () => {
    switch (statusType) {
      case 'type1':
      case 'type2':
        return (
          <PSM_TicketMenu
            isCreateTicketWithStatus={isCreateTicketWithStatus}
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
          <PSM_RaportMenu
            isCreateTicketWithStatus={isCreateTicketWithStatus}
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
            statusType={statusType}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="overflow-hidden">
      <div className="d-flex gap-5 overflow-auto flex-row align-items-start">
        <div>
          <PSM_StatusTypeSelector statusType={statusType} setStatusType={setStatusType} />
        </div>
        <div>{renderContent()}</div>
      </div>
    </div>
  );
};

export default React.memo(PSM_StatusAssignmentControls);
