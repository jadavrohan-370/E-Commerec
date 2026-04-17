import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const baseQuery = fetchBaseQuery({ 
  baseUrl: import.meta.env.VITE_BACKEND_URL || import.meta.env.VITE_API_BASE_URL || "",
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
