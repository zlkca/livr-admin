import MDBox from "./MDBox";
import MDTypography from "./MDTypography";

export default function CardHead({ title, children }) {
  return (
    <MDBox
      mx={2}
      mt={-3}
      py={3}
      px={2}
      variant="contained"
      bgColor="secondary"
      borderRadius="md"
      coloredShadow="none"
    >
      <MDTypography variant="h6" color="white">
        {title}
      </MDTypography>
      {children}
    </MDBox>
  );
}
