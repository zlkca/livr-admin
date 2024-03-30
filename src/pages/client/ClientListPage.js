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
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";

// @mui material components
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";

import DashboardLayout from "layouts/DashboardLayout";
import DashboardNavbar from "layouts/DashboardNavbar";
import Footer from "layouts/Footer";
import { memo } from "react";

import { accountAPI } from "services/accountAPI";
import { setSignedInUser } from "redux/auth/auth.slice";
import { setSnackbar } from "redux/ui/ui.slice";

import MDSnackbar from "components/MDSnackbar";

import { selectSnackbar } from "redux/ui/ui.selector";
import { selectSignedInUser } from "redux/auth/auth.selector";

import { setClients } from "redux/account/account.slice";
import CardHead from "components/CardHead";
import ClientList from "components/account/ClientList";
import { selectBranch } from "redux/branch/branch.selector";
import { getClientsQuery } from "permission";
import { logout, getMonthRangeQuery } from "utils";

export default memo(function ClientListPage() {
  const dispatch = useDispatch();
  const { t } = useTranslation();

  const snackbar = useSelector(selectSnackbar);
  const signedInUser = useSelector(selectSignedInUser);
  const branch = useSelector(selectBranch);

  const mq = getMonthRangeQuery();

  const handleClientsDateRangeChange = (fd, ld) => {
    const q = getClientsQuery(signedInUser, branch ? branch._id : "");
    accountAPI.searchAccounts({ ...q, created: { $gte: fd, $lte: ld } }).then((r) => {
      if (r.status == 200) {
        dispatch(setClients(r.data));
      } else if (r.status === 401) {
        dispatch(setSignedInUser());
        logout();
      }
    });
  };

  useEffect(() => {
    if (signedInUser) {
      const q = getClientsQuery(signedInUser, branch ? branch._id : "");
      accountAPI.searchAccounts({ ...q, ...mq }).then((r) => {
        if (r.status == 200) {
          dispatch(setClients(r.data));
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
              <CardHead title={t("Clients")} />
              {/* <Grid container spacing={2} direction="row" justifyContent="flex-end">
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
                </Grid> */}
              <MDBox pt={2} px={2} style={{ height: 1240 }}>
                <ClientList
                  user={signedInUser}
                  height={1000}
                  rowsPerPage={20}
                  onDateRangeChange={handleClientsDateRangeChange}
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
