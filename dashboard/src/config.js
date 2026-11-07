// Base URL of the backend API.
// Override it without editing code by creating a .env file with:
//   REACT_APP_API_URL=http://localhost:5000/api
export const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000/api";

// The backend's address without "/api" (images are served from here).
export const API_ORIGIN = API_URL.replace(/\/api\/?$/, "");

// Product images are stored as "/uploads/x.png"; turn them into full URLs.
export const assetUrl = (src) =>
  !src ? "" : /^(https?:|data:|blob:)/.test(src) ? src : `${API_ORIGIN}${src.startsWith("/") ? "" : "/"}${src}`;

export const authHeader = () => {
  try {
    const token = JSON.parse(localStorage.getItem("token"));
    return token ? { authorization: `bearer ${token}` } : {};
  } catch {
    return {};
  }
};

export const clearLogin = () => {
  ["token", "user"].forEach((k) => localStorage.removeItem(k));
};

// fetch() for admin endpoints: adds the login token, and sends the user back to
// the login page if the session expired (401) or the account isn't an admin (403).
export const apiFetch = async (path, options = {}) => {
  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: { ...(options.headers || {}), ...authHeader() },
  });
  if (response.status === 401 || response.status === 403) {
    clearLogin();
    window.location.href = "/login";
    throw new Error("Not authorized");
  }
  return response;
};

export const ORDER_STATUSES = ["pending", "shipped", "delivered", "cancelled", "refunded"];

export const STATUS_COLORS = {
  pending: "#fcd34d",
  shipped: "#60a5fa",
  delivered: "#4ade80",
  cancelled: "#fca5a1",
  refunded: "#c4b5fd",
};

export const money = (n) => `$${Number(n || 0).toFixed(2)}`;
