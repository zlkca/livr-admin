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

// Material Dashboard 2 React example components
import DashboardLayout from "layouts/DashboardLayout";
import DashboardNavbar from "layouts/DashboardNavbar";
import Footer from "layouts/Footer";
import { accountAPI } from "services/accountAPI";
import { logout } from "utils";
import { setSignedInUser } from "redux/auth/auth.slice";
import { selectSignedInUser } from "redux/auth/auth.selector";
import MDSnackbar from "components/MDSnackbar";
import { selectSnackbar } from "redux/ui/ui.selector";
import { setSnackbar } from "redux/ui/ui.slice";
import CardHead from "components/CardHead";
import EmployeeList from "components/account/EmployeeList";
import { setEmployees } from "redux/account/account.slice";
import { getEmployeesQuery } from "permission";
import { selectBranch } from "redux/branch/branch.selector";

export default memo(function EmployeeListPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const signedInUser = useSelector(selectSignedInUser);
  const snackbar = useSelector(selectSnackbar);
  const branch = useSelector(selectBranch);

  const handleEmployeesDateRangeChange = (fd, ld) => {
    const q = getEmployeesQuery(signedInUser, branch ? branch._id : "");
    accountAPI.searchAccounts({ ...q, created: { $gte: fd, $lte: ld } }).then((r) => {
      if (r.status == 200) {
        dispatch(setEmployees(r.data));
      } else if (r.status === 401) {
        dispatch(setSignedInUser());
        logout();
      }
    });
  };

  // by default get all the employees
  useEffect(() => {
    const q = getEmployeesQuery(signedInUser, branch ? branch._id : "");
    accountAPI
      .searchAccounts({
        ...q,
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
              <CardHead title={t("Employees")} />
              <MDBox pt={2} px={2} style={{ height: 740 }}>
                <EmployeeList
                  user={signedInUser}
                  height={500}
                  rowsPerPage={8}
                  onDateRangeChange={handleEmployeesDateRangeChange}
                />
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
