import MDBox from "./MDBox";
import MDTypography from "./MDTypography";

export default function VField({ label, value }) {
  return (
    <MDBox key={label} py={1} pr={8} mb={1}>
      <MDBox display="flex" justifyContent="space-between" alignItems="center">
        <MDBox display="flex" alignItems="center">
          <MDBox display="flex" flexDirection="column">
            <MDTypography variant="button" fontWeight="medium" gutterBottom>
              {label}
            </MDTypography>
            <MDTypography variant="caption" color="text" fontWeight="regular">
              {value}
            </MDTypography>
          </MDBox>
        </MDBox>
      </MDBox>
    </MDBox>
  );
}
