import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import type { RootState } from "./store";
import type {
  LocationState,
  LocationCoords,
  ScheduleTime,
  TimeLocationData,
} from "../types/location";
import type { ApiResponse } from "../types/api";
import api from "../services/api";

export const getLocations = createAsyncThunk<
  LocationCoords,
  { coords: { latitude: number; longitude: number } },
  { rejectValue: string }
>("locations/getLocation", async (location, { rejectWithValue }) => {
  try {
    const { latitude, longitude } = location.coords;
    return { latitude, longitude };
  } catch (error: unknown) {
    return rejectWithValue(
      error instanceof Error ? error.message : "Error al obtener ubicación"
    );
  }
});

export const registerTimeAndLocations = createAsyncThunk<
  ApiResponse<unknown>,
  TimeLocationData,
  { rejectValue: string }
>("locations/addTimesLocations", async (locationTimeData, { rejectWithValue }) => {
  try {
    const response = await api.post("locations", locationTimeData);
    return response.data;
  } catch (error: unknown) {
    return rejectWithValue(
      error instanceof Error
        ? error.message
        : "Error al registrar tiempo/ubicación"
    );
  }
});

const initialState: LocationState = {
  location: null,
  schedule: {
    startJob: null,
    breakJob: null,
    returnToWork: null,
    exitJob: null,
  },
  status: "",
  message: "",
};

const timeLocationSlice = createSlice({
  name: "timesLocation",
  initialState,
  reducers: {
    takeTime(state, action) {
      const { label, time } = action.payload;
      switch (label) {
        case "entrada":
          state.schedule.startJob = time;
          break;
        case "descanso":
          state.schedule.breakJob = time;
          break;
        case "retorno":
          state.schedule.returnToWork = time;
          break;
        case "salida":
          state.schedule.exitJob = time;
          break;
      }
    },
  },
  extraReducers(builder) {
    builder
      .addCase(getLocations.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.location = action.payload;
      })
      .addCase(getLocations.rejected, (state, action) => {
        state.status = "rejected";
        state.message = action.payload || "Error al obtener ubicación";
      })
      .addCase(registerTimeAndLocations.pending, (state) => {
        state.status = "loading";
      })
      .addCase(registerTimeAndLocations.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.message = action.payload.message || "";
      })
      .addCase(registerTimeAndLocations.rejected, (state, action) => {
        state.status = "rejected";
        state.message = action.payload || "Error al registrar tiempo";
      });
  },
});

export const selectLocation = (state: RootState): LocationCoords | null =>
  state.timesLocation.location;
export const selectSchedule = (state: RootState): ScheduleTime =>
  state.timesLocation.schedule;
export const selectTimesMessage = (state: RootState): string =>
  state.timesLocation.message;

export const { takeTime } = timeLocationSlice.actions;
export default timeLocationSlice.reducer;
