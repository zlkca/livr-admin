import { Card, Grid } from "@mui/material";
import MDBox from "components/MDBox";
import MDSection from "components/MDSection";
import VField from "components/VField";
import ActionBar from "components/common/ActionBar";
import DashboardLayout from "layouts/DashboardLayout";
import DashboardNavbar from "layouts/DashboardNavbar";
import Footer from "layouts/Footer";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { accountAPI } from "services/accountAPI";

import { selectEmployee } from "redux/account/account.selector";
import { setEmployee } from "redux/account/account.slice";
import MDButton from "components/MDButton";
import { useEffect, useState } from "react";
import { setSnackbar } from "redux/ui/ui.slice";
import CardHead from "components/CardHead";
import { setAccounts } from "redux/account/account.slice";
import { orderAPI } from "services/orderAPI";
import { setOrders } from "redux/order/order.slice";
import { setSignedInUser } from "redux/auth/auth.slice";
import { logout } from "utils";
import { projectAPI } from "services/projectAPI";
import { setProjects } from "redux/project/project.slice";
import { setClients } from "redux/account/account.slice";
import LabTabs from "components/common/Tabs";
import ClientsTab from "components/ClientsTab";
import OrdersTab from "components/OrdersTab";
import ProjectsTab from "components/ProjectsTab";
import { TabPanel } from "@mui/lab";

export default function EmployeeDetails() {
  const { t } = useTranslation();
  const params = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const employee = useSelector(selectEmployee);
  const [profile, setProfile] = useState();

  // const [data, setData] = useState();
  const tabs = [
    { id: "orders", label: t("Orders") },
    { id: "clients", label: t("Clients") },
    { id: "projects", label: t("Projects") },
    // { id: ClientDetailsTabId.Appointment, label: t("Employee") },
    // { id: "6", label: t("Quote") },
  ];
  const [tab, setTab] = useState({ id: "orders" });

  const handleTabChange = (e, id) => {
    if (id === "orders") {
      const q =
        profile.role === "sales" ? { "sales._id": profile._id } : { "technician._id": profile._id };

      orderAPI.searchOrders(q).then((r) => {
        if (r.status == 200) {
          dispatch(setOrders(r.data));
          // setSummary(calcSummary(r.data));
          setTab({ id });
        } else if (r.status === 401) {
          dispatch(setSignedInUser());
          logout();
        }
      });
    } else if (id === "clients") {
      const qClient = { "sales._id": profile._id, role: "client" };

      accountAPI.searchAccounts(qClient).then((r) => {
        if (r.status == 200) {
          dispatch(setClients(r.data));
          setTab({ id });
        } else if (r.status === 401) {
          dispatch(setSignedInUser());
          logout();
        }
      });
    } else if (id === "projects") {
      const q = { "sales._id": profile._id };

      projectAPI.searchProjects(q).then((r) => {
        if (r.status == 200) {
          dispatch(setProjects(r.data));
          setTab({ id });
        } else if (r.status === 401) {
          dispatch(setSignedInUser());
          logout();
        }
      });
    }
  };
  const handleOrdersDataRangeChange = (fd, ld) => {
    const q =
      profile.role === "sales" ? { "sales._id": profile._id } : { "technician._id": profile._id };
    q.created = { $gte: fd, $lte: ld };

    orderAPI.searchOrders(q).then((r) => {
      if (r.status == 200) {
        dispatch(setOrders(r.data));
        // setSummary(calcSummary(r.data));
        // setTab({ id });
      } else if (r.status === 401) {
        dispatch(setSignedInUser());
        logout();
      }
    });
  };
  const handleEdit = () => {
    if (employee) {
      const _id = employee._id;
      accountAPI.fetchAccount(_id).then((r) => {
        if (r.status === 200) {
          dispatch(setEmployee(r.data));
          navigate(`/employees/${_id}/form`);
        }
      });
    }
  };

  const handleDelete = () => {
    if (employee) {
      const _id = employee._id;
      accountAPI.deleteAccount(_id).then((r) => {
        if (r.status === 200) {
          dispatch(setAccounts(rows.filter((it) => it._id !== r.data._id)));
          dispatch(
            setSnackbar({
              color: "success",
              icon: "check",
              title: "",
              content: t(t("Deleted Successfully!")),
              open: true,
            })
          );
          navigate("/employees");
        }
      });
    }
  };

  // handle refresh
  useEffect(() => {
    if (employee) {
      setProfile({ ...employee });
      const q =
        employee.role === "sales"
          ? { "sales._id": employee._id }
          : { "technician._id": employee._id };

      orderAPI.searchOrders(q).then((r) => {
        if (r.status == 200) {
          dispatch(setOrders(r.data));
          // setSummary(calcSummary(r.data));
          // setTab({ id });
        } else if (r.status === 401) {
          dispatch(setSignedInUser());
          logout();
        }
      });
    } else {
      if (params && params.id) {
        if (!employee) {
          accountAPI.fetchAccount(params.id).then((r1) => {
            if (r1.status === 200) {
              setProfile({ ...r1.data });
              const q =
                r1.data.role === "sales"
                  ? { "sales._id": r1.data._id }
                  : { "technician._id": r1.data._id };

              orderAPI.searchOrders(q).then((r) => {
                if (r.status == 200) {
                  dispatch(setOrders(r.data));
                  // setSummary(calcSummary(r.data));
                  // setTab({ id });
                } else if (r.status === 401) {
                  dispatch(setSignedInUser());
                  logout();
                }
              });
            }
          });
        }
      }
    }
  }, [employee]);

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox pt={1} pb={3}>
        <Grid container spacing={6}>
          <Grid item xs={12}>
            {profile && (
              <Card style={{ height: 800 }}>
                <CardHead title={t("Employee")}>
                  <Grid container spacing={2} direction="row" justifyContent="flex-end">
                    <Grid item>
                      <MDButton size="small" variant={"outlined"} onClick={handleEdit}>
                        {t("Edit")}
                      </MDButton>
                    </Grid>
                  </Grid>
                </CardHead>
                <MDSection title={t("Basic Info")}>
                  <Grid display="flex">
                    <VField label={t("Username")} value={profile.username} />
                    <VField label={t("Firstname")} value={profile.firstName} />
                    <VField label={t("Lastname")} value={profile.lastName} />
                    <VField
                      label={t("Branch")}
                      value={profile.branch ? profile.branch.name : "N/A"}
                    />
                    <VField label={t("Role")} value={profile.role} />
                  </Grid>
                </MDSection>

                <MDSection title={t("Contact")}>
                  <Grid display="flex">
                    <VField label={t("Email")} value={profile.email} />
                    <VField label={t("Phone")} value={profile.phone} />
                  </Grid>
                </MDSection>

                <MDSection>
                  <LabTabs tabs={tabs} id={tab.id} onChange={handleTabChange}>
                    <TabPanel value={"orders"} style={{ width: "100%" }}>
                      <OrdersTab onDateRangeChange={handleOrdersDataRangeChange} />
                    </TabPanel>
                    <TabPanel value={"clients"}>
                      <ClientsTab />
                    </TabPanel>
                    <TabPanel value={"projects"}>
                      <ProjectsTab />
                    </TabPanel>
                  </LabTabs>
                </MDSection>
                <Grid display="flex" justifyContent="flex-end" xs={12} px={2} py={2}>
                  <MDButton variant="outlined" color="secondary" onClick={() => navigate(-1)}>
                    {t("Back")}
                  </MDButton>
                </Grid>
              </Card>
            )}
          </Grid>
        </Grid>
      </MDBox>

      <Footer />
    </DashboardLayout>
  );
}
