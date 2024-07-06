import { createSlice } from "@reduxjs/toolkit";

const employeesSlides = createSlice({
  name: "employees",
  initialState: {
    id: "",
  },
  reducers: {
    addEmployeeID(state, action) {
      state.id = action.payload.id;
    },
  },
});

export const addEmployeeID = employeesSlides.actions.addEmployeeID;
export default employeesSlides.reducer;
