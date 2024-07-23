import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query";

const PORT = process.env.EXPO_PUBLIC_API_URL;
const url = `http://192.168.1.14:${PORT}/api`;

export const employeesApi = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({ baseUrl: url }),
  endpoints: (builder) => ({
    getEmployees: builder.query({
      query: () => "/employees",
    }),
  }),
});

export const { useGetEmployeesQuery } = employeesApi;
