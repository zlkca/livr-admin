import RefreshIcon from "@mui/icons-material/Refresh";
import { Button } from "@mui/material";
// import { IconButton } from '@mui/material';

export const RefreshButton = ({ onClick }) => {
  return (
    <Button variant="outlined" onClick={onClick}>
      <RefreshIcon />
    </Button>
  );
};
