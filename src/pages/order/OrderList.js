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
import MDTypography from "components/MDTypography";
import GridTable from "components/common/GridTable";
import MDButton from "components/MDButton";
import ActionBar from "components/common/ActionBar";

// Material Dashboard 2 React example components
import DashboardLayout from "layouts/DashboardLayout";
import DashboardNavbar from "layouts/DashboardNavbar";
import Footer from "layouts/Footer";

import { selectAccounts } from "redux/account/account.selector";
import { fetchAccounts } from "redux/account/account.thunk";
import { selectAccountHttpStatus } from "redux/account/account.selector";
import { fetchAccount } from "redux/account/account.thunk";
import { setClient } from "redux/account/account.slice";

import { orderAPI } from "services/orderAPI";
import { selectSignedInUser } from "redux/auth/auth.selector";
import { debounce, isAdmin, isDrawingEngineer, getAddressString } from "utils";
import { selectOrders } from "redux/order/order.selector";
import { setOrders } from "redux/order/order.slice";
import { setOrder } from "redux/order/order.slice";
import MDLinearProgress from "components/MDLinearProgress";
import { setSignedInUser } from "redux/auth/auth.slice";
import { logout } from "utils";
import { setSnackbar } from "redux/ui/ui.slice";
import MDSnackbar from "components/MDSnackbar";
import { selectSnackbar } from "redux/ui/ui.selector";
import CardHead from "components/CardHead";
import exportToExcel from "export/exportToExcel";
import { gridFilteredSortedRowEntriesSelector, useGridApiRef } from "@mui/x-data-grid";
import MDSection from "components/MDSection";
import VField from "components/VField";
import { numToString } from "utils";
import { calcSummary } from "utils";
// Data

export default function OrderList() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const gridApiRef = useGridApiRef();

  const [selectedRow, setSelectedRow] = useState();
  const [keyword, setKeyword] = useState("");
  const [isLoading, setLoading] = useState();

  const status = useSelector(selectAccountHttpStatus);
  const orders = useSelector(selectOrders);
  const signedInUser = useSelector(selectSignedInUser);
  const snackbar = useSelector(selectSnackbar);
  const [summary, setSummary] = useState([]);

  const handleFilterModelChange = (newFilterModel) => {
    const filteredRows = gridFilteredSortedRowEntriesSelector(gridApiRef);
    setSummary(calcSummary(filteredRows));
  };
  //   setFilterModel(newFilterModel);
  //   // Get the IDs of the orders that passed the filtering
  //   const filteredRowIds = newFilterModel.orders.map((row) => row.id);

  //   // Assuming you have access to your original data source
  //   // Filter the original data to get the orders that passed the filtering
  //   const filteredRowsData = orders.filter((row) => filteredRowIds.includes(row.id));

  //   // Update the state to store the filtered orders
  //   setFilteredRows(filteredRowsData);
  // };

  const columns = [
    {
      headerName: t("ID"),
      field: "id",
      width: 120,
      flex: 2,
    },
    {
      headerName: t("Branch"),
      field: "branch",
      width: 180,
      flex: 2,
      valueGetter: (params) => (params.row?.branch ? params.row?.branch.name : t("Unassigned")),
    },
    // {
    //   headerName: t("Address"),
    //   field: "address",
    //   width: 380,
    //   flex: 3,
    //   valueGetter: (params) =>
    //     params.row?.address ? getAddressString(params.row?.address) : t("Unassigned"),
    // },
    {
      headerName: t("Sales"),
      field: "sales",
      width: 150,
      flex: 1,
      valueGetter: (params) => (params.row?.sales ? params.row?.sales.username : t("Unassigned")),
    },
    {
      headerName: t("Client"),
      field: "client",
      width: 150,
      flex: 1,
      valueGetter: (params) => (params.row?.client ? params.row?.client.username : t("Unknown")),
    },
    {
      headerName: t("Amount"),
      field: "amount",
      width: 80,
      flex: 1,
    },
    {
      headerName: t("Deposit"),
      field: "deposit",
      width: 80,
      flex: 1,
    },
    {
      headerName: t("Tax Option"),
      field: "taxOpt",
      width: 80,
      flex: 1,
    },
    {
      headerName: t("Balance"),
      field: "balance",
      width: 80,
      flex: 1,
    },
    { headerName: t("Created Date"), field: "created", width: 190, flex: 2 },
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
              dispatch(setOrder(params.row));
              const orderId = params.row._id;
              navigate(`/orders/${orderId}`);
            }}
          >
            {t("View Details")}
          </MDButton>
        );
      },
    },
  ];

  const handleCreate = () => {
    dispatch(setOrder({ address: {} }));
    navigate("/orders/new/form");
  };

  const handleEdit = () => {
    if (selectedRow) {
      const _id = selectedRow._id;
      const row = orders.find((it) => it._id === _id);
      dispatch(setOrder(row));
      navigate(`/orders/${_id}/form`);
    }
  };

  const handleExport = () => {
    const dataToExport = gridFilteredSortedRowEntriesSelector(gridApiRef);
    const dataList = dataToExport.map((it) => ({
      id: it.id,
      branch: it.branch?.name,
      sales: it.sales?.username,
      client: it.client?.username,
      amount: it.amount,
      deposit: it.deposit,
      taxOpt: it.taxOpt,
      created: it.created,
    }));
    exportToExcel(dataList, `shutterlux-orders-${new Date().toISOString()}.xlsx`);
  };

  const handleSelectRow = (row) => {
    setSelectedRow(row);
  };

  const getOrderListQuery = (keyword, signedInUser) => {
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

  useEffect(() => {
    if (signedInUser) {
      setLoading(true);
      const q = isAdmin(signedInUser) ? {} : { "sales._id": signedInUser._id };

      orderAPI.searchOrders(q).then((r) => {
        if (r.status == 200) {
          dispatch(setOrders(r.data));
          setSummary(calcSummary(r.data));
          setLoading(false);
        } else if (r.status === 401) {
          dispatch(setSignedInUser());
          logout();
        }
      });
    }
  }, [signedInUser]);

  const handleSearch = (keyword) => {
    if (signedInUser) {
      loadOrders(keyword, signedInUser);
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
      loadOrders(keyword, signedInUser);
    }
  };

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox pt={1} pb={3}>
        <Grid container spacing={6}>
          <Grid item xs={12}>
            <Card>
              <CardHead title={t("Orders")}>
                <Grid container spacing={2} direction="row" justifyContent="flex-end">
                  {isAdmin(signedInUser) && (
                    <Grid item>
                      <MDButton size="small" variant={"outlined"} onClick={handleEdit}>
                        {t("Edit")}
                      </MDButton>
                    </Grid>
                  )}
                  <Grid item>
                    <MDButton size="small" variant={"outlined"} onClick={handleCreate}>
                      {t("Create")}
                    </MDButton>
                  </Grid>
                  <Grid item>
                    <MDButton size="small" variant={"outlined"} onClick={handleExport}>
                      {t("Export")}
                    </MDButton>
                  </Grid>
                </Grid>
              </CardHead>
              <MDBox pt={0} px={2} style={{ height: 740 }}>
                {/* <DataTable
                    table={{ columns, orders }}
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
                  <Grid container>
                    <Grid item xs={12} style={{ height: 540 }}>
                      <GridTable
                        autoPageSize
                        apiRef={gridApiRef}
                        data={orders}
                        columns={columns}
                        onRowClick={handleSelectRow}
                        rowsPerPage={10}
                        onFilterModelChange={handleFilterModelChange}
                        sortModel={[{ field: "created", sort: "desc" }]}
                      />
                    </Grid>
                    {summary && (
                      <Grid item xs={12}>
                        <MDSection
                          title={t("Summary")}
                          styles={{ root: { paddingLeft: 0, paddingRight: 0 } }}
                        >
                          <Grid display="flex">
                            <VField label={t("Amount")} value={numToString(summary.total)} />
                            <VField label={t("Received")} value={numToString(summary.received)} />
                            <VField
                              label={t("Receivable")}
                              value={numToString(summary.receivable)}
                            />
                          </Grid>
                        </MDSection>
                      </Grid>
                    )}
                  </Grid>
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
}
