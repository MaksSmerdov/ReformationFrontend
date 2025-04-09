import React from 'react';
import styles from './CustomModal.module.scss';

const CustomModal = ({isOpen, onClose, children}) => {
  if (!isOpen) return null;

  return (
    <div className={`${styles['modal__overlay']}`}>
      <div className={`${styles['modal']}`}>
        {onClose && (
          <button onClick={onClose} className={`${styles['modal__close']}`}>
            &times;
          </button>
        )}
        <div className={`${styles['modal__content']}`}>
          {children}
        </div>
      </div>
    </div>
  );
};

export default CustomModal;