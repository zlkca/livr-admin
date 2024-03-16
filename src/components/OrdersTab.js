import { Grid } from "@mui/material";
import { gridFilteredSortedRowEntriesSelector, useGridApiRef } from "@mui/x-data-grid";
import MDBox from "components/MDBox";
import MDButton from "components/MDButton";
import MDDateRangePicker from "components/MDDateRangePicker";
import MDLinearProgress from "components/MDLinearProgress";
// import MDSection from "components/MDSection";
import VField from "components/VField";
import GridTable from "components/common/GridTable";
// import { set } from "date-fns";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { selectOrders } from "redux/order/order.selector";
import { setOrders } from "redux/order/order.slice";
import { setOrder } from "redux/order/order.slice";
import { on } from "rsuite/esm/DOMHelper";
import { orderAPI } from "services/orderAPI";
import { numToString } from "utils";
import { calcSummary } from "utils";
import { logout } from "utils";
import MDMonthPicker from "./MDMonthPicker";
import MDYearPicker from "./MDYearPicker";
import DateRangeFilter from "./DateRangeFilter";
import { isValidDate } from "utils";
import { getFirstDayOfYear } from "utils";
import { getLastDayOfYear } from "utils";
import { set } from "date-fns";
import { getFirstDayOfMonth } from "utils";
import { getLastDayOfMonth } from "utils";

export default function OrdersTab(props) {
  const d = new Date();
  const month = d.getMonth();
  const year = d.getFullYear();
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0, 23, 59, 59);

  const { branch, onDateRangeChange } = props;
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const gridApiRef = useGridApiRef();

  const orders = useSelector(selectOrders);
  const [isLoading, setLoading] = useState();
  const [selectedRow, setSelectedRow] = useState();
  const [summary, setSummary] = useState();

  const [searchMode, setSearchMode] = useState("month");
  const [searchMonth, setSearchMonth] = useState(new Date());
  const [searchYear, setSearchYear] = useState(new Date().getFullYear());
  const [dateRange, setDateRange] = useState([firstDay, lastDay]);

  const handleFilterModelChange = (newFilterModel) => {
    const filteredRows = gridFilteredSortedRowEntriesSelector(gridApiRef);
    setSummary(calcSummary(filteredRows));
  };

  const handleSelectRow = (row) => {
    setSelectedRow(row);
  };

  const handleCreate = () => {
    dispatch(setOrder({ address: {} }));
    navigate("/orders/new/form");
  };

  const handleEdit = () => {
    if (selectedRow) {
      const _id = selectedRow._id;
      orderAPI.fetchOrder(_id).then((r) => {
        if (r.status === 200) {
          dispatch(setOrder(r.data));
          navigate(`/orders/${_id}/form`);
        }
      });
    }
  };

  const columns = [
    {
      headerName: t("ID"),
      field: "id",
      width: 120,
      flex: 2,
    },
    {
      headerName: t("Branch"),
      field: "branch",
      width: 180,
      flex: 2,
      valueGetter: (params) => (params.row?.branch ? params.row?.branch.name : t("Unassigned")),
    },
    {
      headerName: t("Sales"),
      field: "sales",
      width: 150,
      flex: 1,
      valueGetter: (params) => (params.row?.sales ? params.row?.sales.username : t("Unassigned")),
    },
    {
      headerName: t("Client"),
      field: "client",
      width: 150,
      flex: 1,
      valueGetter: (params) => (params.row?.client ? params.row?.client.username : t("Unknown")),
    },
    {
      headerName: t("Amount"),
      field: "amount",
      width: 80,
      flex: 1,
    },
    {
      headerName: t("Deposit"),
      field: "deposit",
      width: 80,
      flex: 1,
    },
    {
      headerName: t("Tax"),
      field: "taxOpt",
      width: 80,
      flex: 1,
    },
    { headerName: t("Created Date"), field: "created", width: 190, flex: 2 },
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
              dispatch(setOrder(params.row));
              const orderId = params.row._id;
              navigate(`/orders/${orderId}`);
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
      setDateRange([firstDay, lastDay]);
      const fd = `${firstDay.toISOString()}`;
      const ld = `${lastDay.toISOString()}`;
      onDateRangeChange(fd, ld);
    }
  };
  return (
    <Grid xs={12} style={{ height: 400 }}>
      <Grid container display="flex" justifyContent={"flex-start"}>
        <Grid item xs={6}>
          {/* {dateRange && (
            <MDDateRangePicker range={dateRange} onChange={handleDateRangeChange} />
          )} */}
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
          </Grid>
        </Grid>
      </Grid>
      <MDBox pt={0} px={0} style={{ height: 300, marginTop: 20 }}>
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
            data={orders}
            columns={columns}
            onRowClick={handleSelectRow}
            rowsPerPage={6}
            sortModel={[{ field: "created", sort: "desc" }]}
            onFilterModelChange={handleFilterModelChange}
          />
        )}
      </MDBox>
      {summary && (
        <Grid container spacing={2} direction="row" display="flex" px={2} pt={2}>
          <VField label={t("Amount")} value={numToString(summary.total)} />
          <VField label={t("Received")} value={numToString(summary.received)} />
          <VField label={t("Receivable")} value={numToString(summary.receivable)} />
        </Grid>
      )}
    </Grid>
  );
}
