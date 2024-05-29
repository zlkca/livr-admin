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
import FeedbackListPage from "pages/feedback/FeedbackList";
import ProductListPage from "pages/product/ProductList";
import InventoryLocationListPage from "pages/inventory/InventoryLocationList";
import InventoryTransactionListPage from "pages/inventory/InventoryTransactionList";
import InventoryStockListPage from "pages/inventory/InventoryStockList";
import CategoryListPage from "pages/category/CategoryList";
import { Cfg } from "config";

const menus = [
  {
    type: "collapse",
    name: "Dashboard",
    key: "dashboard",
    icon: <Icon fontSize="small">dashboard</Icon>,
    route: "/dashboard",
    component: <Dashboard />,
    enabled: true,
  },
  {
    type: "collapse",
    name: "Branches",
    key: "branches",
    icon: <BusinessIcon fontSize="small" color="white" />,
    route: "/branches",
    component: <BranchList />,
    enabled: Cfg.MultiStore.enabled
  },
  {
    type: "collapse",
    name: "Employees",
    key: "employees",
    icon: <BadgeIcon fontSize="small" color="white" />,
    route: "/employees",
    component: <EmployeeListPage />,
    enabled: true
  },
  {
    type: "collapse",
    name: "Clients",
    key: "clients",
    icon: <GroupsIcon fontSize="small" color="white" />,
    route: "/clients",
    component: <ClientListPage />,
    enabled: true
  },
  {
    type: "collapse",
    name: "Projects",
    key: "projects",
    icon: <AssignmentIcon fontSize="small" color="white" />,
    route: "/projects",
    component: <ProjectListPage />,
    enabled: Cfg.Workflow.enabled
  },
  {
    type: "collapse",
    name: "Appointments",
    key: "appointments",
    icon: <CalendarMonthIcon fontSize="small" color="white" />,
    route: "/appointments",
    component: <AppointmentsPage />,
    enabled: Cfg.Appointment.enabled
  },
  {
    type: "collapse",
    name: "Orders",
    key: "orders",
    icon: <Icon fontSize="small">table_view</Icon>,
    route: "/orders",
    component: <OrderListPage />,
    enabled: true
  },
  {
    type: "collapse",
    name: "Feedbacks",
    key: "feedbacks",
    icon: <Icon fontSize="small">table_view</Icon>,
    route: "/feedbacks",
    component: <FeedbackListPage />,
  },
  {
    name: "Categories",
    key: "categories",
    icon: <Icon fontSize="small">table_view</Icon>,
    route: "/categories",
    component: <CategoryListPage />,
    enabled: Cfg.Product.enabled
  },
  {
    type: "collapse",
    name: "Products",
    key: "products",
    icon: <Icon fontSize="small">table_view</Icon>,
    route: "/products",
    component: <ProductListPage />,
    enabled: Cfg.Product.enabled
  },
  {
    type: "collapse",
    name: "Inventory Settings",
    key: "inventory_settings",
    icon: <Icon fontSize="small">table_view</Icon>,
    route: "/inventoryLocations",
    component: <InventoryLocationListPage />,
    enabled: Cfg.Inventory.enabled
  },
  {
    type: "collapse",
    name: "Inventory Transaction",
    key: "inventory_transaction",
    icon: <Icon fontSize="small">table_view</Icon>,
    route: "/inventoryTransactions",
    component: <InventoryTransactionListPage />,
    enabled: Cfg.Inventory.enabled
  },
  {
    type: "collapse",
    name: "Stock",
    key: "inventory_stocks",
    icon: <Icon fontSize="small">table_view</Icon>,
    route: "/inventoryStocks",
    component: <InventoryStockListPage />,
    enabled: Cfg.Inventory.enabled
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
