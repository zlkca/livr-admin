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
import MDButton from "components/MDButton";

import DashboardLayout from "layouts/DashboardLayout";
import DashboardNavbar from "layouts/DashboardNavbar";
import Footer from "layouts/Footer";
import { memo } from "react";

import { accountAPI } from "services/accountAPI";
import { setClient } from "redux/account/account.slice";
import { setAccounts } from "redux/account/account.slice";
import { setSignedInUser } from "redux/auth/auth.slice";
import { setSnackbar } from "redux/ui/ui.slice";

import MDSnackbar from "components/MDSnackbar";
import MDLinearProgress from "components/MDLinearProgress";

import { selectSnackbar } from "redux/ui/ui.selector";
import { selectSignedInUser } from "redux/auth/auth.selector";
import { selectAccountHttpStatus } from "redux/account/account.selector";
import { selectClients } from "redux/account/account.selector";

import { isAdmin, logout } from "utils";
import { setClients } from "redux/account/account.slice";
import CardHead from "components/CardHead";

export default memo(function ClientList() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const [selectedRow, setSelectedRow] = useState();
  const [isLoading, setLoading] = useState();
  const status = useSelector(selectAccountHttpStatus);
  const rows = useSelector(selectClients);
  const snackbar = useSelector(selectSnackbar);
  const signedInUser = useSelector(selectSignedInUser);

  const columns = [
    { headerName: t("Username"), field: "username", maxWidth: 200, flex: 1 },
    {
      headerName: t("Sales"),
      field: "sales",
      width: 150,
      flex: 1,
      valueGetter: (params) => (params.row?.sales ? params.row?.sales.username : t("Unassigned")),
    },
    {
      headerName: t("Branch"),
      field: "branch",
      maxWidth: 300,
      valueGetter: (params) => (params.row?.branch ? params.row?.branch.name : t("N/A")),
      flex: 1,
    },
    { headerName: t("Email"), field: "email", maxWidth: 320, flex: 1.5 },
    { headerName: t("Phone"), field: "phone", maxWidth: 200, flex: 1 },
    // { headerName: t("Status"), field: "status", maxWidth: 150, flex: 1 },
    { headerName: t("Created Date"), field: "created", maxWidth: 200, flex: 1 },
    {
      headerName: t("Actions"),
      field: "_id",
      maxWidth: 180,
      flex: 1,
      renderCell: (params) => {
        return (
          <MDButton
            color="info"
            size="small"
            onClick={() => {
              dispatch(setClient(params.row));
              navigate(`/clients/${params.row._id}`);
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
      accountAPI.fetchAccount(_id).then((r) => {
        if (r.status === 200) {
          dispatch(setClient(r.data));
        }
        navigate(`/clients/${_id}/form`);
      });
    }
  };

  const handleCreate = () => {
    if (isAdmin(signedInUser)) {
      dispatch(setClient({}));
    } else {
      dispatch(
        setClient({
          branch: signedInUser.branch,
          sales: {
            _id: signedInUser._id,
            username: signedInUser.username,
            email: signedInUser.email,
            phone: signedInUser.phone,
          },
        })
      );
    }
    navigate("/clients/new/form");
  };

  const handleSelectRow = (row) => {
    setSelectedRow(row);
  };

  useEffect(() => {
    if (signedInUser) {
      setLoading(true);
      const q = isAdmin(signedInUser)
        ? { role: "client" }
        : { role: "client", "sales._id": signedInUser._id };
      accountAPI.searchAccounts(q).then((r) => {
        if (r.status == 200) {
          dispatch(setClients(r.data));
          setTimeout(() => {
            setLoading(false);
          }, 500);
        } else if (r.status === 401) {
          dispatch(setSignedInUser());
          logout();
        }
      });
    }
  }, []);

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox pt={1} pb={3}>
        <Grid container spacing={6}>
          <Grid item xs={12}>
            <Card>
              <CardHead title={t("Clients")}>
                <Grid container spacing={2} direction="row" justifyContent="flex-end">
                  <Grid item>
                    <MDButton variant={"outlined"} size="small" onClick={handleEdit}>
                      {t("Edit")}
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
                    rowsPerPage={9}
                    // styles={mStyles.table}
                    sortModel={[{ field: "created", sort: "desc" }]}
                  />
                )}
              </MDBox>
            </Card>
          </Grid>
        </Grid>
      </MDBox>
      <MDSnackbar
        {...snackbar}
        title=""
        datetime=""
        icon="check"
        autoHideDuration={3000}
        close={() => dispatch(setSnackbar({ ...snackbar, open: false }))}
        onClose={() => dispatch(setSnackbar({ ...snackbar, open: false }))}
      />
      <Footer />
    </DashboardLayout>
  );
});
