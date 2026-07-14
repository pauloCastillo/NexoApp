import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";
import { useDispatch, useSelector, TypedUseSelectorHook } from "react-redux";
import employeesReducer from "./employees";
import timeLocationSlice from "./locations";
import clientsReducer from "./clients";
import orderDayReducer from "./orderDay";
import permissionsReducer from "./permissions";
import vacationsReducer from "./vacations";

export const store = configureStore({
  reducer: {
    employees: employeesReducer,
    timesLocation: timeLocationSlice,
    clients: clientsReducer,
    orderDay: orderDayReducer,
    permissions: permissionsReducer,
    vacations: vacationsReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ serializableCheck: false }),
});

setupListeners(store.dispatch);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
