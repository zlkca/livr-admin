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

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

// react-router-dom components
import { useLocation, NavLink } from "react-router-dom";
import { useTranslation } from "react-i18next";

// prop-types is a library for typechecking of props.
import PropTypes from "prop-types";

// @mui material components
import List from "@mui/material/List";
import Divider from "@mui/material/Divider";

import Icon from "@mui/material/Icon";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDButton from "components/MDButton";

// Material Dashboard 2 React example components
import SidenavCollapse from "./SidenavCollapse";

// Custom styles for the Sidenav
import SidenavRoot from "./SidenavRoot";
import sidenavLogoLabel from "./styles/sidenav";

import { setMiniSidenav, setTransparentSidenav, setWhiteSidenav } from "../redux/ui/ui.slice";
import { selectUI } from "../redux/ui/ui.selector";
import { selectSignedInUser } from "../redux/auth/auth.selector";
import Sidemenu from "./Sidemenu";
import { getUiPath } from "utils";

function Sidenav({ color, brand, brandName, menus, ...rest }) {
  const dispatch = useDispatch();

  const { miniSidenav, transparentSidenav, whiteSidenav, darkMode } = useSelector(selectUI);

  const location = useLocation();
  const collapseName = getUiPath(location.pathname);
  const signedInUser = useSelector(selectSignedInUser);

  let textColor = "white";

  if (transparentSidenav || (whiteSidenav && !darkMode)) {
    textColor = "dark";
  } else if (whiteSidenav && darkMode) {
    textColor = "inherit";
  }

  const handleCloseSideNav = () => {
    dispatch(setMiniSidenav(true));
    // setMiniSidenav(dispatch, true);
  };

  useEffect(() => {
    // A function that sets the mini state of the sidenav.
    function handleMiniSidenav() {
      dispatch(setMiniSidenav(window.innerWidth < 1200));
      setTransparentSidenav(dispatch, window.innerWidth < 1200 ? false : transparentSidenav);
      setWhiteSidenav(dispatch, window.innerWidth < 1200 ? false : whiteSidenav);
    }

    /** 
     The event listener that's calling the handleMiniSidenav function when resizing the window.
    */
    window.addEventListener("resize", handleMiniSidenav);

    // Call the handleMiniSidenav function to set the state with the initial value.
    handleMiniSidenav();

    // Remove event listener on cleanup
    return () => window.removeEventListener("resize", handleMiniSidenav);
  }, [dispatch, location]);

  return (
    <SidenavRoot {...rest} variant="permanent">
      <MDBox pt={3} pb={1} px={4} textAlign="center">
        <MDBox
          display={{ xs: "block", xl: "none" }}
          // display={{ xs: "block" }}
          position="absolute"
          top={0}
          right={0}
          p={1.625}
          onClick={handleCloseSideNav}
          sx={{ cursor: "pointer" }}
        >
          <MDTypography variant="h6" color="secondary">
            <Icon sx={{ fontWeight: "bold" }} onClick={handleCloseSideNav}>
              close
            </Icon>
          </MDTypography>
        </MDBox>
        <MDBox component={NavLink} to="/" display="flex" alignItems="center">
          {brand && <MDBox component="img" src={brand} alt="Brand" width="2rem" />}
          <MDBox
            width={!brandName && "100%"}
            sx={(theme) => sidenavLogoLabel(theme, { miniSidenav })}
          >
            <MDTypography component="h6" variant="button" fontWeight="medium" color={textColor}>
              {brandName}
            </MDTypography>
          </MDBox>
        </MDBox>
      </MDBox>
      <Divider
        light={
          (!darkMode && !whiteSidenav && !transparentSidenav) ||
          (darkMode && !transparentSidenav && whiteSidenav)
        }
      />
      <List>{signedInUser && <Sidemenu menus={menus} collapseName={collapseName} />}</List>
      {/* <MDBox p={2} mt="auto">
        <MDButton
          component="a"
          href="https://www.creative-tim.com/product/material-dashboard-pro-react"
          target="_blank"
          rel="noreferrer"
          variant="gradient"
          color={sidenavColor}
          fullWidth
        >
          upgrade to pro
        </MDButton>
      </MDBox> */}
    </SidenavRoot>
  );
}

// Setting default values for the props of Sidenav
Sidenav.defaultProps = {
  color: "info",
  brand: "",
};

// Typechecking props for the Sidenav
Sidenav.propTypes = {
  color: PropTypes.oneOf(["primary", "secondary", "info", "success", "warning", "error", "dark"]),
  brand: PropTypes.string,
  brandName: PropTypes.string.isRequired,
  menus: PropTypes.arrayOf(PropTypes.object).isRequired,
};

export default Sidenav;
