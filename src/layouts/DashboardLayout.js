import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import PropTypes from "prop-types";

import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";

import Box from "../components/common/Box";
import { setLayout } from "../redux/ui/ui.slice";
import { selectUI } from "../redux/ui/ui.selector";
import { getUiPath } from "utils";

function DashboardLayout({ children }) {
  const dispatch = useDispatch();
  const { miniSidenav } = useSelector(selectUI);
  const { pathname } = useLocation();

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.up("xs"));

  const [padding, setPadding] = useState(3);

  useEffect(() => {
    dispatch(setLayout, "dashboard");
    if (pathname) {
      const uiPath = getUiPath(pathname);
      if (uiPath == "dashboard") setPadding(isMobile ? 2 : 3);
      else setPadding(isMobile ? 0 : 3);
    }
  }, [pathname]);

  return (
    <Box
      pt={0}
      pb={1}
      px={padding}
      sx={({ breakpoints, transitions, functions: { pxToRem } }) => ({
        // p: 3,
        position: "relative",

        [breakpoints.up("xl")]: {
          marginLeft: miniSidenav ? pxToRem(120) : pxToRem(274),
          transition: transitions.create(["margin-left", "margin-right"], {
            easing: transitions.easing.easeInOut,
            duration: transitions.duration.standard,
          }),
        },
      })}
    >
      {children}
    </Box>
  );
}

DashboardLayout.propTypes = {
  children: PropTypes.node.isRequired,
};

export default DashboardLayout;
