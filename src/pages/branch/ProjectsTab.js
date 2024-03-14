import { Grid } from "@mui/material";
import MDBox from "components/MDBox";
import MDButton from "components/MDButton";
import MDLinearProgress from "components/MDLinearProgress";
import GridTable from "components/common/GridTable";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { selectProjects } from "redux/project/project.selector";
import { setProjects } from "redux/project/project.slice";
import { setProject } from "redux/project/project.slice";
import { projectAPI } from "services/projectAPI";
import { getAddressString } from "utils";
import { logout } from "utils";

export default function ProjectsTab(props) {
  const { branch } = props;
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const projects = useSelector(selectProjects);
  const [isLoading, setLoading] = useState();

  useEffect(() => {
    setLoading(true);
    const q = { "branch._id": branch._id };

    projectAPI.searchProjects(q).then((r) => {
      if (r.status == 200) {
        dispatch(setProjects(r.data));
        setTimeout(() => {
          setLoading(false);
        }, 500);
      } else if (r.status === 401) {
        dispatch(setSignedInUser());
        logout();
      }
    });
  }, []);

  const columns = [
    {
      headerName: t("ID"),
      field: "id",
      width: 120,
      flex: 1,
    },
    {
      headerName: t("Branch"),
      field: "branch",
      width: 150,
      flex: 2,
      valueGetter: (params) => (params.row?.branch ? params.row?.branch.name : t("Unassigned")),
    },
    {
      headerName: t("Address"),
      field: "address",
      width: 380,
      flex: 3,
      valueGetter: (params) =>
        params.row?.address ? getAddressString(params.row?.address) : t("Unassigned"),
    },
    {
      headerName: t("Client"),
      field: "client",
      width: 150,
      flex: 1,
      valueGetter: (params) => (params.row?.client ? params.row?.client.username : t("Unknown")),
    },
    {
      headerName: t("Stage"),
      field: "stage",
      width: 160,
      flex: 1,
    },
    {
      headerName: t("Sales"),
      field: "sales",
      width: 150,
      flex: 1,
      valueGetter: (params) => (params.row?.sales ? params.row?.sales.username : t("Unassigned")),
    },
    { headerName: t("Created Date"), field: "created", width: 190, flex: 1 },
    {
      headerName: t("Actions"),
      field: "_id",
      width: 170,
      flex: 1,
      renderCell: (params) => {
        return (
          <MDButton
            color="info"
            size="small"
            onClick={() => {
              dispatch(setProject(params.row));
              const projectId = params.row._id;
              navigate(`/projects/${projectId}`);
            }}
          >
            {t("View Details")}
          </MDButton>
        );
      },
    },
  ];

  return (
    <Grid xs={12}>
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
            data={projects}
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
