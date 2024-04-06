import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { Grid } from "@mui/material";
import { gridFilteredSortedRowEntriesSelector, useGridApiRef } from "@mui/x-data-grid";

import MDBox from "components/MDBox";
import MDButton from "components/MDButton";
import GridTable from "components/common/GridTable";
import MDLinearProgress from "components/MDLinearProgress";
import { selectProjects } from "redux/project/project.selector";
import { setProject } from "redux/project/project.slice";
import { projectAPI } from "services/projectAPI";
import DateRangeFilter from "../DateRangeFilter";

import {
  getFinanceSummary,
  isValidDate,
  getFirstDayOfYear,
  getLastDayOfYear,
  getFirstDayOfMonth,
  getLastDayOfMonth,
} from "utils";

import { isAdmin } from "permission";
import { generateProjectNumber } from "utils";
import { getAddressString } from "utils";
import { setProjects } from "redux/project/project.slice";
import { setSnackbar } from "redux/ui/ui.slice";
import { orderAPI } from "services/orderAPI";
import { setOrder } from "redux/order/order.slice";
import { getDefaultDateRange } from "utils";
import CellButton from "components/common/CellButton";

export default function ProjectList(props) {
  const { user, rowsPerPage, height, onDateRangeChange } = props;

  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const gridApiRef = useGridApiRef();

  const projects = useSelector(selectProjects);
  const [isLoading, setLoading] = useState();
  const [selectedRow, setSelectedRow] = useState();
  const [searchMode, setSearchMode] = useState("range");

  const today = new Date();
  const [searchMonth, setSearchMonth] = useState(today);
  const [searchYear, setSearchYear] = useState(today.getFullYear());
  const [dateRange, setDateRange] = useState(getDefaultDateRange());

  const handleSelectRow = (row) => {
    setSelectedRow(row);
  };

  const handleEdit = () => {
    if (selectedRow) {
      const _id = selectedRow._id;
      projectAPI.fetchProject(_id).then((r) => {
        if (r.status === 200) {
          dispatch(setProject(r.data));
          navigate(`/projects/${_id}/form`);
        }
      });
    }
  };
  const handleDelete = () => {
    if (selectedRow) {
      const _id = selectedRow._id;
      projectAPI.deleteProject(_id).then((r) => {
        if (r.status === 200) {
          dispatch(setProjects(projects.filter((it) => it._id !== r.data._id)));
          dispatch(
            setSnackbar({
              color: "success",
              icon: "check",
              title: "",
              content: t("Deleted Successfully!"),
              open: true,
            })
          );
          navigate(`/projects`);
        }
      });
    }
  };
  const handleCreate = () => {
    const id = generateProjectNumber();
    if (isAdmin(user)) {
      dispatch(setProject({ id, address: {} }));
    } else {
      dispatch(
        setProject({
          id,
          address: {},
          branch: user.branch,
          sales: {
            _id: user._id,
            username: user.username,
            email: user.email,
            phone: user.phone,
            branch: user.branch,
          },
        })
      );
    }
    navigate("/projects/new/form");
  };

  const columns = [
    {
      headerName: t("ID"),
      field: "id",
      minWidth: 150,
      flex: 1,
    },
    {
      headerName: t("Branch"),
      field: "branch",
      minWidth: 260,
      flex: 2,
      valueGetter: (params) => (params.row?.branch ? params.row?.branch.name : t("Unassigned")),
    },
    {
      headerName: t("Address"),
      field: "address",
      minWidth: 380,
      flex: 3,
      valueGetter: (params) =>
        params.row?.address ? getAddressString(params.row?.address) : t("Unassigned"),
    },
    {
      headerName: t("Client"),
      field: "client",
      minWidth: 150,
      flex: 1,
      valueGetter: (params) => (params.row?.client ? params.row?.client.username : t("Unknown")),
    },
    {
      headerName: t("Stage"),
      field: "stage",
      minWidth: 160,
      flex: 1,
    },
    {
      headerName: t("Sales"),
      field: "sales",
      minWidth: 150,
      flex: 1,
      valueGetter: (params) => (params.row?.sales ? params.row?.sales.username : t("Unassigned")),
    },
    {
      headerName: t("Measure"),
      field: "measure",
      minWidth: 150,
      flex: 1,
      valueGetter: (params) =>
        params.row?.measure ? params.row?.measure.username : t("Unassigned"),
    },
    {
      headerName: t("Install"),
      field: "install",
      minWidth: 150,
      flex: 1,
      valueGetter: (params) =>
        params.row?.install ? params.row?.install.username : t("Unassigned"),
    },
    { headerName: t("Created Date"), field: "created", minWidth: 190, flex: 1 },
    {
      headerName: t("Actions"),
      field: "_id",
      minWidth: 160,
      flex: 1,
      renderCell: (params) => {
        return (
          <CellButton
            onClick={() => {
              dispatch(setProject(params.row));
              orderAPI.searchOrders({ id: params.row.id }).then((r) => {
                if (r.data && r.data.length > 0) {
                  dispatch(setOrder(r.data[0]));
                } else {
                  dispatch(setOrder());
                }
                navigate(`/projects/${params.row._id}`);
              });
            }}
          >
            {t("View Details")}
          </CellButton>
        );
      },
    },
  ];

  const handleSearchModeChange = (mode) => {
    if (mode === "year") {
      setSearchMode("year");
      handleSearchYear(searchYear);
    } else if (mode === "month") {
      setSearchMode("month");
      handleSearchMonth(searchMonth);
    } else {
      setSearchMode("range");
      handleDateRangeChange(dateRange);
    }
  };

  const handleSearchMonth = (d) => {
    if (d && isValidDate(d)) {
      const m = d.getMonth();
      const y = d.getFullYear();
      const firstDay = getFirstDayOfMonth(y, m);
      const lastDay = getLastDayOfMonth(y, m);
      const fd = `${firstDay.toISOString()}`;
      const ld = `${lastDay.toISOString()}`;
      setSearchMonth(d);
      onDateRangeChange(fd, ld);
    }
  };

  const handleSearchYear = (year) => {
    if (year && year < 10000 && year > 1900) {
      const firstDay = getFirstDayOfYear(year);
      const lastDay = getLastDayOfYear(year);
      const fd = `${firstDay.toISOString()}`;
      const ld = `${lastDay.toISOString()}`;
      setSearchYear(year);
      onDateRangeChange(fd, ld);
    }
  };

  const handleDateRangeChange = (range) => {
    if (range) {
      setDateRange(range);
      const fd = `${range[0].toISOString()}`;
      const ld = `${range[1].toISOString()}`;
      onDateRangeChange(fd, ld);
    } else {
      const today = new Date();
      const firstDay = getFirstDayOfMonth(today.getFullYear(), today.getMonth());
      const lastDay = getLastDayOfMonth(today.getFullYear(), today.getMonth());
      setDateRange([firstDay, lastDay]);
      const fd = `${firstDay.toISOString()}`;
      const ld = `${lastDay.toISOString()}`;
      onDateRangeChange(fd, ld);
    }
  };

  return (
    <Grid xs={12} style={{ height: height + 100 }}>
      <Grid container display="flex" justifyContent={"flex-start"}>
        <Grid item xs={6}>
          <DateRangeFilter
            mode={searchMode}
            year={searchYear}
            month={searchMonth}
            range={dateRange}
            onModeChange={handleSearchModeChange}
            onYearChange={handleSearchYear}
            onMonthChange={handleSearchMonth}
            onRangeChange={handleDateRangeChange}
          />
        </Grid>

        <Grid item xs={6}>
          <Grid container spacing={2} direction="row" justifyContent="flex-end">
            {isAdmin(user) && (
              <Grid item>
                <MDButton color="info" variant={"outlined"} size="small" onClick={handleEdit}>
                  {t("Edit")}
                </MDButton>
              </Grid>
            )}
            <Grid item>
              <MDButton color="info" variant={"outlined"} size="small" onClick={handleCreate}>
                {t("Create")}
              </MDButton>
            </Grid>
            {isAdmin(user) && (
              <Grid item>
                <MDButton color="info" variant={"outlined"} size="small" onClick={handleDelete}>
                  {t("Delete")}
                </MDButton>
              </Grid>
            )}
          </Grid>
        </Grid>
      </Grid>
      <MDBox pt={0} px={0} style={{ height: height, marginTop: 20 }}>
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
            autoPageSize
            apiRef={gridApiRef}
            data={projects}
            columns={columns}
            onRowClick={handleSelectRow}
            rowsPerPage={rowsPerPage}
            sortModel={[{ field: "created", sort: "desc" }]}
          />
        )}
      </MDBox>
    </Grid>
  );
}
