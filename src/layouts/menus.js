import Dashboard from "layouts/dashboard";
import Tables from "layouts/tables";

// @mui icons
import Icon from "@mui/material/Icon";
import ClientList from "pages/client/ClientList";
import EmployeeList from "pages/employee/EmployeeList";
import ProjectList from "pages/project/ProjectList";
import AppointmentList from "pages/appointment/AppointmentList";
import Billing from "layouts/billing";
import PaymentList from "pages/payment/PaymentList";
import OrderList from "pages/order/OrderList";
import BranchList from "pages/branch/BranchList";
import Notifications from "./notifications";

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
    component: <EmployeeList />,
  },
  {
    type: "collapse",
    name: "Clients",
    key: "clients",
    icon: <Icon fontSize="small">table_view</Icon>,
    route: "/clients",
    component: <ClientList />,
  },
  // {
  //   type: "collapse",
  //   name: "Partners",
  //   key: "partners",
  //   icon: <Icon fontSize="small">table_view</Icon>,
  //   route: "/partners",
  //   component: <PartnerList />,
  // },
  {
    type: "collapse",
    name: "Projects",
    key: "projects",
    icon: <Icon fontSize="small">table_view</Icon>,
    route: "/projects",
    component: <ProjectList />,
  },
  {
    type: "collapse",
    name: "Appointments",
    key: "appointments",
    icon: <Icon fontSize="small">table_view</Icon>,
    route: "/appointments",
    component: <AppointmentList />,
  },
  {
    type: "collapse",
    name: "Orders",
    key: "orders",
    icon: <Icon fontSize="small">table_view</Icon>,
    route: "/orders",
    component: <OrderList />,
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
