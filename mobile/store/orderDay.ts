import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import type { RootState } from "./store";
import type {
  WorkOrder,
  WorkOrderState,
  SubmitWorkOrderPayload,
} from "../types/workOrder";
import type { ApiResponse } from "../types/api";
import api from "../services/api";

export const submitWorkOrder = createAsyncThunk<
  ApiResponse<WorkOrder>,
  SubmitWorkOrderPayload,
  { state: RootState; rejectValue: string }
>("orderDay/submit", async (orderData, { getState, rejectWithValue }) => {
  try {
    const response = await api.post("work-orders", orderData);
    return response.data;
  } catch (error: unknown) {
    return rejectWithValue(
      error instanceof Error
        ? error.message
        : "Error al registrar orden de trabajo"
    );
  }
});

export const fetchWorkOrders = createAsyncThunk<
  ApiResponse<WorkOrder>,
  void,
  { state: RootState; rejectValue: string }
>("orderDay/fetchHistory", async (_, { getState, rejectWithValue }) => {
  try {
    const employeeId = getState().employees.id;
    const response = await api.get("work-orders/" + employeeId);
    return response.data;
  } catch (error: unknown) {
    return rejectWithValue(
      error instanceof Error
        ? error.message
        : "Error al obtener órdenes de trabajo"
    );
  }
});

const initialState: WorkOrderState = {
  currentOrder: null,
  history: [],
  status: "idle",
  message: "",
};

const orderDaySlice = createSlice({
  name: "orderDay",
  initialState,
  reducers: {
    setCurrentOrder(state, action) {
      state.currentOrder = action.payload;
    },
    clearCurrentOrder(state) {
      state.currentOrder = null;
    },
  },
  extraReducers(builder) {
    builder
      .addCase(submitWorkOrder.pending, (state) => {
        state.status = "loading";
      })
      .addCase(submitWorkOrder.fulfilled, (state, action) => {
        state.status = "succeeded";
        const workOrder = action.payload.workOrder as WorkOrder | undefined;
        if (workOrder) {
          state.currentOrder = workOrder;
          state.history.unshift(workOrder);
        }
        state.message = "Orden registrada exitosamente";
      })
      .addCase(submitWorkOrder.rejected, (state, action) => {
        state.status = "rejected";
        state.message = action.payload || "Error al registrar orden";
      })
      .addCase(fetchWorkOrders.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchWorkOrders.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.history = (action.payload.workOrders as WorkOrder[]) || [];
      })
      .addCase(fetchWorkOrders.rejected, (state, action) => {
        state.status = "rejected";
        state.message = action.payload || "Error al obtener órdenes";
      });
  },
});

export const selectCurrentOrder = (state: RootState): WorkOrder | null =>
  state.orderDay.currentOrder;
export const selectOrderHistory = (state: RootState): WorkOrder[] =>
  state.orderDay.history;

export const { setCurrentOrder, clearCurrentOrder } = orderDaySlice.actions;
export default orderDaySlice.reducer;
