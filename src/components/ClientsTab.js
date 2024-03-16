import { Grid } from "@mui/material";
import MDBox from "components/MDBox";
import MDButton from "components/MDButton";
import MDLinearProgress from "components/MDLinearProgress";
import MDSection from "components/MDSection";
import GridTable from "components/common/GridTable";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { selectClients } from "redux/account/account.selector";
import { setClients } from "redux/account/account.slice";
import { setClient } from "redux/account/account.slice";
import { accountAPI } from "services/accountAPI";
import { logout } from "utils";

export default function ClientsTab(props) {
  const { branch } = props;
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const clients = useSelector(selectClients);
  const [isLoading, setLoading] = useState();

  const columns = [
    { headerName: t("Username"), field: "username", maxWidth: 200, flex: 1 },
    {
      headerName: t("Branch"),
      field: "branch",
      maxWidth: 300,
      valueGetter: (params) => (params.row?.branch ? params.row?.branch.name : t("N/A")),
      flex: 1,
    },
    { headerName: t("Email"), field: "email", maxWidth: 320, flex: 1.5 },
    { headerName: t("Phone"), field: "phone", maxWidth: 200, flex: 1 },
    // { headerName: t("Status"), field: "status", maxWidth: 150, flex: 1 },
    { headerName: t("Created Date"), field: "created", maxWidth: 200, flex: 1 },
    {
      headerName: t("Actions"),
      field: "_id",
      maxWidth: 180,
      flex: 1,
      renderCell: (params) => {
        return (
          <MDButton
            color="info"
            size="small"
            onClick={() => {
              dispatch(setClient(params.row));
              navigate(`/clients/${params.row._id}`);
            }}
          >
            {t("View Details")}
          </MDButton>
        );
      },
    },
  ];

  return (
    <Grid>
      <MDBox pt={0} px={0}>
        {isLoading ? (
          <Grid
            container
            display="flex"
            justifyContent="center"
            alignItems="center"
            style={{ height: 400 }}
          >
            <Grid item xs={6}>
              <MDLinearProgress color="info" />
            </Grid>
          </Grid>
        ) : (
          <GridTable
            data={clients}
            columns={columns}
            onRowClick={() => {}}
            rowsPerPage={10}
            sortModel={[{ field: "created", sort: "desc" }]}
          />
        )}
      </MDBox>
    </Grid>
  );
}
