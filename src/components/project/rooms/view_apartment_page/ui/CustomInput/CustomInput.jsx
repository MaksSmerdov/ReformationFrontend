import styles from './CustomInput.module.scss';

const CustomInput = ({
  variant = 'primary',
  label,
  ...inputProps
}) => {
  const variantClass = variant === 'secondary'
    ? styles['custom-input--secondary']
    : styles['custom-input--primary'];

  return (
    <div className={`${styles['custom-input']} ${variantClass}`}>

      <label className={styles['custom-input__label']}>
        {label}
      </label>

      <div className={styles['custom-input__wrapper']}>
        <input
          {...inputProps}
          className={styles['custom-input__field']}
        />
      </div>
    </div>
  );
};

export default CustomInput;