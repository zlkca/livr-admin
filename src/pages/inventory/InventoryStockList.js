import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useGridApiRef } from "@mui/x-data-grid";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";

import { setInventoryStock } from "../../redux/inventory/inventory.slice";
import { selectInventoryStocks } from "../../redux/inventory/inventory.selector";
import { setInventoryStocks } from "../../redux/inventory/inventory.slice";
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

import { inventoryStockAPI } from "../../services/inventoryStockAPI";

const GridCfg = { RowsPerPage: 20 };

export default function InventoryStockListPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const gridApiRef = useGridApiRef();

  const inventoryStocks = useSelector(selectInventoryStocks);
  const signedInUser = useSelector(selectSignedInUser);
  const [selectedRow, setSelectedRow] = useState();
  const snackbar = useSelector(selectSnackbar);

  const columns = [
    { headerName: t("Notes"), field: "notes", minWidth: 200, flex: 1 },
    { headerName: t("ProductId"), field: "productId", minWidth: 200, flex: 1 },
    { headerName: t("Quantity"), field: "quantity", minWidth: 200, flex: 1 },
    { headerName: t("LastUpdatedCost"), field: "lastUpdatedCost", minWidth: 200, flex: 1 },
    { headerName: t("LastUpdatedPrice"), field: "lastUpdatedPrice", minWidth: 200, flex: 1 },
    { headerName: t("LocationId"), field: "locationId", minWidth: 200, flex: 1 },
    { headerName: t("Type"), field: "type", minWidth: 200, flex: 1 },
    {
      headerName: t("Creator"),
      field: "creator",
      minWidth: 200,
      flex: 1,
      valueGetter: (params) => (params.row?.creator ? params.row?.creator.username : t("Unknown")),
    },
    { headerName: t("Created"), field: "created", minWidth: 200, flex: 1 },
    {
      headerName: t("Actions"),
      field: "_id",
      minWidth: 180,
      renderCell: (params) => {
        return (
          <CellButton
            onClick={() => {
              dispatch(setInventoryStock(params.row));
              const inventoryStockId = params.row._id;
              navigate("/inventoryStocks/" + inventoryStockId);
            }}
          >
            {t("View Details")}
          </CellButton>
        );
      },
    },
  ];

  const handleCreate = () => {
    dispatch(setInventoryStock());
    navigate("/inventoryStocks/new/form");
  };

  const handleSelectRow = (row) => {
    setSelectedRow(row);
  };

  useEffect(() => {
    if (signedInUser) {
      inventoryStockAPI.searchInventoryStocks({}).then((r) => {
        if (r.status == 200) {
          dispatch(setInventoryStocks(r.data));
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
              <CardHead title={t("InventoryStocks")} />
              <MDBox pt={2} px={2} style={{ height: 1240 }}>
                <Grid container display="flex" justifyContent={"flex-start"}>
                  <Grid item xs={2} md={9}>
                    <Grid container spacing={2} direction="row" justifyContent="flex-end">
                      <Grid item>
                        <MDButton
                          color="info"
                          variant={"outlined"}
                          size="small"
                          onClick={handleCreate}
                        >
                          {t("Create")}
                        </MDButton>
                      </Grid>
                    </Grid>
                  </Grid>
                </Grid>
                <MDBox pt={0} px={0} style={{ height: 1000, marginTop: 20 }}>
                  <GridTable
                    autoPageSize
                    apiRef={gridApiRef}
                    data={inventoryStocks}
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
