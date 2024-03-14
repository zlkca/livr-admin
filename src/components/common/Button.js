import Button from "@mui/material/Button";

const baseStyles = {
  root: {
    marginLeft: 8,
  },
};

export default function ButtonWidget({
  children,
  variant,
  disabled,
  onClick,
  styles,
  size = "medium",
}) {
  const mStyles = styles
    ? {
        root: { ...baseStyles.root, ...styles.root },
      }
    : baseStyles;

  const handleClick = () => {
    if (disabled) {
      return;
    } else {
      onClick();
    }
  };

  return (
    <Button
      style={mStyles.root}
      size={size}
      variant={variant ? variant : "contained"}
      disabled={disabled}
      color="primary"
      onClick={() => handleClick()}
    >
      {children}
    </Button>
  );
}
