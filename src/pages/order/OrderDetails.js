import { Card, Grid } from "@mui/material";
import CardHead from "components/CardHead";
import MDBox from "components/MDBox";
import MDButton from "components/MDButton";
import MDLinearProgress from "components/MDLinearProgress";
import MDSection from "components/MDSection";
import MDSnackbar from "components/MDSnackbar";
import VField from "components/VField";

import GridTable from "components/common/GridTable";
import DashboardLayout from "layouts/DashboardLayout";
import DashboardNavbar from "layouts/DashboardNavbar";
import Footer from "layouts/Footer";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { selectSignedInUser } from "redux/auth/auth.selector";
import { setSignedInUser } from "redux/auth/auth.slice";
import { selectOrder } from "redux/order/order.selector";
import { setOrder } from "redux/order/order.slice";
import { selectPayments } from "redux/payment/payment.selector";
import { setPayments } from "redux/payment/payment.slice";
import { setPayment } from "redux/payment/payment.slice";
import { selectSnackbar } from "redux/ui/ui.selector";
import { setSnackbar } from "redux/ui/ui.slice";
import { orderAPI } from "services/orderAPI";
import { paymentAPI } from "services/paymentAPI";
import { isAdmin } from "permission";
import { logout } from "utils";

export default function OrderDetails() {
  const order = useSelector(selectOrder);
  const signedInUser = useSelector(selectSignedInUser);
  const snackbar = useSelector(selectSnackbar);
  const payments = useSelector(selectPayments);

  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isLoading, setLoading] = useState();
  const [paid, setPaid] = useState(0);
  const [selectedPayment, setSelectedPayment] = useState();

  const handleSelectPayment = (row) => {
    setSelectedPayment(row);
  };

  const columns = [
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
  ];

  const handleEdit = () => {
    if (order) {
      const _id = order._id;
      orderAPI.fetchOrder(_id).then((r) => {
        if (r.status === 200) {
          dispatch(setOrder(r.data));
          navigate(`/orders/${_id}/form`);
        }
      });
    }
  };

  const handleDelete = () => {
    if (order) {
      const _id = order._id;
      orderAPI.deleteOrder(_id).then((r) => {
        if (r.status === 200) {
          dispatch(
            setSnackbar({
              color: "success",
              icon: "check",
              title: "",
              content: "Deleted Successfully!",
              open: true,
            })
          );
          navigate("/orders");
        }
      });
    }
  };

  const handleAddPayment = () => {
    dispatch(
      setPayment({
        id: order.id,
        project: { _id: order.project._id },
        branch: order.branch,
        client: order.client,
        sales: order.sales,
        creator: signedInUser,
        balance: parseFloat(paid) - parseFloat(order.amount),
      })
    );
    navigate("/payments/new/form");
  };

  useEffect(() => {
    if (order && order.id) {
      paymentAPI.searchPayments({ id: order.id }).then((r) => {
        if (r.status == 200) {
          if (r.data.length) {
            let total = 0;
            for (let i = 0; i < r.data.length; i++) {
              total += parseFloat(r.data[i].amount);
            }
            setPaid(total);
          }
          dispatch(setPayments(r.data));
        } else if (r.status === 401) {
          dispatch(setSignedInUser());
          logout();
        }
      });
    }
  }, []);

  const handleDeletePayment = () => {
    if (selectedPayment) {
      const _id = selectedPayment._id;
      paymentAPI.deletePayment(_id).then((r) => {
        if (r.status === 200) {
          dispatch(setPayments(payments.filter((it) => it._id !== r.data._id)));
          dispatch(
            setSnackbar({
              color: "success",
              icon: "check",
              title: "",
              content: t(t("Deleted Successfully!")),
              open: true,
            })
          );
        }
      });
    }
  };

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox pt={1} pb={3}>
        <Grid container spacing={6}>
          <Grid item xs={12}>
            {order && (
              <Card>
                <CardHead title={t("Order")} />
                <Grid container spacing={2} direction="row" justifyContent="flex-end" px={2} pt={2}>
                  {isAdmin(signedInUser) && (
                    <Grid item>
                      <MDButton color="info" size="small" variant={"outlined"} onClick={handleEdit}>
                        {t("Edit")}
                      </MDButton>
                    </Grid>
                  )}
                  {isAdmin(signedInUser) && (
                    <Grid item>
                      <MDButton
                        color="info"
                        size="small"
                        variant={"outlined"}
                        onClick={handleDelete}
                      >
                        {t("Delete")}
                      </MDButton>
                    </Grid>
                  )}
                </Grid>

                <MDSection title={t("Orders")}>
                  <Grid display="flex">
                    <VField label={t("ID")} value={order.id} />
                    <VField label={t("pre-tax Total")} value={order.amount} />
                    <VField label={t("Deposit Receivable")} value={order.deposit} />
                    <VField label={t("Tax")} value={order.taxOpt} />
                    <VField label={t("Balance")} value={order.balance} />
                    <VField label={t("Date")} value={order.created} />
                  </Grid>
                </MDSection>

                <MDSection title={t("Client")}>
                  <Grid display="flex">
                    <VField label={t("Username")} value={order.client.username} />
                    <VField label={t("Email")} value={order.client.email} />
                    <VField label={t("Phone")} value={order.client.phone} />
                    {/* <VField label={t("Address")} value={order.displayAddress} /> */}
                  </Grid>
                </MDSection>

                <MDSection title={t("Sales")}>
                  <Grid display="flex">
                    <VField label={t("Username")} value={order.sales.username} />
                    <VField label={t("Email")} value={order.sales.email} />
                    <VField label={t("Phone")} value={order.sales.phone} />
                  </Grid>
                </MDSection>

                <MDSection title={t("Payment")}>
                  <MDBox pt={0} px={0}>
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
                      <Grid>
                        <Grid container spacing={2} direction="row" justifyContent="flex-end">
                          <Grid item pb={1}>
                            <MDButton
                              color="info"
                              size="small"
                              variant={"outlined"}
                              onClick={handleAddPayment}
                            >
                              {t("Add Payment")}
                            </MDButton>
                          </Grid>
                          {isAdmin(signedInUser) && (
                            <Grid item pb={1}>
                              <MDButton
                                color="info"
                                size="small"
                                variant={"outlined"}
                                onClick={handleDeletePayment}
                              >
                                {t("Delete Payment")}
                              </MDButton>
                            </Grid>
                          )}
                        </Grid>

                        <GridTable
                          data={payments}
                          columns={columns}
                          onRowClick={handleSelectPayment}
                          rowsPerPage={15}
                          sortModel={[{ field: "created", sort: "desc" }]}
                        />
                      </Grid>
                    )}
                  </MDBox>
                </MDSection>

                <Grid display="flex" justifyContent="flex-end" xs={12} px={2} py={2}>
                  <MDButton variant="outlined" color="secondary" onClick={() => navigate(-1)}>
                    {t("Back")}
                  </MDButton>
                </Grid>
              </Card>
            )}
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
