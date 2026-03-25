import { jwtDecode } from "jwt-decode";

export const getUser = () => {
  const token = localStorage.getItem("token");
  if (!token) return null;
  return jwtDecode(token);
};

export const logout = () => {
  localStorage.removeItem("token");
  window.location.href = "/login";
};
