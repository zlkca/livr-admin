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

import { selectAccountHttpStatus } from "redux/account/account.selector";

import { appointmentAPI } from "services/appointmentAPI";
import { selectSignedInUser } from "redux/auth/auth.selector";
import { debounce } from "utils";
import { selectAppointments } from "redux/appointment/appointment.selector";
import { setAppointments } from "redux/appointment/appointment.slice";
import { setAppointment } from "redux/appointment/appointment.slice";
import MDSnackbar from "components/MDSnackbar";
import MDLinearProgress from "components/MDLinearProgress";
import { setSignedInUser } from "redux/auth/auth.slice";
import { logout } from "utils";
import MDButton from "components/MDButton";
import { selectSnackbar } from "redux/ui/ui.selector";
import { setSnackbar } from "redux/ui/ui.slice";
import { isAdmin } from "permission";
import CardHead from "components/CardHead";
import AppointmentList from "components/appointment/AppointmentList";
import { getAppointmentsQuery } from "permission";
import { selectBranch } from "redux/branch/branch.selector";
import { getMonthRangeQuery } from "utils";
// Data

export default function AppointmentListPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const [selectedRow, setSelectedRow] = useState();
  const [keyword, setKeyword] = useState("");
  const [isLoading, setLoading] = useState();

  const status = useSelector(selectAccountHttpStatus);
  const snackbar = useSelector(selectSnackbar);
  const rows = useSelector(selectAppointments);
  const signedInUser = useSelector(selectSignedInUser);
  const branch = useSelector(selectBranch);

  const columns = [
    {
      headerName: t("Order #"),
      field: "id",
      maxWidth: 180,
      flex: 1,
    },
    {
      headerName: t("Client"),
      field: "client",
      maxWidth: 180,
      flex: 1,
      valueGetter: (params) => (params.row?.client ? params.row?.client.username : t("Unknown")),
    },
    {
      headerName: t("Employee"),
      field: "employee",
      maxWidth: 180,
      flex: 1,
      valueGetter: (params) =>
        params.row?.employee ? params.row?.employee.username : t("Unassigned"),
    },
    { headerName: t("Type"), field: "type", maxWidth: 180, flex: 1 },
    { headerName: t("Created Date"), field: "created", maxWidth: 250, flex: 2 },
    {
      headerName: t("Actions"),
      field: "_id",
      maxWidth: 150,
      flex: 1,
      renderCell: (params) => {
        return (
          <MDButton
            size="small"
            color="info"
            onClick={() => {
              dispatch(setAppointment(params.row));
              navigate(`/appointments/${params.row._id}`);
            }}
          >
            {t("View Details")}
          </MDButton>
        );
      },
    },
  ];

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

  const handleEdit = () => {
    if (selectedRow) {
      const _id = selectedRow._id;
      appointmentAPI.fetchAppointment(_id).then((r) => {
        if (r.status === 200) {
          dispatch(setAppointment(r.data));
          navigate(`/appointments/${_id}/form`);
        }
      });
    }
  };

  const handleCreate = () => {
    dispatch(setAppointment({ address: {} }));
    navigate("/appointments/new/form");
  };

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
  }, [signedInUser]);

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox pt={1} pb={3}>
        <Grid container spacing={6}>
          <Grid item xs={12}>
            <Card>
              <CardHead title={t("Appointments")}>
                {/* <Grid container spacing={2} direction="row" justifyContent="flex-end">
                  <Grid item>
                    <MDButton variant={"outlined"} size="small" onClick={handleEdit}>
                      {t("Edit")}
                    </MDButton>
                  </Grid>
                  <Grid item>
                    <MDButton variant={"outlined"} size="small" onClick={handleDelete}>
                      {t("Delete")}
                    </MDButton>
                  </Grid>
                  <Grid item>
                    <MDButton size="small" variant={"outlined"} onClick={handleCreate}>
                      {t("Create")}
                    </MDButton>
                  </Grid>
                </Grid> */}
              </CardHead>
              <MDBox pt={2} px={2} style={{ height: 740 }}>
                <AppointmentList
                  user={signedInUser}
                  height={500}
                  rowsPerPage={8}
                  onDateRangeChange={handleAppointmentsDateRangeChange}
                />
              </MDBox>
              {/* <MDBox pt={0} px={2} style={{ height: 600 }}>
                {isLoading ? (
                  <Grid
                    container
                    display="flex"
                    justifyContent="center"
                    alignItems="center"
                    style={{ height: 400 }}
                  >
                    <Grid item xs={6}>
                      <MDLinearProgress color="info" />
                    </Grid>
                  </Grid>
                ) : (
                  <GridTable
                    autoPageSize
                    data={rows}
                    columns={columns}
                    onRowClick={handleSelectRow}
                    rowsPerPage={10}
                    // styles={mStyles.table}
                    sortModel={[{ field: "created", sort: "desc" }]}
                  />
                )}
              </MDBox> */}
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
