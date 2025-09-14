import api from "./api";

export interface Note {
  id: number;
  title: string;
  content: string;
}

export async function fetchNotes(): Promise<Note[]> {
  const res = await api.get("/notes");
  return res.data as Note[];
}

export async function createNote(title: string, content: string): Promise<Note> {
  const res = await api.post("/notes", { title, content });
  return res.data as Note;
}

export async function updateNote(id: number, title: string, content: string): Promise<Note> {
  const res = await api.put(`/notes/${id}`, { title, content });
  return res.data as Note;
}

export async function deleteNote(id: number): Promise<void> {
  await api.delete(`/notes/${id}`);
}
