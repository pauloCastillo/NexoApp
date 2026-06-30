import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import type { RootState } from "./store";
import type {
  Employee,
  EmployeeState,
  RegisterEmployeePayload,
  LoginPayload,
  RegisterEmployeeResponse,
  LoginResponse,
} from "../types/employee";
import api from "../services/api";
import {
  setTokens,
  clearTokens,
  getAccessToken,
} from "../services/token";

export const registerNewEmployee = createAsyncThunk<
  RegisterEmployeeResponse,
  RegisterEmployeePayload,
  { rejectValue: string }
>("employee/addNewEmployee", async (userData, { rejectWithValue }) => {
  try {
    const response = await api.post("auth/register", userData, {
      headers: { "User-Agent": "mobile" },
    });
    const data = response.data as RegisterEmployeeResponse;
    const accessToken =
      data.newEmployee?.token || (data as Record<string, string>).token || "";
    const refreshToken = (data as Record<string, string>).refreshToken || "";
    if (accessToken) {
      await setTokens(accessToken, refreshToken);
    }
    return data;
  } catch (error: unknown) {
    if (error instanceof Error && "response" in error) {
      const axiosError = error as {
        response?: { data?: { message?: string } };
      };
      return rejectWithValue(
        axiosError.response?.data?.message || error.message
      );
    }
    return rejectWithValue(
      error instanceof Error
        ? error.message
        : "Error desconocido al registrarse"
    );
  }
});

export const loginEmployee = createAsyncThunk<
  LoginResponse,
  LoginPayload,
  { rejectValue: string }
>("employee/login", async (employee, { rejectWithValue }) => {
  try {
    const response = await api.post(
      "auth/login",
      { email: employee.mail, password: employee.password },
      { headers: { "User-Agent": "mobile" } }
    );
    const data = response.data as LoginResponse;
    const accessToken =
      data.employee?.token || (data as Record<string, string>).token || "";
    const refreshToken = (data as Record<string, string>).refreshToken || "";
    if (accessToken) {
      await setTokens(accessToken, refreshToken);
    }
    return data;
  } catch (error: unknown) {
    if (error instanceof Error && "response" in error) {
      const axiosError = error as {
        response?: { data?: { message?: string } };
      };
      return rejectWithValue(
        axiosError.response?.data?.message || error.message
      );
    }
    return rejectWithValue(
      error instanceof Error
        ? error.message
        : "Error desconocido al iniciar sesión"
    );
  }
});

export const logoutEmployee = createAsyncThunk<
  void,
  void,
  { rejectValue: string }
>("employee/logout", async (_, { rejectWithValue }) => {
  try {
    const token = await getAccessToken();
    if (token) {
      await api.post(
        "auth/logout",
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
    }
  } catch {
    // Ignore logout API errors — always clear local state
  } finally {
    await clearTokens();
  }
});

const initialState: EmployeeState = {
  id: "",
  employee: null,
  status: "",
  message: "",
  role: "employee",
  username: "",
};

const employeesSlice = createSlice({
  name: "employees",
  initialState,
  reducers: {
    addEmployeeID(state, action) {
      state.id = action.payload.id;
    },
    addEmployee(state, action) {
      state.employee = action.payload;
      if (action.payload?.id) state.id = action.payload.id;
      if (action.payload?.role) state.role = action.payload.role;
    },
    setRole(state, action) {
      state.role = action.payload;
    },
    resetAuth(state) {
      state.id = "";
      state.employee = null;
      state.status = "";
      state.message = "";
      state.role = "employee";
      state.username = "";
    },
  },
  extraReducers(builder) {
    builder
      .addCase(registerNewEmployee.pending, (state) => {
        state.status = "loading";
      })
      .addCase(registerNewEmployee.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.id =
          action.payload.newEmployee?.id?.toString() ||
          action.payload.id ||
          "";
        state.username = action.payload.newEmployee?.username || "";
        state.role = action.payload.newEmployee?.role || "employee";
        state.message = action.payload.message || "Registro exitoso!";
        state.employee = {
          username: state.username,
          email: "",
          role: state.role,
        };
      })
      .addCase(registerNewEmployee.rejected, (state, action) => {
        state.status = "rejected";
        state.message = action.payload || "Error al registrarse";
      })
      .addCase(loginEmployee.pending, (state) => {
        state.status = "loading";
      })
      .addCase(loginEmployee.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.message = action.payload.message || "Bienvenido!";
        if (action.payload.employee) {
          state.id = action.payload.employee.id?.toString() || "";
          state.role = action.payload.employee.role || "employee";
        }
      })
      .addCase(loginEmployee.rejected, (state, action) => {
        state.status = "rejected";
        state.message = action.payload || "Error al iniciar sesión";
      })
      .addCase(logoutEmployee.fulfilled, (state) => {
        state.id = "";
        state.employee = null;
        state.status = "";
        state.message = "";
        state.role = "employee";
        state.username = "";
      });
  },
});

export const selectEmployee = (state: RootState): Employee | null =>
  state.employees.employee;
export const selectMessage = (state: RootState): string =>
  state.employees.message;
export const selectEmployeeID = (state: RootState): string =>
  state.employees.id;
export const selectStatus = (state: RootState): string =>
  state.employees.status;
export const selectRole = (state: RootState): string =>
  state.employees.role;

export const {
  addEmployee,
  addEmployeeID,
  setRole,
  resetAuth,
} = employeesSlice.actions;
export default employeesSlice.reducer;
