import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { Grid } from "@mui/material";
import { useGridApiRef } from "@mui/x-data-grid";

import MDBox from "components/MDBox";
import MDButton from "components/MDButton";
import GridTable from "components/common/GridTable";
import MDLinearProgress from "components/MDLinearProgress";
import { setAppointment } from "redux/appointment/appointment.slice";
import { appointmentAPI } from "services/appointmentAPI";
import DateRangeFilter from "../DateRangeFilter";

import {
  isValidDate,
  getFirstDayOfYear,
  getLastDayOfYear,
  getFirstDayOfMonth,
  getLastDayOfMonth,
} from "utils";

import { isAdmin } from "permission";
import { setSnackbar } from "redux/ui/ui.slice";
import moment from "moment";

export default function AppointmentList(props) {
  const { user, data, rowsPerPage, height, onDateRangeChange, hideFilter } = props;

  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const gridApiRef = useGridApiRef();

  const [isLoading, setLoading] = useState();
  const [selectedRow, setSelectedRow] = useState();
  const [searchMode, setSearchMode] = useState("month");
  const [appointments, setAppointments] = useState([]);

  const today = new Date();
  const [searchMonth, setSearchMonth] = useState(today);
  const [searchYear, setSearchYear] = useState(today.getFullYear());
  const [dateRange, setDateRange] = useState([
    getFirstDayOfMonth(today.getFullYear(), today.getMonth()),
    getLastDayOfMonth(today.getFullYear(), today.getMonth()),
  ]);

  useEffect(() => {
    if (data) {
      const rows = data.map((it) => ({
        ...it,
        start: moment.utc(it.start).local().format("yyyy-MM-DD hh:mm:ss"),
        end: moment.utc(it.end).local().format("yyyy-MM-DD hh:mm:ss"),
        created: moment.utc(it.created).local().format("yyyy-MM-DD hh:mm:ss"),
        updated: moment.utc(it.updated).local().format("yyyy-MM-DD hh:mm:ss"),
      }));
      setAppointments(rows);
    }
  }, [data]);

  const handleSelectRow = (row) => {
    setSelectedRow(row);
  };

  const handleCreate = () => {
    dispatch(setAppointment({ address: {} }));
    navigate("/appointments/new/form");
  };

  const handleEdit = () => {
    if (selectedRow) {
      const _id = selectedRow._id;
      appointmentAPI.fetchAppointment(_id).then((r) => {
        if (r.status === 200) {
          dispatch(setAppointment(r.data));
          navigate(`/appointments/${_id}/form`);
        }
      });
    }
  };
  const handleDelete = () => {
    if (selectedRow) {
      const _id = selectedRow._id;
      appointmentAPI.deleteAppointment(_id).then((r) => {
        if (r.status === 200) {
          dispatch(setAppointments(appointments.filter((it) => it._id !== r.data._id)));
          dispatch(
            setSnackbar({
              color: "success",
              icon: "check",
              title: "",
              content: "Deleted Successfully!",
              open: true,
            })
          );
        }
      });
    }
  };
  const columns = [
    {
      headerName: t("Order #"),
      field: "id",
      maxWidth: 180,
      flex: 1,
    },
    {
      headerName: t("Client"),
      field: "client",
      maxWidth: 180,
      flex: 1,
      valueGetter: (params) => (params.row?.client ? params.row?.client.username : t("Unknown")),
    },
    {
      headerName: t("Employee"),
      field: "employee",
      maxWidth: 180,
      flex: 1,
      valueGetter: (params) =>
        params.row?.employee ? params.row?.employee.username : t("Unassigned"),
    },
    { headerName: t("Type"), field: "type", maxWidth: 180, flex: 1 },
    { headerName: t("Start"), field: "start", maxWidth: 180, flex: 1 },
    { headerName: t("End"), field: "end", maxWidth: 180, flex: 1 },
    { headerName: t("Created Date"), field: "created", maxWidth: 250, flex: 2 },
    {
      headerName: t("Actions"),
      field: "_id",
      maxWidth: 150,
      flex: 1,
      renderCell: (params) => {
        return (
          <MDButton
            size="small"
            color="info"
            onClick={() => {
              dispatch(setAppointment(params.row));
              navigate(`/appointments/${params.row._id}`);
            }}
          >
            {t("View Details")}
          </MDButton>
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
        {!hideFilter && (
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
        )}

        <Grid item xs={hideFilter ? 12 : 6}>
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
            <Grid item>
              <MDButton color="info" variant={"outlined"} size="small" onClick={handleDelete}>
                {t("Delete")}
              </MDButton>
            </Grid>
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
            data={appointments}
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
