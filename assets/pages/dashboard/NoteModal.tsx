import React, { useState, useEffect } from "react";

const API = process.env.REACT_APP_API_URL;


export const NoteModal = ({ note, onClose, onSaved }: any) => {
    const [form, setForm] = useState({ title: "", content: "", category: "", status: "new" });

    useEffect(() => {
        if (note) setForm(note);
    }, [note]);

    const handleSubmit = async () => {
        const method = note ? "PUT" : "POST";
        const url = note ? `${API}/notes/${note.id}` : `${API}/notes`;

        const res = await fetch(url, {
            method,
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem("jwt")}`,
            },
            body: JSON.stringify(form),
        });
        const data = await res.json();
        onSaved(data);
    };

    return (
        <div className="modal d-block" tabIndex={-1}>
            <div className="modal-dialog">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title">{note ? "Edit Note" : "Add Note"}</h5>
                        <button type="button" className="btn-close" onClick={onClose}></button>
                    </div>
                    <div className="modal-body">
                        <input
                            className="form-control mb-2"
                            placeholder="Title"
                            value={form.title}
                            onChange={(e) => setForm({ ...form, title: e.target.value })}
                        />
                        <textarea
                            className="form-control mb-2"
                            placeholder="Content"
                            value={form.content}
                            onChange={(e) => setForm({ ...form, content: e.target.value })}
                        />
                        <input
                            className="form-control mb-2"
                            placeholder="Category"
                            value={form.category}
                            onChange={(e) => setForm({ ...form, category: e.target.value })}
                        />
                        <select
                            className="form-select mb-2"
                            value={form.status}
                            onChange={(e) => setForm({ ...form, status: e.target.value })}
                        >
                            <option value="new">new</option>
                            <option value="todo">todo</option>
                            <option value="done">done</option>
                        </select>
                    </div>
                    <div className="modal-footer">
                        <button className="btn btn-secondary" onClick={onClose}>Cancel</button>
                        <button className="btn btn-primary" onClick={handleSubmit}>{note ? "Save" : "Add"}</button>
                    </div>
                </div>
            </div>
        </div>
    );
};