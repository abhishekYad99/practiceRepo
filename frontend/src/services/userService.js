import apiClient from "./apiClient";

/**
 * User API service.
 *
 * Keep ALL /users network calls in this file.
 *
 * Endpoints (mockapi.io):
 *   GET /users
 *
 * TODO: implement the function below.
 */

// export async function getUsers() {
//   // TODO: return (await apiClient.get("/users")).data;
// }

export const signup = async (data) => {
  const response = await apiClient.post("/auth/signup", data);
  return response.data;
};

export const getUsers = async () => {
  const { data } = await apiClient.get("/users");
  return data;
};