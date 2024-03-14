import React, { useState } from "react";
import IconButton from "@mui/material/IconButton";
import MenuItem from "@mui/material/MenuItem";
import Menu from "@mui/material/Menu";
// import TranslateIcon from '@mui/icons-material/Translate';

const styles = {
  lang: {
    marginLeft: "10px",
    fontSize: "14px",
  },
};

export const LanguageMenu = ({ menus, onSelect }) => {
  const [menu, setMenu] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClick = (menu) => {
    setAnchorEl(null);
    setMenu(menu);
    onSelect(menu);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <div>
      <IconButton
        aria-label="language"
        aria-controls="menu-appbar-lang"
        aria-haspopup="true"
        onClick={handleMenu}
        color="inherit"
      >
        {/* <TranslateIcon /> */}
        <div style={styles.lang}>{menu ? menu.text : ""}</div>
      </IconButton>
      <Menu
        id="menu-appbar-lang"
        anchorEl={anchorEl}
        anchorOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        keepMounted
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        open={open}
        onClose={handleClose}
      >
        {menus.map((menu) => (
          <MenuItem onClick={() => handleClick(menu)}>{menu.text}</MenuItem>
        ))}
      </Menu>
    </div>
  );
};

export default LanguageMenu;
