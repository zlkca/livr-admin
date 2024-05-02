import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Card, Checkbox, FormControlLabel, FormGroup, Grid } from "@mui/material";

import { selectInventoryStock } from "../../redux/inventory/inventory.selector";
import { setInventoryStock } from "../../redux/inventory/inventory.slice";
import { setSignedInUser } from "../../redux/auth/auth.slice";
import { setSnackbar } from "../../redux/ui/ui.slice";
import { selectSignedInUser } from "redux/auth/auth.selector";

import DashboardLayout from "layouts/DashboardLayout";
import DashboardNavbar from "layouts/DashboardNavbar";
import MDBox from "components/MDBox";
import CardHead from "components/CardHead";
import MDButton from "components/MDButton";
import MDSection from "components/MDSection";
import MDTypography from "components/MDTypography";
import MDInput from "components/MDInput";
import Footer from "layouts/Footer";
import { inventoryStockAPI } from "../../services/inventoryStockAPI";

export default function InventoryStockFormPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const params = useParams();

  const [error, setError] = useState({});
  const [data, setData] = useState();

  const signedInUser = useSelector(selectSignedInUser);
  const inventoryStock = useSelector(selectInventoryStock);

  useEffect(() => {
    if (inventoryStock) {
      setData({ ...inventoryStock });
    } else {
      if (params && params.id && params.id !== "new") {
        if (!inventoryStock) {
          // refetch if page refreshed
          inventoryStockAPI.fetchInventoryStock(params.id).then((r) => {
            if (r.status === 200) {
              setData({ ...r.data });
            }
          });
        }
      }
    }
  }, [inventoryStock]);

  const validate = (d) => {
    if (!d.notes) {
      alert(t("Notes is required"));
      return false;
    }

    if (!d.productId) {
      alert(t("ProductId is required"));
      return false;
    }

    if (!d.quantity) {
      alert(t("Quantity is required"));
      return false;
    }

    if (!d.lastUpdatedCost) {
      alert(t("LastUpdatedCost is required"));
      return false;
    }

    if (!d.lastUpdatedPrice) {
      alert(t("LastUpdatedPrice is required"));
      return false;
    }

    if (!d.locationId) {
      alert(t("LocationId is required"));
      return false;
    }

    if (!d.type) {
      alert(t("Type is required"));
      return false;
    }

    if (!d.creator) {
      alert(t("Creator is required"));
      return false;
    }

    return true;
  };

  const handleNotesChange = (event) => {
    const a = { ...data, notes: event.target.value };
    setData(a);
  };

  const handleProductIdChange = (event) => {
    const a = { ...data, productId: event.target.value };
    setData(a);
  };

  const handleQuantityChange = (event) => {
    const a = { ...data, quantity: event.target.value };
    setData(a);
  };

  const handleLastUpdatedCostChange = (event) => {
    const a = { ...data, lastUpdatedCost: event.target.value };
    setData(a);
  };

  const handleLastUpdatedPriceChange = (event) => {
    const a = { ...data, lastUpdatedPrice: event.target.value };
    setData(a);
  };

  const handleLocationIdChange = (event) => {
    const a = { ...data, locationId: event.target.value };
    setData(a);
  };

  const handleTypeChange = (event) => {
    const a = { ...data, type: event.target.value };
    setData(a);
  };

  const handleSubmit = () => {
    const d = {
      ...data,
      creator: {
        _id: signedInUser._id,
        username: signedInUser.username,
      },
    };

    if (!validate(d)) return;

    if (d._id) {
      inventoryStockAPI.updateInventoryStock(d._id, d).then((r) => {
        if (r.status === 200) {
          dispatch(setInventoryStock(r.data));
          dispatch(
            setSnackbar({
              color: "success",
              icon: "check",
              title: "",
              content: t("Updated Successfully!"),
              open: true,
            })
          );
          navigate("/inventoryStocks");
        }
      });
    } else {
      inventoryStockAPI
        .createInventoryStock({
          ...d,
        })
        .then((r) => {
          if (r.status === 200) {
            dispatch(setInventoryStock(r.data));
            dispatch(
              setSnackbar({
                color: "success",
                icon: "check",
                title: "",
                content: t("Created Successfully!"),
                open: true,
              })
            );
            navigate("/inventoryStocks");
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
            <Card>
              <CardHead title={data && data._id ? t("Edit Project") : t("Create Project")} />

              <MDSection title={t("Basic Info")}>
                <Grid container xs={12} display="flex" pt={1} spacing={2}>
                  <Grid item xs={12} sm={4}>
                    <MDTypography variant="button" fontWeight="regular" color="text"></MDTypography>
                  </Grid>
                </Grid>

                <Grid container xs={12} display="flex" pt={2} spacing={2}>
                  <Grid item xs={6} sm={3}>
                    <MDInput
                      label={t("notes")}
                      value={data && data.notes ? data.notes : ""}
                      onChange={handleNotesChange}
                      helperText={error && error.notes ? error.notes : ""}
                    />
                  </Grid>
                </Grid>

                <Grid container xs={12} display="flex" pt={2} spacing={2}>
                  <Grid item xs={6} sm={3}>
                    <MDInput
                      label={t("productId")}
                      value={data && data.productId ? data.productId : ""}
                      onChange={handleProductIdChange}
                      helperText={error && error.productId ? error.productId : ""}
                    />
                  </Grid>
                </Grid>

                <Grid container xs={12} display="flex" pt={2} spacing={2}>
                  <Grid item xs={6} sm={3}>
                    <MDInput
                      label={t("quantity")}
                      value={data && data.quantity ? data.quantity : ""}
                      onChange={handleQuantityChange}
                      helperText={error && error.quantity ? error.quantity : ""}
                    />
                  </Grid>
                </Grid>

                <Grid container xs={12} display="flex" pt={2} spacing={2}>
                  <Grid item xs={6} sm={3}>
                    <MDInput
                      label={t("lastUpdatedCost")}
                      value={data && data.lastUpdatedCost ? data.lastUpdatedCost : ""}
                      onChange={handleLastUpdatedCostChange}
                      helperText={error && error.lastUpdatedCost ? error.lastUpdatedCost : ""}
                    />
                  </Grid>
                </Grid>

                <Grid container xs={12} display="flex" pt={2} spacing={2}>
                  <Grid item xs={6} sm={3}>
                    <MDInput
                      label={t("lastUpdatedPrice")}
                      value={data && data.lastUpdatedPrice ? data.lastUpdatedPrice : ""}
                      onChange={handleLastUpdatedPriceChange}
                      helperText={error && error.lastUpdatedPrice ? error.lastUpdatedPrice : ""}
                    />
                  </Grid>
                </Grid>

                <Grid container xs={12} display="flex" pt={2} spacing={2}>
                  <Grid item xs={6} sm={3}>
                    <MDInput
                      label={t("locationId")}
                      value={data && data.locationId ? data.locationId : ""}
                      onChange={handleLocationIdChange}
                      helperText={error && error.locationId ? error.locationId : ""}
                    />
                  </Grid>
                </Grid>

                <Grid container xs={12} display="flex" pt={2} spacing={2}>
                  <Grid item xs={6} sm={3}>
                    <MDInput
                      label={t("type")}
                      value={data && data.type ? data.type : ""}
                      onChange={handleTypeChange}
                      helperText={error && error.type ? error.type : ""}
                    />
                  </Grid>
                </Grid>
              </MDSection>

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
          </Grid>
        </Grid>
      </MDBox>
      <Footer />
    </DashboardLayout>
  );
}
