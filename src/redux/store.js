import { configureStore } from "@reduxjs/toolkit";

import uiReducer from "../redux/ui/ui.slice";
import authReducer from "../redux/auth/auth.slice";
import projectReducer from "../redux/project/project.slice";
import appointmentReducer from "../redux/appointment/appointment.slice";
import accountReducer from "../redux/account/account.slice";
import paymentReducer from "../redux/payment/payment.slice";
import orderReducer from "../redux/order/order.slice";
import branchReducer from "../redux/branch/branch.slice";
import feedbackReducer from "../redux/feedback/feedback.slice";
import productReducer from "../redux/product/product.slice";
import inventoryReducer from "../redux/inventory/inventory.slice";
import categoryReducer from "../redux/category/category.slice";
import supplierReducer from "../redux/supplier/supplier.slice";

export default configureStore({
  reducer: {
    ui: uiReducer,
    auth: authReducer,
    branch: branchReducer,
    payment: paymentReducer,
    appointment: appointmentReducer,
    project: projectReducer,
    account: accountReducer,
    order: orderReducer,
    feedback: feedbackReducer,
    supplier: supplierReducer,
    product: productReducer,
    inventory: inventoryReducer,
    category: categoryReducer,
    // upload: uploadReducer,
    // message: messageReducer,
  },
});
