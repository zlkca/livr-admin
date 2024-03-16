import { Grid } from "@mui/material";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import BarChartCard from "../../components/dashboard/BarChartCard";
import LineChartCard from "../../components/dashboard/LineChartCard";
import StatisticsCard from "../../components/dashboard/StatisticsCard";

// import { Path } from "../../const";
// import Content from "../../layout/Content";
import { selectClients } from "../../redux/account/account.selector";
import { setClients } from "../../redux/account/account.slice";
// import { selectBreadcrumb } from "../../redux/layout/layout.selector";
// import { setBreadcrumb } from "../../redux/layout/layout.slice";
import { selectProjects } from "../../redux/project/project.selector";
import { setProjects } from "../../redux/project/project.slice";
import { selectPayments } from "../../redux/payment/payment.selector";

// import { fetchProjects } from "../../services/api";
import { accountAPI } from "../../services/accountAPI";
import reportData from "./reportData";
import { getReceivedPaymentMonthly } from "./utils";
import { projectAPI } from "services/projectAPI";
import { selectSignedInUser } from "redux/auth/auth.selector";
import { setPayments } from "redux/payment/payment.slice";
import { paymentAPI } from "services/paymentAPI";
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

const mStyles = {
  root: {
    width: "100%",
  },
  formControl: {
    width: "100%",
    marginBottom: 15,
  },
  col: {
    width: "33%",
    float: "left",
    paddingBottom: 15,
  },
};

export default function DashboardPage() {
  const dispatch = useDispatch();
  const { t } = useTranslation();

  // const { salesDaily, salesMonthly, tasks } = reportData;

  // const branches = useSelector(selectBranches);
  // const projects = useSelector(selectProjects);
  // const payments = useSelector(selectPayments);
  // const roles = useSelector(selectRoles);
  // const signedInUser = useSelector(selectSignedInUser);

  const [orderMap, setOrderMap] = useState({});
  // const [totalAmount, setTotalAmount] = useState(0);
  // const [totalBalance, setTotalBalance] = useState(0);
  const [nProjects, setNumOfProjects] = useState("0");
  const [nClients, setNumOfClients] = useState("0");
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

  const d = new Date();
  const month = d.getMonth();
  const year = d.getFullYear();
  const firstDay = new Date(year, month, 1);
  const fd = `${firstDay.toISOString().split("T")[0]}T00:00:00`;
  const lastDay = new Date(year, month + 1, 0);
  const ld = `${lastDay.toISOString().split("T")[0]}T23:59:59`;

  function getTotalKFromMap(map) {
    let t = 0;
    if (map) {
      if (Object.keys(map).length) {
        Object.keys(map).forEach((k) => (t += map[k]));
        return parseFloat(t / 1000);
      } else {
        return 0;
      }
    } else {
      return t;
    }
  }
  function getOrderMap(orders, branches) {
    let totalMap = {};
    let balanceMap = {};
    let total = 0;
    let balance = 0;
    branches.forEach((it) => {
      totalMap[t(it)] = 0;
      balanceMap[t(it)] = 0;
    });
    for (let d of orders) {
      if (d.taxOpt === "include") {
        totalMap[t(d.branch.name)] += parseFloat(d.amount);
        total += parseFloat(d.amount);
      } else {
        totalMap[t(d.branch.name)] += parseFloat(d.amount) * 1.13;
        total += parseFloat(d.amount) * 1.13;
      }
      balanceMap[t(d.branch.name)] += parseFloat(d.balance);
      balance += parseFloat(d.balance);
    }
    return { totalMap, balanceMap, total, balance };
  }

  // function calcPaymentMap(payments, branches) {
  //   let rMap = {};
  //   let dMap = {};

  //   branches.forEach((it) => {
  //     rMap[it] = 0;
  //     dMap[it] = 0;
  //   });

  //   payments.map((it) => {
  //     if (it.type === "Deposit") {
  //       dMap[it.branch.name] += parseFloat(it.amount);
  //     } else {
  //       rMap[it.branch.name] += parseFloat(it.amount);
  //     }
  //   });
  //   return { rMap, dMap };
  // }

  useEffect(() => {
    branchAPI.fetchBranches().then((r1) => {
      if (r1.status === 200) {
        setReceivableMonthly({ ...receivableMonthly, labels: r1.data.map((it) => it.name) });
        setReceivedMonthly({ ...receivedMonthly, labels: r1.data.map((it) => it.name) });
        dispatch(setBranches(r1.data));
      }
    });

    projectAPI
      .searchProjects({
        created: { $gte: fd, $lte: ld },
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
        role: "client",
        created: { $gte: fd, $lte: ld },
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
  }, []);

  useEffect(() => {
    if (receivableMonthly.labels.length > 0) {
      orderAPI
        .searchOrders({
          created: { $gte: fd, $lte: ld },
        })
        .then((r) => {
          const t = getOrderMap(r.data, receivableMonthly.labels);
          setOrderMap(t);
        });

      // paymentAPI
      //   .searchPayments({
      //     created: { $gte: fd, $lte: ld },
      //   })
      //   .then((r) => {
      //     const p = calcPaymentMap(r.data, receivableMonthly.labels);
      //     setRemainPayMap(p.rMap);
      //     setDepositMap(p.dMap);
      //   });
    }
  }, [receivableMonthly.labels]);
  // useEffect(() => {
  //     dispatch(setBreadcrumb([
  //         {
  //             id: Path.Dashboard,
  //             label: t("Dashboard"),
  //         }
  //     ]));
  // }, []);

  // useEffect(() => {
  //   if (payments && payments.length > 0) {
  //     // get total received payments

  //     // setNumOfPaidClients(Object.keys(clientMap).length);

  //     // salesMonthly: {
  //     //     labels: ["Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
  //     //     datasets: { label: "Mobile apps", data: [50, 40, 300, 320, 500, 350, 200, 230, 500] },
  //     //   },
  //     const data = getReceivedPaymentMonthly(payments);

  //     setReceivedMonthly({
  //       labels: data.months,
  //       datasets: { label: t("Received Payments"), data: data.payments },
  //     });
  //   }
  // }, [payments]);

  useEffect(() => {
    if (orderMap && orderMap.balanceMap && Object.keys(orderMap.balanceMap).length) {
      setReceivableMonthly({
        ...receivableMonthly,
        labels: receivableMonthly.labels.map((k) => t(k)),
        datasets: {
          label: t("Receivable Payments"),
          data: receivableMonthly.labels.map((k) => -parseFloat(orderMap.balanceMap[k])),
        },
      });

      setReceivedMonthly({
        ...receivedMonthly,
        labels: receivedMonthly.labels.map((k) => t(k)),
        datasets: {
          label: t("Received Payments"),
          data: receivedMonthly.labels.map(
            (k) => parseFloat(orderMap.totalMap[k]) + parseFloat(orderMap.balanceMap[k])
          ),
        },
      });
    }
  }, [orderMap]);

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox py={3}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6} lg={2}>
            {orderMap && (
              <StatisticsCard
                color="dark"
                icon="weekend"
                title={t("Clients")}
                count={nClients}
                percentage={{
                  color: "success",
                  amount: "",
                  label: t("this month"),
                }}
              />
            )}
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
                  label: t("this month"),
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
                  label: t("this month"),
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
                  label: t("this month"),
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
                label: t("this month"),
              }}
            />
          </Grid>
        </Grid>

        <Grid container spacing={3} style={{ marginTop: 30 }}>
          <Grid item xs={12} md={4} lg={4}>
            <BarChartCard
              color="#EF5350"
              title={t("Projects")}
              description={t("Monthly projects by stage")}
              date={t("this month")}
              chart={projectsByStage}
            />
          </Grid>
          <Grid item xs={12} md={4} lg={4}>
            <BarChartCard
              color="#747b8a"
              title={t("Clients")}
              description={t("Monthly clients by source")}
              date={t("this month")}
              chart={clientsBySource}
            />
          </Grid>
          <Grid item xs={12} md={4} lg={4}>
            <BarChartCard
              color="#FFA726"
              title={t("Receivable")}
              description={t("Monthly Receivable by branch")}
              date={t("this month")}
              chart={receivableMonthly}
            />
          </Grid>
        </Grid>
        <Grid container spacing={3} style={{ marginTop: 30 }}>
          <Grid item xs={12} md={6} lg={4}>
            <BarChartCard
              color="#1769aa"
              title={t("Received Payments")}
              description={t("Received Payments")}
              date={t("this month")}
              chart={receivedMonthly}
            />
          </Grid>
          {/* <Grid item xs={12} md={6} lg={4}>
            <LineChartCard
              color="#357a38"
              title="daily sales"
              description={
                <>
                  (<strong>+15%</strong>) increase in today sales.
                </>
              }
              date="updated 4 min ago"
              chart={salesDaily}
            />
          </Grid>
          <Grid item xs={12} md={6} lg={4}>
            <LineChartCard
              color="#424242"
              title="completed tasks"
              description="Last Campaign Performance"
              date="just updated"
              chart={tasks}
            />
          </Grid> */}
        </Grid>
      </MDBox>
      <Footer />
    </DashboardLayout>
  );
}
