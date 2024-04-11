import { useEffect, useState } from "react";
import { Card, Grid } from "@mui/material";
import MDBox from "components/MDBox";
import MDSection from "components/MDSection";
import VField from "components/VField";
import DashboardLayout from "layouts/DashboardLayout";
import DashboardNavbar from "layouts/DashboardNavbar";
import Footer from "layouts/Footer";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { accountAPI } from "services/accountAPI";
import { TabPanel } from "@mui/lab";

import MDButton from "components/MDButton";
import CardHead from "components/CardHead";
import LabTabs from "components/common/Tabs";

import { selectEmployee } from "redux/account/account.selector";
import { setEmployee } from "redux/account/account.slice";
import { setSnackbar } from "redux/ui/ui.slice";
import { orderAPI } from "services/orderAPI";
import { setOrders } from "redux/order/order.slice";
import { projectAPI } from "services/projectAPI";
import { setProjects } from "redux/project/project.slice";
import { setSignedInUser } from "redux/auth/auth.slice";
import { setClients } from "redux/account/account.slice";
import { selectSignedInUser } from "redux/auth/auth.selector";
import OrderList from "components/order/OrderList";
import ClientList from "components/account/ClientList";
import { appointmentAPI } from "services/appointmentAPI";
import { setAppointments } from "redux/appointment/appointment.slice";
import ProjectList from "components/project/ProjectList";
import AppointmentList from "components/appointment/AppointmentList";
import { selectAppointments } from "redux/appointment/appointment.selector";
import { getAllItemsQuery } from "permission";
import { logout, getFirstDayOfMonth, getLastDayOfMonth, getDefaultDateRangeQuery } from "utils";
import { selectBranch } from "redux/branch/branch.selector";
import MDSnackbar from "components/MDSnackbar";
import { selectSnackbar } from "redux/ui/ui.selector";
import { getOrdersQuery } from "permission";
import { getProjectsQuery } from "permission";
import { getEmployeesQuery } from "permission";
import { getAppointmentsQuery } from "permission";

const TabContentHeight = 896;
const RowsPerPage = 12;

export default function EmployeeDetails() {
  const { t } = useTranslation();
  const params = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const employee = useSelector(selectEmployee);
  const signedInUser = useSelector(selectSignedInUser);
  const appointments = useSelector(selectAppointments);
  const branch = useSelector(selectBranch);
  const snackbar = useSelector(selectSnackbar);

  const [profile, setProfile] = useState();

  const tabs = [
    { id: "orders", label: t("Orders") },
    { id: "clients", label: t("Clients") },
    { id: "projects", label: t("Projects") },
    { id: "appointments", label: t("Appointments") },
  ];
  const [tab, setTab] = useState({ id: "orders" });

  const handleTabChange = (e, id) => {
    const mq = getDefaultDateRangeQuery();
    if (id === "orders") {
      const q = getOrdersQuery(profile);
      orderAPI.searchOrders({ ...mq, ...q }).then((r) => {
        if (r.status == 200) {
          dispatch(setOrders(r.data));
          setTab({ id });
        } else if (r.status === 401) {
          dispatch(setSignedInUser());
          logout();
        }
      });
    } else if (id === "clients") {
      const qClient = { "sales._id": profile._id, roles: ["client"], ...mq };
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
      const q = getProjectsQuery(profile);
      projectAPI.searchProjects({ ...mq, ...q }).then((r) => {
        if (r.status == 200) {
          dispatch(setProjects(r.data));
          setTab({ id });
        } else if (r.status === 401) {
          dispatch(setSignedInUser());
          logout();
        }
      });
    } else if (id === "appointments") {
      const q = getAppointmentsQuery(profile);
      appointmentAPI.searchAppointments({ ...mq, ...q }).then((r) => {
        if (r.status == 200) {
          dispatch(setAppointments(r.data));
          setTab({ id });
        } else if (r.status === 401) {
          dispatch(setSignedInUser());
          logout();
        }
      });
    }
  };

  const handleOrdersDateRangeChange = (fd, ld) => {
    const oq = getOrdersQuery(profile);
    const q = { ...oq, created: { $gte: fd, $lte: ld } };

    orderAPI.searchOrders(q).then((r) => {
      if (r.status == 200) {
        dispatch(setOrders(r.data));
      } else if (r.status === 401) {
        dispatch(setSignedInUser());
        logout();
      }
    });
  };
  const handleClientsDateRangeChange = (fd, ld) => {
    const q = { "sales._id": profile._id, roles: ["client"], created: { $gte: fd, $lte: ld } };
    accountAPI.searchAccounts(q).then((r) => {
      if (r.status == 200) {
        dispatch(setClients(r.data));
      } else if (r.status === 401) {
        dispatch(setSignedInUser());
        logout();
      }
    });
  };

  const handleProjectsDateRangeChange = (fd, ld) => {
    if (profile) {
      const oq = getProjectsQuery(profile);
      const q = { ...oq, created: { $gte: fd, $lte: ld } };
      projectAPI.searchProjects(q).then((r) => {
        if (r.status == 200) {
          dispatch(setProjects(r.data));
        } else if (r.status === 401) {
          dispatch(setSignedInUser());
          logout();
        }
      });
    }
  };

  const handleAppointmentsDateRangeChange = (fd, ld) => {
    if (profile) {
      const oq = getAppointmentsQuery(profile);
      const q = { ...oq, created: { $gte: fd, $lte: ld } };

      appointmentAPI.searchAppointments(q).then((r) => {
        if (r.status == 200) {
          dispatch(setAppointments(r.data));
        } else if (r.status === 401) {
          dispatch(setSignedInUser());
          logout();
        }
      });
    }
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
          dispatch(
            setSnackbar({
              color: "success",
              icon: "check",
              title: "",
              content: t("Deleted Successfully!"),
              open: true,
            })
          );
          navigate("/employees");
        }
      });
    }
  };

  const handleActivate = () => {
    if (profile) {
      const _id = profile._id;
      accountAPI.updateAccount(_id, { status: "active" }).then((r) => {
        if (r.status === 200) {
          dispatch(setEmployee(r.data));
          dispatch(
            setSnackbar({
              color: "success",
              icon: "check",
              title: "",
              content: t("Updated Successfully!"),
              open: true,
            })
          );
        }
      });
    }
  };

  const handleSuspend = () => {
    if (profile) {
      const _id = profile._id;
      accountAPI.updateAccount(_id, { status: "suspend" }).then((r) => {
        if (r.status === 200) {
          dispatch(setEmployee(r.data));
          dispatch(
            setSnackbar({
              color: "success",
              icon: "check",
              title: "",
              content: t("Updated Successfully!"),
              open: true,
            })
          );
        }
      });
    }
  };

  // handle refresh
  useEffect(() => {
    const today = new Date();
    const firstDay = getFirstDayOfMonth(today.getFullYear(), today.getMonth());
    const lastDay = getLastDayOfMonth(today.getFullYear(), today.getMonth());
    const fd = `${firstDay.toISOString()}`;
    const ld = `${lastDay.toISOString()}`;
    if (employee) {
      setProfile({ ...employee });
      const oq = getOrdersQuery(employee);
      const q = { ...oq, created: { $gte: fd, $lte: ld } };
      orderAPI.searchOrders(q).then((r) => {
        if (r.status == 200) {
          dispatch(setOrders(r.data));
          // setSummary(getFinanceSummary(r.data));
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
              const oq = getOrdersQuery(employee);
              const q = { ...oq, created: { $gte: fd, $lte: ld } };
              orderAPI.searchOrders(q).then((r) => {
                if (r.status == 200) {
                  dispatch(setOrders(r.data));
                  // setSummary(getFinanceSummary(r.data));
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
              <Card style={{ height: 940 }}>
                <CardHead title={t("Employee")} />
                <Grid container spacing={2} direction="row" justifyContent="flex-end" px={2} pt={2}>
                  <Grid item>
                    <MDButton color="info" size="small" variant={"outlined"} onClick={handleEdit}>
                      {t("Edit")}
                    </MDButton>
                  </Grid>
                  {profile.status !== "active" && (
                    <Grid item>
                      <MDButton
                        color="info"
                        variant={"outlined"}
                        size="small"
                        onClick={handleActivate}
                      >
                        {t("Activate")}
                      </MDButton>
                    </Grid>
                  )}
                  {profile.status === "active" && (
                    <Grid item>
                      <MDButton
                        color="info"
                        variant={"outlined"}
                        size="small"
                        onClick={handleSuspend}
                      >
                        {t("Deactivate")}
                      </MDButton>
                    </Grid>
                  )}
                  <Grid item>
                    <MDButton color="info" size="small" variant={"outlined"} onClick={handleDelete}>
                      {t("Delete")}
                    </MDButton>
                  </Grid>
                </Grid>
                <MDSection title={t("Basic Info")}>
                  <Grid display="flex">
                    <VField label={t("Username")} value={profile.username} />
                    <VField label={t("Firstname")} value={profile.firstName} />
                    <VField label={t("Lastname")} value={profile.lastName} />
                    <VField
                      label={t("Branch")}
                      value={profile.branch ? profile.branch.name : "N/A"}
                    />
                    <VField label={t("Roles")} value={profile.roles.join(", ")} />
                    <VField label={t("Email")} value={profile.email} />
                    <VField label={t("Phone")} value={profile.phone} />
                    <VField label={t("Status")} value={profile.status} />
                  </Grid>
                </MDSection>

                <MDSection>
                  <LabTabs tabs={tabs} id={tab.id} onChange={handleTabChange}>
                    <TabPanel
                      value={"orders"}
                      style={{ width: "100%", paddingLeft: 0, paddingRight: 0 }}
                    >
                      <OrderList
                        user={signedInUser}
                        height={TabContentHeight}
                        rowsPerPage={RowsPerPage}
                        onDateRangeChange={handleOrdersDateRangeChange}
                      />
                    </TabPanel>
                    <TabPanel
                      value={"clients"}
                      style={{ width: "100%", paddingLeft: 0, paddingRight: 0 }}
                    >
                      <ClientList
                        user={signedInUser}
                        height={TabContentHeight}
                        rowsPerPage={RowsPerPage}
                        onDateRangeChange={handleClientsDateRangeChange}
                      />
                    </TabPanel>
                    <TabPanel
                      value={"projects"}
                      style={{ width: "100%", paddingLeft: 0, paddingRight: 0 }}
                    >
                      <ProjectList
                        user={signedInUser}
                        height={TabContentHeight}
                        rowsPerPage={RowsPerPage}
                        onDateRangeChange={handleProjectsDateRangeChange}
                      />
                    </TabPanel>
                    <TabPanel
                      value={"appointments"}
                      style={{ width: "100%", paddingLeft: 0, paddingRight: 0 }}
                    >
                      <AppointmentList
                        data={appointments}
                        user={signedInUser}
                        height={TabContentHeight}
                        rowsPerPage={RowsPerPage}
                        onDateRangeChange={handleAppointmentsDateRangeChange}
                      />
                    </TabPanel>
                  </LabTabs>
                </MDSection>
                <Grid display="flex" justifyContent="flex-end" xs={12} px={2} py={2}>
                  <MDButton variant="outlined" color="secondary" onClick={() => navigate(-1)}>
                    {t("Back")}
                  </MDButton>
                </Grid>
                <MDSnackbar
                  {...snackbar}
                  title=""
                  datetime=""
                  icon="check"
                  autoHideDuration={3000}
                  close={() => dispatch(setSnackbar({ ...snackbar, open: false }))}
                  onClose={() => dispatch(setSnackbar({ ...snackbar, open: false }))}
                />
              </Card>
            )}
          </Grid>
        </Grid>
      </MDBox>

      <Footer />
    </DashboardLayout>
  );
}
