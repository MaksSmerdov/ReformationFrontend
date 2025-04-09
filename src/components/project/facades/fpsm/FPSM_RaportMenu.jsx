import React from 'react';
import { Form } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import SelectUserInProject from '@components/common/select/SelectUserInProject';

const FPSM_RaportMenu = ({
  isCreateTicketWithStatus = false,
  userIds = [],
  setUserIds = () => {},
  datetimeStart = '',
  setDatetimeStart = () => {},
  datetimeEnd = '',
  setDatetimeEnd = () => {},
}) => {
  const { t } = useTranslation('translation', { keyPrefix: 'components.project.rooms.psm' });

  return (
    <div className="d-flex flex-column align-items-center justify-content-start gap-2 g-2 m-0">
      <div className="d-flex flex-row gap-2 g-2 m-0">
        <div className="mb-2 mb-md-0 mt-0">
          <Form.Group className="d-flex flex-column align-items-center justify-content-center">
            <div className="d-flex flex-row justify-content-between w-100">
              <Form.Label className="m-0">
                <b>{t('status_assignment_controls.team')}</b>
              </Form.Label>
              <button
                className="no-spinner p-1 text-center border-0 bg-transparent bluebtn markall"
                onClick={() => console.log('+ markall')}
              >
                {t('status_assignment_controls.markall')}
              </button>
            </div>
            {isCreateTicketWithStatus && (
              <SelectUserInProject
                selectedUserIds={userIds}
                onChange={setUserIds}
                showPhonesAsLinks={true}
                isMulti={true}
                className="w-100"
              />
            )}
          </Form.Group>
          <Form.Label className="m-0">
            <b>{t('status_assignment_controls.start')}</b>
          </Form.Label>
          <Form.Control
            type="datetime-local"
            value={datetimeStart}
            onChange={(e) => setDatetimeStart(e.target.value)}
            className="p-1px text-center"
          />
          <Form.Label className="m-0">
            <b>{t('status_assignment_controls.end')}</b>
          </Form.Label>
          <Form.Control
            type="datetime-local"
            value={datetimeEnd}
            onChange={(e) => setDatetimeEnd(e.target.value)}
            className="p-1px text-center"
          />
        </div>
        <div className="mb-2 mb-md-0 mt-0">
          <Form.Group className="d-flex flex-column align-items-center justify-content-center">
            <div className="d-flex flex-row justify-content-between w-100">
              <Form.Label className="m-0">
                <b>{t('status_assignment_controls.pick_statuses')}</b>
              </Form.Label>
              <button
                className="no-spinner p-1 text-center border-0 bg-transparent bluebtn markall"
                onClick={() => console.log('+ markall')}
              >
                {t('status_assignment_controls.markall')}
              </button>
            </div>
            <Form.Control as="select" value={'Status etc etc'} onChange={() => {}} className="p-1px text-center" />
            <i> ^^Multiple choice select box</i>
          </Form.Group>
        </div>
      </div>
      <div>
        <button
          className="no-spinner p-1 text-center border-2 sendbtn"
          onClick={() => {
            const button = document.getElementById('sendButton');
            button.classList.add('sent');
            button.innerHTML = `${t('status_assignment_controls.sent')} 10s`;
            let counter = 10;
            const interval = setInterval(() => {
              counter -= 1;
              button.innerHTML = `${t('status_assignment_controls.sent')} ${counter}s`;
              if (counter === 0) {
                clearInterval(interval);
                button.classList.remove('sent');
                button.innerHTML = t('status_assignment_controls.send');
              }
            }, 1000);
          }}
          id="sendButton"
        >
          {t('status_assignment_controls.send')}
        </button>
      </div>
    </div>
  );
};

export default FPSM_RaportMenu;
