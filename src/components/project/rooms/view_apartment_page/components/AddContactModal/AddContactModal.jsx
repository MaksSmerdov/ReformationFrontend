import React from 'react';
import CustomModal from "@components/project/rooms/view_apartment_page/ui/CustomModal/CustomModal.jsx";
import styles from './AddContactModal.module.scss';
import CustomInput from "@components/project/rooms/view_apartment_page/ui/CustomInput/CustomInput.jsx";
import CustomButton from "@components/project/rooms/view_apartment_page/ui/CustomButton/CustomButton.jsx";

const AddContactModal = ({isOpen, onClose}) => {
  const contactTypes = [
    {value: 'asukas', label: 'Asukas'},
    {value: 'osakas', label: 'Osakas'},
    {value: 'omistaja', label: 'Omistaja'},
  ];

  return (
    <CustomModal isOpen={isOpen} onClose={onClose}>
      <form className={styles.formContent}>
        <div className={`${styles['modal__body']}`}>
          <CustomInput type='number' label='Nimi' variant='secondary'/>
          <CustomInput type='text' label='Puh' variant='secondary'/>
          <CustomInput type='email' label='Email' variant='secondary'/>
          <div className={styles['form-group']}>
            <label className={styles['select-label']}>Tyyppi</label>
            <select className={styles['custom-select']}>
              {contactTypes.map((type) => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className={`${styles['modal__footer']}`}>
          <CustomButton variant='secondary' onClick={onClose}>
            Peruuta
          </CustomButton>
          <CustomButton>
            Tallenna
          </CustomButton>
        </div>
      </form>
    </CustomModal>
  );
};

export default AddContactModal;