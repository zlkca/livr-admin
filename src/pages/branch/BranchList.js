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
import GridTable from "components/common/GridTable";
import MDButton from "components/MDButton";

// Material Dashboard 2 React example components
import DashboardLayout from "layouts/DashboardLayout";
import DashboardNavbar from "layouts/DashboardNavbar";
import Footer from "layouts/Footer";

import { selectAccountHttpStatus } from "redux/account/account.selector";
import { branchAPI } from "services/branchAPI";
import { selectSignedInUser } from "redux/auth/auth.selector";
import { debounce, getAddressString } from "utils";
import { selectBranches } from "redux/branch/branch.selector";
import { setBranches } from "redux/branch/branch.slice";
import { setBranch } from "redux/branch/branch.slice";
import MDLinearProgress from "components/MDLinearProgress";
import { setSignedInUser } from "redux/auth/auth.slice";
import { logout } from "utils";
import { setSnackbar } from "redux/ui/ui.slice";
import { selectSnackbar } from "redux/ui/ui.selector";
import MDSnackbar from "components/MDSnackbar";
import CardHead from "components/CardHead";

export default function BranchList() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const [selectedRow, setSelectedRow] = useState();
  const [keyword, setKeyword] = useState("");
  const [isLoading, setLoading] = useState();
  const status = useSelector(selectAccountHttpStatus);
  const rows = useSelector(selectBranches);
  const signedInUser = useSelector(selectSignedInUser);
  const snackbar = useSelector(selectSnackbar);

  const columns = [
    {
      headerName: t("Name"),
      field: "name",
      width: 280,
      flex: 1,
    },
    {
      headerName: t("Address"),
      field: "address",
      width: 300,
      flex: 3,
      valueGetter: (params) =>
        params.row?.address ? getAddressString(params.row?.address) : t("Unassigned"),
    },
    { headerName: t("Created Date"), field: "created", width: 190, flex: 1 },
    {
      headerName: t("Actions"),
      field: "_id",
      width: 190,
      flex: 1,
      renderCell: (params) => {
        return (
          <MDButton
            color="info"
            size="small"
            onClick={() => {
              dispatch(setBranch(params.row));
              const branchId = params.row._id;
              navigate(`/branches/${branchId}`);
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
      branchAPI.fetchBranch(_id).then((r) => {
        if (r.status === 200) {
          dispatch(setBranch(r.data));
          navigate(`/branches/${_id}/form`);
        }
      });
    }
  };
  const handleCreate = () => {
    dispatch(setBranch({ address: {} }));
    navigate("/branches/new/form");
  };

  const handleDelete = () => {
    if (selectedRow) {
      const _id = selectedRow._id;
      branchAPI.deleteBranch(_id).then((r) => {
        if (r.status === 200) {
          dispatch(setBranches(rows.filter((it) => it._id !== r.data._id)));
          dispatch(
            setSnackbar({
              color: "success",
              icon: "check",
              title: "",
              content: t("Deleted Successfully!"),
              open: true,
            })
          );
          navigate("/branches");
        }
      });
    }
  };

  const handleSelectRow = (row) => {
    setSelectedRow(row);
  };

  const getBranchListQuery = (keyword, signedInUser) => {
    return keyword ? { keyword } : null;
  };

  const loadBranches = (keyword, signedInUser) => {
    const query = getBranchListQuery(keyword, signedInUser);
    branchAPI.fetchBranches(query).then((r) => {
      if (r.status == 200) {
        dispatch(setBranches(r.data));
      } else if (r.status === 401) {
        dispatch(setSignedInUser());
        logout();
      }
    });
  };

  const fetchBranchesDelay = debounce(loadBranches, 500);

  useEffect(() => {
    if (signedInUser) {
      fetchBranchesDelay(keyword, signedInUser);
    }
  }, [signedInUser, keyword]);

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox pt={1} pb={3}>
        <Grid container spacing={6}>
          <Grid item xs={12}>
            <Card>
              <CardHead title={t("Branches")} />
              <Grid item xs={12} px={2} py={2}>
                <Grid container spacing={2} direction="row" justifyContent="flex-end">
                  <Grid item>
                    <MDButton color="info" size="small" variant={"outlined"} onClick={handleEdit}>
                      {t("Edit")}
                    </MDButton>
                  </Grid>
                  <Grid item>
                    <MDButton color="info" size="small" variant={"outlined"} onClick={handleCreate}>
                      {t("Create")}
                    </MDButton>
                  </Grid>
                  <Grid item>
                    <MDButton color="info" size="small" variant={"outlined"} onClick={handleDelete}>
                      {t("Delete")}
                    </MDButton>
                  </Grid>
                </Grid>
              </Grid>
              <MDBox pt={0} px={2}>
                {/* <DataTable
                    table={{ columns, rows }}
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
                    data={rows}
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
      <MDSnackbar
        {...snackbar}
        icon="check"
        title=""
        datetime=""
        autoHideDuration={3000}
        close={() => dispatch(setSnackbar({ ...snackbar, open: false }))}
        onClose={() => dispatch(setSnackbar({ ...snackbar, open: false }))}
      />
      <Footer />
    </DashboardLayout>
  );
}
