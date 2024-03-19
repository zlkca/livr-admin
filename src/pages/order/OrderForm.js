import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";

import MDBox from "components/MDBox";
import DashboardLayout from "layouts/DashboardLayout";
import DashboardNavbar from "layouts/DashboardNavbar";
import { Card, Checkbox, Dialog, FormControlLabel, FormGroup, Grid } from "@mui/material";
import Footer from "layouts/Footer";
import { selectSignedInUser } from "redux/auth/auth.selector";
import MDButton from "components/MDButton";
import MDSnackbar from "components/MDSnackbar";
import MDInput from "components/MDInput";
import { orderAPI } from "services/orderAPI";
import { selectOrder } from "redux/order/order.selector";
import { setOrder } from "redux/order/order.slice";
import ProjectSelectBackdrop from "components/project/ProjectSelectBackdrop";
import { projectAPI } from "services/projectAPI";
import MDSelect from "components/MDSelect";
import { setSnackbar } from "redux/ui/ui.slice";
import { selectDialog } from "redux/ui/ui.selector";
import DialogWidget from "components/common/Dialog";
import { setDialog } from "redux/ui/ui.slice";
import MDSection from "components/MDSection";
import CardHead from "components/CardHead";

const mStyles = {
  root: {
    width: "100%",
  },
  formControl: {
    width: "100%",
    marginBottom: 15,
  },
  row: {
    width: "100%",
    display: "flex",
    justifyContent: "start",
    marginTop: 20,
  },
  col: {
    width: "33%",
    float: "left",
    paddingBottom: 15,
  },
  card: {
    // root: { width: theme.card.width },
  },
  buttonRow: {
    // width: theme.card.width,
    flex: "0 0 100%",
    paddingRight: 10,
  },
  error: {
    color: "red",
    textAlign: "left",
    paddingTop: -8,
    fontSize: 12,
  },
};

export default function OrderForm() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const params = useParams();

  const taxOptions = [
    { id: "include", label: t("Include Tax"), value: "include" },
    { id: "exclude", label: t("Exclude Tax"), value: "exclude" },
  ];

  const methodOptions = [
    { id: "Cash", label: t("Cash") },
    { id: "Cheque", label: t("Cheque") },
    { id: "e-Transfer", label: t("e-Transfer") },
    { id: "Credit Card", label: t("Credit Card") },
    { id: "Debit Card", label: t("Debit Card") },
  ];

  // const [submitButtonDisabled, setSubmitButtonDisabled] = useState(false);
  const [error, setError] = useState({});
  const [backdrop, setBackdrop] = useState({ opened: false });

  const [data, setData] = useState({
    address: {
      unitNumber: "",
      streetNumber: "",
      streetName: "",
      city: "",
      province: "",
      country: "",
      postcode: "",
    },
    depositPaid: false,
  });

  const [projects, setProjects] = useState([]);
  const signedInUser = useSelector(selectSignedInUser);
  const order = useSelector(selectOrder);

  //   const breadcrumb = useSelector(selectBreadcrumb);
  useEffect(() => {
    if (order) {
      setData({ ...order, depositPaid: false });
    } else {
      if (params && params.id && params.id !== "new") {
        // refetch if page refreshed
        orderAPI.fetchOrder(params.id).then((r) => {
          if (r.status === 200) {
            setData({ ...r.data, depositPaid: false });
          }
        });
      }
    }
  }, []);

  const handleSubmit = () => {
    const d = {
      ...data,
    };
    if (d._id) {
      orderAPI.updateOrder(d._id, d).then((r) => {
        if (r.status === 200) {
          dispatch(setOrder(r.data));
          dispatch(
            setSnackbar({
              color: "success",
              icon: "check",
              title: "",
              content: t("Updated Successfully!"),
              open: true,
            })
          );
          navigate(-1);
        }
      });
    } else {
      orderAPI
        .createOrder({
          ...d,
          creator: {
            _id: signedInUser._id,
            username: signedInUser.username,
          },
        })
        .then((r) => {
          if (r.status === 200) {
            dispatch(setOrder(r.data));
            dispatch(
              setSnackbar({
                color: "success",
                icon: "check",
                title: "",
                content: t("Created Successfully!"),
                open: true,
              })
            );
            navigate(-1);
          }
        });
    }
  };

  const handleAmountChange = (event) => {
    const amount = event.target.value === "" ? "" : parseFloat(event.target.value); // new amount
    const a = { ...data, amount };
    setData(a);

    setError({ ...error, amount: "" });
  };

  const handleDepositChange = (event) => {
    const deposit = event.target.value === "" ? "" : parseFloat(event.target.value); // new amount
    const a = { ...data, deposit };
    setData(a);

    setError({ ...error, deposit: "" });
  };

  const handleTaxOptChange = (event) => {
    const taxOpt = event.target.value;
    const a = { ...data, taxOpt };
    setData(a);
    setError({ ...error, taxOpt: "" });
  };

  const handleNotesChange = (event) => {
    const a = { ...data, notes: event.target.value };
    setData(a);
  };

  const handleSelectProject = (project) => {
    if (data._id) {
      if (project) {
        setData({
          ...data,
          id: project.id,
          project: { _id: project._id },
          address: project.address,
          branch: project.branch,
          client: project.client,
          sales: project.sales,
        });
        setError({ ...error, project: "" });
      }
    } else {
      orderAPI.searchOrders({ id: project.id }).then((r) => {
        if (r && r.data && r.data.length) {
          setError({ project: "The Project already has the order, please select other project" });
        } else {
          if (project) {
            setData({
              ...data,
              id: project.id,
              project: { _id: project._id },
              address: project.address,
              branch: project.branch,
              client: project.client,
              sales: project.sales,
            });
            setError({ ...error, project: "" });
          }
        }
      });
    }
  };

  const handleOpenBackdrop = () => {
    projectAPI.fetchProjects().then((r) => {
      setProjects(r.data);
      const p = data.project ? r.data.find((it) => it._id === data.project._id) : null;
      setBackdrop({ opened: true, project: p });
    });
  };

  const dialog = useSelector(selectDialog);
  const dialogButtons = [
    { label: t("Cancel"), onClick: () => dispatch(setDialog({ open: false })) },
    {
      label: t("Submit"),
      onClick: () => {
        handleSubmit();
        dispatch(setDialog({ open: false }));
      },
    },
  ];

  const handleDepositPaidCheckboxChange = () => {
    const newV = !data.depositPaid;
    if (newV) {
      setData({
        ...data,
        depositPaid: newV,
        payment: {
          type: "Deposit",
          amount: parseFloat(data.deposit),
        },
      });
    } else {
      delete data.payment;
      setData({
        ...data,
        depositPaid: false,
      });
    }
  };

  const handlePaymentMethodChange = (event) => {
    setData({
      ...data,
      payment: {
        ...data.payment,
        method: event.target.value,
      },
    });
    setError({});
  };

  const handlePaymentNotesChange = (event) => {
    setData({
      ...data,
      payment: {
        ...data.payment,
        notes: event.target.value,
      },
    });
  };

  const handleOpenConfirmDialog = () => {
    if (error.project) {
      return;
    }
    if (!data._id && !data.id) {
      setError({ project: "Please select a project" });
      return;
    }
    if (!data.client) {
      setError({ client: "Please select a client" });
      return;
    }
    if (!data.sales) {
      setError({ sales: "Please select a sales" });
      return;
    }
    if (!data.amount) {
      setError({ amount: "Please input amount" });
      return;
    }
    if (!data.deposit) {
      setError({ deposit: "Please input deposit" });
      return;
    }
    if (!data.taxOpt) {
      setError({ taxOpt: "Please select tax option" });
      return;
    }
    if (data.depositPaid) {
      if (!data.payment.method) {
        setError({ paymentMethod: "Please select payment method for deposit" });
        return;
      }
    }
    dispatch(setDialog({ open: true }));
  };

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox pt={1} pb={3}>
        <Grid container spacing={6}>
          <Grid item xs={12}>
            {data && (
              <Card>
                <CardHead title={data._id ? t("Edit Order") : t("Create Order")} />

                <MDSection title={t("Basic Info")}>
                  <Grid container spacing={2} style={{ marginTop: 15 }}>
                    <Grid item xs={3}>
                      <MDInput
                        name="project"
                        label={t("Order #")}
                        value={data && data.id ? data.id : ""}
                        onClick={() => handleOpenBackdrop()}
                        helperText={error && error.project ? error.project : ""}
                      />
                    </Grid>
                  </Grid>

                  <Grid container spacing={2} style={{ marginTop: 15 }}>
                    <Grid item xs={3}>
                      <MDInput
                        readOnly
                        label={t("Branch")}
                        value={data.branch ? data.branch.name : ""}
                      />
                    </Grid>
                    <Grid item xs={3}>
                      <MDInput
                        readOnly
                        label={t("Sales")}
                        value={data.sales ? data.sales.username : ""}
                      />
                    </Grid>
                    <Grid item xs={3}>
                      <MDInput
                        readOnly
                        label={t("Client")}
                        value={data.client ? data.client.username : ""}
                      />
                    </Grid>
                  </Grid>
                  <Grid container spacing={2} style={{ marginTop: 15 }}>
                    <Grid item xs={3}>
                      <MDInput
                        name="amount"
                        label={t("pre-tax Total")}
                        value={data.amount}
                        onChange={handleAmountChange}
                        helperText={error && error.amount ? error.amount : ""}
                      />
                    </Grid>
                    <Grid item xs={3}>
                      {data && (
                        <MDSelect
                          name="taxOpt"
                          label={t("Tax Option")}
                          value={data.taxOpt ? data.taxOpt : ""} // controlled
                          options={taxOptions}
                          onChange={handleTaxOptChange} // (event, child) => { }
                        />
                      )}
                      {error && error.taxOpt && <div style={mStyles.error}>{error.taxOpt}</div>}
                    </Grid>
                  </Grid>
                  <Grid item xs={12} sm={10} md={10} lg={8} xl={8}>
                    <div style={mStyles.row}>
                      <MDInput
                        name="notes"
                        label={t("Notes")}
                        value={data ? data.notes : ""} // controlled
                        onChange={handleNotesChange}
                        maxRows={5}
                        minRows={5}
                        multiline
                      />
                    </div>
                  </Grid>
                </MDSection>
                <MDSection title={t("Deposit")}>
                  <Grid container spacing={2} style={{ marginTop: 15 }}>
                    <Grid item xs={3}>
                      <MDInput
                        name="deposit"
                        label={t("Deposit")}
                        value={data.deposit}
                        onChange={handleDepositChange}
                        helperText={error && error.deposit ? error.deposit : ""}
                      />
                    </Grid>
                    {data && !data._id && (
                      <Grid item xs={3}>
                        <FormGroup>
                          <FormControlLabel
                            control={
                              <Checkbox
                                checked={data.depositPaid}
                                onChange={handleDepositPaidCheckboxChange}
                                inputProps={{ "aria-label": "controlled" }}
                              />
                            }
                            label={t("Received Deposit")}
                          />
                        </FormGroup>
                      </Grid>
                    )}
                  </Grid>
                  {data && data.depositPaid && (
                    <Grid container spacing={2} style={{ marginTop: 15 }}>
                      <Grid item xs={3}>
                        <MDSelect
                          name="paymentMethod"
                          label={t("Method")}
                          value={data.payment ? data.payment.method : ""} // controlled
                          options={methodOptions}
                          onChange={handlePaymentMethodChange} // (event, child) => { }
                        />
                        {error && error.paymentMethod && (
                          <div style={mStyles.error}>{error.paymentMethod}</div>
                        )}
                      </Grid>
                    </Grid>
                  )}
                  {data && data.depositPaid && (
                    <Grid item xs={12} sm={10} md={10} lg={8} xl={8}>
                      <div style={mStyles.row}>
                        <MDInput
                          name="paymentNotes"
                          label={t("Notes")}
                          value={data.payment ? data.paymentNotes : ""} // controlled
                          onChange={handlePaymentNotesChange}
                          maxRows={5}
                          minRows={5}
                          multiline
                        />
                      </div>
                    </Grid>
                  )}
                </MDSection>

                <Grid item display="flex" justifyContent="flex-end" xs={12} px={2} py={2}>
                  <MDButton
                    color="secondary"
                    variant="outlined"
                    style={{ marginRight: 20 + "px" }}
                    onClick={() => navigate(-1)}
                  >
                    {t("Cancel")}
                  </MDButton>
                  <MDButton variant="gradient" color="info" onClick={handleOpenConfirmDialog}>
                    {t("Submit")}
                  </MDButton>
                </Grid>
              </Card>
            )}
          </Grid>
        </Grid>
      </MDBox>

      <ProjectSelectBackdrop
        projects={projects}
        open={backdrop.opened}
        selected={backdrop.project}
        onCancel={() => {
          setBackdrop({ opened: false });
        }}
        onChoose={handleSelectProject}
      />

      <DialogWidget
        open={dialog && dialog.open}
        title={t("Create Order")}
        buttons={dialogButtons}
        onClose={() => dispatch(setDialog({ open: false }))}
      >
        <div style={{ paddingTop: 10 }}>
          {t("Once submit, only Admin can modify, do you want to proceed ?")}
        </div>
      </DialogWidget>
      <Footer />
    </DashboardLayout>
  );
}
