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
import { appointmentAPI } from "services/appointmentAPI";

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

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox pt={1} pb={3}>
        <Grid container spacing={6}>
          <Grid item xs={12}>
            <Card>
              <CardHead title={t("Appointment")}>
                <Grid container spacing={2} direction="row" justifyContent="flex-end">
                  <Grid item>
                    <MDButton variant={"outlined"} size="small" onClick={handleEdit}>
                      {t("Edit")}
                    </MDButton>
                  </Grid>
                </Grid>
              </CardHead>
              <MDSection title={t("Basic Info")}>
                <Grid display="flex">
                  <VField label={t("Order #")} value={appointment.id} />
                  <VField label={t("Type")} value={appointment.type} />
                  {/* <VField label={t("Address")} value={appointment.displayAddress} /> */}
                </Grid>
              </MDSection>

              <MDSection title={t("Client")}>
                <Grid display="flex">
                  <VField label={t("Username")} value={appointment.client.username} />
                  <VField label={t("Email")} value={appointment.client.email} />
                  <VField label={t("Phone")} value={appointment.client.phone} />
                </Grid>
              </MDSection>

              {/* <MDSection title={t("Sales")}>
                <Grid display="flex">
                  <VField label={t("Username")} value={appointment.sales.username} />
                  <VField label={t("Email")} value={appointment.sales.email} />
                  <VField label={t("Phone")} value={appointment.sales.phone} />
                </Grid>
              </MDSection> */}

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