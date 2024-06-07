import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Grid } from "@mui/material";
import { useGridApiRef } from "@mui/x-data-grid";

import DateRangeFilter from "components/DateRangeFilter";
import MDBox from "components/MDBox";
import MDButton from "components/MDButton";
import MDLinearProgress from "components/MDLinearProgress";
import GridTable from "components/common/GridTable";

import { selectEmployees } from "redux/account/account.selector";
import { setEmployees } from "redux/account/account.slice";
import { setEmployee } from "redux/account/account.slice";
import { selectSignedInUser } from "redux/auth/auth.selector";
import { setSnackbar } from "redux/ui/ui.slice";
import { accountAPI } from "services/accountAPI";
import { isAdmin } from "permission";
import {
  isValidDate,
  getFirstDayOfYear,
  getLastDayOfYear,
  getLastDayOfMonth,
  getFirstDayOfMonth,
  getDefaultDateRange,
} from "utils";
import CellButton from "components/common/CellButton";
import { Cfg } from "config";

export default function EmployeeList(props) {
  const { user, rowsPerPage, height, onDateRangeChange } = props;
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const gridApiRef = useGridApiRef();

  const signedInUser = useSelector(selectSignedInUser);
  const employees = useSelector(selectEmployees);
  const [isLoading, setLoading] = useState();
  const [selectedRow, setSelectedRow] = useState();
  const [searchMode, setSearchMode] = useState("range");

  const today = new Date();
  const [searchMonth, setSearchMonth] = useState(today);
  const [searchYear, setSearchYear] = useState(today.getFullYear());
  const [dateRange, setDateRange] = useState(getDefaultDateRange());

  let columns = [
    { headerName: t("Username"), field: "username", minWidth: 180, flex: 1 },
    { headerName: t("Email"), field: "email", minWidth: 280, flex: 1.5 },
    { headerName: t("Phone"), field: "phone", minWidth: 160, flex: 1 },
    { headerName: t("Status"), field: "status", minWidth: 120, flex: 1 },
  ];

  if (Cfg.MultiStore.enabled) {
    columns.push({
      headerName: t("Roles"),
      field: "roles",
      minWidth: 260,
      flex: 1,
      valueGetter: (params) => (params.row?.roles ? params.row?.roles.join(", ") : t("Unknown")),
    });
    columns.push({
      headerName: t("Branch"),
      field: "branch",
      minWidth: 300,
      valueGetter: (params) => (params.row?.branch ? params.row?.branch.name : t("N/A")),
      flex: 1,
    });
  }

  columns = columns.concat([
    { headerName: t("Created Date"), field: "created", minWidth: 200, flex: 1 },
    {
      headerName: t("Actions"),
      field: "_id",
      minWidth: 160,
      flex: 1,
      renderCell: (params) => {
        return (
          <CellButton
            onClick={(e) => {
              dispatch(setEmployee(params.row));
              navigate(`/employees/${params.row._id}`);
            }}
          >
            {t("View Details")}
          </CellButton>
        );
      },
    },
  ]);

  const handleEdit = () => {
    if (selectedRow) {
      const _id = selectedRow._id;
      accountAPI.fetchAccount(_id).then((r) => {
        if (r.status === 200) {
          dispatch(setEmployee(r.data));
        }
        navigate(`/employees/${_id}/form`);
      });
    }
  };

  const handleActivate = () => {
    if (selectedRow) {
      const _id = selectedRow._id;
      accountAPI.updateAccount(_id, { status: "active" }).then((r) => {
        if (r.status === 200) {
          dispatch(setEmployee(r.data));
          const es = employees.map((e) => {
            if (e._id === _id) {
              return {
                ...e,
                status: "active",
              };
            } else {
              return e;
            }
          });
          dispatch(
            setSnackbar({
              color: "success",
              icon: "check",
              title: "",
              content: t("Updated Successfully!"),
              open: true,
            })
          );
          dispatch(setEmployees(es));
        }
      });
    }
  };

  const handleSuspend = () => {
    if (selectedRow) {
      const _id = selectedRow._id;
      accountAPI.updateAccount(_id, { status: "suspend" }).then((r) => {
        if (r.status === 200) {
          dispatch(setEmployee(r.data));
          const es = employees.map((e) => {
            if (e._id === _id) {
              return {
                ...e,
                status: "suspend",
              };
            } else {
              return e;
            }
          });
          dispatch(
            setSnackbar({
              color: "success",
              icon: "check",
              title: "",
              content: t("Updated Successfully!"),
              open: true,
            })
          );
          dispatch(setEmployees(es));
        }
      });
    }
  };

  const handleCreate = () => {
    if (isAdmin(signedInUser)) {
      dispatch(setEmployee({}));
    } else {
      dispatch(
        setEmployee({
          branch: signedInUser.branch,
          sales: {
            _id: signedInUser._id,
            username: signedInUser.username,
            email: signedInUser.email,
            phone: signedInUser.phone,
          },
        })
      );
    }
    navigate("/employees/new/form");
  };

  const handleDelete = () => {
    if (selectedRow) {
      const _id = selectedRow._id;
      accountAPI.deleteAccount(_id).then((r) => {
        if (r.status === 200) {
          dispatch(setEmployees(employees.filter((it) => it._id !== r.data._id)));
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
        <Grid item xs={10} md={3}>
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

        <Grid item xs={2} md={9}>
          <Grid container spacing={2} direction="row" justifyContent="flex-end">
            {/* {selectedRow && selectedRow.status !== "active" && (
              <Grid item>
                <MDButton color="info" variant={"outlined"} size="small" onClick={handleActivate}>
                  {t("Activate")}
                </MDButton>
              </Grid>
            )}
            {selectedRow && selectedRow.status === "active" && (
              <Grid item>
                <MDButton color="info" variant={"outlined"} size="small" onClick={handleSuspend}>
                  {t("Deactivate")}
                </MDButton>
              </Grid>
            )}
            <Grid item>
              <MDButton color="info" variant={"outlined"} size="small" onClick={handleEdit}>
                {t("Edit")}
              </MDButton>
            </Grid> */}
            <Grid item>
              <MDButton color="info" variant={"outlined"} size="small" onClick={handleCreate}>
                {t("Create")}
              </MDButton>
            </Grid>
            {/* <Grid item>
              <MDButton color="info" variant={"outlined"} size="small" onClick={handleDelete}>
                {t("Delete")}
              </MDButton>
            </Grid> */}
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
            data={employees}
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
