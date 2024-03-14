import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Button from "@mui/material/Button";

const baseStyles = {
  root: {
    marginLeft: 8,
  },
};

export default function DialogWidget({ open, buttons, title, notes, children, onClose, styles }) {
  const mStyles = styles
    ? {
        root: { ...baseStyles.root, ...styles.root },
      }
    : baseStyles;

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        {notes && <DialogContentText>{notes}</DialogContentText>}

        {children}
      </DialogContent>
      <DialogActions>
        {buttons &&
          buttons.map((button) => (
            <Button key={button.label} onClick={button.onClick}>
              {button.label}
            </Button>
          ))}
      </DialogActions>
    </Dialog>
  );
}
