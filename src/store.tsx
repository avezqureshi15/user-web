import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import imageReducer from "./slices/imageUploadSlice";
import userReducer from "./slices/userSlice";
import paymentReducer from "./slices/paymentSlice";
import supportTicketReducer from "./slices/supportTicketSlice";

const store = configureStore({
  reducer: {
    auth: authReducer,
    user: userReducer,
    imageUpload: imageReducer,
    payment: paymentReducer,
    supportTicket: supportTicketReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
