import { useSelector } from "react-redux";
import MDBox from "./MDBox";
import MDTypography from "./MDTypography";
import { selectUI } from "redux/ui/ui.selector";

export default function MDSection({ title, children, styles }) {
  const { darkMode } = useSelector(selectUI);
  const noGutter = false;
  const rootStyle = styles ? styles.root : {};
  return (
    <div style={{ paddingLeft: 20, paddingRight: 20, ...rootStyle }}>
      <MDBox
        component="li"
        display="flex"
        justifyContent="space-between"
        alignItems="flex-start"
        bgColor={darkMode ? "transparent" : "grey-100"}
        borderRadius="lg"
        p={3}
        mb={noGutter ? 0 : 1}
        mt={2}
        style={{ width: "100%" }}
      >
        <MDBox width="100%" display="flex" flexDirection="column">
          <MDBox
            display="flex"
            justifyContent="space-between"
            alignItems={{ xs: "flex-start", sm: "center" }}
            flexDirection={{ xs: "column", sm: "row" }}
            mb={2}
          >
            {title && (
              <MDTypography variant="subtitle1" fontWeight="regular" textTransform="capitalize">
                {title}
              </MDTypography>
            )}
          </MDBox>
          {children}
        </MDBox>
      </MDBox>
    </div>
  );
}
