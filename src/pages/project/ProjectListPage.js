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

import { selectSignedInUser } from "redux/auth/auth.selector";
import { setProjects } from "redux/project/project.slice";
import { setSignedInUser } from "redux/auth/auth.slice";
import { logout } from "utils";
import { setSnackbar } from "redux/ui/ui.slice";
import { selectSnackbar } from "redux/ui/ui.selector";
import MDSnackbar from "components/MDSnackbar";
import CardHead from "components/CardHead";
import { projectAPI } from "services/projectAPI";
import ProjectList from "components/project/ProjectList";
import { getItemsQuery } from "permission";
import { getMonthRangeQuery } from "utils";
import { selectBranch } from "redux/branch/branch.selector";
// Data

export default function ProjectListPage() {
  const dispatch = useDispatch();
  const { t } = useTranslation();

  const signedInUser = useSelector(selectSignedInUser);
  const branch = useSelector(selectBranch);
  const snackbar = useSelector(selectSnackbar);

  const handleProjectsDateRangeChange = (fd, ld) => {
    const q = getItemsQuery(signedInUser, branch ? branch._id : "");
    projectAPI.searchProjects({ ...q, created: { $gte: fd, $lte: ld } }).then((r) => {
      if (r.status == 200) {
        dispatch(setProjects(r.data));
      } else if (r.status === 401) {
        dispatch(setSignedInUser());
        logout();
      }
    });
  };

  useEffect(() => {
    if (signedInUser) {
      const mq = getMonthRangeQuery();
      const q = getItemsQuery(signedInUser, branch ? branch._id : "");
      projectAPI.searchProjects({ ...q, ...mq }).then((r) => {
        if (r.status == 200) {
          dispatch(setProjects(r.data));
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
              <CardHead title={t("Projects")} />
              <MDBox pt={2} px={2} style={{ height: 740 }}>
                <ProjectList
                  user={signedInUser}
                  height={500}
                  rowsPerPage={8}
                  onDateRangeChange={handleProjectsDateRangeChange}
                />
              </MDBox>
            </Card>
          </Grid>
        </Grid>
      </MDBox>
      {snackbar && (
        <MDSnackbar
          {...snackbar}
          title=""
          datetime=""
          icon="check"
          autoHideDuration={3000}
          close={() => dispatch(setSnackbar({ ...snackbar, open: false }))}
          onClose={() => dispatch(setSnackbar({ ...snackbar, open: false }))}
        />
      )}
      <Footer />
    </DashboardLayout>
  );
}
