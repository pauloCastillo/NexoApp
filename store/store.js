import { configureStore } from "@reduxjs/toolkit";
import employeesSlides from "./employees";

export const store = configureStore({
  reducer: {
    employee: employeesSlides,
  },
});
