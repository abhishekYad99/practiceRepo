import apiClient from "./apiClient";

export const getDashboard = async () => {
  const { data } = await apiClient.get("/dashboard");
  return data;
};

export const getDashboardData = getDashboard;