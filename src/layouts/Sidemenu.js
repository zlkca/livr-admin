import { NavLink } from "react-router-dom";
import SidenavCollapse from "./SidenavCollapse";
import MDTypography from "components/MDTypography";
import { Divider } from "@mui/material";
import Link from "@mui/material/Link";
import { useTranslation } from "react-i18next";

// Render all the routes from the menus.js (All the visible items on the Sidenav)
export default function Sidemenu({ menus, collapseName }) {
  const { t } = useTranslation();

  return menus.map((menu) => {
    const { type, name, icon, title, noCollapse, key, href, route } = menu;
    let returnValue;
    if (type === "collapse") {
      returnValue = href ? (
        <Link
          href={href}
          key={key}
          target="_blank"
          rel="noreferrer"
          sx={{ textDecoration: "none" }}
        >
          <SidenavCollapse
            name={t(name)}
            icon={icon}
            active={key === collapseName}
            noCollapse={noCollapse}
          />
        </Link>
      ) : (
        <NavLink key={key} to={route}>
          <SidenavCollapse name={t(name)} icon={icon} active={key === collapseName} />
        </NavLink>
      );
    } else if (type === "title") {
      returnValue = (
        <MDTypography
          key={key}
          color={textColor}
          display="block"
          variant="caption"
          fontWeight="bold"
          textTransform="uppercase"
          pl={3}
          mt={2}
          mb={1}
          ml={1}
        >
          {title}
        </MDTypography>
      );
    } else if (type === "divider") {
      returnValue = (
        <Divider
          key={key}
          //   light={false
          //     // (!darkMode && !whiteSidenav && !transparentSidenav) ||
          //     // (darkMode && !transparentSidenav && whiteSidenav)
          //   }
        />
      );
    }

    return returnValue;
  });
}
