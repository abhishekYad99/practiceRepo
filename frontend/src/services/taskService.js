
import apiClient from "./apiClient";

/**
 * Task API service.
 *
 * Keep ALL /tasks network calls in this file. Components/stores should
 * import these functions instead of calling the API directly.
 *
 * Endpoints (mockapi.io):
 *   GET    /tasks
 *   POST   /tasks
 *   PUT    /tasks/:id
 *   DELETE /tasks/:id
 *
 * TODO: implement the functions below.
 */

// export async function getTasks() {
//   // TODO: return (await apiClient.get("/tasks")).data;
// }

// export async function createTask(payload) {
//   // TODO: return (await apiClient.post("/tasks", payload)).data;
// }

export const getTasks = async () => {
  const { data } = await apiClient.get("/tasks");
  return data;
};


export const createTask = async (payload) => {
  const { data } = await apiClient.post("/tasks", payload);
  return data;
};

export async function updateTask(id, payload) {
  // TODO: return (await apiClient.put(`/tasks/${id}`, payload)).data;
}

export async function deleteTask(id) {
  // TODO: return (await apiClient.delete(`/tasks/${id}`)).data;
}


