import { Card, Grid } from "@mui/material";
import CardHead from "components/CardHead";
import MDBox from "components/MDBox";
import MDButton from "components/MDButton";
import MDSection from "components/MDSection";
import VField from "components/VField";
import AppointmentList from "components/appointment/AppointmentList";
import DashboardLayout from "layouts/DashboardLayout";
import DashboardNavbar from "layouts/DashboardNavbar";
import Footer from "layouts/Footer";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setAppointments } from "redux/appointment/appointment.slice";
import { setAppointment } from "redux/appointment/appointment.slice";
import { selectSignedInUser } from "redux/auth/auth.selector";
import { selectOrder } from "redux/order/order.selector";
import { setOrder } from "redux/order/order.slice";
import { selectProject } from "redux/project/project.selector";
import { setProject } from "redux/project/project.slice";
import { setSnackbar } from "redux/ui/ui.slice";
import { appointmentAPI } from "services/appointmentAPI";
import { projectAPI } from "services/projectAPI";
import { isAdmin } from "permission";
import { selectAppointments } from "redux/appointment/appointment.selector";

export default function ProjectDetails() {
  const project = useSelector(selectProject);
  const order = useSelector(selectOrder);
  const signedInUser = useSelector(selectSignedInUser);
  const appointments = useSelector(selectAppointments);
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    if (project) {
      const _id = project._id;
      appointmentAPI.searchAppointments({ "project._id": _id }).then((r) => {
        if (r.status === 200) {
          dispatch(setAppointments(r.data));
        }
      });
    }
  }, []);

  const handleEdit = () => {
    if (project) {
      const _id = project._id;
      projectAPI.fetchProject(_id).then((r) => {
        if (r.status === 200) {
          dispatch(setProject(r.data));
          navigate(`/projects/${_id}/form`);
        }
      });
    }
  };
  const handleDelete = () => {
    if (project) {
      const _id = project._id;
      projectAPI.deleteProject(_id).then((r) => {
        if (r.status === 200) {
          dispatch(
            setSnackbar({
              color: "success",
              icon: "check",
              title: "",
              content: t("Deleted Successfully!"),
              open: true,
            })
          );
          navigate(`/projects`);
        }
      });
    }
  };

  const handleCreateOrder = () => {
    if (project) {
      const _id = project._id;
      dispatch(
        setOrder({
          id: project.id,
          project: { _id: project._id },
          address: project.address,
          client: project.client,
          sales: project.sales,
          branch: project.branch,
        })
      );
      navigate("/orders/new/form");
    }
  };
  const handleCreateAppointment = () => {
    if (project) {
      dispatch(
        setAppointment({
          id: project.id,
          project: { _id: project._id },
          address: project.address,
          client: project.client,
          sales: project.sales,
          branch: project.branch,
        })
      );
      navigate("/appointments/new/form");
    }
  };
  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox pt={1} pb={3}>
        <Grid container spacing={6}>
          <Grid item xs={12}>
            <Card>
              <CardHead title={t("Project")} />
              <Grid container spacing={2} direction="row" justifyContent="flex-end" px={2} pt={2}>
                {isAdmin(signedInUser) && (
                  <Grid item>
                    <MDButton color="info" size="small" variant={"outlined"} onClick={handleEdit}>
                      {t("Edit")}
                    </MDButton>
                  </Grid>
                )}
                {isAdmin(signedInUser) && (
                  <Grid item>
                    <MDButton color="info" size="small" variant={"outlined"} onClick={handleDelete}>
                      {t("Delete")}
                    </MDButton>
                  </Grid>
                )}
                <Grid item>
                  <MDButton
                    color="info"
                    size="small"
                    variant={"outlined"}
                    onClick={handleCreateOrder}
                  >
                    {t("Create Order")}
                  </MDButton>
                </Grid>
                <Grid item>
                  <MDButton
                    color="info"
                    size="small"
                    variant={"outlined"}
                    onClick={handleCreateAppointment}
                  >
                    {t("Create Appointment")}
                  </MDButton>
                </Grid>
              </Grid>
              {project && (
                <>
                  <MDSection title={t("Basic Info")}>
                    <Grid display="flex">
                      <VField label={t("Order #")} value={project.id} />
                      <VField
                        label={t("Branch")}
                        value={project.branch ? project.branch.name : "N/A"}
                      />
                      <VField label={t("Stage")} value={project.stage} />
                      <VField label={t("Date")} value={project.created} />
                    </Grid>
                  </MDSection>
                  {order && (
                    <MDSection title={t("Orders")}>
                      <Grid display="flex">
                        <VField label={t("Order #")} value={order.id} />
                        <VField label={t("Amount")} value={order.amount} />
                        <VField label={t("Deposit")} value={order.deposit} />
                        <VField label={t("Tax")} value={order.taxOpt} />
                        <VField label={t("Balance")} value={order.balance} />
                        <VField label={t("Date")} value={order.created} />
                        <MDButton
                          color="info"
                          size="small"
                          variant={"outlined"}
                          style={{ height: 40 }}
                          onClick={() => {
                            navigate(`/orders/${order._id}`);
                          }}
                        >
                          {t("View Details")}
                        </MDButton>
                      </Grid>
                    </MDSection>
                  )}
                  <MDSection title={t("Client")}>
                    <Grid display="flex">
                      <VField label={t("Username")} value={project.client.username} />
                      <VField label={t("Email")} value={project.client.email} />
                      <VField label={t("Phone")} value={project.client.phone} />
                      <VField label={t("Address")} value={project.displayAddress} />
                    </Grid>
                  </MDSection>

                  <MDSection title={t("Sales")}>
                    <Grid display="flex">
                      <VField
                        label={t("Branch")}
                        value={project.branch ? project.branch.name : "N/A"}
                      />
                      <VField label={t("Username")} value={project.sales.username} />
                      <VField label={t("Email")} value={project.sales.email} />
                      <VField label={t("Phone")} value={project.sales.phone} />
                    </Grid>
                  </MDSection>
                </>
              )}
              <MDSection title={t("Appointments")}>
                <AppointmentList
                  data={appointments}
                  hideFilter={true}
                  user={signedInUser}
                  height={300}
                  rowsPerPage={6}
                  onDateRangeChange={() => {}}
                />
              </MDSection>
              <Grid display="flex" justifyContent="flex-end" xs={12} px={2} py={2}>
                <MDButton
                  variant="outlined"
                  color="secondary"
                  onClick={() => navigate("/projects")}
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
