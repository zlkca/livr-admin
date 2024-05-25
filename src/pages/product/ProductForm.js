import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { v4 as uuidv4 } from "uuid";
import { Card, Checkbox, FormControlLabel, FormGroup, Grid } from "@mui/material";

import { selectProduct } from "../../redux/product/product.selector";
import { setProduct } from "../../redux/product/product.slice";
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

import Select from "components/common/Select";

import Footer from "layouts/Footer";
import { productAPI } from "../../services/productAPI";
// import { selectCategories } from "redux/category/category.selector";
import { categoryAPI } from "services/categoryAPI";
import { setCategories } from "redux/category/category.slice";
import ImageUploader from "components/common/ImageUploader";
import { uploadFilesToS3 } from "services/upload";
import { bulkUpload } from "services/upload";

export default function ProductFormPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const params = useParams();

  const [error, setError] = useState({});
  const [data, setData] = useState();
  const [catOptions, setCatOptions] = useState([]);
  const [uploadItems, setUploadItems] = useState([]);

  const signedInUser = useSelector(selectSignedInUser);
  const product = useSelector(selectProduct);
  // const categories = useSelector(selectCategories);

  useEffect(() => {
    categoryAPI.fetchCategories().then((r) => {
      dispatch(setCategories(r.data));
      setCatOptions(r.data.map((it) => ({ id: it._id, label: it.name })));
    });
  }, []);

  useEffect(() => {
    if (product) {
      setData({ ...product });
    } else {
      if (params && params.id) {
        if (params.id !== "new") {
          if (!product) {
            // refetch if page refreshed
            productAPI.fetchProduct(params.id).then((r) => {
              if (r.status === 200) {
                const uploadId = r.data.uploadId ? r.data.uploadId : uuidv4();
                setData({ ...r.data, uploadId });
              }
            });
          }
        } else {
          setData({ uploadId: uuidv4() });
        }
      }
    }
  }, [product]);

  const validate = (d) => {
    if (!d.category) {
      alert(t("Category is required"));
      return false;
    }
    if (!d.name) {
      alert(t("Name is required"));
      return false;
    }

    if (!d.description) {
      alert(t("Description is required"));
      return false;
    }

    if (!d.SKU) {
      alert(t("Sku is required"));
      return false;
    }

    if (!d.cost) {
      alert(t("Cost is required"));
      return false;
    }

    if (!d.price) {
      alert(t("Price is required"));
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

  const handleCategoryChange = (event) => {
    const cat = catOptions.find((r) => r.id === event.target.value);
    setData({ ...data, category: { _id: cat.id, name: cat.label } });
  };

  const handleNameChange = (event) => {
    const a = { ...data, name: event.target.value };
    setData(a);
  };

  const handleDescriptionChange = (event) => {
    const a = { ...data, description: event.target.value };
    setData(a);
  };

  const handleSkuChange = (event) => {
    const a = { ...data, SKU: event.target.value };
    setData(a);
  };

  const handleCostChange = (event) => {
    const a = { ...data, cost: event.target.value };
    setData(a);
  };

  const handlePriceChange = (event) => {
    const a = { ...data, price: event.target.value };
    setData(a);
  };

  const handleDiscountChange = (event) => {
    const a = { ...data, discount: event.target.value };
    setData(a);
  };

  const handleStatusChange = (event) => {
    const a = { ...data, status: event.target.value };
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
      productAPI.updateProduct(d._id, d).then((r) => {
        if (r.status === 200) {
          dispatch(setProduct(r.data));
          dispatch(
            setSnackbar({
              color: "success",
              icon: "check",
              title: "",
              content: t("Updated Successfully!"),
              open: true,
            })
          );
          navigate("/products");
        }
      });
    } else {
      productAPI
        .createProduct({
          ...d,
        })
        .then((r) => {
          if (r.status === 200) {
            dispatch(setProduct(r.data));
            dispatch(
              setSnackbar({
                color: "success",
                icon: "check",
                title: "",
                content: t("Created Successfully!"),
                open: true,
              })
            );
            navigate("/products");
          }
        });
    }
  };

  const handleUpload = async (files, ds) => {
    if (ds && ds.length > 0) {
      const category = "product";

      // { uploadId, category, items: [{fname, notes}] }
      const r = await bulkUpload({
        uploadId: data.uploadId,
        category,
        items: ds,
      });

      const res = await uploadFilesToS3(files, category, data.uploadId);
      if (res.status === 200) {
        // setSnackbar({ opened: true, message: "Upload files successfully" });
      } else {
        // setSnackbar({ opened: true, message: "Upload files failed" });
      }
    }
  };

  // only upload new files
  const handleUploadFileChange = async (files) => {
    if (files && files.length > 0) {
      const ds = [];
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        // const found = data.pictures && data.pictures.find((it) => it.fname === file.name);
        // if (!found) {
        ds.push({ fname: file.name, notes: "" });
        // }
      }
      setUploadItems(ds);
      await handleUpload(files, ds);
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
                <Grid container xs={12}>
                  {data && (
                    <Grid item xs={6}>
                      <ImageUploader items={data.pictures} onFileChange={handleUploadFileChange} />
                    </Grid>
                  )}
                  <Grid item xs={6}>
                    <Grid container xs={12} display="flex" pt={1} spacing={2}>
                      <Grid item xs={12} sm={12}>
                        <MDTypography
                          variant="button"
                          fontWeight="regular"
                          color="text"
                        ></MDTypography>
                      </Grid>
                    </Grid>

                    <Grid container xs={12} display="flex" pt={2} spacing={2}>
                      <Grid item xs={6} sm={8}>
                        <Select
                          name="category"
                          label={t("Category")}
                          value={data && data.category ? data.category._id : ""} // controlled
                          options={catOptions}
                          onChange={handleCategoryChange}
                        />
                      </Grid>
                    </Grid>

                    <Grid container xs={12} display="flex" pt={2} spacing={2}>
                      <Grid item xs={6} sm={8}>
                        <MDInput
                          label={t("name")}
                          value={data && data.name ? data.name : ""}
                          onChange={handleNameChange}
                          helperText={error && error.name ? error.name : ""}
                        />
                      </Grid>
                    </Grid>

                    <Grid container xs={12} display="flex" pt={2} spacing={2}>
                      <Grid item xs={6} sm={8}>
                        <MDInput
                          label={t("description")}
                          value={data && data.description ? data.description : ""}
                          onChange={handleDescriptionChange}
                          helperText={error && error.description ? error.description : ""}
                        />
                      </Grid>
                    </Grid>

                    <Grid container xs={12} display="flex" pt={2} spacing={2}>
                      <Grid item xs={6} sm={8}>
                        <MDInput
                          label={t("SKU")}
                          value={data && data.SKU ? data.SKU : ""}
                          onChange={handleSkuChange}
                          helperText={error && error.SKU ? error.SKU : ""}
                        />
                      </Grid>
                    </Grid>

                    <Grid container xs={12} display="flex" pt={2} spacing={2}>
                      <Grid item xs={6} sm={8}>
                        <MDInput
                          label={t("cost")}
                          value={data && data.cost ? data.cost : ""}
                          onChange={handleCostChange}
                          helperText={error && error.cost ? error.cost : ""}
                        />
                      </Grid>
                    </Grid>

                    <Grid container xs={12} display="flex" pt={2} spacing={2}>
                      <Grid item xs={6} sm={8}>
                        <MDInput
                          label={t("price")}
                          value={data && data.price ? data.price : ""}
                          onChange={handlePriceChange}
                          helperText={error && error.price ? error.price : ""}
                        />
                      </Grid>
                    </Grid>

                    <Grid container xs={12} display="flex" pt={2} spacing={2}>
                      <Grid item xs={6} sm={8}>
                        <MDInput
                          label={t("discount")}
                          value={data && data.discount ? data.discount : ""}
                          onChange={handleDiscountChange}
                          helperText={error && error.discount ? error.discount : ""}
                        />
                      </Grid>
                    </Grid>

                    <Grid container xs={12} display="flex" pt={2} spacing={2}>
                      <Grid item xs={6} sm={8}>
                        <MDInput
                          label={t("status")}
                          value={data && data.status ? data.status : ""}
                          onChange={handleStatusChange}
                          helperText={error && error.status ? error.status : ""}
                        />
                      </Grid>
                    </Grid>
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
