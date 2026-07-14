import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import type { RootState } from "./store";
import type { Client, ClientState, CreateClientPayload } from "../types/client";
import type { ApiResponse } from "../types/api";
import api from "../services/api";

export const fetchClients = createAsyncThunk<
  ApiResponse<Client>,
  void,
  { state: RootState; rejectValue: string }
>("clients/fetchClients", async (_, { rejectWithValue }) => {
  try {
    const response = await api.get("clients");
    return response.data;
  } catch (error: unknown) {
    return rejectWithValue(
      error instanceof Error ? error.message : "Error al obtener clientes"
    );
  }
});

export const createClient = createAsyncThunk<
  ApiResponse<Client>,
  CreateClientPayload,
  { rejectValue: string }
>("clients/createClient", async (clientData, { rejectWithValue }) => {
  try {
    const response = await api.post("clients", clientData);
    return response.data;
  } catch (error: unknown) {
    return rejectWithValue(
      error instanceof Error ? error.message : "Error al crear cliente"
    );
  }
});

const initialState: ClientState = {
  list: [],
  status: "idle",
  message: "",
  selected: null,
};

const clientsSlice = createSlice({
  name: "clients",
  initialState,
  reducers: {
    selectClient(state, action) {
      state.selected = action.payload;
    },
    clearSelectedClient(state) {
      state.selected = null;
    },
  },
  extraReducers(builder) {
    builder
      .addCase(fetchClients.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchClients.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.list = (action.payload.clients as Client[]) || [];
      })
      .addCase(fetchClients.rejected, (state, action) => {
        state.status = "rejected";
        state.message = action.payload || "Error al obtener clientes";
      })
      .addCase(createClient.pending, (state) => {
        state.status = "loading";
      })
      .addCase(createClient.fulfilled, (state, action) => {
        state.status = "succeeded";
        const client = action.payload.client as Client | undefined;
        if (client) {
          state.list.push(client);
          state.selected = client;
        }
      })
      .addCase(createClient.rejected, (state, action) => {
        state.status = "rejected";
        state.message = action.payload || "Error al crear cliente";
      });
  },
});

export const selectClients = (state: RootState): Client[] =>
  state.clients.list;
export const selectSelectedClient = (state: RootState): Client | null =>
  state.clients.selected;

export const { selectClient, clearSelectedClient } = clientsSlice.actions;
export default clientsSlice.reducer;
