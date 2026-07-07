import apiClient from "./apiClient";

/**
 * Document API service.
 *
 * Keep ALL /documents network calls in this file.
 *
 * Endpoints (mockapi.io):
 *   GET  /documents
 *   POST /documents
 *
 * TODO: implement the functions below.
 */

export async function getDocuments() {
  // TODO: return (await apiClient.get("/documents")).data;
}

export async function createDocument(payload) {
  // TODO: return (await apiClient.post("/documents", payload)).data;
}
