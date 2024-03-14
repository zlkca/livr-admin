import { Card, Grid } from "@mui/material";
import CardHead from "components/CardHead";
import MDBox from "components/MDBox";
import MDButton from "components/MDButton";
import MDSection from "components/MDSection";
import VField from "components/VField";
import DashboardLayout from "layouts/DashboardLayout";
import DashboardNavbar from "layouts/DashboardNavbar";
import Footer from "layouts/Footer";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setAppointment } from "redux/appointment/appointment.slice";
import { selectOrder } from "redux/order/order.selector";
import { setOrder } from "redux/order/order.slice";
import { selectProject } from "redux/project/project.selector";
import { setProject } from "redux/project/project.slice";
import { projectAPI } from "services/projectAPI";

export default function ProjectDetails() {
  const project = useSelector(selectProject);
  const order = useSelector(selectOrder);
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();

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
              <CardHead title={t("Project")}>
                <Grid container spacing={2} direction="row" justifyContent="flex-end">
                  <Grid item>
                    <MDButton size="small" variant={"outlined"} onClick={handleEdit}>
                      {t("Edit")}
                    </MDButton>
                  </Grid>
                  <Grid item>
                    <MDButton size="small" variant={"outlined"} onClick={handleCreateOrder}>
                      {t("Create Order")}
                    </MDButton>
                  </Grid>
                  <Grid item>
                    <MDButton size="small" variant={"outlined"} onClick={handleCreateAppointment}>
                      {t("Create Appointment")}
                    </MDButton>
                  </Grid>
                </Grid>
              </CardHead>
              <MDSection title={t("Basic Info")}>
                <Grid display="flex">
                  {!order && <VField label={t("Order #")} value={project.id} />}
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
