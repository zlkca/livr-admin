import Dashboard from "layouts/dashboard";
import Tables from "layouts/tables";
import BusinessIcon from "@mui/icons-material/Business";
import BadgeIcon from "@mui/icons-material/Badge";
import GroupsIcon from "@mui/icons-material/Groups";
import AssignmentIcon from "@mui/icons-material/Assignment";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
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
import ProductListPage from "pages/product/ProductList";
import InventoryLocationListPage from "pages/inventory/InventoryLocationList";
import InventoryTransactionListPage from "pages/inventory/InventoryTransactionList";
import InventoryStockListPage from "pages/inventory/InventoryStockList";

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
    icon: <BusinessIcon fontSize="small" color="white" />,
    route: "/branches",
    component: <BranchList />,
  },
  {
    type: "collapse",
    name: "Employees",
    key: "employees",
    icon: <BadgeIcon fontSize="small" color="white" />,
    route: "/employees",
    component: <EmployeeListPage />,
  },
  {
    type: "collapse",
    name: "Clients",
    key: "clients",
    icon: <GroupsIcon fontSize="small" color="white" />,
    route: "/clients",
    component: <ClientListPage />,
  },
  {
    type: "collapse",
    name: "Projects",
    key: "projects",
    icon: <AssignmentIcon fontSize="small" color="white" />,
    route: "/projects",
    component: <ProjectListPage />,
  },
  {
    type: "collapse",
    name: "Appointments",
    key: "appointments",
    icon: <CalendarMonthIcon fontSize="small" color="white" />,
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
  {
    type: "collapse",
    name: "Products",
    key: "products",
    icon: <Icon fontSize="small">table_view</Icon>,
    route: "/products",
    component: <ProductListPage />,
  },

  {
    type: "collapse",
    name: "Inventory Settings",
    key: "settings",
    icon: <Icon fontSize="small">table_view</Icon>,
    route: "/inventoryLocations",
    component: <InventoryLocationListPage />,
  },
  {
    type: "collapse",
    name: "Inventory Transaction",
    key: "settings",
    icon: <Icon fontSize="small">table_view</Icon>,
    route: "/inventoryTransactions",
    component: <InventoryTransactionListPage />,
  },
  {
    type: "collapse",
    name: "Stock",
    key: "inventoryStocks",
    icon: <Icon fontSize="small">table_view</Icon>,
    route: "/inventoryStocks",
    component: <InventoryStockListPage />,
  },
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
