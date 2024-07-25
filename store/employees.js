import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

export const registerNewEmployee = createAsyncThunk(
  "employee/addNewEmployee",
  async (user) => {
    try {
      const response = await axios.post(
        "http://192.168.1.12:8000/api/employees/signup",
        { user }
      );
      return response.data;
    } catch (error) {
      console.log(error);
      return error.message;
    }
  }
);

export const loginEmployee = createAsyncThunk(
  "employee/login",
  async (employee) => {
    try {
      const response = await axios.post(
        "http://192.168.1.12:8000/api/employees/login",
        { employee }
      );
      return response.data;
    } catch (error) {
      return error.message;
    }
  }
);

const employeesSlides = createSlice({
  name: "employees",
  initialState: {
    id: "",
    employee: null,
    status: "",
    message: "",
    token: "",
  },
  reducers: {
    addEmployeeID(state, action) {
      state.id = action.payload.id;
    },
    addEmployee(state, action) {
      state.employee = action.payload;
    },
  },
  extraReducers(builder) {
    builder
      .addCase(registerNewEmployee.pending, (state) => {
        state.status = "loading";
      })
      .addCase(registerNewEmployee.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.id = action.payload.user.id;
        state.token = action.payload.user.token;
        state.message = action.payload.user.message;
      })
      .addCase(registerNewEmployee.rejected, (state, action) => {
        state.status = "rejected";
        state.message = action.payload.message;
      })
      .addCase(loginEmployee.pending, (state, action) => {
        state.status = "loading";
      })
      .addCase(loginEmployee.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.id = action.payload.worker.id;
        state.token = action.payload.worker.token;
        state.message = action.payload.message;
      })
      .addCase(loginEmployee.rejected, (state, action) => {
        state.status = "rejected";
        state.message = action.payload.message;
      });
  },
});

export const selectEmployee = (state) => state.employees.employee;
export const selectMessage = (state) => state.employees.message;
export const selectEmployeeID = (state) => state.employees.id;
export const selectStatus = (state) => state.employees.status;

export const { addEmployee, addEmployeeID } = employeesSlides.actions;
export default employeesSlides.reducer;
