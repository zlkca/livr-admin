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

import { projectAPI } from "services/projectAPI";
import { selectSignedInUser } from "redux/auth/auth.selector";
import { debounce, isAdmin, isDrawingEngineer, getAddressString } from "utils";
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
import { orderAPI } from "services/orderAPI";
import { setOrder } from "redux/order/order.slice";
// Data

export default function ProjectList() {
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

  const columns = [
    {
      headerName: t("ID"),
      field: "id",
      width: 120,
      flex: 1,
    },
    {
      headerName: t("Branch"),
      field: "branch",
      width: 150,
      flex: 2,
      valueGetter: (params) => (params.row?.branch ? params.row?.branch.name : t("Unassigned")),
    },
    {
      headerName: t("Address"),
      field: "address",
      width: 380,
      flex: 3,
      valueGetter: (params) =>
        params.row?.address ? getAddressString(params.row?.address) : t("Unassigned"),
    },
    {
      headerName: t("Client"),
      field: "client",
      width: 150,
      flex: 1,
      valueGetter: (params) => (params.row?.client ? params.row?.client.username : t("Unknown")),
    },
    {
      headerName: t("Stage"),
      field: "stage",
      width: 160,
      flex: 1,
    },
    {
      headerName: t("Sales"),
      field: "sales",
      width: 150,
      flex: 1,
      valueGetter: (params) => (params.row?.sales ? params.row?.sales.username : t("Unassigned")),
    },
    { headerName: t("Created Date"), field: "created", width: 190, flex: 1 },
    {
      headerName: t("Actions"),
      field: "_id",
      width: 170,
      flex: 1,
      renderCell: (params) => {
        return (
          <MDButton
            color="info"
            size="small"
            onClick={() => {
              const projectId = params.row._id;
              dispatch(setProject(params.row));

              orderAPI.searchOrders({ id: params.row.id }).then((r) => {
                if (r.data && r.data.length > 0) {
                  dispatch(setOrder(r.data[0]));
                } else {
                  dispatch(setOrder());
                }
                navigate(`/projects/${projectId}`);
              });
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
      projectAPI.fetchProject(_id).then((r) => {
        if (r.status === 200) {
          dispatch(setProject(r.data));
          navigate(`/projects/${_id}/form`);
        }
      });
    }
  };

  const handleCreate = () => {
    const id = generateProjectNumber();
    if (isAdmin(signedInUser)) {
      dispatch(setProject({ id, address: {} }));
    } else {
      dispatch(
        setProject({
          id,
          address: {},
          branch: signedInUser.branch,
          sales: {
            _id: signedInUser._id,
            username: signedInUser.username,
            email: signedInUser.email,
            phone: signedInUser.phone,
            branch: signedInUser.branch,
          },
        })
      );
    }
    navigate("/projects/new/form");
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
              <CardHead title={t("Projects")}>
                <Grid container spacing={2} direction="row" justifyContent="flex-end">
                  {isAdmin(signedInUser) && (
                    <Grid item>
                      <MDButton variant={"outlined"} size="small" onClick={handleEdit}>
                        {t("Edit")}
                      </MDButton>
                    </Grid>
                  )}
                  <Grid item>
                    <MDButton size="small" variant={"outlined"} onClick={handleCreate}>
                      {t("Create")}
                    </MDButton>
                  </Grid>
                </Grid>
              </CardHead>
              <MDBox pt={0} px={2} style={{ height: 600 }}>
                {/* <DataTable
                   table={{ columns, projects }}
                   isSorted={false}
                   entriesPerPage={false}
                   showTotalEntries={false}
                   noEndBorder
                 /> */}
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
                    data={projects}
                    columns={columns}
                    onRowClick={handleSelectRow}
                    rowsPerPage={15}
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
