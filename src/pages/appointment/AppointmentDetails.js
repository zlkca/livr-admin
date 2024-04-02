import { Card, Grid } from "@mui/material";
import CardHead from "components/CardHead";
import MDBox from "components/MDBox";
import MDButton from "components/MDButton";
import MDSection from "components/MDSection";
import VField from "components/VField";
import ActionBar from "components/common/ActionBar";
import DashboardLayout from "layouts/DashboardLayout";
import DashboardNavbar from "layouts/DashboardNavbar";
import Footer from "layouts/Footer";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { selectAppointment } from "redux/appointment/appointment.selector";
import { setAppointment } from "redux/appointment/appointment.slice";
import { setSnackbar } from "redux/ui/ui.slice";
import { appointmentAPI } from "services/appointmentAPI";
import { getAddressString } from "utils";

export default function AppointmentDetails() {
  const appointment = useSelector(selectAppointment);
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleEdit = () => {
    if (appointment) {
      const _id = appointment._id;
      appointmentAPI.fetchAppointment(_id).then((r) => {
        if (r.status === 200) {
          dispatch(setAppointment(r.data));
          navigate(`/appointments/${_id}/form`);
        }
      });
    }
  };
  const handleDelete = () => {
    if (appointment) {
      const _id = appointment._id;
      appointmentAPI.deleteAppointment(_id).then((r) => {
        if (r.status === 200) {
          dispatch(
            setSnackbar({
              color: "success",
              icon: "check",
              title: "",
              content: "Deleted Successfully!",
              open: true,
            })
          );
          navigate("/appointments");
        }
      });
    }
  };
  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox pt={1} pb={3}>
        <Grid container spacing={6}>
          <Grid item xs={12}>
            <Card>
              <CardHead title={t("Appointment")} />
              <Grid container spacing={2} direction="row" justifyContent="flex-end" px={2} pt={2}>
                <Grid item>
                  <MDButton color="info" variant={"outlined"} size="small" onClick={handleEdit}>
                    {t("Edit")}
                  </MDButton>
                </Grid>
                <Grid item>
                  <MDButton color="info" variant={"outlined"} size="small" onClick={handleDelete}>
                    {t("Delete")}
                  </MDButton>
                </Grid>
              </Grid>
              {appointment && (
                <>
                  <MDSection title={t("Basic Info")}>
                    <Grid display="flex">
                      <VField label={t("Order #")} value={appointment.id} />
                      <VField label={t("Type")} value={appointment.type} />
                      <VField
                        label={t("Address")}
                        value={
                          appointment.address ? getAddressString(appointment.address) : t("Unknown")
                        }
                      />
                      <VField
                        label={t("Time")}
                        value={`${appointment.start} - ${appointment.end}`}
                      />
                      <VField label={t("Summary")} value={appointment.summary} />
                      <VField label={t("Notes")} value={appointment.notes} />
                    </Grid>
                  </MDSection>

                  {appointment.client && (
                    <MDSection title={t("Client")}>
                      <Grid display="flex">
                        <VField label={t("Username")} value={appointment.client.username} />
                        <VField label={t("Email")} value={appointment.client.email} />
                        <VField label={t("Phone")} value={appointment.client.phone} />
                      </Grid>
                    </MDSection>
                  )}
                  {appointment.employee && (
                    <MDSection title={t("Employee")}>
                      <Grid display="flex">
                        <VField label={t("Username")} value={appointment.employee.username} />
                        {/* <VField label={t("Role")} value={appointment.employee.role} /> */}
                        <VField label={t("Email")} value={appointment.employee.email} />
                        <VField label={t("Phone")} value={appointment.employee.phone} />
                      </Grid>
                    </MDSection>
                  )}
                </>
              )}

              <Grid display="flex" justifyContent="flex-end" xs={12} px={2} py={2}>
                <MDButton
                  variant="outlined"
                  color="secondary"
                  onClick={() => navigate("/appointments")}
                >
                  {t("Back")}
                </MDButton>
              </Grid>
            </Card>
          </Grid>
        </Grid>
      </MDBox>
      <Footer />
    </DashboardLayout>
  );
}
