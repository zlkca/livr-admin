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
import EmployeeList from "components/account/EmployeeList";
import { setEmployees } from "redux/account/account.slice";
import { getMonthRangeQuery } from "utils";
import { selectEmployees } from "redux/account/account.selector";

export default memo(function EmployeeListPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const [selectedRow, setSelectedRow] = useState();
  const [isLoading, setLoading] = useState();

  const signedInUser = useSelector(selectSignedInUser);
  const status = useSelector(selectAccountHttpStatus);
  const snackbar = useSelector(selectSnackbar);
  const mq = getMonthRangeQuery();

  const handleEmployeesDateRangeChange = (fd, ld) => {
    const q = {
      role: { $in: ["admin", "root", "sales", "technician", "user"] },
      created: { $gte: fd, $lte: ld },
    };
    accountAPI.searchAccounts(q).then((r) => {
      if (r.status == 200) {
        dispatch(setEmployees(r.data));
      } else if (r.status === 401) {
        dispatch(setSignedInUser());
        logout();
      }
    });
  };

  // const handleEdit = () => {
  //   if (selectedRow) {
  //     const _id = selectedRow._id;
  //     accountAPI.fetchAccount(_id).then((r) => {
  //       if (r.status === 200) {
  //         dispatch(setEmployee(r.data));
  //       }
  //       navigate(`/employees/${_id}/form`);
  //     });
  //   }
  // };

  // const handleDelete = () => {
  //   if (selectedRow) {
  //     const _id = selectedRow._id;
  //     accountAPI.deleteAccount(_id).then((r) => {
  //       if (r.status === 200) {
  //         dispatch(setAccounts(rows.filter((it) => it._id !== r.data._id)));
  //         dispatch(
  //           setSnackbar({
  //             color: "success",
  //             icon: "check",
  //             title: "",
  //             content: t("Deleted Successfully!"),
  //             open: true,
  //           })
  //         );
  //       }
  //     });
  //   }
  // };

  // const handleCreate = () => {
  //   dispatch(setEmployee({}));
  //   navigate("/employees/new/form");
  // };

  const handleSelectRow = (row) => {
    setSelectedRow(row);
  };

  useEffect(() => {
    accountAPI
      .searchAccounts({
        role: { $in: ["admin", "technician", "sales", "user"] },
        ...mq,
      })
      .then((r) => {
        if (r.status == 200) {
          dispatch(setEmployees(r.data));
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
              <CardHead title={t("Employees")}>
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
                <EmployeeList
                  user={signedInUser}
                  height={500}
                  rowsPerPage={8}
                  onDateRangeChange={handleEmployeesDateRangeChange}
                />
                {/* {isLoading ? (
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
                )} */}
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
