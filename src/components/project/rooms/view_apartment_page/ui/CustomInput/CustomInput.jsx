import styles from './CustomInput.module.scss';

const CustomInput = ({
                       icon,
                       variant = 'primary',
                       label,
                       ...inputProps
                     }) => {
  const variantClass = variant === 'secondary'
    ? styles['custom-input--secondary']
    : styles['custom-input--primary'];

  return (
    <div className={`${styles['custom-input']} ${variantClass}`}>
      {variant === 'secondary' && label && (
        <label className={styles['custom-input__label']}>
          {label}
        </label>
      )}

      <div className={styles['custom-input__wrapper']}>
        {icon && (
          <span className={styles['custom-input__icon']}>
            {icon}
          </span>
        )}
        <input
          {...inputProps}
          className={styles['custom-input__field']}
        />
      </div>
    </div>
  );
};

export default CustomInput;