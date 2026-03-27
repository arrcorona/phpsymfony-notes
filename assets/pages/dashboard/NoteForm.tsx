import React, { useState } from "react";

const API = process.env.REACT_APP_API_URL;

export const NoteForm = ({ onCreated }: any) => {
  const [note, setNote] = useState({ title: "", content: "", category: "", status: "new" });

  const create = async () => {
    const res = await fetch(`${API}/notes`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("jwt")}`,
      },
      body: JSON.stringify(note),
    });

    const data = await res.json();
    onCreated(data);
  };

  return (
    <div>
      <input placeholder="Title" onChange={(e) => setNote({ ...note, title: e.target.value })} />
      <button onClick={create}>Add</button>
    </div>
  );
};