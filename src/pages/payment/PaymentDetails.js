import { Card, Grid } from "@mui/material";
import MDBox from "components/MDBox";
import MDButton from "components/MDButton";
import MDSection from "components/MDSection";
import VField from "components/VField";
import ActionBar from "components/common/ActionBar";
import DashboardLayout from "layouts/DashboardLayout";
import DashboardNavbar from "layouts/DashboardNavbar";
import Footer from "layouts/Footer";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { selectPayment } from "redux/payment/payment.selector";
import { setPayment } from "redux/payment/payment.slice";
import { paymentAPI } from "services/paymentAPI";

export default function PaymentDetails() {
  const payment = useSelector(selectPayment);
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isLoading, setLoading] = useState();
  const actions = [
    {
      label: t("Edit"),
      variant: "contained",
      onClick: () => {
        if (payment) {
          const _id = payment._id;
          paymentAPI.fetchPayment(_id).then((r) => {
            if (r.status === 200) {
              dispatch(setPayment(r.data));
              navigate(`/payments/${_id}/form`);
            }
          });
        }
      },
    },
    // { label: "Delete", onClick: () => {} },
  ];

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox pt={1} pb={3}>
        <Grid container spacing={6}>
          <Grid item xs={12}>
            <Card style={{ padding: 30 }}>
              <ActionBar buttons={actions} />
              <MDSection title={t("Project")}>
                <Grid display="flex">
                  <VField label={t("Order #")} value={payment.id} />
                  <VField label={t("Date")} value={payment.created} />
                </Grid>
              </MDSection>

              <MDSection title={t("Client")}>
                <Grid display="flex">
                  <VField label={t("Username")} value={payment.client.username} />
                  <VField label={t("Email")} value={payment.client.email} />
                  <VField label={t("Phone")} value={payment.client.phone} />
                  <VField label={t("Address")} value={payment.displayAddress} />
                </Grid>
              </MDSection>

              <MDSection title={t("Sales")}>
                <Grid display="flex">
                  <VField label={t("Username")} value={payment.sales.username} />
                  <VField label={t("Email")} value={payment.sales.email} />
                  <VField label={t("Phone")} value={payment.sales.phone} />
                </Grid>
              </MDSection>

              <Grid display="flex" justifyContent="flex-end" xs={12} pt={2}>
                <MDButton
                  variant="outlined"
                  color="secondary"
                  onClick={() => navigate("/payments")}
                >
                  {t("Back")}
                </MDButton>
              </Grid>
            </Card>
          </Grid>
        </Grid>
      </MDBox>
      <Footer />
    </DashboardLayout>
  );
}
