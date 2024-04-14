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

import { useSelector } from "react-redux";
// prop-types is a library for typechecking of props.
import PropTypes from "prop-types";

// @mui material components
import ListItem from "@mui/material/ListItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Icon from "@mui/material/Icon";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import theme from "assets/theme/index";

// Custom styles for the SidenavCollapse
import { collapseIconBox, collapseIcon, collapseText } from "./styles/sidenavCollapse";

import { selectUI } from "../redux/ui/ui.selector";

function collapseItem(theme, active, sidenavColor) {
  const { palette, transitions, breakpoints, boxShadows, borders, functions } = theme;

  const { white, transparent, dark, grey, gradients } = palette;
  const { md } = boxShadows;
  const { borderRadius } = borders;
  const { pxToRem, rgba, linearGradient } = functions;

  return {
    background: active
      ? linearGradient(gradients[sidenavColor].main, gradients[sidenavColor].state)
      : transparent.main,
    // color: !active ? dark.main : white.main,
    color: white.main,
    display: "flex",
    alignItems: "center",
    width: "100%",
    padding: `${pxToRem(8)} ${pxToRem(10)}`,
    margin: `${pxToRem(1.5)} ${pxToRem(16)}`,
    borderRadius: borderRadius.md,
    cursor: "pointer",
    userSelect: "none",
    whiteSpace: "nowrap",
    boxShadow: active ? md : "none",
    [breakpoints.up("xl")]: {
      transition: transitions.create(["box-shadow", "background-color"], {
        easing: transitions.easing.easeInOut,
        duration: transitions.duration.shorter,
      }),
    },
    "& span": { color: white.main },
    "&:hover, &:focus": {
      color: active ? white.main : dark.main,
      backgroundColor: active ? null : grey[600],
    },
  };
}

function SidenavCollapse({ icon, name, active }) {
  // , ...rest
  const { miniSidenav, transparentSidenav, whiteSidenav, darkMode, sidenavColor } =
    useSelector(selectUI);

  const { palette } = theme;
  const { white, transparent, dark, grey, gradients } = palette;
  return (
    <ListItem component="li">
      <MDBox
        // {...rest}
        sx={(theme) => collapseItem(theme, active, sidenavColor)}
      >
        <ListItemIcon
          sx={{
            // color: white.main,
            "& svg, svg g": { fontSize: 16 },
            "&:hover, &:focus": {
              color: dark.main,
            },
          }}
          // sx={(theme) =>
          //   collapseIconBox(theme, { transparentSidenav, whiteSidenav, darkMode, active })
          // }
        >
          {typeof icon === "string" ? (
            <Icon
              sx={{
                // color: white.main,
                fontSize: 16,
                // "&:hover, &:focus": {
                //   color: dark.main,
                // },
              }}
              // sx={(theme) => collapseIcon(theme, { active })}
            >
              {icon}
            </Icon>
          ) : (
            icon
          )}
        </ListItemIcon>

        {/* {!miniSidenav && ( */}
        <ListItemText
          primary={name}
          sx={{
            // color: white.main,
            "& span": { fontSize: 16 },
            // "&:hover, &:focus": {
            //   color: dark.main,
            // },
          }}
          // sx={(theme) =>
          //   collapseText(theme, {
          //     miniSidenav,
          //     transparentSidenav,
          //     whiteSidenav,
          //     active,
          //   })
          // }
        />
        {/* )} */}
      </MDBox>
    </ListItem>
  );
}

// Setting default values for the props of SidenavCollapse
SidenavCollapse.defaultProps = {
  active: false,
};

// Typechecking props for the SidenavCollapse
SidenavCollapse.propTypes = {
  icon: PropTypes.node.isRequired,
  name: PropTypes.string.isRequired,
  active: PropTypes.bool,
};

export default SidenavCollapse;
