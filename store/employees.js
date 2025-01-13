import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { BASEURL } from "./configApi";

export const registerNewEmployee = createAsyncThunk(
  "employee/addNewEmployee",
  async (user) => {
    console.log(user);
    try {
      const response = await BASEURL.post("auth/register", {
        user,
        headers: {
          "User-Agent": "mobile",
        },
      });
      return response.data;
    } catch (error) {
      return error.message;
    }
  }
);

export const loginEmployee = createAsyncThunk(
  "employee/login",
  async (employee) => {
    try {
      const response = await BASEURL.post(
        "auth/login",
        { employee },
        {
          headers: {
            Authorization: "Bearer " + selectToken,
          },
        }
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
    token: "",
    message: "",
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
        state.id = action.payload.newEmployee.id;
        state.token = action.payload.newEmployee.token;
        state.message = action.payload.message;
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
export const selectToken = (state) => state.employees.token;
export const selectStatus = (state) => state.employees.status;

export const { addEmployee, addEmployeeID } = employeesSlides.actions;
export default employeesSlides.reducer;
