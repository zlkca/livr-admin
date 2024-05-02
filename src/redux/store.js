import { configureStore } from "@reduxjs/toolkit";

import uiReducer from "../redux/ui/ui.slice";
import authReducer from "../redux/auth/auth.slice";
import projectReducer from "../redux/project/project.slice";
import appointmentReducer from "../redux/appointment/appointment.slice";
import accountReducer from "../redux/account/account.slice";
import paymentReducer from "../redux/payment/payment.slice";
import orderReducer from "../redux/order/order.slice";
import branchReducer from "../redux/branch/branch.slice";

import productReducer from "../redux/product/product.slice";
import inventoryReducer from "../redux/inventory/inventory.slice";

// import windowReducer from '../redux/window/window.slice';
// import uploadReducer from '../redux/upload/upload.slice';
// import messageReducer from '../redux/message/message.slice';

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
    product: productReducer,
    inventory: inventoryReducer,
    // window: windowReducer,
    // upload: uploadReducer,
    // message: messageReducer,
  },
});
