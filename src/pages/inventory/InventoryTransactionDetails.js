import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Card, Grid } from "@mui/material";

import Box from "../../components/common/Box";
import Button from "../../components/common/Button";
import MDSection from "../../components/MDSection";
import VField from "../../components/VField";
import ActionBar from "../../components/common/ActionBar";
import DashboardLayout from "../../layouts/DashboardLayout";
import DashboardNavbar from "../../layouts/DashboardNavbar";
import Footer from "../../layouts/Footer";

import { selectInventoryTransaction } from "../../redux/inventory/inventory.selector";
import { setInventoryTransaction } from "../../redux/inventory/inventory.slice";
import { inventoryTransactionAPI } from "../../services/inventoryTransactionAPI";

export default function InventoryTransactionDetails() {
  const inventoryTransaction = useSelector(selectInventoryTransaction);
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isLoading, setLoading] = useState();
  const actions = [
    {
      label: t("Edit"),
      variant: "contained",
      onClick: () => {
        const _id = inventoryTransaction._id;
        inventoryTransactionAPI.fetchInventoryTransaction(_id).then((r) => {
          if (r.status === 200) {
            dispatch(setInventoryTransaction(r.data));
            navigate(`/inventoryTransactions/${_id}/form`);
          }
        });
      },
    },
    {
      label: "Delete",
      onClick: () => {
        const _id = inventoryTransaction._id;
        inventoryTransactionAPI.deleteInventoryTransaction(_id).then((r) => {
          if (r.status === 200) {
            navigate(`/inventoryTransactions`);
          }
        });
      },
    },
  ];

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <Box pt={1} pb={3}>
        <Grid container spacing={6}>
          <Grid item xs={12}>
            <Card style={{ padding: 30 }}>
              <ActionBar buttons={actions} />
              <MDSection title={t("Transaction")}>
                <Grid display="flex">
                  <VField label={t("Id")} value={inventoryTransaction._id} />
                </Grid>
              </MDSection>

              <Grid display="flex" justifyContent="flex-end" xs={12} pt={2}>
                <Button
                  variant="outlined"
                  color="secondary"
                  onClick={() => navigate("/inventoryTransactions")}
                >
                  {t("Back")}
                </Button>
              </Grid>
            </Card>
          </Grid>
        </Grid>
      </Box>
      <Footer />
    </DashboardLayout>
  );
}
