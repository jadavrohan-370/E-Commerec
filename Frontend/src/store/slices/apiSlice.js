import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const baseQuery = fetchBaseQuery({ 
  baseUrl: "",
  prepareHeaders: (headers) => {
    // Ensuring credentials are sent for authentication cookies
    return headers;
  },
  // This is crucial for sending HTTP-only JWT cookies to the backend
  credentials: 'include'
});

export const apiSlice = createApi({
  baseQuery,
  tagTypes: ["Product", "Order", "User"],
  endpoints: (builder) => ({builder}),
});
