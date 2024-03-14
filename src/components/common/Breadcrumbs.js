import * as React from "react";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import Typography from "@mui/material/Typography";
import Link from "@mui/material/Link";
import Stack from "@mui/material/Stack";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import { Path } from "../../const";
import { useNavigate } from "react-router-dom";

const baseStyles = {
  root: {
    paddingBottom: 20,
    paddingLeft: 20,
  },
};

export default function WidgetBreadcrumbs({ data, styles }) {
  const navigate = useNavigate();

  const mStyles = styles
    ? {
        root: {
          ...baseStyles.root,
          ...styles.root,
        },
      }
    : baseStyles;

  const handleClick = (d) => {
    switch (d.id) {
      case Path.ManageClients:
        navigate("/clients");
        break;
      case Path.ClientDetails:
        navigate(`/clients/${d.params.accountId}`);
        break;
      case Path.ManagePartners:
        navigate("/partners");
        break;
      case Path.PartnerDetails:
        navigate(`/partners/${d.params.accountId}`);
        break;
      case Path.ManageEmployees:
        navigate("/employees");
        break;
      case Path.EmployeeDetails:
        navigate(`/employees/${d.params.accountId}`);
        break;
      case Path.ManageProjects:
        navigate("/projects");
        break;
      case Path.ProjectDetails:
        navigate(`/projects/${d.params.projectId}`);
        break;
      case Path.ProjectAssignEmployee:
        navigate(`/projects/${d.params.projectId}/sales`);
        break;
      case Path.MeasurementDetails:
        navigate(`/measurements/${d.params.measurementId}`);
        break;
      case Path.AppointmentDetails:
        navigate(`/appointments/${d.params.appointmentId}`);
        break;
    }
  };

  return (
    <Stack spacing={2} style={mStyles.root}>
      <Breadcrumbs separator={<NavigateNextIcon fontSize="small" />} aria-label="breadcrumb">
        {data &&
          data.length > 0 &&
          data.map((d, index) =>
            index !== data.length - 1 ? (
              <Link underline="hover" key={d.id} color="inherit" onClick={() => handleClick(d)}>
                {d.label}
              </Link>
            ) : (
              <Typography key={d.id} color="text.primary">
                {d.label}
              </Typography>
            )
          )}
      </Breadcrumbs>
    </Stack>
  );
}
