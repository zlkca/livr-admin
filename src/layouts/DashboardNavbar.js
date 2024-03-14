/**
=========================================================
* Material Dashboard 2 React - v2.2.0
=========================================================

* Product Page: https://www.creative-tim.com/product/material-dashboard-react
* Copyright 2023 Creative Tim (https://www.creative-tim.com)

Coded by www.creative-tim.com

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
*/

import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

// react-router components
import { useLocation, Link, useNavigate } from "react-router-dom";

// prop-types is a library for typechecking of props.
import PropTypes from "prop-types";

// @material-ui core components
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import Icon from "@mui/material/Icon";
import MenuItem from "@mui/material/MenuItem";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import Breadcrumbs from "./Breadcrumbs";

// Material Dashboard 2 React example components
import NotificationItem from "examples/Items/NotificationItem";

// Custom styles for DashboardNavbar
import { navbar, navbarContainer, navbarRow, navbarIconButton, navbarMobileMenu } from "./styles";

// Material Dashboard 2 React context
import {
  setTransparentNavbar,
  setMiniSidenav,
  setOpenConfigurator,
  setLanguage,
} from "../redux/ui/ui.slice";

import { selectUI } from "../redux/ui/ui.selector";
import { selectSignedInUser } from "redux/auth/auth.selector";

import { useTranslation } from "react-i18next";
import Cookies from "js-cookie";
// import MenuItem from "components/common/MenuItem";
import LanguageMenu from "components/LanguageMenu";
import { JWT_COOKIE } from "const";
import { setSignedInUser } from "redux/auth/auth.slice";
import { LANGUAGE_COOKIE } from "const";
import { ACCOUNT_COOKIE } from "const";
import { setTokenId } from "redux/auth/auth.slice";
import { setEmployee } from "redux/account/account.slice";

const languageMenus = [
  { name: "en", text: "English" },
  { name: "zh", text: "中文" },
];

function DashboardNavbar({ absolute, light, isMini }) {
  const dispatch = useDispatch();
  const { i18n, t } = useTranslation();
  const navigate = useNavigate();
  const [navbarType, setNavbarType] = useState();
  const { miniSidenav, transparentNavbar, fixedNavbar, openConfigurator, darkMode } =
    useSelector(selectUI);

  const [openMenu, setOpenMenu] = useState(false);
  const route = useLocation().pathname.split("/").slice(1);

  const signedInUser = useSelector(selectSignedInUser);
  const [anchorEl, setAnchorEl] = useState(null);

  const handleLanguageSelect = (menu) => {
    Cookies.set(LANGUAGE_COOKIE, menu.name);
    i18n.changeLanguage(menu.name);
    dispatch(setLanguage(menu.name));
    setAnchorEl(null);
  };

  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleChangePassword = () => {
    setAnchorEl(null);
    window.location.href = "/change-password";
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    Cookies.set(JWT_COOKIE, "");
    Cookies.set(ACCOUNT_COOKIE, "");
    dispatch(setSignedInUser());
    dispatch(setTokenId());
    setAnchorEl(null);
    window.location.href = "/authentication/sign-in";
  };

  useEffect(() => {
    // Setting the navbar type
    if (fixedNavbar) {
      setNavbarType("sticky");
    } else {
      setNavbarType("static");
    }

    // A function that sets the transparent state of the navbar.
    function handleTransparentNavbar() {
      setTransparentNavbar(dispatch, (fixedNavbar && window.scrollY === 0) || !fixedNavbar);
    }

    /** 
     The event listener that's calling the handleTransparentNavbar function when 
     scrolling the window.
    */
    window.addEventListener("scroll", handleTransparentNavbar);

    // Call the handleTransparentNavbar function to set the state with the initial value.
    handleTransparentNavbar();

    // Remove event listener on cleanup
    return () => window.removeEventListener("scroll", handleTransparentNavbar);
  }, [dispatch, fixedNavbar]);

  const handleMiniSidenav = () => {
    dispatch(setMiniSidenav(!miniSidenav));
  };
  const handleConfiguratorOpen = () => setOpenConfigurator(dispatch, !openConfigurator);
  const handleOpenMenu = (event) => setOpenMenu(event.currentTarget);
  const handleCloseMenu = () => setOpenMenu(false);

  // Render the notifications menu
  const renderMenu = () => (
    <Menu
      anchorEl={openMenu}
      anchorReference={null}
      anchorOrigin={{
        vertical: "bottom",
        horizontal: "left",
      }}
      open={Boolean(openMenu)}
      onClose={handleCloseMenu}
      sx={{ mt: 2 }}
    >
      <NotificationItem icon={<Icon>email</Icon>} title="Check new messages" />
      <NotificationItem icon={<Icon>podcasts</Icon>} title="Manage Podcast sessions" />
      <NotificationItem icon={<Icon>shopping_cart</Icon>} title="Payment successfully completed" />
    </Menu>
  );

  // Styles for the navbar icons
  const iconsStyle = ({ palette: { dark, white, text }, functions: { rgba } }) => ({
    color: () => {
      let colorValue = light || darkMode ? white.main : dark.main;

      if (transparentNavbar && !light) {
        colorValue = darkMode ? rgba(text.main, 0.6) : text.main;
      }

      return colorValue;
    },
  });
  const handleEditProfile = () => {
    setAnchorEl(null);
    // if (signedInUser) {
    //   dispatch(setEmployee(signedInUser));
    //   navigate(`/employees/${signedInUser._id}/form`);
    // }
  };
  return (
    <AppBar
      position={absolute ? "absolute" : navbarType}
      color="inherit"
      sx={(theme) => navbar(theme, { transparentNavbar, absolute, light, darkMode })}
    >
      <Toolbar sx={(theme) => navbarContainer(theme)}>
        <MDBox color="inherit" mb={{ xs: 1, md: 0 }} sx={(theme) => navbarRow(theme, { isMini })}>
          <Breadcrumbs icon="home" title={route[route.length - 1]} route={route} light={light} />
        </MDBox>
        {isMini ? null : (
          <MDBox sx={(theme) => navbarRow(theme, { isMini })}>
            {/* <MDBox pr={1}>
              <MDInput label="Search here" />
            </MDBox> */}
            <MDBox color={light ? "white" : "inherit"}>
              {/* <Link to="/authentication/sign-in/basic"> */}
              <IconButton
                sx={navbarIconButton}
                size="small"
                disableRipple
                onClick={handleEditProfile}
              >
                <Icon sx={iconsStyle}>account_circle</Icon>
              </IconButton>
              {/* </Link> */}
              <IconButton
                size="small"
                disableRipple
                color="inherit"
                sx={navbarMobileMenu}
                onClick={handleMiniSidenav}
              >
                <Icon sx={iconsStyle} fontSize="medium">
                  {miniSidenav ? "menu_open" : "menu"}
                </Icon>
              </IconButton>
              <IconButton
                size="small"
                disableRipple
                color="inherit"
                sx={navbarIconButton}
                onClick={handleProfileMenuOpen}
              >
                <Icon sx={iconsStyle}>settings</Icon>
              </IconButton>
              <IconButton
                size="small"
                disableRipple
                color="inherit"
                sx={navbarIconButton}
                aria-controls="notification-menu"
                aria-haspopup="true"
                variant="contained"
                onClick={handleOpenMenu}
              >
                <Icon sx={iconsStyle}>notifications</Icon>
              </IconButton>
              {/* <LanguageMenu menus={languageMenus} onSelect={handleLanguageSelect} /> */}
              <Menu
                anchorEl={anchorEl}
                anchorOrigin={{ vertical: "top", horizontal: "right" }}
                // id={menuId}
                keepMounted
                transformOrigin={{ vertical: "top", horizontal: "right" }}
                open={anchorEl ? true : false}
                onClose={handleMenuClose}
              >
                <MenuItem onClick={() => handleLanguageSelect({ name: "en" })}>English</MenuItem>
                <MenuItem onClick={() => handleLanguageSelect({ name: "zh" })}>中文</MenuItem>
                <MenuItem
                  onClick={() => (window.location.href = "/authentication/change-password")}
                >
                  {t("Change Password")}
                </MenuItem>
                <MenuItem onClick={handleLogout}>{t("Logout")}</MenuItem>
              </Menu>
              {/* {renderMenu()} */}
            </MDBox>
          </MDBox>
        )}
      </Toolbar>
    </AppBar>
  );
}

// Setting default values for the props of DashboardNavbar
DashboardNavbar.defaultProps = {
  absolute: false,
  light: false,
  isMini: false,
};

// Typechecking props for the DashboardNavbar
DashboardNavbar.propTypes = {
  absolute: PropTypes.bool,
  light: PropTypes.bool,
  isMini: PropTypes.bool,
};

export default DashboardNavbar;
