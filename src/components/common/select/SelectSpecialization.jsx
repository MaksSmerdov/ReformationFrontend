import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchSpecializations } from '@slices/teams/specializationsSlice';
import CustomSelect from '@components/common/basic/CustomSelect';
import { Spinner } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import IconSpecialization from '@components/common/icon/IconSpecialization';

const SelectSpecialization = ({ value, onChange, isMulti = false, onlyIcon = false, ...props }) => {
  const dispatch = useDispatch();
  const specializations = useSelector((state) => state.specializations.items);
  const specializationsStatus = useSelector((state) => state.specializations.status.fetch);
  const specializationsError = useSelector((state) => state.specializations.error.fetch);
  const { t } = useTranslation('translation', { keyPrefix: 'components.common.select' });

  useEffect(() => {
    if (specializationsStatus === 'idle') {
      dispatch(fetchSpecializations());
    }
  }, [dispatch, specializationsStatus]);

  if (specializationsStatus === 'loading') {
    return <Spinner animation="border" />;
  }

  if (specializationsStatus === 'failed') {
    return <div>Error: {specializationsError}</div>;
  }

  const options = specializations.map((spec) => ({
    value: spec.id,
    label: (
      <div className="d-flex flex-row gap-2 align-items-center wh-min-resize-button">
        <IconSpecialization id={spec.id} title={spec.title} className="wh-min-resize-button wh-resize-button" />
        {!onlyIcon && <div>{spec.title}</div>}
      </div>
    ),
  }));

  const handleChange = (selectedOptions) => {
    if (isMulti) {
      const selectedValues = selectedOptions ? selectedOptions.map((option) => option.value) : [];
      onChange(selectedValues);
    } else {
      const selectedValue = selectedOptions ? selectedOptions.value : null;
      onChange(selectedValue);
    }
  };

  const selectedValue = isMulti
    ? options.filter((option) => value.includes(option.value))
    : options.find((option) => option.value === value);

  const customStyles = {
    control: (provided) => ({
      ...provided,
      width: '100%',
    }),
    menu: (provided) => ({
      ...provided,
      width: '100%',
      minWidth: '100%',
    }),
    ...(onlyIcon
      ? {
          dropdownIndicator: () => ({
            display: 'none',
          }),
          indicatorSeparator: () => ({
            display: 'none',
          }),
        }
      : {}),
  };

  return (
    <CustomSelect
      value={selectedValue}
      onChange={handleChange}
      options={options}
      isMulti={isMulti}
      placeholder={t('specialization_select.placeholder')}
      customStyles={customStyles}
      {...props}
    />
  );
};

export default SelectSpecialization;
