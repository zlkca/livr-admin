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

import { selectClient } from "redux/account/account.selector";
import { setClient } from "redux/account/account.slice";
import MDButton from "components/MDButton";
import { useEffect, useState } from "react";
import { selectSignedInUser } from "redux/auth/auth.selector";
import CardHead from "components/CardHead";
import { setProject } from "redux/project/project.slice";
import { orderAPI } from "services/orderAPI";
import { setSignedInUser } from "redux/auth/auth.slice";
import { setOrders } from "redux/order/order.slice";
import LabTabs from "components/common/Tabs";
import { TabPanel } from "@mui/lab";
import OrderList from "components/order/OrderList";
import { setProjects } from "redux/project/project.slice";
import { projectAPI } from "services/projectAPI";
import ProjectList from "components/project/ProjectList";
import AppointmentList from "components/appointment/AppointmentList";
import { appointmentAPI } from "services/appointmentAPI";
import { setAppointments } from "redux/appointment/appointment.slice";
import { setSnackbar } from "redux/ui/ui.slice";
import { isAdmin } from "permission";
import { selectAppointments } from "redux/appointment/appointment.selector";
import { generateProjectNumber, logout, getDefaultDateRangeQuery } from "utils";

export default function ClientDetails() {
  const params = useParams();
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const client = useSelector(selectClient);
  const signedInUser = useSelector(selectSignedInUser);
  const appointments = useSelector(selectAppointments);

  const [profile, setProfile] = useState();

  const tabs = [
    { id: "orders", label: t("Orders") },
    { id: "projects", label: t("Projects") },
    { id: "appointments", label: t("Appointments") },
  ];
  const [tab, setTab] = useState({ id: "orders" });

  const handleTabChange = (e, id) => {
    const mq = getDefaultDateRangeQuery();
    if (id === "orders") {
      const q = { "client._id": profile._id, ...mq };
      orderAPI.searchOrders(q).then((r) => {
        if (r.status == 200) {
          dispatch(setOrders(r.data));
          setTab({ id });
        } else if (r.status === 401) {
          dispatch(setSignedInUser());
          logout();
        }
      });
    } else if (id === "projects") {
      const q = { "client._id": profile._id, ...mq };
      projectAPI.searchProjects(q).then((r) => {
        if (r.status == 200) {
          dispatch(setProjects(r.data));
          setTab({ id });
        } else if (r.status === 401) {
          dispatch(setSignedInUser());
          logout();
        }
      });
    } else {
      const q = { "client._id": profile._id, ...mq };
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
    if (profile) {
      const q = { "client._id": profile._id, created: { $gte: fd, $lte: ld } };

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

  const handleProjectsDateRangeChange = (fd, ld) => {
    if (profile) {
      const q = { "client._id": profile._id, created: { $gte: fd, $lte: ld } };

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
      const q = { "client._id": profile._id, created: { $gte: fd, $lte: ld } };

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
    if (client) {
      const _id = client._id;
      accountAPI.fetchAccount(_id).then((r) => {
        if (r.status === 200) {
          dispatch(setClient(r.data));
          navigate(`/clients/${_id}/form`);
        }
      });
    }
  };

  const handleCreateProject = () => {
    if (client) {
      const id = generateProjectNumber();

      dispatch(
        setProject({
          id,
          client: {
            _id: client._id,
            username: client.username,
            email: client.email,
            phone: client.phone,
            address: client.address,
          },
          address: {},
          branch: signedInUser.branch,
          sales: {
            _id: signedInUser._id,
            username: signedInUser.username,
            email: signedInUser.email,
            phone: signedInUser.phone,
            branch: signedInUser.branch,
          },
        })
      );

      navigate("/projects/new/form");
    }
  };

  const handleDelete = () => {
    if (profile) {
      const _id = profile._id;
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
          navigate("/clients");
        }
      });
    }
  };

  useEffect(() => {
    const mq = getDefaultDateRangeQuery();
    if (client) {
      setProfile({ ...client });
      const q = { "client._id": client._id, ...mq };
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
        if (!client) {
          accountAPI.fetchAccount(params.id).then((r) => {
            if (r.status === 200) {
              setProfile({ ...r.data });
              const q = { "client._id": r.data._id, ...mq };
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
  }, [client]);

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox pt={1} pb={3}>
        <Grid container spacing={6}>
          <Grid item xs={12}>
            {profile && (
              <Card>
                <CardHead title={t("Client")} />
                <Grid container spacing={2} direction="row" justifyContent="flex-end" px={2} pt={2}>
                  <Grid item>
                    <MDButton color="info" size="small" variant={"outlined"} onClick={handleEdit}>
                      {t("Edit")}
                    </MDButton>
                  </Grid>
                  {isAdmin(signedInUser) && (
                    <Grid item>
                      <MDButton
                        color="info"
                        size="small"
                        variant={"outlined"}
                        onClick={handleDelete}
                      >
                        {t("Delete")}
                      </MDButton>
                    </Grid>
                  )}
                  <Grid item>
                    <MDButton
                      color="info"
                      size="small"
                      variant={"outlined"}
                      onClick={handleCreateProject}
                    >
                      {t("Create Project")}
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
                  </Grid>
                </MDSection>

                <MDSection title={t("Contact")}>
                  <Grid display="flex">
                    <VField label={t("Email")} value={profile.email} />
                    <VField label={t("Phone")} value={profile.phone} />
                    <VField label={t("Best time to call")} value={profile.bestTimeToCall} />
                    <VField label={t("Preferred Contact")} value={profile.preferredContact} />
                    <VField label={t("Address")} value={profile.displayAddress} />
                  </Grid>
                </MDSection>

                <MDSection title={t("Profile")}>
                  <Grid display="flex">
                    <VField label={t("Language")} value={profile.languages.join(",")} />
                    <VField label={t("Source")} value={profile.source} />
                  </Grid>
                </MDSection>
                <MDSection>
                  <LabTabs tabs={tabs} id={tab.id} onChange={handleTabChange}>
                    <TabPanel value={"orders"} style={{ width: "100%" }}>
                      <OrderList
                        user={signedInUser}
                        height={300}
                        rowsPerPage={20}
                        onDateRangeChange={handleOrdersDateRangeChange}
                      />
                    </TabPanel>
                    <TabPanel value={"projects"}>
                      <ProjectList
                        user={signedInUser}
                        height={300}
                        rowsPerPage={20}
                        onDateRangeChange={handleProjectsDateRangeChange}
                      />
                    </TabPanel>
                    <TabPanel value={"appointments"}>
                      <AppointmentList
                        data={appointments}
                        user={signedInUser}
                        height={300}
                        rowsPerPage={20}
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
              </Card>
            )}
          </Grid>
        </Grid>
      </MDBox>
      <Footer />
    </DashboardLayout>
  );
}
