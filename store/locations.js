import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

export const getLocations = createAsyncThunk(
  "locations/getLocation",
  async (location) => {
    try {
      const { latitude, longitude } = await location.coords;
      return { latitude, longitude };
    } catch (error) {
      return error.message;
    }
  }
);

export const registerTimeAndLocations = createAsyncThunk(
  "locations/addTimesLocations",
  async (locationTimeData) => {
    try {
      const response = await axios.post(
        "http://192.168.1.14:8000/api/locations",
        {
          headers: { Authorization: `Bearer ${locationTimeData.token}` },
          data: locationTimeData,
        }
      );

      return response.status === 200 && response.data;
    } catch (error) {
      console.log(error.message);
      return error.message;
    }
  }
);

const timeLocationSlice = createSlice({
  name: "timesLocation",
  initialState: {
    location: null,
    schedule: {
      startJob: null,
      breakJob: null,
      returnToWork: null,
      exitJob: null,
    },
    status: "",
    message: "",
  },
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
        default:
          return state.schedule;
      }
      return state.schedule;
    },
  },
  extraReducers(builder) {
    builder
      .addCase(getLocations.fulfilled, (state, action) => {
        state.message = "succeeded";
        state.location = action.payload;
      })

      .addCase(getLocations.rejected, (state, action) => {
        state.message = action.payload;
      })
      .addCase(registerTimeAndLocations.fulfilled, (state, action) => {
        state.status = "succeeded";
        console.log(action.payload.newTime);
      })
      .addCase(registerTimeAndLocations.rejected, (state, action) => {
        state.status = "rejected";
        state.message = action.payload;
      });
  },
});

export const selectLocation = (state) => state.timesLocation.location;
export const selectMessage = (state) => state.timesLocation.message;
export const { takeTime } = timeLocationSlice.actions;

export default timeLocationSlice.reducer;
