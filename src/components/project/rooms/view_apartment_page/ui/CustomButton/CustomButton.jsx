import styles from "./CustomButton.module.scss";

const CustomButton = ({
  children,
  variant = "primary",
  onClick,
  disabled,
  ...rest
}) => {

  return (
    <button
      className={`${styles["button"]} ${styles[variant]} ${disabled ? styles["disabled"] : ""}`}
      onClick={onClick}
      disabled={disabled}
      {...rest}>
      {children}
    </button>
  );
};

export default CustomButton;
