const BASE_URL = ""; // Proxied by Vite

const api = async (url, options = {}) => {
  options.credentials = "include";
  options.headers = {
    "Content-Type": "application/json",
    ...options.headers,
  };

  let response = await fetch(url, options);

  // If unauthorized, try to refresh token
  if (
    response.status === 401 &&
    url !== "/api/users/login" &&
    url !== "/api/users/refresh"
  ) {
    const refreshRes = await fetch("/api/users/refresh", {
      method: "POST",
      credentials: "include",
    });

    if (refreshRes.ok) {
      // Retry original request
      response = await fetch(url, options);
    } else {
      // Refresh failed, might need to logout
      window.dispatchEvent(new Event("auth-failed"));
    }
  }

  return response;
};

export default api;
