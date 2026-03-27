import React, { useEffect, useState } from "react";

const API = process.env.REACT_APP_API_URL;

export const ConfirmPage = ({ token, goLogin }: any) => {
    const [status, setStatus] = useState("Confirming...");

    useEffect(() => {
        const confirm = async () => {
            const res = await fetch(`${API}/confirm/${token}`);
            const data = await res.json();

            if (data.message) {
                setStatus("Account confirmed!");
            } else {
                setStatus(data.error);
            }
        };

        confirm();
    }, [token]);

    return (
        <div className="form-signin w-25 m-auto">
            <h3 className="h3 mb-3 fw-normal">{status}</h3>
            <button className="btn btn-primary w-100 py-2" onClick={goLogin}>Go to Login</button>
        </div>
    );
};
