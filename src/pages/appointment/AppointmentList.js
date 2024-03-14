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
import { isAdmin } from "utils";
import CardHead from "components/CardHead";
// Data

export default function AppointmentList() {
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

  const handleDelete = () => {
    if (selectedRow) {
      const _id = selectedRow._id;
      appointmentAPI.deleteAppointment(_id).then((r) => {
        if (r.status === 200) {
          dispatch(setAppointments(rows.filter((it) => it._id !== r.data._id)));
          setSnackbar({
            color: "success",
            icon: "check",
            title: "",
            content: "Deleted Successfully!",
            open: true,
          });
        }
      });
    }
  };
  const handleCreate = () => {
    dispatch(setAppointment({ address: {} }));
    navigate("/appointments/new/form");
  };

  //   const [rows, setRows] = [];
  const handleSelectRow = (row) => {
    setSelectedRow(row);
  };

  const getAppointmentListQuery = (keyword, signedInUser) => {
    return keyword ? { keyword } : null;
    // if (isAdmin(signedInUser) || isDrawingEngineer(signedInUser)) {
    //   return keyword ? { keyword } : null;
    // } else if (isEmployee(signedInUser)) {
    //   const query = { [`${signedInUser.role}Id`]: signedInUser.id };
    //   return keyword ? { keyword, ...query } : query;
    // } else {
    //   return null;
    // }
  };

  // const loadAppointments = (keyword, signedInUser) => {

  // };

  // const fetchAppointmentsDelay = debounce(loadAppointments, 500);

  useEffect(() => {
    if (signedInUser) {
      setLoading(true);
      // const query = getAppointmentListQuery(keyword, signedInUser);
      const q = isAdmin(signedInUser) ? {} : { "employee._id": signedInUser._id };
      appointmentAPI.searchAppointments(q).then((r) => {
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

  // const handleSearch = (keyword) => {
  //   if (signedInUser) {
  //     loadAppointments(keyword, signedInUser);
  //   }
  // };

  // const handleClearSearch = () => {
  //   setKeyword();
  // };

  // const handleKeywordChange = (v) => {
  //   setKeyword(v);
  // };

  const handleRefresh = () => {
    if (signedInUser) {
      loadAppointments(keyword, signedInUser);
    }
  };

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox pt={1} pb={3}>
        <Grid container spacing={6}>
          <Grid item xs={12}>
            <Card>
              <CardHead title={t("Appointments")}>
                <Grid container spacing={2} direction="row" justifyContent="flex-end">
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
                </Grid>
              </CardHead>

              <MDBox pt={0} px={2} style={{ height: 600 }}>
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
              </MDBox>
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
