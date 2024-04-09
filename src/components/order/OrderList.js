import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { Grid } from "@mui/material";
import { gridFilteredSortedRowEntriesSelector, useGridApiRef } from "@mui/x-data-grid";

import MDBox from "components/MDBox";
import VField from "components/VField";
import MDButton from "components/MDButton";
import GridTable from "components/common/GridTable";
import MDLinearProgress from "components/MDLinearProgress";
import { selectOrders } from "redux/order/order.selector";
import { setOrder } from "redux/order/order.slice";
import { orderAPI } from "services/orderAPI";
import DateRangeFilter from "../DateRangeFilter";

import {
  numToString,
  getFinanceSummary,
  isValidDate,
  getFirstDayOfYear,
  getLastDayOfYear,
  getFirstDayOfMonth,
  getLastDayOfMonth,
} from "utils";
import { isAdmin } from "permission";
import { BrandName } from "config";
import { setOrders } from "redux/order/order.slice";
import { setSnackbar } from "redux/ui/ui.slice";
import exportToCsv from "export/exportToCSV";
import { getDefaultDateRange } from "utils";
import CellButton from "components/common/CellButton";
// import exportToExcel from "export/exportToExcel";

export default function OrderList(props) {
  const { user, rowsPerPage, height, onDateRangeChange } = props;

  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const gridApiRef = useGridApiRef();

  const orders = useSelector(selectOrders);
  const [isLoading, setLoading] = useState();
  const [selectedRow, setSelectedRow] = useState();
  const [summary, setSummary] = useState();
  const [searchMode, setSearchMode] = useState("range");

  const today = new Date();
  const [searchMonth, setSearchMonth] = useState(today);
  const [searchYear, setSearchYear] = useState(today.getFullYear());
  const [dateRange, setDateRange] = useState(getDefaultDateRange());

  useEffect(() => {
    if (orders) {
      setSummary(getFinanceSummary(orders));
    }
  }, [orders]);

  const handleFilterModelChange = (newFilterModel) => {
    const filteredRows = gridFilteredSortedRowEntriesSelector(gridApiRef);
    setSummary(getFinanceSummary(filteredRows));
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

  const handleDelete = () => {
    if (selectedRow) {
      const _id = selectedRow._id;
      orderAPI.deleteOrder(_id).then((r) => {
        if (r.status === 200) {
          dispatch(setOrders(orders.filter((it) => it._id !== r.data._id)));
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
  const handleExport = () => {
    const dataToExport = gridFilteredSortedRowEntriesSelector(gridApiRef);
    const dataList = dataToExport.map(({ model }) => [
      model.id,
      model.branch?.name,
      model.sales?.username,
      model.client?.username,
      model.amount,
      model.deposit,
      model.balance,
      model.created,
    ]);

    dataList.unshift([
      "Order #",
      "Branch",
      "Sales",
      "Client",
      "Amount Pre-Tax",
      "Deposit",
      "Balance",
      "Date",
    ]);

    exportToCsv(`${BrandName}-orders-${new Date().toISOString()}.csv`, dataList);
    // exportToExcel(`${BrandName}-orders-${new Date().toISOString()}.xlsx`, dataList);
  };
  const columns = [
    {
      headerName: t("ID"),
      field: "id",
      minWidth: 150,
      flex: 2,
    },
    {
      headerName: t("Branch"),
      field: "branch",
      minWidth: 280,
      flex: 2,
      valueGetter: (params) => (params.row?.branch ? params.row?.branch.name : t("Unassigned")),
    },
    {
      headerName: t("Sales"),
      field: "sales",
      minWidth: 150,
      flex: 1,
      valueGetter: (params) => (params.row?.sales ? params.row?.sales.username : t("Unassigned")),
    },
    {
      headerName: t("Client"),
      field: "client",
      minWidth: 150,
      flex: 1,
      valueGetter: (params) => (params.row?.client ? params.row?.client.username : t("Unknown")),
    },
    {
      headerName: t("pre-tax Total"),
      field: "amount",
      minWidth: 80,
      flex: 1,
    },
    {
      headerName: t("Deposit"),
      field: "deposit",
      minWidth: 80,
      flex: 1,
    },
    {
      headerName: t("Tax Option"),
      field: "taxOpt",
      minWidth: 80,
      flex: 1,
    },
    {
      headerName: t("Balance"),
      field: "balance",
      minWidth: 80,
      flex: 1,
    },
    { headerName: t("Created Date"), field: "created", minWidth: 190, flex: 2 },
    {
      headerName: t("Actions"),
      field: "_id",
      minWidth: 160,
      flex: 1,
      renderCell: (params) => {
        return (
          <CellButton
            onClick={() => {
              dispatch(setOrder(params.row));
              const orderId = params.row._id;
              navigate(`/orders/${orderId}`);
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
            {/* {isAdmin(user) && (
              <Grid item>
                <MDButton color="info" variant={"outlined"} size="small" onClick={handleEdit}>
                  {t("Edit")}
                </MDButton>
              </Grid>
            )} */}
            <Grid item>
              <MDButton color="info" variant={"outlined"} size="small" onClick={handleCreate}>
                {t("Create")}
              </MDButton>
            </Grid>
            {/* {isAdmin(user) && (
              <Grid item>
                <MDButton color="info" variant={"outlined"} size="small" onClick={handleDelete}>
                  {t("Delete")}
                </MDButton>
              </Grid>
            )} */}
            <Grid item>
              <MDButton color="info" variant={"outlined"} size="small" onClick={handleExport}>
                {t("Export")}
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
            data={orders}
            columns={columns}
            onRowClick={handleSelectRow}
            rowsPerPage={rowsPerPage}
            sortModel={[{ field: "created", sort: "desc" }]}
            onFilterModelChange={handleFilterModelChange}
          />
        )}
      </MDBox>
      {summary && (
        <Grid container spacing={2} direction="row" display="flex" px={2} pt={2}>
          <VField label={t("pre-tax Total")} value={numToString(summary.preTax)} />
          <VField label={t("Grand Total")} value={numToString(summary.total)} />
          <VField label={t("Received")} value={numToString(summary.received)} />
          <VField label={t("Receivable")} value={numToString(summary.receivable)} />
        </Grid>
      )}
    </Grid>
  );
}
