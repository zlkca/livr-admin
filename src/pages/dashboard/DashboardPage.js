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
import { StageMap } from "const";
import { sourceOptions } from "const";
import { orderAPI } from "services/orderAPI";
import { selectBranches } from "redux/branch/branch.selector";
import { branchAPI } from "services/branchAPI";
import { setBranches } from "redux/branch/branch.slice";
import { numToString } from "utils";
import { getFirstDayOfMonth, getLastDayOfMonth, getPrevMonthRange, getNextMonthRange } from "utils";
import MDButton from "components/MDButton";
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

  useEffect(() => {
    const d = new Date();
    const firstDay = getFirstDayOfMonth(d.getFullYear(), d.getMonth());
    const lastDay = getLastDayOfMonth(d.getFullYear(), d.getMonth());
    setMonth({ firstDay, lastDay, iMonth: d.getMonth(), year: d.getFullYear() });
  }, []);

  const [receivedMonthly, setReceivedMonthly] = useState({
    labels: [],
    datasets: { label: t("Received Payments"), data: [] },
  });

  const [receivableMonthly, setReceivableMonthly] = useState({
    labels: [],
    datasets: { label: t("Receivable Payments"), data: [] },
  });

  const [projectsByStage, setProjectsByStage] = useState({
    labels: Object.keys(StageMap).map((k) => t(k)),
    datasets: { label: t("Projects this month"), data: [] },
  });

  const [clientsBySource, setClientsBySource] = useState({
    labels: [],
    datasets: { label: t("Clients this month"), data: [] },
  });

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
    branchAPI.fetchBranches().then((r1) => {
      if (r1.status === 200) {
        setReceivableMonthly({ ...receivableMonthly, labels: r1.data.map((it) => it.name) });
        setReceivedMonthly({ ...receivedMonthly, labels: r1.data.map((it) => it.name) });
        dispatch(setBranches(r1.data));
      }
    });

    if (monthData && monthData.firstDay && monthData.lastDay) {
      projectAPI
        .searchProjects({
          created: {
            $gte: `${monthData.firstDay.toISOString()}`,
            $lte: `${monthData.lastDay.toISOString()}`,
          },
        })
        .then((r) => {
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
          // dispatch(setProjects(r.data));
        });

      accountAPI
        .searchAccounts({
          roles: ["client"],
          created: {
            $gte: `${monthData.firstDay.toISOString()}`,
            $lte: `${monthData.lastDay.toISOString()}`,
          },
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
          // dispatch(setProjects(r.data));
        });
    }
  }, [monthData]);

  useEffect(() => {
    if (branches && branches.length > 0 && monthData && monthData.firstDay && monthData.firstDay) {
      orderAPI
        .searchOrders({
          created: {
            $gte: `${monthData.firstDay.toISOString()}`,
            $lte: `${monthData.lastDay.toISOString()}`,
          },
        })
        .then((r) => {
          const t = getOrderMap(r.data, branches);
          setOrderMap(t);
        });
    }
  }, [branches]);

  useEffect(() => {
    if (orderMap && orderMap.balanceMap && Object.keys(orderMap.balanceMap).length) {
      setReceivableMonthly({
        ...receivableMonthly,
        labels: receivableMonthly.labels.map((k) => t(k)),
        datasets: {
          label: t("Receivable Payments"),
          data: branches.map((b) => -parseFloat(orderMap.balanceMap[b._id])),
        },
      });

      setReceivedMonthly({
        ...receivedMonthly,
        labels: receivedMonthly.labels.map((k) => t(k)),
        datasets: {
          label: t("Received Payments"),
          data: branches.map(
            (b) => parseFloat(orderMap.totalMap[b._id]) + parseFloat(orderMap.balanceMap[b._id])
          ),
        },
      });
    }
  }, [orderMap]);

  const handlePrevMonth = () => {
    const m = getPrevMonthRange(monthData.firstDay);
    setMonth(m);
  };

  const handleNextMonth = () => {
    const m = getNextMonthRange(monthData.firstDay);
    setMonth(m);
  };
  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox pb={0}>
        <Grid container spacing={2} pb={1}>
          <Grid item>
            <MDButton color="info" variant={"outlined"} size="small" onClick={handlePrevMonth}>
              {t("Prev Month")}
            </MDButton>
          </Grid>
          <Grid item>
            <MDButton color="info" variant={"outlined"} size="small" onClick={handleNextMonth}>
              {t("Next Month")}
            </MDButton>
          </Grid>
        </Grid>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6} lg={2}>
            {orderMap && monthData && (
              <StatisticsCard
                color="dark"
                icon="weekend"
                title={t("Clients")}
                count={nClients}
                percentage={{
                  color: "success",
                  amount: "",
                  label: t(months[monthData.iMonth]),
                }}
              />
            )}
          </Grid>
          <Grid item xs={12} md={6} lg={2}>
            {orderMap && monthData && (
              <StatisticsCard
                icon="leaderboard"
                title={t("Received")}
                count={numToString(orderMap.total + orderMap.balance)}
                percentage={{
                  color: "success",
                  amount: "",
                  label: t(months[monthData.iMonth]),
                }}
              />
            )}
          </Grid>
          <Grid item xs={12} md={6} lg={2}>
            {orderMap && monthData && (
              <StatisticsCard
                color="success"
                icon="store"
                title={t("Receivable")}
                count={numToString(-orderMap.balance)}
                percentage={{
                  color: "success",
                  amount: "",
                  label: t(months[monthData.iMonth]),
                }}
              />
            )}
          </Grid>
          <Grid item xs={12} md={6} lg={2}>
            {orderMap && monthData && (
              <StatisticsCard
                color="success"
                icon="store"
                title={t("Total")}
                count={numToString(orderMap.total)}
                percentage={{
                  color: "success",
                  amount: "",
                  label: t(months[monthData.iMonth]),
                }}
              />
            )}
          </Grid>
          <Grid item xs={12} md={6} lg={2}>
            {monthData && (
              <StatisticsCard
                color="primary"
                icon="person_add"
                title={t("Projects")}
                count={nProjects}
                percentage={{
                  color: "success",
                  amount: "",
                  label: t(months[monthData.iMonth]),
                }}
              />
            )}
          </Grid>
        </Grid>
        {monthData && (
          <Grid container spacing={3} style={{ marginTop: 30 }}>
            <Grid item xs={12} md={4} lg={4}>
              <BarChartCard
                color="#EF5350"
                title={t("Projects")}
                description={t("Monthly projects by stage")}
                date={t(months[monthData.iMonth])}
                chart={projectsByStage}
              />
            </Grid>
            <Grid item xs={12} md={4} lg={4}>
              <BarChartCard
                color="#747b8a"
                title={t("Clients")}
                description={t("Monthly clients by source")}
                date={t(months[monthData.iMonth])}
                chart={clientsBySource}
              />
            </Grid>
            <Grid item xs={12} md={4} lg={4}>
              <BarChartCard
                color="#FFA726"
                title={t("Receivable")}
                description={t("Monthly Receivable by branch")}
                date={t(months[monthData.iMonth])}
                chart={receivableMonthly}
              />
            </Grid>
          </Grid>
        )}
        {monthData && (
          <Grid container spacing={3} style={{ marginTop: 30 }}>
            <Grid item xs={12} md={6} lg={4}>
              <BarChartCard
                color="#1769aa"
                title={t("Received Payments")}
                description={t("Received Payments")}
                date={t(months[monthData.iMonth])}
                chart={receivedMonthly}
              />
            </Grid>
          </Grid>
        )}
      </MDBox>
      <Footer />
    </DashboardLayout>
  );
}
