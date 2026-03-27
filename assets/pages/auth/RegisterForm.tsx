import React, { useState } from "react";

const API = process.env.REACT_APP_API_URL;

export const RegisterForm = ({ onRegistered, goLogin }: any) => {
    const [form, setForm] = useState({ email: "", password: "" });

    const handleRegister = async () => {
        const res = await fetch(`${API}/register`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(form),
        });

        const data = await res.json();

        if (data.token) {
            alert("Registered! Download email file to confirm.");
            onRegistered(data.token);
        } else {
            alert(data.error);
        }
    };

    return (
        <div className="form-signin w-25 m-auto">
            <h3 className="h3 mb-3 fw-normal">Register</h3>

            <div className="form-floating mb-2">
                <input
                    type="email"
                    className="form-control"
                    id="floatingInput"
                    placeholder="admin2@test.com"
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                />
                <label htmlFor="floatingInput">Email address</label>
            </div>
            <div className="form-floating mb-2">
                <input
                    type="password"
                    className="form-control"
                    id="floatingPassword"
                    placeholder="Password"
                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                />
                <label htmlFor="floatingPassword">Password</label>
            </div>

            <button className="btn btn-secondary w-100 py-2" onClick={handleRegister}>
                Register
            </button>
            
            <a className="mt-5 mb-3 text-body-secondary" onClick={goLogin}>
                Already have account? Login
            </a>
        </div>
    );
};
