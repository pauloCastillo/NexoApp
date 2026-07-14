import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import type { RootState } from "./store";
import type {
  Permission,
  PermissionState,
  SubmitPermissionPayload,
} from "../types/permission";
import type { ApiResponse } from "../types/api";
import api from "../services/api";

export const submitPermission = createAsyncThunk<
  ApiResponse<Permission>,
  SubmitPermissionPayload,
  { state: RootState; rejectValue: string }
>("permissions/submit", async (permissionData, { getState, rejectWithValue }) => {
  try {
    const response = await api.post("permissions", permissionData);
    return response.data;
  } catch (error: unknown) {
    return rejectWithValue(
      error instanceof Error
        ? error.message
        : "Error al solicitar permiso"
    );
  }
});

export const fetchPermissions = createAsyncThunk<
  ApiResponse<Permission>,
  void,
  { state: RootState; rejectValue: string }
>("permissions/fetchAll", async (_, { getState, rejectWithValue }) => {
  try {
    const employeeId = getState().employees.id;
    const response = await api.get("permissions/" + employeeId);
    return response.data;
  } catch (error: unknown) {
    return rejectWithValue(
      error instanceof Error
        ? error.message
        : "Error al obtener permisos"
    );
  }
});

const initialState: PermissionState = {
  list: [],
  status: "idle",
  message: "",
};

const permissionsSlice = createSlice({
  name: "permissions",
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder
      .addCase(submitPermission.pending, (state) => {
        state.status = "loading";
      })
      .addCase(submitPermission.fulfilled, (state, action) => {
        state.status = "succeeded";
        const permission = action.payload.permission as Permission | undefined;
        if (permission) {
          state.list.unshift(permission);
        }
        state.message = action.payload.message || "";
      })
      .addCase(submitPermission.rejected, (state, action) => {
        state.status = "rejected";
        state.message = action.payload || "Error al solicitar permiso";
      })
      .addCase(fetchPermissions.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchPermissions.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.list = (action.payload.permissions as Permission[]) || [];
      })
      .addCase(fetchPermissions.rejected, (state, action) => {
        state.status = "rejected";
        state.message = action.payload || "Error al obtener permisos";
      });
  },
});

export const selectPermissions = (state: RootState): Permission[] =>
  state.permissions.list;

export default permissionsSlice.reducer;
