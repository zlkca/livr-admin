import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Card, Checkbox, FormControlLabel, FormGroup, Grid } from "@mui/material";

import { selectSupplier } from "redux/supplier/supplier.selector";
import { setSupplier } from "redux/supplier/supplier.slice";
import { setSignedInUser } from "redux/auth/auth.slice";
import { setSnackbar } from "redux/ui/ui.slice";
import { selectSignedInUser } from "redux/auth/auth.selector";

import DashboardLayout from "layouts/DashboardLayout";
import DashboardNavbar from "layouts/DashboardNavbar";
import MDBox from "components/MDBox";
import CardHead from "components/CardHead";
import MDButton from "components/MDButton";
import MDSection from "components/MDSection";
import MDTypography from "components/MDTypography";

import Input from "components/common/Input";
import Footer from "layouts/Footer";
import { supplierAPI } from "../../services/supplierAPI";
import AddressForm from "components/AddressForm";

export default function SupplierFormPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const params = useParams();

  const [error, setError] = useState({});
  const [data, setData] = useState();

  const signedInUser = useSelector(selectSignedInUser);
  const supplier = useSelector(selectSupplier);

  useEffect(() => {
    if (supplier) {
      setData({ ...supplier });
    } else {
      if (params && params.id && params.id !== "new") {
        if (!supplier) {
          // refetch if page refreshed
          supplierAPI.fetchSupplier(params.id).then((r) => {
            if (r.status === 200) {
              setData({ ...r.data });
            }
          });
        }
      }
    }
  }, [supplier]);

  const validate = (d) => {
    if (!d.name) {
      alert(t("Name is required"));
      return false;
    }

    if (!d.description) {
      alert(t("Description is required"));
      return false;
    }

    if (!d.status) {
      alert(t("Status is required"));
      return false;
    }

    if (!d.creator) {
      alert(t("Creator is required"));
      return false;
    }

    return true;
  };

  const handleNameChange = (event) => {
    const a = { ...data, name: event.target.value };
    setData(a);
  };

  const handleDescriptionChange = (event) => {
    const a = { ...data, description: event.target.value };
    setData(a);
  };

  const handleStatusChange = (event) => {
    const a = { ...data, status: event.target.value };
    setData(a);
  };

  const handlePhoneChange = (event) => {
    const a = { ...data, phone: event.target.value };
    setData(a);
  };

  const handleAddressChange = (obj) => {
    setData({
      ...data,
      address: { ...data.address, ...obj },
    });
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
      supplierAPI.updateSupplier(d._id, d).then((r) => {
        if (r.status === 200) {
          dispatch(setSupplier(r.data));
          dispatch(
            setSnackbar({
              color: "success",
              icon: "check",
              title: "",
              content: t("Updated Successfully!"),
              open: true,
            })
          );
          navigate("/suppliers");
        }
      });
    } else {
      supplierAPI
        .createSupplier({
          ...d,
        })
        .then((r) => {
          if (r.status === 200) {
            dispatch(setSupplier(r.data));
            dispatch(
              setSnackbar({
                color: "success",
                icon: "check",
                title: "",
                content: t("Created Successfully!"),
                open: true,
              })
            );
            navigate("/suppliers");
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
              <CardHead title={data && data._id ? t("Edit Supplier") : t("Create Supplier")} />

              <MDSection title={t("Basic Info")}>
                <Grid container xs={12} display="flex" pt={1} spacing={2}>
                  <Grid item xs={12} sm={4}>
                    <MDTypography variant="button" fontWeight="regular" color="text"></MDTypography>
                  </Grid>
                </Grid>

                <Grid container xs={12} display="flex" pt={2} spacing={2}>
                  <Grid item xs={6} sm={3}>
                    <Input
                      label={t("Name")}
                      value={data && data.name ? data.name : ""}
                      onChange={handleNameChange}
                      helperText={error && error.name ? error.name : ""}
                    />
                  </Grid>
                </Grid>

                <Grid container xs={12} display="flex" pt={2} spacing={2}>
                  <Grid item xs={6} sm={3}>
                    <Input
                      label={t("Description")}
                      value={data && data.description ? data.description : ""}
                      onChange={handleDescriptionChange}
                      helperText={error && error.description ? error.description : ""}
                    />
                  </Grid>
                </Grid>

                <Grid container xs={12} display="flex" pt={2} spacing={2}>
                  <Grid item xs={6} sm={3}>
                    <Input
                      label={t("Status")}
                      value={data && data.status ? data.status : ""}
                      onChange={handleStatusChange}
                      helperText={error && error.status ? error.status : ""}
                    />
                  </Grid>
                </Grid>
                <Grid container xs={12} display="flex" pt={2} spacing={2}>
                  <Grid item xs={6} sm={3}>
                    <Input
                      label={t("Phone")}
                      value={data && data.phone ? data.phone : ""}
                      onChange={handlePhoneChange}
                      helperText={error && error.phone ? error.phone : ""}
                    />
                  </Grid>
                </Grid>
              </MDSection>
              <MDSection title={t("Address")}>
                <Grid item xs={12} sm={10} md={10} lg={8} xl={8}>
                  <AddressForm address={data ? data.address : {}} onChange={handleAddressChange} />
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
