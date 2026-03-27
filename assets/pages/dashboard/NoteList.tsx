import React from "react";

export const NoteList = ({ notes, onEdit, onDelete }: any) => {
    return (
        <>
            <table className="table table-sm">
                <thead>
                    <tr>
                        <th scope="col">Title</th>
                        <th scope="col">Content</th>
                        <th scope="col">Category</th>
                        <th scope="col">Status</th>
                        <th scope="col">Action</th>
                    </tr>
                </thead>
                <tbody>
                    {notes.map((n: any) => {
                        const statusClass = (() => {
                            switch (n.status) {
                                case "new":
                                    return "text-bg-primary";
                                case "todo":
                                    return "text-bg-warning text-white";
                                case "done":
                                    return "text-bg-success";
                                default:
                                    return "text-bg-secondary";
                            }
                        })();

                        return (
                            <tr key={n.id}>
                                <td>{n.title}</td>
                                <td>{n.content}</td>
                                <td>{n.category}</td>
                                <td>
                                    <span className={`badge rounded-pill ${statusClass}`}>{n.status}</span>
                                </td>
                                <td>
                                    <button className="btn btn-sm btn-outline-primary me-1" onClick={() => onEdit(n)}>
                                        <i className="bi bi-pencil-square"></i>
                                    </button>
                                    <button className="btn btn-sm btn-outline-danger" onClick={() => onDelete(n.id)}>
                                         <i className="bi bi-trash"></i>
                                    </button>
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </>
    );
};
