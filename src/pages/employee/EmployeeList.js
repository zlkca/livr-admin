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

import { memo, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";

// @mui material components
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";

// Material Dashboard 2 React example components
import DashboardLayout from "layouts/DashboardLayout";
import DashboardNavbar from "layouts/DashboardNavbar";
import Footer from "layouts/Footer";
import GridTable from "components/common/GridTable";
import { selectAccounts } from "redux/account/account.selector";
import { searchAccounts } from "redux/account/account.thunk";
import { accountAPI } from "services/accountAPI";
import { selectAccountHttpStatus } from "redux/account/account.selector";
import ActionBar from "components/common/ActionBar";
import { setEmployee } from "redux/account/account.slice";
import { setAccounts } from "redux/account/account.slice";
import MDLinearProgress from "components/MDLinearProgress";
import { logout } from "utils";
import { setSignedInUser } from "redux/auth/auth.slice";
import { selectSignedInUser } from "redux/auth/auth.selector";
import MDSnackbar from "components/MDSnackbar";
import MDButton from "components/MDButton";
import { selectSnackbar } from "redux/ui/ui.selector";
import { setSnackbar } from "redux/ui/ui.slice";
import CardHead from "components/CardHead";

// Data

export default memo(function EmployeeList() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const [selectedRow, setSelectedRow] = useState();
  const [isLoading, setLoading] = useState();

  const signedInUser = useSelector(selectSignedInUser);
  const status = useSelector(selectAccountHttpStatus);
  const rows = useSelector(selectAccounts);
  const snackbar = useSelector(selectSnackbar);

  const columns = [
    { headerName: t("Username"), field: "username", maxWidth: 200, flex: 1 },
    { headerName: t("Email"), field: "email", maxWidth: 320, flex: 1.5 },
    { headerName: t("Phone"), field: "phone", maxWidth: 200, flex: 1 },
    { headerName: t("Role"), field: "role", maxWidth: 200, flex: 1 },
    // { headerName: t("Status"), field: "status", maxWidth: 200, flex: 1 },
    {
      headerName: t("Branch"),
      field: "branch",
      maxWidth: 300,
      valueGetter: (params) => (params.row?.branch ? params.row?.branch.name : t("N/A")),
      flex: 1,
    },
    { headerName: t("Created Date"), field: "created", maxWidth: 200, flex: 1 },
    {
      headerName: t("Actions"),
      field: "_id",
      maxWidth: 180,
      flex: 1,
      renderCell: (params) => {
        return (
          <MDButton
            size="small"
            color="info"
            onClick={() => {
              dispatch(setEmployee(params.row));
              navigate(`/employees/${params.row._id}`);
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
          dispatch(setEmployee(r.data));
        }
        navigate(`/employees/${_id}/form`);
      });
    }
  };
  const handleDelete = () => {
    if (selectedRow) {
      const _id = selectedRow._id;
      accountAPI.deleteAccount(_id).then((r) => {
        if (r.status === 200) {
          dispatch(setAccounts(rows.filter((it) => it._id !== r.data._id)));
          dispatch(
            setSnackbar({
              color: "success",
              icon: "check",
              title: "",
              content: t("Deleted Successfully!"),
              open: true,
            })
          );
        }
      });
    }
  };
  const handleCreate = () => {
    dispatch(setEmployee({}));
    navigate("/employees/new/form");
  };

  const handleSelectRow = (row) => {
    setSelectedRow(row);
  };

  useEffect(() => {
    let roles = [];
    if (signedInUser) {
      if (signedInUser.role === "root") {
        roles = ["admin", "accountant", "engineer", "technician", "sales", "user"];
      } else if (signedInUser.role === "admin") {
        roles = ["accountant", "engineer", "technician", "sales", "user"];
      } else {
        roles = [signedInUser.role];
      }

      setLoading(true);
      accountAPI
        .searchAccounts({
          role: { $in: roles },
        })
        .then((r) => {
          if (r.status == 200) {
            dispatch(setAccounts(r.data));
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
              <CardHead title={t("Employees")}>
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
