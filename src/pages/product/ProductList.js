import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import { useGridApiRef } from "@mui/x-data-grid";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";

import { setProduct } from "../../redux/product/product.slice";
import { selectProducts } from "../../redux/product/product.selector";
import { setProducts } from "../../redux/product/product.slice";
import { setSignedInUser } from "redux/auth/auth.slice";
import { setSnackbar } from "redux/ui/ui.slice";
import { selectSnackbar } from "redux/ui/ui.selector";
import { selectSignedInUser } from "redux/auth/auth.selector";

import GridTable from "../../components/common/GridTable";
import CellButton from "components/common/CellButton";
import MDSnackbar from "components/MDSnackbar";
import MDBox from "components/MDBox";
import CardHead from "components/CardHead";
import MDButton from "components/MDButton";
import DashboardLayout from "layouts/DashboardLayout";
import DashboardNavbar from "layouts/DashboardNavbar";
import Footer from "layouts/Footer";

import { productAPI } from "../../services/productAPI";
import { ActionButton } from "components/common/Button";

const GridCfg = { RowsPerPage: 20 };

export default function ProductListPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const gridApiRef = useGridApiRef();

  const products = useSelector(selectProducts);
  const signedInUser = useSelector(selectSignedInUser);
  const [selectedRow, setSelectedRow] = useState();
  const snackbar = useSelector(selectSnackbar);

  const columns = [
    // {
    //   headerName: t("Category"),
    //   field: "category",
    //   minWidth: 180,
    //   flex: 1,
    //   valueGetter: (params) => (params.row?.category ? params.row?.category.name : t("Unassigned")),
    // },
    { headerName: t("Name"), field: "name", minWidth: 200, flex: 1 },
    // { headerName: t("Description"), field: "description", minWidth: 200, flex: 1 },
    { headerName: t("SKU"), field: "SKU", minWidth: 120, flex: 1 },
    { headerName: t("Cost"), field: "cost", minWidth: 90, flex: 1 },
    { headerName: t("Price"), field: "price", minWidth: 90, flex: 1 },
    { headerName: t("Status"), field: "status", minWidth: 80, flex: 1 },
    {
      headerName: t("Creator"),
      field: "creator",
      minWidth: 100,
      flex: 1,
      valueGetter: (params) => (params.row?.creator ? params.row?.creator.username : t("Unknown")),
    },
    { headerName: t("Created"), field: "created", minWidth: 200, flex: 1 },
    { headerName: t("Updated"), field: "updated", minWidth: 200, flex: 1 },
    {
      headerName: t("Actions"),
      field: "_id",
      minWidth: 180,
      renderCell: (params) => {
        return (
          <CellButton
            onClick={() => {
              const uploadId = params.row.uploadId ? params.row.uploadId : uuidv4();
              dispatch(setProduct({ ...params.row, uploadId }));
              const productId = params.row._id;
              navigate("/products/" + productId);
            }}
          >
            {t("View Details")}
          </CellButton>
        );
      },
    },
  ];

  const handleCreate = () => {
    dispatch(setProduct());
    navigate("/products/new/form");
  };

  const handleSelectRow = (row) => {
    setSelectedRow(row);
  };

  useEffect(() => {
    if (signedInUser) {
      productAPI.searchProducts({}).then((r) => {
        if (r.status == 200) {
          dispatch(setProducts(r.data));
        } else if (r.status === 401) {
          dispatch(setSignedInUser());
        }
      });
    }
  }, [signedInUser]);

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox pt={1} pb={3}>
        <Grid container spacing={6}>
          <Grid item xs={12}>
            <Card>
              <CardHead title={t("Products")} />
              <MDBox pt={2} px={2} style={{ height: 1240 }}>
                <Grid container display="flex" justifyContent={"flex-start"}>
                  <Grid item xs={2} md={9}>
                    <Grid container spacing={2} direction="row" justifyContent="flex-end">
                      <Grid item>
                        <ActionButton onClick={handleCreate}>{t("Create")}</ActionButton>
                      </Grid>
                    </Grid>
                  </Grid>
                </Grid>
                <MDBox pt={0} px={0} style={{ height: 1000, marginTop: 20 }}>
                  <GridTable
                    autoPageSize
                    apiRef={gridApiRef}
                    data={products}
                    columns={columns}
                    onRowClick={handleSelectRow}
                    rowsPerPage={GridCfg.RowsPerPage}
                    sortModel={[{ field: "created", sort: "desc" }]}
                  />
                </MDBox>
              </MDBox>
            </Card>
          </Grid>
        </Grid>
      </MDBox>
      <MDSnackbar
        {...snackbar}
        title=""
        datetime=""
        icon="check"
        autoHideDuration={3000}
        close={() => dispatch(setSnackbar({ ...snackbar, open: false }))}
        onClose={() => dispatch(setSnackbar({ ...snackbar, open: false }))}
      />
      <Footer />
    </DashboardLayout>
  );
}
