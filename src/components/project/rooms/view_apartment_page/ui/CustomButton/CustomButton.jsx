import styles from './CustomButton.module.scss';

const CustomButton = ({
                        children,
                        variant = 'primary',
                        icon,
                        onClick,
                        disabled,
                        ...rest
                      }) => {
  const content =
    icon && !children ? (
      icon
    ) : (
      <>
        {icon && <span className={styles['icon']}>{icon}</span>}
        {children}
      </>
    );

  return (
    <button
      className={`${styles['button']} ${styles[variant]} ${disabled ? styles['disabled'] : ''}`}
      onClick={onClick}
      disabled={disabled}
      {...rest}>
      {content}
    </button>
  );
};

export default CustomButton;
