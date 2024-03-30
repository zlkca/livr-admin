/**
=========================================================
* Material Dashboard 2 React - v2.2.0
=========================================================

* Product Page: https://www.creative-tim.com/product/material-dashboard-react
* Copyright 2023 Creative Tim (https://www.creative-tim.com)

Coded by www.creative-tim.com

 =========================================================

 * The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
 */

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";

// @mui material components
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import GridTable from "components/common/GridTable";

// Material Dashboard 2 React example components
import DashboardLayout from "layouts/DashboardLayout";
import DashboardNavbar from "layouts/DashboardNavbar";
import Footer from "layouts/Footer";
import TabPanel from "@mui/lab/TabPanel";

import { selectAccountHttpStatus } from "redux/account/account.selector";

import { selectSignedInUser } from "redux/auth/auth.selector";
import { selectAppointments } from "redux/appointment/appointment.selector";
import { setAppointments } from "redux/appointment/appointment.slice";
import { setSignedInUser } from "redux/auth/auth.slice";
import { selectSnackbar } from "redux/ui/ui.selector";
import { setSnackbar } from "redux/ui/ui.slice";
import { selectBranch } from "redux/branch/branch.selector";
import CardHead from "components/CardHead";

import LabTabs from "components/common/Tabs";
import MDSnackbar from "components/MDSnackbar";
import AppointmentList from "components/appointment/AppointmentList";
import { appointmentAPI } from "services/appointmentAPI";
import { getAppointmentsQuery } from "permission";
import { getMonthRangeQuery, logout } from "utils";
import { accountAPI } from "services/accountAPI";
import { getActiveEmployeesQuery } from "permission";
import { AppointmentCalendar } from "components/appointment/AppointmentCalendar";

export default function AppointmentsPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const [isLoading, setLoading] = useState();
  const [events, setEvents] = useState([]);

  const status = useSelector(selectAccountHttpStatus);
  const snackbar = useSelector(selectSnackbar);
  const rows = useSelector(selectAppointments);
  const signedInUser = useSelector(selectSignedInUser);
  const branch = useSelector(selectBranch);
  const appointments = useSelector(selectAppointments);

  const tabs = [
    { id: "appointment-calendar", label: t("Calendar") },
    { id: "appointment-list", label: t("Appointments") },
  ];

  const [tab, setTab] = useState({ id: "appointment-calendar" });
  const [employees, setEmployees] = useState([]);

  const handleTabChange = (e, id) => {
    const q = getAppointmentsQuery(signedInUser, branch ? branch._id : "");
    const mq = getMonthRangeQuery();
    appointmentAPI.searchAppointments({ ...q, ...mq }).then((r) => {
      if (r.status == 200) {
        dispatch(setAppointments(r.data));
        setTab({ id });
      } else if (r.status === 401) {
        dispatch(setSignedInUser());
        logout();
      }
    });
  };

  const handleAppointmentsDateRangeChange = (fd, ld) => {
    const q = getAppointmentsQuery(signedInUser, branch ? branch._id : "");
    appointmentAPI.searchAppointments({ ...q, created: { $gte: fd, $lte: ld } }).then((r) => {
      if (r.status == 200) {
        dispatch(setAppointments(r.data));
      } else if (r.status === 401) {
        dispatch(setSignedInUser());
        logout();
      }
    });
  };

  //    const handleEdit = () => {
  //      if (selectedRow) {
  //        const _id = selectedRow._id;
  //        appointmentAPI.fetchAppointment(_id).then((r) => {
  //          if (r.status === 200) {
  //            dispatch(setAppointment(r.data));
  //            navigate(`/appointments/${_id}/form`);
  //          }
  //        });
  //      }
  //    };

  //    const handleCreate = () => {
  //      dispatch(setAppointment({ address: {} }));
  //      navigate("/appointments/new/form");
  //    };

  const handleSearchModeChange = (mode) => {
    if (mode === "year") {
      setSearchMode("year");
      handleSearchYear(searchYear);
    } else if (mode === "month") {
      setSearchMode("month");
      handleSearchMonth(searchMonth);
    } else {
      setSearchMode("range");
      handleDateRangeChange(dateRange);
    }
  };

  const handleSearchMonth = (d) => {
    if (d && isValidDate(d)) {
      const m = d.getMonth();
      const y = d.getFullYear();
      const firstDay = getFirstDayOfMonth(y, m);
      const lastDay = getLastDayOfMonth(y, m);
      const fd = `${firstDay.toISOString()}`;
      const ld = `${lastDay.toISOString()}`;
      setSearchMonth(d);
      onDateRangeChange(fd, ld);
    }
  };

  const handleSearchYear = (year) => {
    if (year && year < 10000 && year > 1900) {
      const firstDay = getFirstDayOfYear(year);
      const lastDay = getLastDayOfYear(year);
      const fd = `${firstDay.toISOString()}`;
      const ld = `${lastDay.toISOString()}`;
      setSearchYear(year);
      onDateRangeChange(fd, ld);
    }
  };

  const handleDateRangeChange = (range) => {
    if (range) {
      setDateRange(range);
      const fd = `${range[0].toISOString()}`;
      const ld = `${range[1].toISOString()}`;
      onDateRangeChange(fd, ld);
    } else {
      const today = new Date();
      const firstDay = getFirstDayOfMonth(today.getFullYear(), today.getMonth());
      const lastDay = getLastDayOfMonth(today.getFullYear(), today.getMonth());
      setDateRange([firstDay, lastDay]);
      const fd = `${firstDay.toISOString()}`;
      const ld = `${lastDay.toISOString()}`;
      onDateRangeChange(fd, ld);
    }
  };

  useEffect(() => {
    if (signedInUser) {
      setLoading(true);
      const q = getAppointmentsQuery(signedInUser, branch ? branch._id : "");
      const mq = getMonthRangeQuery();
      appointmentAPI.searchAppointments({ ...q, ...mq }).then((r) => {
        if (r.status == 200) {
          dispatch(setAppointments(r.data));
          setTimeout(() => {
            setLoading(false);
          }, 500);
        } else if (r.status === 401) {
          dispatch(setSignedInUser());
          logout();
        }
      });
    }
    const accountQ = getActiveEmployeesQuery(signedInUser, branch ? branch._id : "");
    accountAPI.searchAccounts(accountQ).then((r) => {
      if (r.status == 200) {
        setEmployees(r.data);
      } else if (r.status === 401) {
        dispatch(setSignedInUser());
        logout();
      }
    });
  }, []);

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox pt={1} pb={3}>
        <Grid container spacing={6}>
          <Grid item xs={12}>
            <Card>
              <CardHead title={t("Appointments")}></CardHead>
              <LabTabs tabs={tabs} id={tab.id} onChange={handleTabChange}>
                <TabPanel value={"appointment-calendar"} style={{ width: "100%" }}>
                  <AppointmentCalendar
                    appointments={appointments}
                    user={signedInUser}
                    branch={branch}
                  />
                </TabPanel>
                <TabPanel value={"appointment-list"}>
                  <MDBox pt={2} px={2} style={{ height: 740 }}>
                    <AppointmentList
                      data={appointments}
                      user={signedInUser}
                      height={500}
                      rowsPerPage={8}
                      onDateRangeChange={handleAppointmentsDateRangeChange}
                    />
                  </MDBox>
                </TabPanel>
              </LabTabs>
            </Card>
          </Grid>
        </Grid>
      </MDBox>
      {snackbar && (
        <MDSnackbar
          {...snackbar}
          icon="check"
          title=""
          datetime=""
          autoHideDuration={3000}
          close={() => dispatch(setSnackbar({ ...snackbar, open: false }))}
          onClose={() => dispatch(setSnackbar({ ...snackbar, open: false }))}
        />
      )}
      <Footer />
    </DashboardLayout>
  );
}
