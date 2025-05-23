import React, { useState } from 'react';
import CustomInput from '@components/project/rooms/view_apartment_page/ui/CustomInput/CustomInput.jsx';
import styles from './WallsConfiguration.module.scss';
import CustomButton from '@components/project/rooms/view_apartment_page/ui/CustomButton/CustomButton.jsx';
import CustomModal from '@components/project/rooms/view_apartment_page/ui/CustomModal/CustomModal.jsx';

const WallsTable = ({ shapes, onShapesChange }) => {
  const [isExcelModalOpen, setIsExcelModalOpen] = useState(false);

  const handleNameChange = (id, newName) => {
    const updatedShapes = shapes.map((shape) =>
      shape.id === id ? { ...shape, name: newName } : shape,
    );
    onShapesChange(updatedShapes);
  };

  const handleOrderChange = (id, newOrderValue) => {
    const orderVal = parseInt(newOrderValue, 10);
    if (isNaN(orderVal)) return;
    let updatedShapes = shapes.map((shape) =>
      shape.id === id ? { ...shape, order: orderVal } : shape,
    );
    updatedShapes.sort((a, b) => a.order - b.order);
    onShapesChange(updatedShapes);
  };

  const handleDescriptionChange = (id, newDesc) => {
    const updatedShapes = shapes.map((shape) =>
      shape.id === id ? { ...shape, description: newDesc } : shape,
    );
    onShapesChange(updatedShapes);
  };

  return (
    <div>
      <h2>Название</h2>
      <table className={styles['walls-table']}>
        <tbody className={styles['walls-table__body']}>
        {shapes.map((shape) => (
          <tr key={shape.id} className={styles['walls-table__row']}>
            <td className={`${styles['walls-table__cell']} ${styles['walls-table__cell--order']}`}>
              <CustomInput
                type="number"
                className={styles['walls-table__input']}
                style={{ width: '40px' }}
                value={shape.order}
                onChange={(e) => handleOrderChange(shape.id, e.target.value)}
              />
            </td>
            <td className={`${styles['walls-table__cell']} ${styles['walls-table__cell--name']}`}>
              <CustomInput
                type="text"
                className={styles['walls-table__input']}
                style={{ width: '100%' }}
                value={shape.name}
                onChange={(e) => handleNameChange(shape.id, e.target.value)}
              />
            </td>
            <td className={`${styles['walls-table__cell']} ${styles['walls-table__cell--description']}`}>
              <CustomInput
                type="text"
                className={styles['walls-table__input']}
                style={{ width: '100%' }}
                value={shape.description || ''}
                onChange={(e) => handleDescriptionChange(shape.id, e.target.value)}
                placeholder="Описание"
              />
            </td>
          </tr>
        ))}
        </tbody>
      </table>

      <div style={{ paddingTop: '15px' }}>
        <CustomButton onClick={() => setIsExcelModalOpen(true)}>
          Avaa asunnon tilaustaulu
        </CustomButton>
      </div>

      <CustomModal
        isOpen={isExcelModalOpen}
        onClose={() => setIsExcelModalOpen(false)}
      >
        <p>Здесь будет Excel</p>
      </CustomModal>
    </div>
  );
};

export default WallsTable;
