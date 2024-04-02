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

import { useState, useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";

// react-router components
import { Routes, Route, Navigate, useLocation } from "react-router-dom";

import Cookies from "js-cookie";

// @mui material components
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import Icon from "@mui/material/Icon";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";

// Material Dashboard 2 React example components
import menus from "layouts/menus";
import Sidenav from "layouts/Sidenav";

import Configurator from "examples/Configurator";

// Material Dashboard 2 React themes
import theme from "assets/theme";
import themeRTL from "assets/theme/theme-rtl";

// Material Dashboard 2 React Dark Mode themes
import themeDark from "assets/theme-dark";
import themeDarkRTL from "assets/theme-dark/theme-rtl";

// RTL plugins
// import rtlPlugin from "stylis-plugin-rtl";
import { CacheProvider } from "@emotion/react";
import createCache from "@emotion/cache";

import { setMiniSidenav, setOpenConfigurator } from "./redux/ui/ui.slice";

// Images
import brandWhite from "assets/images/logo192.png";
import brandDark from "assets/images/logo192.png";
import { selectTokenId } from "redux/auth/auth.selector";
import { setTokenId } from "redux/auth/auth.slice";
import { selectUI } from "redux/ui/ui.selector";
import { getRouteList } from "routes";
import { ACCOUNT_COOKIE } from "const";
import { setSignedInUser } from "redux/auth/auth.slice";
import { JWT_COOKIE } from "const";
import { LANGUAGE_COOKIE } from "const";
import { useTranslation } from "react-i18next";
import { selectSignedInUser } from "redux/auth/auth.selector";
import { MyRoutes } from "routes";
import { isAdmin } from "permission";
import { BrandName } from "config";
import { isStoreManager } from "permission";
import { branchAPI } from "services/branchAPI";
import { setBranch } from "redux/branch/branch.slice";

export default function App() {
  const dispatch = useDispatch();
  const { i18n } = useTranslation();
  const {
    miniSidenav,
    direction,
    layout,
    openConfigurator,
    sidenavColor,
    transparentSidenav,
    whiteSidenav,
    darkMode,
  } = useSelector(selectUI);

  const [onMouseEnter, setOnMouseEnter] = useState(false);
  const [navMenus, setNavMenus] = useState([]);
  // const [rtlCache, setRtlCache] = useState(null);
  const { pathname } = useLocation();

  const tokenId = useSelector(selectTokenId);

  const token = Cookies.get(JWT_COOKIE);
  const accountCookie = Cookies.get(ACCOUNT_COOKIE);
  const langCookie = Cookies.get(LANGUAGE_COOKIE);

  const signedInUser = useSelector(selectSignedInUser);

  useEffect(() => {
    if (langCookie) {
      i18n.changeLanguage(langCookie);
    }
  }, [langCookie]);

  useEffect(() => {
    dispatch(setTokenId(token));
  }, [token]);

  useEffect(() => {
    if (accountCookie) {
      const user = JSON.parse(accountCookie);
      dispatch(setSignedInUser(user));
      if (user.branch) {
        branchAPI.fetchBranch(user.branch._id).then((r) => {
          if (r && r.data) {
            dispatch(setBranch(r.data));
          }
        });
      }
    }
  }, [accountCookie]);

  useEffect(() => {
    if (isAdmin(signedInUser)) {
      setNavMenus(menus);
    } else if (isStoreManager(signedInUser)) {
      const newMenus = menus.filter((it) => {
        if (["dashboard", "branches"].includes(it.key)) {
          return false;
        } else {
          return true;
        }
      });
      setNavMenus(newMenus);
    } else {
      const newMenus = menus.filter((it) => {
        if (["dashboard", "branches", "employees"].includes(it.key)) {
          return false;
        } else {
          return true;
        }
      });
      setNavMenus(newMenus);
    }
  }, [signedInUser]);

  // Cache for the rtl
  // useMemo(() => {
  //   const cacheRtl = createCache({
  //     key: "rtl",
  //     stylisPlugins: [rtlPlugin],
  //   });

  //   setRtlCache(cacheRtl);
  // }, []);

  // Open sidenav when mouse enter on mini sidenav
  const handleOnMouseEnter = () => {
    if (miniSidenav && !onMouseEnter) {
      dispatch(setMiniSidenav(false));
      setOnMouseEnter(true);
    }
  };

  // Close sidenav when mouse leave mini sidenav
  const handleOnMouseLeave = () => {
    if (onMouseEnter) {
      dispatch(setMiniSidenav(true));
      setOnMouseEnter(false);
    }
  };

  // Change the openConfigurator state
  const handleConfiguratorOpen = () => setOpenConfigurator(dispatch, !openConfigurator);

  // Setting the dir attribute for the body element
  useEffect(() => {
    document.body.setAttribute("dir", direction);
  }, [direction]);

  // Setting page scroll to 0 when changing the route
  useEffect(() => {
    document.documentElement.scrollTop = 0;
    document.scrollingElement.scrollTop = 0;
  }, [pathname]);

  // const configsButton = (
  //   <MDBox
  //     display="flex"
  //     justifyContent="center"
  //     alignItems="center"
  //     width="3.25rem"
  //     height="3.25rem"
  //     bgColor="white"
  //     shadow="sm"
  //     borderRadius="50%"
  //     position="fixed"
  //     right="2rem"
  //     bottom="2rem"
  //     zIndex={99}
  //     color="dark"
  //     sx={{ cursor: "pointer" }}
  //     onClick={handleConfiguratorOpen}
  //   >
  //     <Icon fontSize="small" color="inherit">
  //       settings
  //     </Icon>
  //   </MDBox>
  // );

  return (
    <ThemeProvider theme={darkMode ? themeDark : theme}>
      <CssBaseline />
      {layout === "dashboard" && signedInUser && (
        <>
          <Sidenav
            color={sidenavColor}
            brand={(transparentSidenav && !darkMode) || whiteSidenav ? brandDark : brandWhite} // (transparentSidenav && !darkMode) || whiteSidenav ? brandDark : brandWhite
            brandName={BrandName}
            menus={navMenus}
            onMouseEnter={handleOnMouseEnter}
            onMouseLeave={handleOnMouseLeave}
          />
          <Configurator />
        </>
      )}
      {<MyRoutes tokenId={tokenId} signedInUser={signedInUser} />}
    </ThemeProvider>
  );
}
