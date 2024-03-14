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
import { selectAccountHttpStatus } from "redux/account/account.selector";

import { paymentAPI } from "services/paymentAPI";
import { selectSignedInUser } from "redux/auth/auth.selector";
import { debounce } from "utils";
import { selectPayments } from "redux/payment/payment.selector";
import { setPayments } from "redux/payment/payment.slice";
import { setPayment } from "redux/payment/payment.slice";
import MDSnackbar from "components/MDSnackbar";
import MDLinearProgress from "components/MDLinearProgress";
import { setSignedInUser } from "redux/auth/auth.slice";
import { logout } from "utils";
import { selectSnackbar } from "redux/ui/ui.selector";
import { setSnackbar } from "redux/ui/ui.slice";
import { isAdmin } from "utils";

export default function PaymentList() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const [selectedRow, setSelectedRow] = useState();
  const [keyword, setKeyword] = useState("");
  const [isLoading, setLoading] = useState();

  const status = useSelector(selectAccountHttpStatus);
  const rows = useSelector(selectPayments);
  const signedInUser = useSelector(selectSignedInUser);
  const snackbar = useSelector(selectSnackbar);

  const columns = [
    {
      headerName: t("Order #"),
      field: "id",
      maxWidth: 180,
      flex: 1,
    },
    {
      headerName: t("Branch"),
      field: "branch",
      maxWidth: 180,
      flex: 1,
      valueGetter: (params) =>
        params.row?.branch && params.row?.branch ? params.row?.branch.name : t("Unassigned"),
    },
    {
      headerName: t("Client"),
      field: "client",
      maxWidth: 180,
      flex: 1,
      valueGetter: (params) => (params.row?.client ? params.row?.client.username : t("Unknown")),
    },
    {
      headerName: t("Sales"),
      field: "sales",
      maxWidth: 180,
      flex: 1,
      valueGetter: (params) => (params.row?.sales ? params.row?.sales.username : t("Unassigned")),
    },
    {
      headerName: t("Amount"),
      field: "amount",
      maxWidth: 180,
      flex: 1,
      valueGetter: (params) => (params.row?.amount ? params.row?.amount : t("Unknown")),
    },
    { headerName: t("Type"), field: "type", maxWidth: 180, flex: 1 },
    { headerName: t("Method"), field: "method", maxWidth: 180, flex: 1 },
    { headerName: t("Created Date"), field: "created", maxWidth: 200, flex: 2 },
    {
      headerName: t("Actions"),
      field: "_id",
      width: 200,
      flex: 1,
      renderCell: (params) => {
        return (
          <MDButton
            size="small"
            color="info"
            onClick={() => {
              dispatch(setPayment(params.row));
              navigate(`/payments/${params.row._id}`);
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
      paymentAPI.fetchPayment(_id).then((r) => {
        if (r.status === 200) {
          dispatch(setPayment(r.data));
          navigate(`/payments/${_id}/form`);
        }
      });
    }
  };
  const handleDelete = () => {
    if (selectedRow) {
      const _id = selectedRow._id;
      paymentAPI.deletePayment(_id).then((r) => {
        if (r.status === 200) {
          dispatch(setPayments(rows.filter((it) => it._id !== r.data._id)));
          dispatch(
            setSnackbar({
              color: "success",
              icon: "check",
              title: "",
              content: t("Deleted Successfully!"),
              open: true,
            })
          );
        }
      });
    }
  };
  const handleCreate = () => {
    dispatch(setPayment({ address: {} }));
    navigate("/payments/new/form");
  };
  //   const [rows, setRows] = [];
  const handleSelectRow = (row) => {
    setSelectedRow(row);
  };

  const getPaymentListQuery = (keyword, signedInUser) => {
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

  const loadPayments = (keyword, signedInUser) => {
    // const query = getPaymentListQuery(keyword, signedInUser);
  };

  // const fetchPaymentsDelay = debounce(loadPayments, 500);

  useEffect(() => {
    if (signedInUser) {
      // fetchPaymentsDelay(keyword, signedInUser);
      const q = isAdmin(signedInUser) ? {} : { "sales._id": signedInUser._id };
      setLoading(true);
      paymentAPI.searchPayments(q).then((r) => {
        if (r.status == 200) {
          dispatch(setPayments(r.data));
          setTimeout(() => {
            setLoading(false);
          }, 500);
        } else if (r.status === 401) {
          dispatch(setSignedInUser());
          logout();
        }
      });
    }
  }, [signedInUser]);

  // const handleSearch = (keyword) => {
  //   if (signedInUser) {
  //     loadPayments(keyword, signedInUser);
  //   }
  // };

  const handleClearSearch = () => {
    setKeyword();
  };

  const handleKeywordChange = (v) => {
    setKeyword(v);
  };

  // const handleRefresh = () => {
  //   if (signedInUser) {
  //     loadPayments(keyword, signedInUser);
  //   }
  // };

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox pt={1} pb={3}>
        <Grid container spacing={6}>
          <Grid item xs={12}>
            <Card>
              <MDBox
                mx={2}
                mt={-3}
                py={3}
                px={2}
                variant="contained"
                bgColor="secondary"
                borderRadius="lg"
                coloredShadow="none"
              >
                <MDTypography variant="h6" color="white">
                  {t("Payments")}
                </MDTypography>
                <Grid container spacing={2} direction="row" justifyContent="flex-end">
                  {isAdmin(signedInUser) && (
                    <Grid item>
                      <MDButton variant={"outlined"} size="small" onClick={handleEdit}>
                        {t("Edit")}
                      </MDButton>
                    </Grid>
                  )}
                  {isAdmin(signedInUser) && (
                    <Grid item>
                      <MDButton variant={"outlined"} size="small" onClick={handleDelete}>
                        {t("Delete")}
                      </MDButton>
                    </Grid>
                  )}
                  <Grid item>
                    <MDButton size="small" variant={"outlined"} onClick={handleCreate}>
                      {t("Create")}
                    </MDButton>
                  </Grid>
                </Grid>
              </MDBox>
              <MDBox pt={0} px={2}>
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
