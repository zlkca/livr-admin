/**
=========================================================
* Material Dashboard 2 React - v2.2.0
=========================================================

* Product Page: https://www.creative-tim.com/product/material-dashboard-react
* Copyright 2023 Creative Tim (https://www.creative-tim.com)

Coded by www.creative-tim.com

 =========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
*/

import { Navigate, Route, Routes } from "react-router-dom";

/** 
  All of the routes for the Material Dashboard 2 React are added here,
  You can add a new route, customize the routes and delete the routes here.

  Once you add a new route on this file it will be visible automatically on
  the Sidenav.

  For adding a new route you can follow the existing routes in the routes array.
  1. The `type` key with the `collapse` value is used for a route.
  2. The `type` key with the `title` value is used for a title inside the Sidenav. 
  3. The `type` key with the `divider` value is used for a divider between Sidenav items.
  4. The `name` key is used for the name of the route on the Sidenav.
  5. The `key` key is used for the key of the route (It will help you with the key prop inside a loop).
  6. The `icon` key is used for the icon of the route on the Sidenav, you have to add a node.
  7. The `collapse` key is used for making a collapsible item on the Sidenav that has other routes
  inside (nested routes), you need to pass the nested routes inside an array as a value for the `collapse` key.
  8. The `route` key is used to store the route location which is used for the react router.
  9. The `href` key is used to store the external links location.
  10. The `title` key is only for the item with the type of `title` and its used for the title text on the Sidenav.
  10. The `component` key is used to store the component of its route.
*/

// Material Dashboard 2 React layouts
import Dashboard from "layouts/dashboard";
import Tables from "layouts/tables";
import Billing from "layouts/billing";
import RTL from "layouts/rtl";
import Notifications from "layouts/notifications";
import Profile from "layouts/profile";

// @mui icons
import Icon from "@mui/material/Icon";

import ChangePassword from "pages/auth/ChangePassword";
import SignIn from "pages/auth/SignIn";
import SignUp from "pages/auth/SignUp";
import EmployeeListPage from "pages/employee/EmployeeListPage";
import EmployeeForm from "pages/employee/EmployeeForm";
import ClientForm from "pages/client/ClientForm";
import BranchList from "pages/branch/BranchList";
import BranchDetails from "pages/branch/BranchDetails";
import BranchForm from "pages/branch/BranchForm";
import ProjectListPage from "pages/project/ProjectListPage";
import ProjectDetails from "pages/project/ProjectDetails";
import ProjectForm from "pages/project/ProjectForm";
import OrderDetails from "pages/order/OrderDetails";
import OrderForm from "pages/order/OrderForm";
import PaymentList from "pages/payment/PaymentList";
import PaymentForm from "pages/payment/PaymentForm";
import PaymentDetails from "pages/payment/PaymentDetails";

import CategoryList from "pages/category/CategoryList";
import CategoryForm from "pages/category/CategoryForm";
import CategoryDetails from "pages/category/CategoryDetails";

import AppointmentFormPage from "pages/appointment/AppointmentFormPage";
import AppointmentsPage from "pages/appointment/AppointmentsPage";
import DashboardPage from "pages/dashboard/DashboardPage";
import ClientDetails from "pages/client/ClientDetails";
import EmployeeDetails from "pages/employee/EmployeeDetails";
import AppointmentDetails from "pages/appointment/AppointmentDetails";
import { isAdmin } from "permission";
import OrderListPage from "pages/order/OrderListPage";
import ClientListPage from "pages/client/ClientListPage";
import { isStoreManager } from "permission";
import FeedbackForm from "pages/feedback/FeedbackForm";
import FeedbackListPage from "pages/feedback/FeedbackList";
import FeedbackDetails from "pages/feedback/FeedbackDetails";
import ProductListPage from "pages/product/ProductList";
import ProductFormPage from "pages/product/ProductForm";
import InventoryLocationListPage from "pages/inventory/InventoryLocationList";
import InventoryLocationFormPage from "pages/inventory/InventoryLocationForm";
import InventoryTransactionListPage from "pages/inventory/InventoryTransactionList";
import InventoryTransactionFormPage from "pages/inventory/InventoryTransactionForm";
import InventoryStockListPage from "pages/inventory/InventoryStockList";
import InventoryStockFormPage from "pages/inventory/InventoryStockForm";

export const MyRoutes = ({ tokenId, signedInUser }) => {
  return (
    <Routes>
      {isAdmin(signedInUser) && (
        <Route exact path="/dashboard" element={<DashboardPage />} key="dashboard" />
      )}
      <Route exact path="/clients" element={<ClientListPage />} key="clients" />
      <Route exact path="/clients/:id" element={<ClientDetails />} key="client" />
      <Route exact path="/clients/:id?/form" element={<ClientForm />} key="client-form" />
      {(isAdmin(signedInUser) || isStoreManager(signedInUser)) && (
        <Route exact path="/employees" element={<EmployeeListPage />} key="employees" />
      )}
      {(isAdmin(signedInUser) || isStoreManager(signedInUser)) && (
        <Route exact path="/employees/:id" element={<EmployeeDetails />} key="employee" />
      )}
      {(isAdmin(signedInUser) || isStoreManager(signedInUser)) && (
        <Route exact path="/employees/:id?/form" element={<EmployeeForm />} key="employee-form" />
      )}
      {isAdmin(signedInUser) && (
        <Route exact path="/branches" element={<BranchList />} key="branches" />
      )}
      {isAdmin(signedInUser) && (
        <Route exact path="/branches/:id" element={<BranchDetails />} key="branch" />
      )}
      {isAdmin(signedInUser) && (
        <Route exact path="/branches/:id?/form" element={<BranchForm />} key="branch-form" />
      )}
      <Route exact path="/projects" element={<ProjectListPage />} key="projects" />
      <Route exact path="/projects/:id" element={<ProjectDetails />} key="project" />
      <Route exact path="/projects/:id?/form" element={<ProjectForm />} key="project-form" />
      <Route exact path="/orders" element={<OrderListPage />} key="orders" />
      <Route exact path="/orders/:id" element={<OrderDetails />} key="order" />
      <Route exact path="/orders/:id?/form" element={<OrderForm />} key="order-form" />
      <Route exact path="/payments" element={<PaymentList />} key="payments" />
      <Route exact path="/payments/:id" element={<PaymentDetails />} key="payment" />
      <Route exact path="/payments/:id?/form" element={<PaymentForm />} key="payment-form" />
      <Route exact path="/appointments" element={<AppointmentsPage />} key="appointments" />
      <Route exact path="/appointments/:id" element={<AppointmentDetails />} key="appointment" />
      <Route
        exact
        path="/appointments/:id?/form"
        element={<AppointmentFormPage />}
        key="appointment-form"
      />
      <Route exact path="/feedbacks" element={<FeedbackListPage />} key="feedbacks" />
      <Route exact path="/feedbacks/:id" element={<FeedbackDetails />} key="feedback" />
      <Route exact path="/feedbacks/new/form" element={<FeedbackForm />} key="feedback-form" />
      <Route exact path="/categories" element={<CategoryList />} key="categories" />
      <Route exact path="/categories/:id" element={<CategoryForm />} key="category" />
      <Route exact path="/categories/:id?/form" element={<CategoryForm />} key="category-form" />

      <Route exact path="/products" element={<ProductListPage />} key="products" />
      <Route exact path="/products/:id" element={<ProductFormPage />} key="product" />
      <Route exact path="/products/:id?/form" element={<ProductFormPage />} key="product-form" />
      <Route
        exact
        path="/inventoryLocations"
        element={<InventoryLocationListPage />}
        key="inventoryLocations"
      />
      <Route
        exact
        path="/inventoryLocations/:id"
        element={<InventoryLocationFormPage />}
        key="inventory-location"
      />
      <Route
        exact
        path="/inventoryLocations/:id?/form"
        element={<InventoryLocationFormPage />}
        key="inventory-locations-form"
      />
      <Route
        exact
        path="/inventoryTransactions"
        element={<InventoryTransactionListPage />}
        key="inventoryTransactions"
      />
      <Route
        exact
        path="/inventoryTransactions/:id"
        element={<InventoryTransactionFormPage />}
        key="inventory-transaction"
      />
      <Route
        exact
        path="/inventoryTransactions/:id?/form"
        element={<InventoryTransactionFormPage />}
        key="inventory-transactions-form"
      />
      <Route
        exact
        path="/inventoryStocks"
        element={<InventoryStockListPage />}
        key="inventoryStocks"
      />
      <Route
        exact
        path="/inventoryStocks/:id"
        element={<InventoryStockFormPage />}
        key="inventory-stock"
      />
      <Route
        exact
        path="/inventoryStocks/:id?/form"
        element={<InventoryStockFormPage />}
        key="inventory-stock-form"
      />

      <Route exact path="/billing" element={<Billing />} key="billing" />
      <Route exact path="/notifications" element={<Notifications />} key="notifications" />
      <Route exact path="/profile" element={<Profile />} key="profile" />
      <Route exact path="/authentication/sign-in" element={<SignIn />} key="sign-in" />
      <Route exact path="/authentication/sign-up" element={<SignUp />} key="sign-up" />
      <Route
        exact
        path="/authentication/change-password"
        element={<ChangePassword />}
        key="change-pass"
      />
      {signedInUser && isAdmin(signedInUser) && (
        <Route exact path="/" element={<DashboardPage />} key="root" />
      )}
      {signedInUser && !isAdmin(signedInUser) && (
        <Route exact path="/" element={<ClientListPage />} key="root" />
      )}
      {!signedInUser && <Route path="*" element={<Navigate to="/authentication/sign-in" />} />}
      {/* {tokenId ? (
        <Route
          path="*"
          element={<Navigate to={isAdmin(signedInUser) ? "/dashboard" : "/clients"} />}
        />
      ) : (
        <Route path="*" element={<Navigate to="/authentication/sign-in" />} />
      )} */}
    </Routes>
  );
};
