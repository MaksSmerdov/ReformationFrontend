import React from 'react';
import CustomModal from '@components/project/rooms/view_apartment_page/ui/CustomModal/CustomModal.jsx';
import styles from './AddContactModal.module.scss';
import CustomInput from '@components/project/rooms/view_apartment_page/ui/CustomInput/CustomInput.jsx';
import CustomButton from '@components/project/rooms/view_apartment_page/ui/CustomButton/CustomButton.jsx';
import { useTranslation } from 'react-i18next';

const AddContactModal = ({ isOpen, onClose }) => {
  const { t } = useTranslation('translation',
    { keyPrefix: 'components.project.rooms.view_apartment_page.add_contact_modal' });
  const contactTypes = [
    { value: 'asukas', label: t('resident') },
    { value: 'osakas', label: t('shareholder') },
    { value: 'omistaja', label: t('owner') },
  ];

  return (
    <CustomModal isOpen={isOpen} onClose={onClose}>
      <form>
        <div className={`${styles['modal__body']}`}>
          <CustomInput type="text" label={t('name')} variant="secondary"/>
          <CustomInput type="text" label={t('number')} variant="secondary"/>
          <CustomInput type="email" label={t('email')} variant="secondary"/>
          <div className={styles['select']}>
            <label className={styles['select__label']}>{t('type')}</label>
            <select className={styles['select__custom']}>
              {contactTypes.map((type) => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className={`${styles['modal__footer']}`}>
          <CustomButton variant="secondary" onClick={onClose}>
            {t('cancel')}
          </CustomButton>
          <CustomButton>
            {t('save')}
          </CustomButton>
        </div>
      </form>
    </CustomModal>
  );
};

export default AddContactModal;