import React, {useState} from 'react';
import {useParams} from 'react-router-dom';
import ViewApartmentBreadcrumb from './onpage/ViewApartmentBreadcrumb';
import styles from './ViewApartamentPageComponent.module.scss';
import CustomButton from "@components/project/rooms/view_apartment_page/ui/CustomButton/CustomButton.jsx";
import CustomInput from "@components/project/rooms/view_apartment_page/ui/CustomInput/CustomInput.jsx";
import AddContactModal
  from "@components/project/rooms/view_apartment_page/components/AddContactModal/AddContactModal.jsx";
import {useTranslation} from "react-i18next";

const ViewApartmentPageComponent = () => {
  const {projectId, staircaseId, apartmentId} = useParams();
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const {t} = useTranslation('translation', {keyPrefix: 'components.project.rooms.viewApartmentPage'});

  console.log('Project ID:', projectId, 'Staircase ID:', staircaseId, 'Apartment ID:', apartmentId);

  return (
    <div className={styles['apartment-view']}>
      <div className={styles['apartment-view__top']}>
        <ViewApartmentBreadcrumb projectId={projectId} staircaseId={staircaseId} apartmentId={apartmentId}/>
        <CustomButton variant='secondary'>Edellinen</CustomButton>
      </div>
      <div className={styles['apartment-view__container']}>
        <div className={styles['apartment-view__section']}>
          <h2 className={styles['apartment-view__title']}>Yhteystiedot</h2>
          <CustomButton onClick={() => setIsContactModalOpen(true)}>
            Lisää uusi kontakti
          </CustomButton></div>
        <div className={styles['apartment-view__section']}>
          <h2 className={styles['apartment-view__title']}>Текст</h2>
          <div className={styles['apartment-view__inputs']}>
            <div className={styles['apartment-view__inputs-row']}>
              <CustomInput/>
              <CustomInput/>
              <CustomInput/>
            </div>
            <div className={styles['apartment-view__inputs-btn']}>
              <CustomButton>Submit</CustomButton>
            </div>
          </div>
        </div>
        <div className={styles['apartment-view__section']}>
          <h2 className={styles['apartment-view__title']}>Parveketyypit</h2>
          <div className={styles['apartment-view__balcony']}>
            <CustomButton>Tyhjä asunto 2606</CustomButton>
            <CustomButton>Tyhjä asunto 2606</CustomButton>
          </div>
          <div className={styles['apartment-view__actions']}>
            <CustomButton>Tallenna tämä asunto pohjaksi</CustomButton>
            <CustomButton>Tallenna pystylinjalle</CustomButton>
            <CustomButton>Tallenna vaakalinjalle</CustomButton>
          </div>
        </div>

        <AddContactModal
          isOpen={isContactModalOpen}
          onClose={() => setIsContactModalOpen(false)}
        />
      </div>
    </div>
  );
};

export default ViewApartmentPageComponent;