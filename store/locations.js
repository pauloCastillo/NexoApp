import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { BASEURL } from "./configApi";
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
    const token = locationTimeData.token;
    try {
      const response = await BASEURL.post("locations", {
        data: locationTimeData,
        headers: { Authorization: "Bearer " + token },
      });
      return response.data;
    } catch (error) {
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
      }
    },
  },
  extraReducers(builder) {
    builder
      .addCase(getLocations.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.location = action.payload;
      })

      .addCase(getLocations.rejected, (state) => {
        state.status = "rejected";
        state.message = action.payload.message;
      })
      .addCase(registerTimeAndLocations.pending, (state) => {
        state.status = "loading";
      })
      .addCase(registerTimeAndLocations.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.message = action.payload.message;
      })
      .addCase(registerTimeAndLocations.rejected, (state, action) => {
        state.status = "rejected";
        state.message = action.payload.message;
      });
  },
});

export const selectLocation = (state) => state.timesLocation.location;
export const selectMessage = (state) => state.timesLocation.message;
export const { takeTime } = timeLocationSlice.actions;

export default timeLocationSlice.reducer;
