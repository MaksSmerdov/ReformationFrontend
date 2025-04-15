import React from 'react';
import CustomModal from '@components/project/rooms/view_apartment_page/ui/CustomModal/CustomModal.jsx';
import CustomButton from '@components/project/rooms/view_apartment_page/ui/CustomButton/CustomButton.jsx';

const WallsConfirmModal = ({ isOpen, group, shapes, dimension, onConfirm, onCancel }) => {
  const wallNames = shapes.filter((shape) => group.includes(shape.id)).map((shape) => shape.name).join(', ');

  const dimensionText = dimension === 'width' ? 'ширину' : 'высоту';
  const message = `Вы хотите также изменить ${dimensionText} на всех затрагиваемых стенах (${wallNames})?`;

  return (
    <CustomModal isOpen={isOpen} onClose={onCancel}>

      <span>{message}</span>
      <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
        <CustomButton onClick={onConfirm}>Принять</CustomButton>
        <CustomButton onClick={onCancel}>Отмена</CustomButton>
      </div>

    </CustomModal>
  );
};

export default WallsConfirmModal;
