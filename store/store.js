import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";
import employeesSlides from "./employees";
import timeLocationSlice from "./locations";

export const store = configureStore({
  reducer: {
    employees: employeesSlides,
    timesLocation: timeLocationSlice,
  },
});

setupListeners(store.dispatch);
