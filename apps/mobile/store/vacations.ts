import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import type { RootState } from "./store";
import type {
  Vacation,
  VacationState,
  SubmitVacationPayload,
} from "../types/vacation";
import type { ApiResponse } from "../types/api";
import api from "../services/api";

export const submitVacation = createAsyncThunk<
  ApiResponse<Vacation>,
  SubmitVacationPayload,
  { state: RootState; rejectValue: string }
>("vacations/submit", async (vacationData, { getState, rejectWithValue }) => {
  try {
    const response = await api.post("vacations", vacationData);
    return response.data;
  } catch (error: unknown) {
    return rejectWithValue(
      error instanceof Error
        ? error.message
        : "Error al solicitar vacaciones"
    );
  }
});

export const fetchVacations = createAsyncThunk<
  ApiResponse<Vacation>,
  void,
  { state: RootState; rejectValue: string }
>("vacations/fetchAll", async (_, { getState, rejectWithValue }) => {
  try {
    const employeeId = getState().employees.id;
    const response = await api.get("vacations/" + employeeId);
    return response.data;
  } catch (error: unknown) {
    return rejectWithValue(
      error instanceof Error ? error.message : "Error al obtener vacaciones"
    );
  }
});

const initialState: VacationState = {
  list: [],
  status: "idle",
  message: "",
};

const vacationsSlice = createSlice({
  name: "vacations",
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder
      .addCase(submitVacation.pending, (state) => {
        state.status = "loading";
      })
      .addCase(submitVacation.fulfilled, (state, action) => {
        state.status = "succeeded";
        const vacation = action.payload.vacation as Vacation | undefined;
        if (vacation) {
          state.list.unshift(vacation);
        }
        state.message = action.payload.message || "";
      })
      .addCase(submitVacation.rejected, (state, action) => {
        state.status = "rejected";
        state.message = action.payload || "Error al solicitar vacaciones";
      })
      .addCase(fetchVacations.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchVacations.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.list = (action.payload.vacations as Vacation[]) || [];
      })
      .addCase(fetchVacations.rejected, (state, action) => {
        state.status = "rejected";
        state.message = action.payload || "Error al obtener vacaciones";
      });
  },
});

export const selectVacations = (state: RootState): Vacation[] =>
  state.vacations.list;

export default vacationsSlice.reducer;
