// src/lib/notes.ts
import api from "./api";

export async function fetchNotes() {
  const res = await api.get("/notes");
  return res.data;
}

export async function createNote(title: string, content: string) {
  const res = await api.post("/notes", { title, content });
  return res.data;
}

export async function updateNote(id: number, title: string, content: string) {
  const res = await api.put(`/notes/${id}`, { title, content });
  return res.data;
}

export async function deleteNote(id: number) {
  await api.delete(`/notes/${id}`);
}
