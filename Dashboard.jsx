import React, { useEffect, useState } from "react";

function Dashboard() {
  const [notes, setNotes] = useState([]);
  const [text, setText] = useState("");
  const username = localStorage.getItem("username");
  const token = localStorage.getItem("token");

  const fetchNotes = async () => {
    const res = await fetch("http://localhost:5500/notes", {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    const data = await res.json();
    setNotes(data);
  };

  useEffect(() => {
    fetchNotes();
  }, []);

  const addNote = async () => {
    if (!text.trim()) return;

    await fetch("http://localhost:5500/notes", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ text })
    });

    setText("");
    fetchNotes();
  };

  const deleteNote = async (id) => {
    await fetch(`http://localhost:5500/notes/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    fetchNotes();
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-3xl font-bold mb-4">
        Hello {username} 👋
      </h1>

      {/* Add note */}
      <div className="flex gap-2 mb-6">
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Write a note..."
          className="flex-1 p-2 rounded border"
        />
        <button
          onClick={addNote}
          className="bg-blue-600 text-white px-4 rounded hover:bg-blue-700"
        >
          Add
        </button>
      </div>

      {/* Notes list */}
      <div className="grid gap-4">
        {notes.length === 0 && (
          <p className="text-gray-500">No notes yet.</p>
        )}

        {notes.map((note) => (
          <div
            key={note._id}
            className="bg-white p-4 rounded shadow flex justify-between items-center"
          >
            <span>{note.text}</span>
            <button
              onClick={() => deleteNote(note._id)}
              className="text-red-500 hover:text-red-700"
            >
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Dashboard;
