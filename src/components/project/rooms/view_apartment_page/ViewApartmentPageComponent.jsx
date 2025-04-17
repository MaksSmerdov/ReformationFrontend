import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import ViewApartmentBreadcrumb from './onpage/ViewApartmentBreadcrumb';
import styles from './ViewApartamentPageComponent.module.scss';
import CustomButton from '@components/project/rooms/view_apartment_page/ui/CustomButton/CustomButton.jsx';
import CustomInput from '@components/project/rooms/view_apartment_page/ui/CustomInput/CustomInput.jsx';
import AddContactModal
  from '@components/project/rooms/view_apartment_page/components/AddContactModal/AddContactModal.jsx';
import { useDispatch, useSelector } from 'react-redux';
import { fetchApartmentById, updateApartment } from '@slices/rooms/apartmentsSlice.js';
import { Spinner } from 'react-bootstrap';
import { useNotification } from '@contexts/application/NotificationContext.jsx';
import RoomsConfiguration
  from '@components/project/rooms/view_apartment_page/components/RoomsConfiguration/RoomsConfiguration.jsx';

const ViewApartmentPageComponent = () => {
  const { projectId, staircaseId, apartmentId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { t } = useTranslation('translation', { keyPrefix: 'components.project.rooms.view_apartment_page' });
  const { addNotification } = useNotification();
  const apartment = useSelector((state) => state.apartments.byId[apartmentId]);
  console.log(apartment);

  const [number, setNumber] = useState('');
  const [mailboxName, setMailboxName] = useState('');
  const [description, setDescription] = useState('');
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const [isFileModalOpen, setIsFileModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!apartment) {
      dispatch(fetchApartmentById({ staircaseId, apartmentId }));
    } else {
      setNumber(apartment.number || '');
      setMailboxName(apartment.mailbox_name || '');
      setDescription(apartment.description || '');
    }
  }, [dispatch, staircaseId, apartmentId, apartment]);

  const handleBackClick = () => {
    navigate(`/project/${projectId}`);
  };

  if (!apartment) {
    return <Spinner animation="border"/>;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    const updatedApartment = {
      ...apartment,
      number,
      mailbox_name: mailboxName,
      description,
    };
    try {
      await dispatch(updateApartment({ staircaseId, apartment: updatedApartment })).unwrap();
      addNotification(t('apartment_updated'), 'success');
    } catch (err) {
      addNotification(err.error || 'Server Error', 'danger');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={styles['apartment-view']}>
      <div className={styles['apartment-view__top']}>
        <ViewApartmentBreadcrumb projectId={projectId} staircaseId={staircaseId} apartmentId={apartmentId}/>
        <CustomButton variant="secondary" onClick={handleBackClick}>{t('back_button')}</CustomButton>
      </div>
      <div className={styles['apartment-view__container']}>
        <section className={styles['apartment-view__section']}>
          <h2 className={styles['apartment-view__title']}>{t('contacts.title')}</h2>
          <span>, , , hankkeen_johtaja</span>
          <span>, , , tilaaja</span>
          <span style={{ paddingBottom: '15px' }}>, , , myyja</span>
          <CustomButton variant="submit" onClick={() => setIsContactModalOpen(true)}>
            {t('contacts.add_new_contact')}
          </CustomButton>
        </section>
        <section className={styles['apartment-view__section']}>
          <h2 className={styles['apartment-view__title']}>{t('edit_room.edit_title')}</h2>
          <form className={styles['apartment-view__inputs']} onSubmit={handleSubmit}>
            <div className={styles['apartment-view__inputs-row']}>
              <CustomInput
                label={t('edit_room.apartament_number')}
                value={number}
                onChange={(e) => setNumber(e.target.value)}
              />
              <CustomInput
                label={t('edit_room.mailbox')}
                value={mailboxName}
                onChange={(e) => setMailboxName(e.target.value)}
              />
            </div>
            <div className={styles['apartment-view__inputs-btn']}>
              <CustomButton type="submit" variant="submit" disabled={isSubmitting}>
                {isSubmitting ? (
                  t('edit_room.loading')
                ) : (
                  t('edit_room.submit')
                )}
              </CustomButton>
            </div>
          </form>
        </section>
        <section className={styles['apartment-view__section']}>
          <h2 className={styles['apartment-view__title']}>{t('balcons.balcons_title')}</h2>
          <div className={styles['apartment-view__balcony']}>
            <CustomButton>{t('balcons.no_types')}</CustomButton>
            <CustomButton>{t('balcons.empty_apartment')}</CustomButton>
          </div>
          <div className={styles['apartment-view__actions']}>
            <CustomButton>{t('balcons.save')}</CustomButton>
            <CustomButton>{t('balcons.save_vertical')}</CustomButton>
            <CustomButton>{t('balcons.save_horizontal')}</CustomButton>
          </div>
        </section>
        <section className={styles['apartment-view__section']}
                 style={{ gap: '20px' }}>
          <div>
            <h2 className={styles['apartment-view__subtitle']}>
              Tiedot projektista
            </h2>
            <span>Контент</span>
          </div>
          <div>
            <h2 className={styles['apartment-view__subtitle']}>
              Tiedot huoneesta
            </h2>
            <span>Контент</span>
          </div>
          <div>
            <h2 className={styles['apartment-view__subtitle']}>
              Tiedot tekijästä
            </h2>
            <span>Контент</span>
          </div>
        </section>
        <div className={styles['apartment-view__file-btn']}><CustomButton>Asunnon tiedostopankki</CustomButton></div>
      </div>
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', paddingTop: '30px' }}>
        <RoomsConfiguration/>
      </div>
      <AddContactModal
        isOpen={isContactModalOpen}
        onClose={() => setIsContactModalOpen(false)}
      />
    </div>
  );
};

export default ViewApartmentPageComponent;
