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

import { useEffect } from "react";
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

import { orderAPI } from "services/orderAPI";
import { logout } from "utils";
import { isAdmin } from "permission";

import { setSnackbar } from "redux/ui/ui.slice";
import { setOrders } from "redux/order/order.slice";
import { setSignedInUser } from "redux/auth/auth.slice";
import { selectSignedInUser } from "redux/auth/auth.selector";
import { selectSnackbar } from "redux/ui/ui.selector";

import MDSnackbar from "components/MDSnackbar";
import CardHead from "components/CardHead";
import OrderList from "components/order/OrderList";
import { getMonthRangeQuery } from "utils";
import { getItemsQuery } from "permission";
import { selectBranch } from "redux/branch/branch.selector";
// Data

export default function OrderListPage() {
  const mq = getMonthRangeQuery();

  const dispatch = useDispatch();
  const { t } = useTranslation();
  const signedInUser = useSelector(selectSignedInUser);
  const snackbar = useSelector(selectSnackbar);
  const branch = useSelector(selectBranch);

  const handleOrdersDateRangeChange = (fd, ld) => {
    const q = getItemsQuery(signedInUser, branch ? branch._id : "");
    orderAPI.searchOrders({ ...q, created: { $gte: fd, $lte: ld } }).then((r) => {
      if (r.status == 200) {
        dispatch(setOrders(r.data));
      } else if (r.status === 401) {
        dispatch(setSignedInUser());
        logout();
      }
    });
  };

  useEffect(() => {
    if (signedInUser) {
      const q = getItemsQuery(signedInUser, branch ? branch._id : "");
      orderAPI.searchOrders({ ...q, ...mq }).then((r) => {
        if (r.status == 200) {
          dispatch(setOrders(r.data));
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
              <CardHead title={t("Orders")} />
              <MDBox pt={2} px={2} style={{ height: 1240 }}>
                <OrderList
                  user={signedInUser}
                  height={1000}
                  rowsPerPage={20}
                  onDateRangeChange={handleOrdersDateRangeChange}
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
}
