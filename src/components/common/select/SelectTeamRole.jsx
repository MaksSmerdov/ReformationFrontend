import React from 'react';
import { Form } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';

const SelectTeamRole = ({ value, onChange, isEditable }) => {
  const { t } = useTranslation('translation', { keyPrefix: 'components.common.select.team_role' });

  return (
    <Form.Control
      as="select"
      value={value || ''}
      onChange={onChange}
      className="px-2 py-1px"
      style={{
        minWidth: '100px', // минимальная ширина
        whiteSpace: 'normal', // разрешаем перенос слов
        wordWrap: 'break-word', // перенос длинных слов
        overflowWrap: 'break-word', // альтернатива для wordWrap
      }}
      disabled={!isEditable}
    >
      <option value="" disabled>
        {t('placeholder')}
      </option>
      <option value="leader">{t('leader')}</option>
      <option value="assistant">{t('assistant')}</option>
      <option value="intern">{t('intern')}</option>
    </Form.Control>
  );
};

export default SelectTeamRole;
