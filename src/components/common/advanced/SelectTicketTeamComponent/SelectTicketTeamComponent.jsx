import React, { useEffect, useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { Card, Form, Button } from 'react-bootstrap';
import { fetchAllTeams } from '@slices/teams/teamsSlice';
import { fetchEquipments } from '@slices/teams/equipmentsSlice';
import TicketTeamComponent from '@components/common/advanced/TicketTeamComponent';
import IconSpecialization from '@components/common/icon/IconSpecialization';
import styles from './SelectTicketTeamComponent.module.scss';

const SelectTicketTeamComponent = ({ ticketTeams, setTicketTeams, ...props }) => {
  const { t } = useTranslation('translation', { keyPrefix: 'components.common.select' });
  const dispatch = useDispatch();
  const availableTeams = useSelector((state) => state.teams.items);
  const teamsStatus = useSelector((state) => state.teams.status.fetchAll);
  const equipmentsStatus = useSelector((state) => state.equipments.status.fetch);
  const dropdownRef = useRef(null);
  const [showTeamDropdown, setShowTeamDropdown] = useState(false);

  useEffect(() => {
    if (teamsStatus !== 'succeeded') {
      dispatch(fetchAllTeams());
    }
  }, [dispatch, teamsStatus]);

  useEffect(() => {
    if (equipmentsStatus === 'idle') {
      dispatch(fetchEquipments());
    }
  }, [dispatch, equipmentsStatus]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowTeamDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // При первоначальной загрузке помечаем всех пользователей как выбранных
  useEffect(() => {
    if (ticketTeams.length > 0) {
      const updatedTeams = ticketTeams.map(team => ({
        ...team,
        users: team.users.map(user => ({
          ...user,
          isSelected: user.isSelected !== false // Сохраняем true или undefined как true
        }))
      }));
      if (JSON.stringify(updatedTeams) !== JSON.stringify(ticketTeams)) {
        setTicketTeams(updatedTeams);
      }
    }
  }, [ticketTeams]);

  const handleTeamToggle = (teamId) => {
    setTicketTeams((prev) => {
      if (prev.some((team) => team.team.id === teamId)) {
        return prev.filter((team) => team.team.id !== teamId);
      } else {
        const newTeam = availableTeams.find((team) => team.team.id === teamId);
        const teamWithSelectedUsers = {
          ...newTeam,
          users: newTeam.users.map((user) => ({
            ...user,
            isSelected: true
          })),
        };
        return [...prev, teamWithSelectedUsers];
      }
    });
  };

  const handleRemoveTeam = (teamId, e) => {
    e.stopPropagation();
    setTicketTeams((prev) => prev.filter((team) => team.team.id !== teamId));
  };

  return (
    <Card className="team-input">
      <Card.Header className={`p-0 ${ticketTeams.length > 0 ? 'border-bottom' : 'border-0'} ${styles['team-header']}`}>
        <div className={styles['team-dropdown']} ref={dropdownRef}>
          <div className={`${styles['team-selector']}`} onClick={() => setShowTeamDropdown(!showTeamDropdown)}>
            {ticketTeams.length > 0 ? (
              ticketTeams.map((team) => (
                <div key={team.team.id} className={styles['team-badge']}>
                  <IconSpecialization id={team.team.specialization_id} title={team.team.title} />
                  <span className={styles['team-title']}>{team.team.title}</span>
                  <Button
                    variant="link"
                    size="sm"
                    className={styles['remove-btn']}
                    onClick={(e) => handleRemoveTeam(team.team.id, e)}
                    aria-label="Remove team"
                  >
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 12 12"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      className={styles['remove-icon']}
                    >
                      <path d="M11 1L1 11M1 1L11 11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                    </svg>
                  </Button>
                </div>
              ))
            ) : (
              <span className={styles['placeholder']}>{t('select_team.placeholder')}</span>
            )}
          </div>
          {showTeamDropdown && (
            <div className={styles['team-dropdown-menu']}>
              {availableTeams.map((team) => (
                <div
                  key={team.team.id}
                  className={`${styles['team-item']} ${
                    ticketTeams.some((t) => t.team.id === team.team.id) ? styles['team-item--selected'] : ''
                  }`}
                  onClick={() => handleTeamToggle(team.team.id)}
                >
                  <IconSpecialization id={team.team.specialization_id} title={team.team.title} />
                  <span className={styles['team-title']}>{team.team.title}</span>
                  {ticketTeams.some((t) => t.team.id === team.team.id) && (
                    <span className={styles['checkmark']}>✓</span>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </Card.Header>
      {ticketTeams && ticketTeams.length > 0 && (
        <Card.Body className={styles['team-content']}>
          {ticketTeams.map((teamObject) => (
            <TicketTeamComponent
              key={`ticketTeam${teamObject.team.id}`}
              teamObject={teamObject}
              onUserChange={(teamId, users) =>
                setTicketTeams((prevTeams) =>
                  prevTeams.map((team) => (team.team.id === teamId ? { ...team, users } : team))
                )
              }
              onEquipmentChange={(teamId, equipments) =>
                setTicketTeams((prevTeams) =>
                  prevTeams.map((team) => (team.team.id === teamId ? { ...team, equipments } : team))
                )
              }
            />
          ))}
        </Card.Body>
      )}
    </Card>
  );
};

export default SelectTicketTeamComponent;