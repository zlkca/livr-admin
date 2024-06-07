import { Grid } from "@mui/material";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import BarChartCard from "../../components/dashboard/BarChartCard";
import StatisticsCard from "../../components/dashboard/StatisticsCard";

// import { fetchProjects } from "../../services/api";
import { accountAPI } from "../../services/accountAPI";

import { projectAPI } from "services/projectAPI";

import Footer from "layouts/Footer";
import DashboardLayout from "layouts/DashboardLayout";
import DashboardNavbar from "layouts/DashboardNavbar";
import MDBox from "components/MDBox";
import { StageMap, sourceOptions } from "const";
import { orderAPI } from "services/orderAPI";
import { selectBranches } from "redux/branch/branch.selector";
import { branchAPI } from "services/branchAPI";
import { setBranches } from "redux/branch/branch.slice";
import { getFirstDayOfMonth, getLastDayOfMonth, getPrevMonthRange, getNextMonthRange } from "utils";
import MDButton from "components/MDButton";
import DashboardFilter from "components/DashboardFilter";
import { numToString, isValidDate, getFirstDayOfYear, getLastDayOfYear } from "utils";
import { Cfg } from "config";

const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

export default function DashboardSingleStore() {
  const dispatch = useDispatch();
  const { t } = useTranslation();

  const [orderMap, setOrderMap] = useState({});
  const [nOrders, setNumOfOrders] = useState("0");
  const [nClients, setNumOfClients] = useState("0");
  const [revenue, setRevenue] = useState("0");
  const [monthData, setMonth] = useState();

  const d = new Date();
  const [filterMode, setFilterMode] = useState("year");
  const [dateRangeQuery, setDateRangeQuery] = useState({}); // this month
  const [filterMonth, setFilterMonth] = useState(d);
  const [filterYear, setFilterYear] = useState(d.getFullYear());

  const [ordersByMonth, setOrdersByMonth] = useState({
    labels: [],
    datasets: { label: t("Number of orders by month"), data: [] },
  });

  const [revenueByMonth, setRevenueByMonth] = useState({
    labels: [],
    datasets: { label: t("Revenue by month"), data: [] },
  });

  const [clientsByMonth, setClientsByMonth] = useState({
    labels: [],
    datasets: { label: t("Number of clients by month"), data: [] },
  });

  const handleFilterModeChange = (mode) => {
    if (mode === "year") {
      setFilterMode("year");
      handleFilterYear(filterYear);
    } else if (mode === "month") {
      setFilterMode("month");
      handleFilterMonth(filterMonth);
    } else {
      setFilterMode("all");
    }
  };

  const handleFilterMonth = (d) => {
    if (d && isValidDate(d)) {
      const m = d.getMonth();
      const y = d.getFullYear();
      const firstDay = getFirstDayOfMonth(y, m);
      const lastDay = getLastDayOfMonth(y, m);
      const fd = `${firstDay.toISOString()}`;
      const ld = `${lastDay.toISOString()}`;
      setDateRangeQuery({
        created: {
          $gte: fd,
          $lte: ld,
        },
      });
      setFilterMonth(firstDay);
    }
  };

  const handleFilterYear = (year) => {
    if (year && year < 10000 && year > 1900) {
      const firstDay = getFirstDayOfYear(year);
      const lastDay = getLastDayOfYear(year);
      const fd = `${firstDay.toISOString()}`;
      const ld = `${lastDay.toISOString()}`;
      setDateRangeQuery({
        created: {
          $gte: fd,
          $lte: ld,
        },
      });
      setFilterYear(year);
    }
  };

  useEffect(() => {
    branchAPI.fetchBranches().then((r1) => {
      if (r1.status === 200) {
        dispatch(setBranches(r1.data));
      }
    });
  }, []);

  useEffect(() => {
    handleFilterYear(filterYear);
  }, [filterMode]);

  const getCountMap = (data) => {
    const map = {};
    for (let k = 1; k <= 12; k++) {
      map[k] = 0;
    }
    for (let i in data) {
      const month = parseInt(data[i].created.split("-")[1]);
      map[month]++;
    }
    return map;
  };

  function getOrderMap(orders) {
    const map = {};
    for (let k = 1; k <= 12; k++) {
      map[k] = { revenue: 0, count: 0 };
    }
    for (let i in orders) {
      const d = orders[i];
      const month = parseInt(d.created.split("-")[1]);
      if (d.taxOpt === "include") {
        map[month].revenue += parseFloat(d.amount);
      } else {
        map[month].revenue += parseFloat(d.amount) * 1.13;
      }
      map[month].count++;
    }

    return map;
  }

  useEffect(() => {
    accountAPI
      .searchAccounts({
        roles: ["client"],
        ...dateRangeQuery,
      })
      .then((r) => {
        setNumOfClients(r.data.length);
        const map = getCountMap(r.data);

        setClientsByMonth({
          labels: Object.keys(map).map((it) => t(it)),
          datasets: {
            label: t("number of clients by month"),
            data: Object.values(map),
          },
        });
      });
  }, [dateRangeQuery]);

  useEffect(() => {
    orderAPI.searchOrders({ ...dateRangeQuery }).then((r) => {
      const map = getOrderMap(r.data);
      setOrderMap(map);
      setNumOfOrders(r.data.length);
      const rev = Object.values(map).reduce((a, c) => a + c.revenue, 0);
      setRevenue(rev);

      setRevenueByMonth({
        ...revenueByMonth,
        labels: Object.keys(map).map((it) => t(it)),
        datasets: {
          label: t("Revenue by month"),
          data: Object.values(map).map((it) => it.revenue),
        },
      });

      setOrdersByMonth({
        ...ordersByMonth,
        labels: Object.keys(map).map((it) => t(it)),
        datasets: {
          label: t("Number of Order by month"),
          data: Object.values(map).map((it) => it.count),
        },
      });
    });
  }, [dateRangeQuery]);

  const getCardLabel = () => {
    if (filterMode === "year") {
      return filterYear;
    } else if (filterMode === "month") {
      return t(months[filterMonth.getMonth()]);
    } else {
      return t("All");
    }
  };

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox pb={0}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6} lg={2}>
            <StatisticsCard
              color="dark"
              icon="weekend"
              title={t("Clients")}
              count={nClients}
              percentage={{
                color: "success",
                amount: "",
                label: getCardLabel(),
              }}
            />
          </Grid>

          <Grid item xs={12} md={6} lg={2}>
            <StatisticsCard
              color="success"
              icon="store"
              title={t("Revenue")}
              count={numToString(parseFloat(revenue))}
              percentage={{
                color: "success",
                amount: "",
                label: getCardLabel(),
              }}
            />
          </Grid>
          <Grid item xs={12} md={6} lg={2}>
            <StatisticsCard
              color="primary"
              icon="person_add"
              title={t("Orders")}
              count={nOrders}
              percentage={{
                color: "success",
                amount: "",
                label: getCardLabel(),
              }}
            />
          </Grid>
        </Grid>
        <Grid container spacing={3} style={{ marginTop: 30 }}>
          <Grid item xs={12} md={4} lg={4}>
            <BarChartCard
              color="#EF5350"
              title={t("Clients")}
              description={t("Clients by month")}
              date={getCardLabel()}
              chart={clientsByMonth}
            />
          </Grid>
          <Grid item xs={12} md={4} lg={4}>
            <BarChartCard
              color="#747b8a"
              title={t("Orders")}
              description={t("Orders by month")}
              date={getCardLabel()}
              chart={ordersByMonth}
            />
          </Grid>
          <Grid item xs={12} md={4} lg={4}>
            <BarChartCard
              color="#FFA726"
              title={t("Revenue")}
              description={t("Revenue by month")}
              date={getCardLabel()}
              chart={revenueByMonth}
            />
          </Grid>
        </Grid>
      </MDBox>
      <Footer />
    </DashboardLayout>
  );
}
