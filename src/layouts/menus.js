import Dashboard from "layouts/dashboard";
import Tables from "layouts/tables";

// @mui icons
import Icon from "@mui/material/Icon";
import EmployeeListPage from "pages/employee/EmployeeListPage";
import ProjectListPage from "pages/project/ProjectListPage";
import AppointmentsPage from "pages/appointment/AppointmentsPage";
import Billing from "layouts/billing";
import BranchList from "pages/branch/BranchList";
import Notifications from "./notifications";
import OrderListPage from "pages/order/OrderListPage";
import ClientListPage from "pages/client/ClientListPage";

const menus = [
  {
    type: "collapse",
    name: "Dashboard",
    key: "dashboard",
    icon: <Icon fontSize="small">dashboard</Icon>,
    route: "/dashboard",
    component: <Dashboard />,
  },
  {
    type: "collapse",
    name: "Branches",
    key: "branches",
    icon: <Icon fontSize="small">table_view</Icon>,
    route: "/branches",
    component: <BranchList />,
  },
  {
    type: "collapse",
    name: "Employees",
    key: "employees",
    icon: <Icon fontSize="small">table_view</Icon>,
    route: "/employees",
    component: <EmployeeListPage />,
  },
  {
    type: "collapse",
    name: "Clients",
    key: "clients",
    icon: <Icon fontSize="small">table_view</Icon>,
    route: "/clients",
    component: <ClientListPage />,
  },
  {
    type: "collapse",
    name: "Projects",
    key: "projects",
    icon: <Icon fontSize="small">table_view</Icon>,
    route: "/projects",
    component: <ProjectListPage />,
  },
  {
    type: "collapse",
    name: "Appointments",
    key: "appointments",
    icon: <Icon fontSize="small">table_view</Icon>,
    route: "/appointments",
    component: <AppointmentsPage />,
  },
  {
    type: "collapse",
    name: "Orders",
    key: "orders",
    icon: <Icon fontSize="small">table_view</Icon>,
    route: "/orders",
    component: <OrderListPage />,
  },
  // {
  //   type: "collapse",
  //   name: "Payments",
  //   key: "payments",
  //   icon: <Icon fontSize="small">table_view</Icon>,
  //   route: "/payments",
  //   component: <PaymentList />,
  // },
  // {
  //   type: "collapse",
  //   name: "Billing",
  //   key: "billing",
  //   icon: <Icon fontSize="small">receipt_long</Icon>,
  //   route: "/billing",
  //   component: <Billing />,
  // },
  // {
  //   type: "collapse",
  //   name: "RTL",
  //   key: "rtl",
  //   icon: <Icon fontSize="small">format_textdirection_r_to_l</Icon>,
  //   route: "/rtl",
  //   component: <RTL />,
  // },
  // {
  //   type: "collapse",
  //   name: "Notifications",
  //   key: "notifications",
  //   icon: <Icon fontSize="small">notifications</Icon>,
  //   route: "/notifications",
  //   component: <Notifications />,
  // },
  // {
  //   type: "collapse",
  //   name: "Profile",
  //   key: "profile",
  //   icon: <Icon fontSize="small">person</Icon>,
  //   route: "/profile",
  //   component: <Profile />,
  // },
];

export default menus;
