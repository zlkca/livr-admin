import { Grid } from "@mui/material";
import { useGridApiRef } from "@mui/x-data-grid";
import DateRangeFilter from "components/DateRangeFilter";
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
import { selectSignedInUser } from "redux/auth/auth.selector";
import { setSnackbar } from "redux/ui/ui.slice";
import { accountAPI } from "services/accountAPI";
import { isAdmin } from "permission";
import { isValidDate } from "utils";
import { getFirstDayOfYear } from "utils";
import { getLastDayOfYear } from "utils";
import { getLastDayOfMonth } from "utils";
import { getFirstDayOfMonth } from "utils";
import { logout } from "utils";

export default function ClientList(props) {
  const { user, rowsPerPage, height, onDateRangeChange } = props;
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const gridApiRef = useGridApiRef();

  const signedInUser = useSelector(selectSignedInUser);
  const clients = useSelector(selectClients);
  const [isLoading, setLoading] = useState();
  const [selectedRow, setSelectedRow] = useState();
  const [searchMode, setSearchMode] = useState("month");

  const today = new Date();
  const [searchMonth, setSearchMonth] = useState(today);
  const [searchYear, setSearchYear] = useState(today.getFullYear());
  const [dateRange, setDateRange] = useState([
    getFirstDayOfMonth(today.getFullYear(), today.getMonth()),
    getLastDayOfMonth(today.getFullYear(), today.getMonth()),
  ]);

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

  const handleEdit = () => {
    if (selectedRow) {
      const _id = selectedRow._id;
      accountAPI.fetchAccount(_id).then((r) => {
        if (r.status === 200) {
          dispatch(setClient(r.data));
        }
        navigate(`/clients/${_id}/form`);
      });
    }
  };

  const handleCreate = () => {
    if (isAdmin(signedInUser)) {
      dispatch(setClient({ languages: [] }));
    } else {
      dispatch(
        setClient({
          branch: signedInUser.branch,
          sales: {
            _id: signedInUser._id,
            username: signedInUser.username,
            email: signedInUser.email,
            phone: signedInUser.phone,
          },
          languages: [],
        })
      );
    }
    navigate("/clients/new/form");
  };

  const handleDelete = () => {
    if (selectedRow) {
      const _id = selectedRow._id;
      accountAPI.deleteAccount(_id).then((r) => {
        if (r.status === 200) {
          dispatch(setClients(clients.filter((it) => it._id !== r.data._id)));
          dispatch(
            setSnackbar({
              color: "success",
              icon: "check",
              title: "",
              content: t("Deleted Successfully!"),
              open: true,
            })
          );
        }
      });
    }
  };

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
  const handleSelectRow = (row) => {
    setSelectedRow(row);
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
            <Grid item>
              <MDButton color="info" variant={"outlined"} size="small" onClick={handleEdit}>
                {t("Edit")}
              </MDButton>
            </Grid>
            <Grid item>
              <MDButton color="info" variant={"outlined"} size="small" onClick={handleCreate}>
                {t("Create")}
              </MDButton>
            </Grid>
            {isAdmin(signedInUser) && (
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
            data={clients}
            columns={columns}
            onRowClick={handleSelectRow}
            rowsPerPage={rowsPerPage}
            sortModel={[{ field: "created", sort: "desc" }]}
            // onFilterModelChange={handleFilterModelChange}
          />
        )}
      </MDBox>
    </Grid>
  );
}
