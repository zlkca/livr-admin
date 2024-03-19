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

import { useCallback, useEffect, useState } from "react";
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

// Material Dashboard 2 React example components
import DashboardLayout from "layouts/DashboardLayout";
import DashboardNavbar from "layouts/DashboardNavbar";
import Footer from "layouts/Footer";

import { selectAccounts } from "redux/account/account.selector";
import { fetchAccounts } from "redux/account/account.thunk";
import { selectAccountHttpStatus } from "redux/account/account.selector";
import { fetchAccount } from "redux/account/account.thunk";
import { setClient } from "redux/account/account.slice";

import { selectSignedInUser } from "redux/auth/auth.selector";
import { debounce, isAdmin } from "utils";
import { selectProjects } from "redux/project/project.selector";
import { setProjects } from "redux/project/project.slice";
import { generateProjectNumber } from "utils";
import { setProject } from "redux/project/project.slice";
import MDLinearProgress from "components/MDLinearProgress";
import { setSignedInUser } from "redux/auth/auth.slice";
import { logout } from "utils";
import ButtonWidget from "components/common/Button";
import { setSnackbar } from "redux/ui/ui.slice";
import { selectSnackbar } from "redux/ui/ui.selector";
import MDSnackbar from "components/MDSnackbar";
import CardHead from "components/CardHead";
import { projectAPI } from "services/projectAPI";
import ProjectList from "components/project/ProjectList";
// Data

export default function ProjectListPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const [selectedRow, setSelectedRow] = useState();
  const [keyword, setKeyword] = useState("");
  const [isLoading, setLoading] = useState();
  const status = useSelector(selectAccountHttpStatus);
  const projects = useSelector(selectProjects);
  const signedInUser = useSelector(selectSignedInUser);
  const snackbar = useSelector(selectSnackbar);

  const handleProjectsDateRangeChange = (fd, ld) => {
    const q = isAdmin(signedInUser)
      ? { created: { $gte: fd, $lte: ld } }
      : { [`${signedInUser.role}._id`]: signedInUser._id, created: { $gte: fd, $lte: ld } };

    projectAPI.searchProjects(q).then((r) => {
      if (r.status == 200) {
        dispatch(setProjects(r.data));
      } else if (r.status === 401) {
        dispatch(setSignedInUser());
        logout();
      }
    });
  };

  const handleSelectRow = (row) => {
    const project = projects.find((it) => it._id === row._id);
    setSelectedRow(project);
  };

  const getProjectListQuery = (keyword, signedInUser) => {
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

  const loadProjects = (keyword, signedInUser) => {
    setLoading(true);
    // const query = getProjectListQuery(keyword, signedInUser);
    const q = isAdmin(signedInUser) ? {} : { "sales._id": signedInUser._id };
    projectAPI.searchProjects(q).then((r) => {
      if (r.status == 200) {
        dispatch(setProjects(r.data));
        setTimeout(() => {
          setLoading(false);
        }, 500);
      } else if (r.status === 401) {
        dispatch(setSignedInUser());
        logout();
      }
    });
  };

  const fetchProjectsDelay = debounce(loadProjects, 500);

  useEffect(() => {
    if (signedInUser) {
      fetchProjectsDelay(keyword, signedInUser);
    }
  }, [signedInUser, keyword]);

  const handleSearch = (keyword) => {
    if (signedInUser) {
      loadProjects(keyword, signedInUser);
    }
  };

  const handleClearSearch = () => {
    setKeyword();
  };

  const handleKeywordChange = (v) => {
    setKeyword(v);
  };

  const handleRefresh = () => {
    if (signedInUser) {
      loadProjects(keyword, signedInUser);
    }
  };

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
