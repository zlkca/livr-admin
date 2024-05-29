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

export default function DashboardPage() {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const branches = useSelector(selectBranches);
  const [orderMap, setOrderMap] = useState({});
  const [nProjects, setNumOfProjects] = useState("0");
    
  const [nClients, setNumOfClients] = useState("0");
  const [monthData, setMonth] = useState();

  const d = new Date();
  const [filterMode, setFilterMode] = useState("month");
  const [dateRangeQuery, setDateRangeQuery] = useState({}); // this month
  const [filterMonth, setFilterMonth] = useState(d);
  const [filterYear, setFilterYear] = useState(d.getFullYear());

  const [receivedByBranch, setReceivedByBranch] = useState({
    labels: [],
    datasets: { label: t("Received Payments"), data: [] },
  });

  const [receivableByBranch, setReceivableByBranch] = useState({
    labels: [],
    datasets: { label: t("Receivable Payments"), data: [] },
  });

  const [projectsByStage, setProjectsByStage] = useState({
    labels: Object.keys(StageMap).map((k) => t(k)),
    datasets: { label: t("Projects"), data: [] },
  });

  const [clientsBySource, setClientsBySource] = useState({
    labels: [],
    datasets: { label: t("Clients"), data: [] },
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
    if (filterMode === "year") {
      handleFilterYear(filterYear);
    } else if (filterMode === "month") {
      handleFilterMonth(filterMonth);
    } else {
      setDateRangeQuery({});
    }
  }, [filterMode]);

  useEffect(() => {
    // const d = new Date();
    // const firstDay = getFirstDayOfMonth(d.getFullYear(), d.getMonth());
    // const lastDay = getLastDayOfMonth(d.getFullYear(), d.getMonth());
    // setMonth({ firstDay, lastDay, iMonth: d.getMonth(), year: d.getFullYear() });

    projectAPI.searchProjects({ ...dateRangeQuery }).then((r) => {
      setNumOfProjects(r.data.length);
      const map = { ...StageMap };
      for (let k in map) {
        map[k] = 0;
      }
      for (let i in r.data) {
        const k = r.data[i].stage;
        map[k]++;
      }
      setProjectsByStage({
        ...projectsByStage,
        datasets: {
          label: t("Projects this month"),
          data: Object.values(map),
        },
      });
    });

    accountAPI
      .searchAccounts({
        roles: ["client"],
        ...dateRangeQuery,
      })
      .then((r) => {
        const map = {};
        const arr = [];

        setNumOfClients(r.data.length);

        for (let i in sourceOptions) {
          const k = sourceOptions[i].value;
          map[k] = 0;
        }
        for (let i in r.data) {
          const k = r.data[i].source;
          map[k]++;
        }
        for (let i in sourceOptions) {
          const key = sourceOptions[i].value;
          arr.push({ key, count: map[key] });
        }
        arr.sort((a, b) => b.count - a.count);
        const tops = arr.slice(0, 5);
        setClientsBySource({
          labels: tops.map((it) => t(it.key)),
          datasets: {
            label: t("Top 5 Clients this month"),
            data: tops.map((it) => it.count),
          },
        });
      });
  }, [dateRangeQuery]);

  // orders by branch
  function getOrderMap(orders, branches) {
    let totalMap = {};
    let balanceMap = {};
    let total = 0;
    let balance = 0;

    branches.forEach((b) => {
      totalMap[b._id] = 0;
      balanceMap[b._id] = 0;
    });

    for (let d of orders) {
      if (d.taxOpt === "include") {
        totalMap[d.branch._id] += parseFloat(d.amount);
        total += parseFloat(d.amount);
      } else {
        totalMap[d.branch._id] += parseFloat(d.amount) * 1.13;
        total += parseFloat(d.amount) * 1.13;
      }
      balanceMap[d.branch._id] += parseFloat(d.balance);
      balance += parseFloat(d.balance);
    }
    return { totalMap, balanceMap, total, balance };
  }

  useEffect(() => {
    if (branches && branches.length > 0) {
      orderAPI.searchOrders({ ...dateRangeQuery }).then((r) => {
        const map = getOrderMap(r.data, branches);
        setOrderMap(map);

        setReceivableByBranch({
          ...receivableByBranch,
          labels: branches.map((k) => t(k.name)),
          datasets: {
            label: t("Receivable Payments"),
            data: branches.map((b) => -parseFloat(map.balanceMap[b._id])),
          },
        });

        setReceivedByBranch({
          ...receivedByBranch,
          labels: branches.map((k) => t(k.name)),
          datasets: {
            label: t("Received Payments"),
            data: branches.map(
              (b) => parseFloat(map.totalMap[b._id]) + parseFloat(map.balanceMap[b._id])
            ),
          },
        });
      });
    }
  }, [branches, dateRangeQuery]);

  const handlePrevMonth = () => {
    const m = getPrevMonthRange(monthData.firstDay);
    setMonth(m);
  };

  const handleNextMonth = () => {
    const m = getNextMonthRange(monthData.firstDay);
    setMonth(m);
  };

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
        <Grid container spacing={2} pb={1}>
          <DashboardFilter
            mode={filterMode}
            year={filterYear}
            month={filterMonth}
            onModeChange={handleFilterModeChange}
            onYearChange={handleFilterYear}
            onMonthChange={handleFilterMonth}
          />
          {/* <Grid item>
            <MDButton color="info" variant={"outlined"} size="small" onClick={handlePrevMonth}>
              {t("Prev Month")}
            </MDButton>
          </Grid>
          <Grid item>
            <MDButton color="info" variant={"outlined"} size="small" onClick={handleNextMonth}>
              {t("Next Month")}
            </MDButton>
          </Grid> */}
        </Grid>
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
            {orderMap && (
              <StatisticsCard
                icon="leaderboard"
                title={t("Received")}
                count={numToString(orderMap.total + orderMap.balance)}
                percentage={{
                  color: "success",
                  amount: "",
                  label: getCardLabel(),
                }}
              />
            )}
          </Grid>
          <Grid item xs={12} md={6} lg={2}>
            {orderMap && (
              <StatisticsCard
                color="success"
                icon="store"
                title={t("Receivable")}
                count={numToString(-orderMap.balance)}
                percentage={{
                  color: "success",
                  amount: "",
                  label: getCardLabel(),
                }}
              />
            )}
          </Grid>
          <Grid item xs={12} md={6} lg={2}>
            {orderMap && (
              <StatisticsCard
                color="success"
                icon="store"
                title={t("Total")}
                count={numToString(orderMap.total)}
                percentage={{
                  color: "success",
                  amount: "",
                  label: getCardLabel(),
                }}
              />
            )}
          </Grid>
          <Grid item xs={12} md={6} lg={2}>
            <StatisticsCard
              color="primary"
              icon="person_add"
              title={t("Projects")}
              count={nProjects}
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
              title={t("Projects")}
              description={t("Projects by stage")}
              date={getCardLabel()}
              chart={projectsByStage}
            />
          </Grid>
          <Grid item xs={12} md={4} lg={4}>
            <BarChartCard
              color="#747b8a"
              title={t("Clients")}
              description={t("Clients by source")}
              date={getCardLabel()}
              chart={clientsBySource}
            />
          </Grid>
          <Grid item xs={12} md={4} lg={4}>
            <BarChartCard
              color="#FFA726"
              title={t("Receivable")}
              description={t("Receivable by branch")}
              date={getCardLabel()}
              chart={receivableByBranch}
            />
          </Grid>
        </Grid>
        <Grid container spacing={3} style={{ marginTop: 30 }}>
          <Grid item xs={12} md={6} lg={4}>
            {
              Cfg.MultiStore.enabled &&
                <BarChartCard
                  color="#1769aa"
                  title={t("Received Payments")}
                  description={t("Received Payments")}
                  date={getCardLabel()}
                  chart={receivedByBranch}
                />
            }
          </Grid>
        </Grid>
      </MDBox>
      <Footer />
    </DashboardLayout>
  );
}
