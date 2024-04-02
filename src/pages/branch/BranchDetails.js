import { Card, Grid } from "@mui/material";
import MDBox from "components/MDBox";
import MDButton from "components/MDButton";
import MDSection from "components/MDSection";
import VField from "components/VField";
import DashboardLayout from "layouts/DashboardLayout";
import DashboardNavbar from "layouts/DashboardNavbar";
import Footer from "layouts/Footer";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { selectBranch } from "redux/branch/branch.selector";
import { setBranch } from "redux/branch/branch.slice";

import { branchAPI } from "services/branchAPI";
import LabTabs from "components/common/Tabs";
import { TabPanel } from "@mui/lab";
import CardHead from "components/CardHead";
import { setSnackbar } from "redux/ui/ui.slice";
import { setBranches } from "redux/branch/branch.slice";
import { selectBranches } from "redux/branch/branch.selector";
import { orderAPI } from "services/orderAPI";
import { setOrders } from "redux/order/order.slice";
import { setSignedInUser } from "redux/auth/auth.slice";
import { logout } from "utils";
import { accountAPI } from "services/accountAPI";
import { setClients } from "redux/account/account.slice";
import { setProjects } from "redux/project/project.slice";
import { selectSignedInUser } from "redux/auth/auth.selector";
import { getMonthRangeQuery } from "utils";
import { projectAPI } from "services/projectAPI";

import OrderList from "components/order/OrderList";
import ClientList from "components/account/ClientList";
import ProjectList from "components/project/ProjectList";
import { appointmentAPI } from "services/appointmentAPI";
import { setAppointments } from "redux/appointment/appointment.slice";
import AppointmentList from "components/appointment/AppointmentList";
import { selectAppointments } from "redux/appointment/appointment.selector";

export default function BranchDetails() {
  const mq = getMonthRangeQuery();

  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const params = useParams();

  const branch = useSelector(selectBranch);
  const rows = useSelector(selectBranches);
  const appointments = useSelector(selectAppointments);
  const signedInUser = useSelector(selectSignedInUser);
  const [data, setData] = useState();

  const tabs = [
    { id: "orders", label: t("Orders") },
    { id: "clients", label: t("Clients") },
    { id: "projects", label: t("Projects") },
    { id: "appointments", label: t("Appointments") },
  ];
  const [tab, setTab] = useState({ id: "orders" });

  const handleTabChange = (e, id) => {
    if (id === "orders") {
      const q = { "branch._id": branch._id, ...mq };

      orderAPI.searchOrders(q).then((r) => {
        if (r.status == 200) {
          dispatch(setOrders(r.data));
          setTab({ id });
        } else if (r.status === 401) {
          dispatch(setSignedInUser());
          logout();
        }
      });
    } else if (id === "clients") {
      const qClient = { "branch._id": branch._id, roles: ["client"] };
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
      const q = { "branch._id": branch._id };
      projectAPI.searchProjects(q).then((r) => {
        if (r.status == 200) {
          dispatch(setProjects(r.data));
          setTab({ id });
        } else if (r.status === 401) {
          dispatch(setSignedInUser());
          logout();
        }
      });
    } else if (id === "appointments") {
      const q = { "employee.branch._id": branch._id, ...mq };

      appointmentAPI.searchAppointments(q).then((r) => {
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
    if (branch) {
      const q = { "branch._id": branch._id, created: { $gte: fd, $lte: ld } };

      orderAPI.searchOrders(q).then((r) => {
        if (r.status == 200) {
          dispatch(setOrders(r.data));
        } else if (r.status === 401) {
          dispatch(setSignedInUser());
          logout();
        }
      });
    }
  };

  const handleClientsDateRangeChange = (fd, ld) => {
    const q = { "branch._id": branch._id, roles: ["client"], created: { $gte: fd, $lte: ld } };
    accountAPI.searchAccounts(q).then((r) => {
      if (r.status == 200) {
        dispatch(setClients(r.data));
      } else if (r.status === 401) {
        dispatch(setSignedInUser());
        logout();
      }
    });
  };

  const handleProjectDateRangeChange = (fd, ld) => {
    const q = { "branch._id": branch._id, created: { $gte: fd, $lte: ld } };
    projectAPI.searchProjects(q).then((r) => {
      if (r.status == 200) {
        dispatch(setProjects(r.data));
      } else if (r.status === 401) {
        dispatch(setSignedInUser());
        logout();
      }
    });
  };
  const handleAppointmentsDateRangeChange = (fd, ld) => {
    if (profile) {
      const q = { "employee.branch._id": branch._id, created: { $gte: fd, $lte: ld } };

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
  // handle refresh
  useEffect(() => {
    if (branch) {
      setData({ ...branch });
      const q = { "branch._id": branch._id, ...mq };
      orderAPI.searchOrders(q).then((r1) => {
        if (r1.status == 200) {
          dispatch(setOrders(r1.data));
        } else if (r1.status === 401) {
          dispatch(setSignedInUser());
          logout();
        }
      });
    } else {
      if (params && params.id) {
        if (!branch) {
          branchAPI.fetchBranch(params.id).then((r) => {
            if (r.status === 200) {
              setData({ ...r.data });
              dispatch(setBranch(r.data));
              const q = { "branch._id": r.data._id, ...mq };

              orderAPI.searchOrders(q).then((r1) => {
                if (r1.status == 200) {
                  dispatch(setOrders(r1.data));
                } else if (r1.status === 401) {
                  dispatch(setSignedInUser());
                  logout();
                }
              });
            }
          });
        }
      }
    }
  }, []);

  const handleEdit = () => {
    if (branch) {
      const _id = branch._id;
      branchAPI.fetchBranch(_id).then((r) => {
        if (r.status === 200) {
          dispatch(setBranch(r.data));
          navigate(`/branches/${_id}/form`);
        }
      });
    }
  };

  const handleDelete = () => {
    if (branch) {
      const _id = branch._id;
      branchAPI.deleteBranch(_id).then((r) => {
        if (r.status === 200) {
          dispatch(setBranches(rows.filter((it) => it._id !== r.data._id)));
          dispatch(
            setSnackbar({
              color: "success",
              icon: "check",
              title: "",
              content: t("Deleted Successfully!"),
              open: true,
            })
          );
          navigate("/branches");
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
            {data && (
              <Card>
                <CardHead title={t("Branches")} />
                <Grid container spacing={2} direction="row" justifyContent="flex-end" px={2} pt={2}>
                  <Grid item>
                    <MDButton color="info" size="small" variant={"outlined"} onClick={handleEdit}>
                      {t("Edit")}
                    </MDButton>
                  </Grid>
                  <Grid item>
                    <MDButton color="info" size="small" variant={"outlined"} onClick={handleDelete}>
                      {t("Delete")}
                    </MDButton>
                  </Grid>
                </Grid>
                {/* title={t("Basic Info")} */}
                <MDSection>
                  <Grid display="flex">
                    <VField label={t("Name")} value={data.name} />
                    <VField label={t("Address")} value={data.displayAddress} />
                    <VField label={t("Notes")} value={data.notes} />
                  </Grid>
                </MDSection>
                {/* title={t("Details")} */}
                <MDSection>
                  <LabTabs tabs={tabs} id={tab.id} onChange={handleTabChange}>
                    <TabPanel value={"orders"} style={{ width: "100%" }}>
                      <OrderList
                        user={signedInUser}
                        height={448}
                        rowsPerPage={6}
                        onDateRangeChange={handleOrdersDateRangeChange}
                      />
                    </TabPanel>
                    <TabPanel value={"clients"}>
                      <ClientList
                        user={signedInUser}
                        height={448}
                        rowsPerPage={6}
                        onDateRangeChange={handleClientsDateRangeChange}
                      />
                    </TabPanel>
                    <TabPanel value={"projects"}>
                      <ProjectList
                        user={signedInUser}
                        height={448}
                        rowsPerPage={6}
                        onDateRangeChange={handleProjectDateRangeChange}
                      />
                    </TabPanel>
                    <TabPanel value={"appointments"}>
                      <AppointmentList
                        data={appointments}
                        user={signedInUser}
                        height={300}
                        rowsPerPage={6}
                        onDateRangeChange={handleAppointmentsDateRangeChange}
                      />
                    </TabPanel>
                  </LabTabs>
                </MDSection>
                <Grid display="flex" justifyContent="flex-end" xs={12} py={2} px={2}>
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
