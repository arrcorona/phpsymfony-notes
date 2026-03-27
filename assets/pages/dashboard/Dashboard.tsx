import React, { useEffect, useState } from "react";
import { NoteModal } from "./NoteModal";
import { NoteList } from "./NoteList";

const API = process.env.REACT_APP_API_URL;

export const Dashboard = ({ user, onLogout }: any) => {
    const [notes, setNotes] = useState<any[]>([]);
    const [search, setSearch] = useState("");
    const [debouncedSearch, setDebouncedSearch] = useState("");
    const [modalOpen, setModalOpen] = useState(false);
    const [editingNote, setEditingNote] = useState<any>(null);
    const [loading, setLoading] = useState(false);

    const headers = {
        Authorization: `Bearer ${localStorage.getItem("jwt")}`,
    };

    const fetchNotes = async (query: string = "") => {
        try {
            setLoading(true);

            const params = new URLSearchParams();
            if (query) params.append("search", query);

            const res = await fetch(`${API}/notes?${params.toString()}`, { headers });
            const data = await res.json();

            setNotes(data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedSearch(search);
        }, 300);

        return () => clearTimeout(handler);
    }, [search]);

    useEffect(() => {
        fetchNotes(debouncedSearch);
    }, [debouncedSearch]);

    const openModal = (note: any = null) => {
        setEditingNote(note);
        setModalOpen(true);
    };

    const closeModal = () => {
        setEditingNote(null);
        setModalOpen(false);
    };

    const handleSave = (savedNote: any) => {
        const exists = notes.find((n) => n.id === savedNote.id);

        if (exists) {
            setNotes(notes.map((n) => (n.id === savedNote.id ? savedNote : n)));
        } else {
            setNotes([savedNote, ...notes]);
        }

        closeModal();
    };

    const handleDelete = async (id: number) => {
        try {
            const res = await fetch(`${API}/notes/${id}`, {
                method: "DELETE",
                headers,
            });

            if (res.ok) {
                setNotes(notes.filter((n) => n.id !== id));
            }
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div className="container-fluid">
            <div className="row">
                <main className="col-lg-12 px-md-4">
                    <div className="d-flex flex-column flex-md-row justify-content-between align-items-center pt-3 pb-2 mb-3 border-bottom">
                        <h1 className="h2 mb-3 mb-md-0">Dashboard</h1>

                        <div className="d-flex gap-2">
                            <button className="btn btn-success" onClick={() => openModal()}>
                                <i className="bi bi-plus-lg me-1"></i> Add Note
                            </button>
                        </div>
                    </div>

                    <div className="mb-3" style={{ maxWidth: "400px" }}>
                        <div className="input-group">
                            <span className="input-group-text">
                                <i className="bi bi-search"></i>
                            </span>
                            <input
                                type="text"
                                className="form-control"
                                placeholder="Search notes..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                        </div>
                    </div>

                    {loading ? (
                        <div className="text-center mt-4">
                            <div className="spinner-border text-primary" role="status"></div>
                        </div>
                    ) : notes.length === 0 ? (
                        <div className="text-center text-muted mt-4">No notes found</div>
                    ) : (
                        <NoteList notes={notes} onEdit={openModal} onDelete={handleDelete} />
                    )}

                    {modalOpen && <NoteModal note={editingNote} onClose={closeModal} onSaved={handleSave} />}
                </main>
            </div>
        </div>
    );
};
