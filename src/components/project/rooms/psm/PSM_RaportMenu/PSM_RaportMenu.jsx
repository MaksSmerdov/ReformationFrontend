import React, { useState, useMemo, useRef, useEffect } from 'react';
import { Form, Button, Badge, OverlayTrigger, Tooltip } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import SelectTicketTeamComponent from '@components/common/advanced/SelectTicketTeamComponent/SelectTicketTeamComponent';
import { useSelector } from 'react-redux';
import { useRoomsProject } from '@contexts/rooms_project/RoomsProjectContext';
import StatusIconById from '@components/project/rooms/statuses/StatusIconById';
import styles from './PSM_RaportMenu.module.scss';

const PSM_RaportMenu = ({
  isCreateTicketWithStatus,
  userIds,
  setUserIds,
  dateStart,
  setDateStart,
  timeStart,
  setTimeStart,
  dateEnd,
  setDateEnd,
  timeEnd,
  setTimeEnd,
  ticketTeams = [],
  setTicketTeams,
  statusType,
}) => {
  const { t } = useTranslation('translation', { keyPrefix: 'components.project.rooms.psm' });
  const { selectedApartments } = useRoomsProject();
  const selectTeamRef = useRef(null);
  const dropdownRef = useRef(null);
  const [isSending, setIsSending] = useState(false);
  const [reportFormats, setReportFormats] = useState({
    byApartments: false,
    byTeamsAndWorkers: false,
  });
  const [deliveryMethod, setDeliveryMethod] = useState('split'); // 'split' или 'single'

  // Получаем данные из Redux
  const apartmentStatuses = useSelector((state) => state.currentProject.apartmentStatuses.byApartmentId);
  const statuses = useSelector((state) => state.currentProject.statuses.byId);
  const statusGroups = useSelector((state) => state.currentProject.statusGroups.items);
  const availableTeams = useSelector((state) => state.teams.items);
  const teamsStatus = useSelector((state) => state.teams.status.fetchAll);

  // Состояние для управления выпадающим списком
  const [showStatusDropdown, setShowStatusDropdown] = useState(false);
  const [selectedStatuses, setSelectedStatuses] = useState([]);

  // Закрываем dropdown при клике вне его
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowStatusDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Собираем уникальные статусы из выбранных апартаментов
  const uniqueStatuses = useMemo(() => {
    const statusIds = new Set();

    selectedApartments.forEach((apartmentId) => {
      const statusesForApartment = apartmentStatuses[apartmentId] || [];
      statusesForApartment.forEach((status) => {
        statusIds.add(status.status_id);
      });
    });

    return Array.from(statusIds)
      .map((id) => statuses[id])
      .filter(Boolean);
  }, [selectedApartments, apartmentStatuses, statuses]);

  // Группируем статусы по группам
  const groupedStatuses = useMemo(() => {
    const groupsMap = {};

    uniqueStatuses.forEach((status) => {
      const group = statusGroups.find((g) => g.id === status.status_group_id);
      if (group) {
        if (!groupsMap[group.id]) {
          groupsMap[group.id] = {
            group,
            statuses: [],
          };
        }
        groupsMap[group.id].statuses.push(status);
      }
    });

    // Сортируем группы по важности
    return Object.values(groupsMap).sort((a, b) => {
      if (a.group.id === 1) return -1;
      if (b.group.id === 1) return 1;
      return a.group.title.localeCompare(b.group.title);
    });
  }, [uniqueStatuses, statusGroups]);

  // Обработчики
  const handleStatusToggle = (statusId) => {
    setSelectedStatuses((prev) =>
      prev.includes(statusId) ? prev.filter((id) => id !== statusId) : [...prev, statusId]
    );
  };

  const handleRemoveStatus = (statusId, e) => {
    e.stopPropagation();
    setSelectedStatuses((prev) => prev.filter((id) => id !== statusId));
  };

  // Обновляем обработчик выбора всех команд
  const handleToggleAllTeams = () => {
    if (ticketTeams.length === 0) {
      setTicketTeams([...availableTeams]);
    } else {
      // Если что-то выбрано, очищаем выбор
      setTicketTeams([]);
      if (selectTeamRef.current) {
        selectTeamRef.current.clear?.();
        selectTeamRef.current.reset?.();
      }
    }
  };

  // Добавляем проверку загрузки данных
  const isTeamsLoading = teamsStatus === 'loading';

  const handleToggleAllStatuses = () => {
    if (selectedStatuses.length === uniqueStatuses.length) {
      // Если все статусы выбраны, очищаем выбор
      setSelectedStatuses([]);
    } else {
      // Если не все статусы выбраны, выбираем все
      setSelectedStatuses(uniqueStatuses.map((status) => status.id));
    }
  };

  const handleReportFormatChange = (format) => {
    setReportFormats(prev => ({
      ...prev,
      [format]: !prev[format]
    }));
  };

  const handleDeliveryMethodChange = (method) => {
    setDeliveryMethod(method);
  };

  const handleSendReport = () => {
    setIsSending(true);
    const button = document.getElementById('sendButton');
    button.classList.add('sent');
    button.innerHTML = t('status_assignment_controls.sending') + ' 10s';

    let counter = 10;
    const interval = setInterval(() => {
      counter -= 1;
      button.innerHTML = t('status_assignment_controls.sent_countdown', { count: counter });
      if (counter === 0) {
        clearInterval(interval);
        button.classList.remove('sent');
        button.innerHTML = t('status_assignment_controls.send');
        setIsSending(false);
      }
    }, 1000);

    // Формируем даты
    const dateFrom = `${dateStart} ${timeStart}:00`;
    const dateTo = `${dateEnd} ${timeEnd}:00`;

    // Извлекаем ID команд
    const teamIds = ticketTeams.map(team => team.team.id);

    // Определяем isFuture в зависимости от statusType
    const isFuture = ['type3', 'type4'].includes(statusType); // true для type3 и type4, false для type5 и type6

    // Формируем payload
    const payload = {
      date_from: dateFrom,
      date_to: dateTo,
      status_ids: selectedStatuses,
      team_ids: teamIds,
      sendToResidents: deliveryMethod === 'split',
      sendToWorkerReceivers: reportFormats.byTeamsAndWorkers,
      isFuture, // Добавляем поле isFuture
    };

    console.log('Отправка отчета:', payload);

    // Если выбраны оба формата отчета, отправляем два запроса
    if (reportFormats.byApartments && reportFormats.byTeamsAndWorkers) {
      const payloadApartments = { ...payload, sendToWorkerReceivers: false };
      const payloadTeamsAndWorkers = { ...payload, sendToWorkerReceivers: true };

      console.log('Отправка отчета по апартаментам:', payloadApartments);
      console.log('Отправка отчета по командам и работникам:', payloadTeamsAndWorkers);
    }
  };


  // Формируем текст для отображения в инпуте
  const getInputText = () => {
    if (selectedStatuses.length === 0) {
      return t('select_statuses_placeholder', { defaultValue: 'Выберите статусы' });
    }
    if (selectedStatuses.length === 1) {
      const status = statuses[selectedStatuses[0]];
      return status?.title || status?.name || `Status ${selectedStatuses[0]}`;
    }
    return t('statuses_selected', {
      count: selectedStatuses.length,
      defaultValue: `Выбрано ${selectedStatuses.length} статусов`,
    });
  };

  // Проверяем, выбран ли хотя бы один формат отчета
  const isReportFormatSelected = reportFormats.byApartments || reportFormats.byTeamsAndWorkers;

  return (
    <div className={styles['psm-raport']}>
      <div className={styles['psm-raport__columns']}>
        {/* Левая колонка - команды и даты */}
        <div className={`${styles['psm-raport__column']}`}>
          <Form.Group className={styles['psm-raport__form-group']}>
            <div className={styles['psm-raport__form-header']}>
              <Form.Label className={styles['psm-raport__form-label']}>
                {t('status_assignment_controls.team')}
              </Form.Label>
              <OverlayTrigger placement="top" overlay={<Tooltip>{t('status_assignment_controls.markall')}</Tooltip>}>
                <Button
                  variant="link"
                  size="sm"
                  className={styles['psm-raport__clear-all']}
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
              <SelectTicketTeamComponent
                ticketTeams={ticketTeams}
                setTicketTeams={setTicketTeams}
                disabled={!selectedApartments.length}
              />
            )}
          </Form.Group>

          <div className={styles['psm-raport__datetime']}>
            <div className={styles['psm-raport__datetime-group']}>
              <Form.Label className={styles['psm-raport__datetime-label']}>
                {t('status_assignment_controls.start')}
              </Form.Label>
              <div className={styles['psm-raport__inputs-row']}>
                <Form.Control
                  type="date"
                  value={dateStart}
                  onChange={(e) => setDateStart(e.target.value)}
                  className={styles['psm-raport__date-input']}
                />
                <Form.Control
                  type="time"
                  value={timeStart}
                  onChange={(e) => setTimeStart(e.target.value)}
                  className={styles['psm-raport__time-input']}
                />
              </div>
            </div>

            <div className={styles['psm-raport__datetime-group']}>
              <Form.Label className={styles['psm-raport__datetime-label']}>
                {t('status_assignment_controls.end')}
              </Form.Label>
              <div className={styles['psm-raport__inputs-row']}>
                <Form.Control
                  type="date"
                  value={dateEnd}
                  onChange={(e) => setDateEnd(e.target.value)}
                  className={styles['psm-raport__date-input']}
                />
                <Form.Control
                  type="time"
                  value={timeEnd}
                  onChange={(e) => setTimeEnd(e.target.value)}
                  className={styles['psm-raport__time-input']}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Правая колонка - статусы и настройки отчета */}
        <div className={`${styles['psm-raport__column']}`}>
          <Form.Group>
            <div className={styles['psm-raport__form-header']}>
              <Form.Label className={styles['psm-raport__form-label']}>
                {t('status_assignment_controls.pick_statuses')}
              </Form.Label>
              <OverlayTrigger placement="top" overlay={<Tooltip>{t('status_assignment_controls.markall')}</Tooltip>}>
                <Button
                  variant="link"
                  size="sm"
                  className={styles['psm-raport__clear-all']}
                  onClick={handleToggleAllStatuses}
                >
                  {selectedStatuses.length === uniqueStatuses.length
                    ? t('status_assignment_controls.clearall')
                    : t('status_assignment_controls.markall')}
                </Button>
              </OverlayTrigger>
            </div>

            {/* Комбинированный селектор с выпадающим списком */}
            <div className={styles['psm-raport__dropdown']} ref={dropdownRef}>
              <div
                className={`${styles['psm-raport__selector']} form-control`}
                onClick={() => setShowStatusDropdown(!showStatusDropdown)}
                data-disabled={!selectedApartments.length}
              >
                {selectedStatuses.length > 0 ? (
                  selectedStatuses.map((statusId) => {
                    const status = statuses[statusId];
                    return (
                      <Badge key={statusId} pill={false} bg="" className={styles['psm-raport__status-badge']}>
                        <StatusIconById id={statusId} className={styles['psm-raport__status-icon']} />
                        <span className={`${styles['psm-raport__status-title']}`}>{status?.title}</span>
                        <Button
                          variant="link"
                          size="sm"
                          className={styles['psm-raport__remove-btn']}
                          onClick={(e) => handleRemoveStatus(statusId, e)}
                          aria-label="Remove status"
                        >
                          <svg
                            width="14"
                            height="14"
                            viewBox="0 0 12 12"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                            className={styles['psm-raport__remove-icon']}
                          >
                            <path
                              d="M11 1L1 11M1 1L11 11"
                              stroke="currentColor"
                              strokeWidth="1.5"
                              strokeLinecap="round"
                            />
                          </svg>
                        </Button>
                      </Badge>
                    );
                  })
                ) : (
                  <span className={styles['psm-raport__placeholder']}>{getInputText()}</span>
                )}
              </div>

              {showStatusDropdown && selectedApartments.length > 0 && (
                <div className={styles['psm-raport__dropdown-menu']}>
                  {groupedStatuses.length > 0 ? (
                    groupedStatuses.map(({ group, statuses }) => (
                      <div key={group.id} className={styles['psm-raport__status-group']}>
                        <div className={styles['psm-raport__group-header']} style={{ backgroundColor: group.color }}>
                          {group.title}
                        </div>
                        <div className={styles['psm-raport__status-list']}>
                          {statuses.map((status) => (
                            <div
                              key={status.id}
                              className={`${styles['psm-raport__status-item']} ${
                                selectedStatuses.includes(status.id) ? styles['psm-raport__status-item--selected'] : ''
                              }`}
                              onClick={() => handleStatusToggle(status.id)}
                            >
                              <StatusIconById id={status.id} className={styles['psm-raport__status-icon']} />
                              <span>{status.title}</span>
                              {selectedStatuses.includes(status.id) && (
                                <span className={styles['psm-raport__checkmark']}>✓</span>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className={styles['psm-raport__empty-message']}>{t('no_statuses_available')}</div>
                  )}
                </div>
              )}
            </div>
          </Form.Group>

          {/* Группа чекбоксов для выбора формата отчета */}
          <Form.Group className={styles['psm-raport__form-group']}>
            <Form.Label className={styles['psm-raport__form-label']}>
              Valitse raportin muoto
            </Form.Label>
            <div className={styles['psm-raport__format-options']}>
              <Form.Check
                type="checkbox"
                id="report-by-apartments"
                label="Raportti asunnottain"
                checked={reportFormats.byApartments}
                onChange={() => handleReportFormatChange('byApartments')}
                className={styles['psm-raport__format-checkbox']}
              />
              <Form.Check
                type="checkbox"
                id="report-by-teams"
                label="Raportti tiimeittäin & tekijöittäin"
                checked={reportFormats.byTeamsAndWorkers}
                onChange={() => handleReportFormatChange('byTeamsAndWorkers')}
                className={styles['psm-raport__format-checkbox']}
              />
            </div>
          </Form.Group>

          {/* Группа радиокнопок для выбора метода отправки */}
          <Form.Group className={styles['psm-raport__form-group']}>
            <Form.Label className={styles['psm-raport__form-label']}>
              Valitse miten raportti menee
            </Form.Label>
            <div className={styles['psm-raport__radio-options']}>
              <Form.Check
                type="radio"
                id="delivery-split"
                label="Pilko ja lähetä asunnoittain"
                checked={deliveryMethod === 'split'}
                onChange={() => handleDeliveryMethodChange('split')}
                className={styles['psm-raport__radio-option']}
              />
              <Form.Check
                type="radio"
                id="delivery-single"
                label="Lähetä yhdellä viestillä"
                checked={deliveryMethod === 'single'}
                onChange={() => handleDeliveryMethodChange('single')}
                className={styles['psm-raport__radio-option']}
              />
            </div>
          </Form.Group>
        </div>
      </div>

      {/* Кнопка отправки */}
      {selectedStatuses.length > 0 && ticketTeams.length > 0 && dateStart && timeStart && dateEnd && timeEnd && isReportFormatSelected && (
        <div className={styles['psm-raport__send-btn']}>
          <Button
            id="sendButton"
            variant="success"
            onClick={handleSendReport}
            disabled={isSending || !selectedApartments.length}
          >
            {t('status_assignment_controls.send')}
          </Button>
        </div>
      )}
    </div>
  );
};

export default PSM_RaportMenu;