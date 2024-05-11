
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { Card, Grid } from "@mui/material";

import CardHead from "components/CardHead";
import MDBox from "components/MDBox";
import MDButton from "components/MDButton";
import MDSection from "components/MDSection";
import MDSnackbar from "components/MDSnackbar";
import VField from "components/VField";

import { ActionButton } from "components/common/Button";

import DashboardLayout from "layouts/DashboardLayout";
import DashboardNavbar from "layouts/DashboardNavbar";
import Footer from "layouts/Footer";

import { selectSignedInUser } from "redux/auth/auth.selector";
import { setSignedInUser } from "redux/auth/auth.slice";
import { selectProduct } from "../../redux/product/product.selector";
import { setProduct } from "../../redux/product/product.slice";
import { selectSnackbar } from "redux/ui/ui.selector";
import { setSnackbar } from "redux/ui/ui.slice";

import { productAPI } from "../../services/productAPI";


export default function ProductDetails() {
  const product = useSelector(selectProduct);
  const signedInUser = useSelector(selectSignedInUser);
  const snackbar = useSelector(selectSnackbar);

  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const params = useParams();
  const [data, setData] = useState();

  useEffect(() => {
    if (product) {
      setData({ ...product });
    } else {
      if (params && params.id && params.id !== "new") {
        if (!data) {
            productAPI.fetchProduct(params.id).then((r) => {
              setData({ ...r.data });
            });
        }
      }
    }
  }, [params]);

  const handleEdit = () => {
    if (data) {
      const _id = data._id;
      productAPI.fetchProduct(_id).then((r) => {
        if (r.status === 200) {
          dispatch(setProduct(r.data));
          navigate("/products/_id/form");
        }
      });
    }
  };

  const handleDelete = () => {
    if (data) {
      const _id = data._id;
      productAPI.deleteProduct(_id).then((r) => {
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
          navigate("/products");
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
                    <Grid item>
                      <ActionButton onClick={handleEdit}>
                        {t("Edit")}
                      </ActionButton>
                    </Grid>
                    <Grid item>
                      <ActionButton onClick={handleDelete}>
                        {t("Delete")}
                      </ActionButton>
                    </Grid>
                </Grid>

                <MDSection title={t("Orders")}>
                  <Grid display="flex">
                    
            <VField label={t("Name")} value={data.name} />
            
            <VField label={t("Description")} value={data.description} />
            
            <VField label={t("Sku")} value={data.SKU} />
            
            <VField label={t("Cost")} value={data.cost} />
            
            <VField label={t("Price")} value={data.price} />
            
            <VField label={t("Status")} value={data.status} />
            
            <VField label={t("Creator")} value={data.creator} />
            
            <VField label={t("Created")} value={data.created} />
            
            <VField label={t("Updated")} value={data.updated} />
            
                  </Grid>
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
    