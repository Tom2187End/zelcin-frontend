import { configureStore } from "@reduxjs/toolkit";
import thunk from "redux-thunk";
import userReducer from "./reducers/userReducer";
import adminReducer from "./reducers/adminReducer";

const store = configureStore({
    reducer: {
        user: userReducer,
        admin: adminReducer
    }, 
    middleware: [thunk]
});
export default store;