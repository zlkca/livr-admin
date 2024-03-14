import React from "react";
import { ListItem, ListItemIcon, ListItemText, Tooltip } from "@mui/material";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
// import { useTheme } from "@emotion/react";
import { deepMerge } from "../../utils";
import theme from "../../theme";

// data --- {id, icon, text, menus }
export default function MenuItem({ expanded, data, selectedId, styles, onClick }) {
  // const theme = useTheme();
  const baseStyles = {
    root: {
      backgroundColor: "white", // theme.palette.secondary.main,
    },
    row: {
      "&:hover": {
        color: theme.palette.secondary.contrastText,
        backgroundColor: theme.palette.secondary.dark,
      },
      height: 48,
    },
    selectedRow: {
      backgroundColor: theme.palette.background.grey,
      color: theme.palette.tertiary.contrastText,
      "&:hover": {
        backgroundColor: theme.palette.background.grey,
        color: theme.palette.tertiary.main,
      },
      height: 48,
    },
    icon: {
      color: "inherit",
      // backgroundColor: 'inherit'
    },
  };

  const cStyles = deepMerge(baseStyles, styles);

  // return data.tooltip ? (
  //   <Tooltip style={cStyles.root} title={data.tooltip} placement="right-end">
  //     <ListItem
  //       style={data.id === selectedId ? cStyles.selectedRow : cStyles.row}
  //       onClick={() => onClick(data)}
  //     >
  //       {data.icon && (
  //         <ListItemIcon sx={cStyles.icon}>{React.cloneElement(data.icon)}</ListItemIcon>
  //       )}
  //       {expanded && <ListItemText>{data.text}</ListItemText>}
  //       {data.menus && (expanded ? <KeyboardArrowDownIcon /> : <KeyboardArrowRightIcon />)}
  //     </ListItem>
  //   </Tooltip>
  // ) :

  return (
    <div style={cStyles.root}>
      <ListItem
        style={data.id === selectedId ? cStyles.selectedRow : cStyles.row}
        onClick={() => onClick(data)}
      >
        {data.icon && (
          <ListItemIcon sx={cStyles.icon}>{React.cloneElement(data.icon)}</ListItemIcon>
        )}
        {expanded && <ListItemText>{data.text}</ListItemText>}
        {data.menus && (expanded ? <KeyboardArrowDownIcon /> : <KeyboardArrowRightIcon />)}
      </ListItem>
    </div>
  );
}
