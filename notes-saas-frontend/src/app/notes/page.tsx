"use client";
import { useEffect, useState } from "react";
import { fetchNotes, createNote, updateNote, deleteNote } from "@/lib/notes";
import AuthGuard from "@/components/AuthGuard";
import { useAuth } from "@/context/AuthContext";

export default function NotesPage() {
  const { user } = useAuth(); // get user info (plan will come from backend)
  const [notes, setNotes] = useState<any[]>([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editContent, setEditContent] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function loadNotes() {
    try {
      setLoading(true);
      const data = await fetchNotes();
      setNotes(data);
    } catch {
      setError("Failed to load notes");
    } finally {
      setLoading(false);
    }
  }

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();

    // Restriction: Free users only max 3 notes
    if (user?.plan === "free" && notes.length >= 3) {
      setError("Free plan allows only 3 notes. Upgrade to Pro!");
      return;
    }

    try {
      await createNote(title, content);
      setTitle("");
      setContent("");
      loadNotes();
    } catch {
      setError("Failed to create note");
    }
  }

  async function handleUpdate(e: React.FormEvent) {
    e.preventDefault();
    if (editingId === null) return;
    try {
      await updateNote(editingId, editTitle, editContent);
      setEditingId(null);
      setEditTitle("");
      setEditContent("");
      loadNotes();
    } catch {
      setError("Failed to update note");
    }
  }

  async function handleDelete(id: number) {
    try {
      await deleteNote(id);
      loadNotes();
    } catch {
      setError("Failed to delete note");
    }
  }

  useEffect(() => {
    loadNotes();
  }, []);

  return (
    <AuthGuard>
      <div className="p-6 max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold mb-4">Notes</h1>
        {error && <p className="text-red-500 mb-4">{error}</p>}

        {/* Create Form */}
        <form onSubmit={handleCreate} className="mb-6 flex flex-col gap-2">
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Title"
            className="border p-2 rounded"
            required
          />
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Content"
            className="border p-2 rounded"
            required
          />
          <button
            disabled={user?.plan === "free" && notes.length >= 3}
            className={`px-4 py-2 rounded text-white ${
              user?.plan === "free" && notes.length >= 3
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            Add Note
          </button>
        </form>

        {/* Notes List */}
        {loading ? (
          <p>Loading...</p>
        ) : notes.length === 0 ? (
          <p className="text-gray-600">No notes yet. Start by adding one!</p>
        ) : (
          <ul className="space-y-3">
            {notes.map((note) => (
              <li key={note.id} className="p-3 border rounded bg-white shadow">
                {editingId === note.id ? (
                  <form onSubmit={handleUpdate} className="flex flex-col gap-2">
                    <input
                      value={editTitle}
                      onChange={(e) => setEditTitle(e.target.value)}
                      className="border p-2 rounded"
                      required
                    />
                    <textarea
                      value={editContent}
                      onChange={(e) => setEditContent(e.target.value)}
                      className="border p-2 rounded"
                      required
                    />
                    <div className="flex gap-2">
                      <button className="bg-green-600 text-white px-3 py-1 rounded">
                        Save
                      </button>
                      <button
                        type="button"
                        onClick={() => setEditingId(null)}
                        className="bg-gray-400 text-white px-3 py-1 rounded"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                ) : (
                  <div className="flex justify-between items-start">
                    <div>
                      <h2 className="font-semibold">{note.title}</h2>
                      <p>{note.content}</p>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => {
                          setEditingId(note.id);
                          setEditTitle(note.title);
                          setEditContent(note.content);
                        }}
                        className="text-blue-600 hover:underline"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(note.id)}
                        className="text-red-600 hover:underline"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </AuthGuard>
  );
}
