import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Card, Grid } from "@mui/material";

import MDBox from "components/MDBox";
import MDButton from "components/MDButton";
import MDSelect from "components/MDSelect";
import MDInput from "components/MDInput";
import MDSnackbar from "components/MDSnackbar";
import DashboardLayout from "layouts/DashboardLayout";
import DashboardNavbar from "layouts/DashboardNavbar";
import Footer from "layouts/Footer";

import { setPayment } from "redux/payment/payment.slice";
import { selectSignedInUser } from "redux/auth/auth.selector";
import { paymentAPI } from "services/paymentAPI";
import { selectPayment } from "redux/payment/payment.selector";
import { projectAPI } from "services/projectAPI";
import { setSnackbar } from "redux/ui/ui.slice";
import { selectOrder } from "redux/order/order.selector";
import CardHead from "components/CardHead";
import MDSection from "components/MDSection";
import { orderAPI } from "services/orderAPI";
import { setOrder } from "redux/order/order.slice";

const mStyles = {
  root: {
    width: "100%",
  },
  formControl: {
    width: "100%",
    marginBottom: 15,
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

export default function PaymentForm() {
  const { t } = useTranslation();

  const typeOptions = [
    { id: "Deposit", label: t("Deposit") },
    { id: "Payment", label: t("Balance Payment") },
  ];

  const methodOptions = [
    { id: "Cash", label: t("Cash") },
    { id: "Cheque", label: t("Cheque") },
    { id: "e-Transfer", label: t("e-Transfer") },
    { id: "Credit Card", label: t("Credit Card") },
    { id: "Debit Card", label: t("Debit Card") },
  ];

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const params = useParams();
  const [backdrop, setBackdrop] = useState({ opened: false });
  // const [submitButtonDisabled, setSubmitButtonDisabled] = useState(false);
  // payment
  const [data, setData] = useState({
    id: "",
    amount: "",
    type: "",
    method: "",
    notes: "",
  });
  const [error, setError] = useState({});
  // const [projects, setProjects] = useState([]);
  const signedInUser = useSelector(selectSignedInUser);
  const payment = useSelector(selectPayment);

  useEffect(() => {
    if (payment) {
      setData({ ...payment });
    } else {
      if (params && params.id) {
        if (!payment) {
          // refetch if page refreshed
          paymentAPI.fetchPayment(params.id).then((r) => {
            if (r.status === 200) {
              setData({ ...r.data });
            }
          });
        }
      }
    }
  }, [payment]);

  const handleTypeChange = (event) => {
    const a = { ...data, type: event.target.value };
    setData(a);
    setError({ ...error, type: "" });
  };

  const handleAmountChange = (event) => {
    const a = { ...data, amount: parseFloat(event.target.value) };
    setData(a);
    setError({ ...error, amount: "" });
  };

  const handleNotesChange = (event) => {
    const a = { ...data, notes: event.target.value };
    setData(a);
  };

  const handleMethodChange = (event) => {
    const m = methodOptions.find((r) => r.id === event.target.value);
    setData({ ...data, method: m.id });
    setError({ ...error, method: "" });
  };

  // const handleSelectProject = (project) => {
  //   if (project) {
  //     setData({
  //       ...data,
  //       id: project.id,
  //       project: { _id: project._id },
  //       branch: project.branch,
  //       client: project.client,
  //       sales: project.sales,
  //     });
  //     setError({ ...error, project: "" });
  //   }
  // };

  // const validate = (mode) => {
  //   const errs = {};
  //   if (!data.firstName) {
  //     errs["firstName"] = "Please enter your first name";
  //   }
  //   if (!data.lastName) {
  //     errs["lastName"] = "Please enter your last name";
  //   }
  //   if (!data.email) {
  //     errs["email"] = "Please enter your email";
  //   } else if (!isValidEmail(data.email)) {
  //     errs["email"] = "Invalid email format";
  //   }
  //   if (!data.phone) {
  //     errs["phone"] = "Please enter your phone number";
  //   }
  //   return errs;
  // };

  // const handleOpenBackdrop = () => {
  //   projectAPI.fetchProjects().then((r) => {
  //     setProjects(r.data);
  //     const p = data.project ? r.data.find((it) => it._id === data.project._id) : null;
  //     setBackdrop({ opened: true, project: p });
  //   });
  // };

  const handleSubmit = () => {
    if (!data.id) {
      setError({ id: t("Please select a project") });
      return;
    }
    if (!data.type) {
      setError({ type: t("Please select a type") });
      return;
    }
    if (!data.method) {
      setError({ method: t("Please select method") });
      return;
    }
    if (!data.amount) {
      setError({ amount: t("Please input amount") });
      return;
    } else if (isNaN(data.amount)) {
      setError({ amount: t("Please input a number") });
      return;
    }
    if (data._id) {
      paymentAPI.updatePayment(data._id, data).then((r) => {
        if (r.status === 200) {
          dispatch(setPayment(r.data));
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
      const doc = {
        ...data,
        creator: {
          _id: signedInUser._id,
          username: signedInUser.username,
          email: signedInUser.email,
        },
      };
      paymentAPI.createPayment(doc).then((r) => {
        if (r.status === 200) {
          dispatch(setPayment(r.data));
          dispatch(
            setSnackbar({
              color: "success",
              icon: "check",
              title: "",
              content: t("Created Successfully!"),
              open: true,
            })
          );
          orderAPI.searchOrders({ id: doc.id }).then((r1) => {
            dispatch(setOrder(r1.data[0]));
            navigate(-1);
          });
        }
      });
    }
  };

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox pt={1} pb={3}>
        <Card>
          <CardHead title={data._id ? t("Edit Payment") : t("Create Payment")} />

          {data && (
            <MDSection>
              <Grid container xs={12} spacing={2}>
                <Grid item xs={3}>
                  <MDInput
                    readOnly
                    label={t("Order #")}
                    value={data && data.id ? data.id : ""}
                    onClick={() => {}}
                    helperText={error && error.project ? error.project : ""}
                  />
                </Grid>
                <Grid item xs={3}>
                  <MDInput
                    readOnly
                    label={t("Balance")}
                    value={data.balance ? parseFloat(data.balance) : ""}
                  />
                </Grid>
              </Grid>
              <Grid container xs={12} spacing={2} style={{ marginTop: 15 }}>
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
              <Grid container xs={12} spacing={2} style={{ marginTop: 15 }}>
                <Grid item xs={3}>
                  <MDSelect
                    label={t("Type")}
                    value={data ? data.type : ""} // controlled
                    options={typeOptions}
                    onChange={handleTypeChange} // (event, child) => { }
                  />
                  {error && error.type && <div style={mStyles.error}>{error.type}</div>}
                </Grid>
                <Grid item xs={3}>
                  <MDSelect
                    name="method"
                    label={t("Method")}
                    value={data ? data.method : ""} // controlled
                    options={methodOptions}
                    onChange={handleMethodChange} // (event, child) => { }
                  />
                  {error && error.method && <div style={mStyles.error}>{error.method}</div>}
                </Grid>
                <Grid item xs={3}>
                  <MDInput
                    name="amount"
                    type="number"
                    label={t("Amount")}
                    value={data.amount} // controlled
                    onChange={handleAmountChange}
                    helperText={error && error.amount ? error.amount : ""}
                  />
                </Grid>
              </Grid>
              <Grid container xs={12} style={{ marginTop: 15 }}>
                <Grid item xs={6}>
                  <MDInput
                    name="notes"
                    label={t("Notes")}
                    value={data.notes} // controlled
                    onChange={handleNotesChange}
                    maxRows={5}
                    minRows={5}
                    multiline
                    // styles={{ formControl: mStyles.formControl }}
                  />
                </Grid>
              </Grid>
            </MDSection>
          )}
          <Grid display="flex" justifyContent="flex-end" xs={12} px={2} py={2}>
            <MDButton
              color="secondary"
              variant="outlined"
              style={{ marginRight: 20 + "px" }}
              onClick={() => navigate(-1)}
            >
              {t("Cancel")}
            </MDButton>
            <MDButton variant="gradient" color="info" onClick={handleSubmit}>
              {t("Save")}
            </MDButton>
          </Grid>
        </Card>
      </MDBox>
      {/* <ProjectSelectBackdrop
        projects={projects}
        open={backdrop.opened}
        selected={backdrop.project}
        onCancel={() => {
          setBackdrop({ opened: false });
        }}
        onChoose={handleSelectProject}
      /> */}
      <Footer />
    </DashboardLayout>
  );
}
