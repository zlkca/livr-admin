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
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { selectAccounts } from "redux/account/account.selector";
import { fetchAccounts } from "redux/account/account.thunk";
import { useEffect } from "react";
import { selectRoles } from "redux/role/role.selector";

// Data

function PartnerList() {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  //   const columns = [
  //     { Header: "author", accessor: "author", width: "45%", align: "left" },
  //     { Header: "function", accessor: "function", align: "left" },
  //     { Header: "status", accessor: "status", align: "center" },
  //     { Header: "employed", accessor: "employed", align: "center" },
  //     { Header: "action", accessor: "action", align: "center" },
  //   ];

  const columns = [
    { headerName: t("Username"), field: "username", maxWidth: 200, flex: 1 },
    { headerName: t("Email"), field: "email", maxWidth: 320, flex: 1.5 },
    { headerName: t("Phone"), field: "phone", maxWidth: 200, flex: 1 },
    // { headerName: t("Status"), field: "status", maxWidth: 150 },
    { headerName: t("Created Date"), field: "created", maxWidth: 200, flex: 1 },
    // {
    //     headerName: t("Actions"),
    //     field: "_id",
    //     maxWidth: 180,
    //     flex: 1,
    //     renderCell: (params) => {
    //         return (
    //             <ButtonWidget
    //                 size="small"
    //                 onClick={() => {
    //                     handleFetchProfile(params.row._id);
    //                 }}
    //             >
    //                 {t("View Details")}
    //             </ButtonWidget>
    //         );
    //     },
    // },
  ];

  //   const [rows, setRows] = [];
  const handleSelectRow = () => {};

  const rows = useSelector(selectAccounts);
  const roles = useSelector(selectRoles);

  const handleFetchAccounts = (query) => {
    dispatch(fetchAccounts(query))
      .unwrap()
      .then((originalPromiseResult) => {})
      .catch((rejectedValueOrSerializedError) => {});
  };

  useEffect(() => {
    if (roles) {
      const role = roles.find((it) => it.name === "partner");
      if (role) {
        handleFetchAccounts({ roleId: role._id });
      }
    }
  }, [roles]);

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox pt={3} pb={3}>
        <Grid container spacing={6}>
          <Grid item xs={12}>
            <Card>
              <MDBox
                mx={2}
                mt={-3}
                py={3}
                px={2}
                variant="gradient"
                bgColor="info"
                borderRadius="lg"
                coloredShadow="info"
              >
                <MDTypography variant="h6" color="white">
                  {t("Partners")}
                </MDTypography>
              </MDBox>
              <MDBox pt={3}>
                {/* <DataTable
                  table={{ columns, rows }}
                  isSorted={false}
                  entriesPerPage={false}
                  showTotalEntries={false}
                  noEndBorder
                /> */}
                {rows && (
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
      <Footer />
    </DashboardLayout>
  );
}

export default PartnerList;
