import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";
import employeesSlides from "./employees";
<<<<<<< HEAD
import { employeesApi } from "./session";

const rootReducer = combineReducers({
  employee: employeesSlides,
  [employeesApi.reducerPath]: employeesApi.reducer(),
});

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(employeesApi.middleware),
=======
import timeLocationSlice from "./locations";

export const store = configureStore({
  reducer: {
    employees: employeesSlides,
    timesLocation: timeLocationSlice,
  },
>>>>>>> lastWork2
});

setupListeners(store.dispatch);
