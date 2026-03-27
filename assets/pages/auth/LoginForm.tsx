import React, { useState } from "react";

const API = process.env.REACT_APP_API_URL;

export const LoginForm = ({ onLogin, goRegister }: any) => {
    const [form, setForm] = useState({ email: "", password: "" });

    const handleLogin = async () => {
        const res = await fetch(`${API}/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(form),
        });

        const data = await res.json();

        console.table(data);

        if (res.ok) {
            localStorage.setItem("jwt", data.token || "temp");
            localStorage.setItem("user", JSON.stringify(data.user));
            onLogin(data.user);
        } else {
            alert(data.error || "Login failed");
        }
    };

    return (
        <div className="form-signin w-25 m-auto">
            <h3 className="h3 mb-3 fw-normal">Login</h3>

            <div className="form-floating mb-2">
                <input
                    type="email"
                    className="form-control"
                    id="floatingInput"
                    placeholder="admin2@test.com"
                    value={form.email}
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
                    value={form.password}
                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                />
                <label htmlFor="floatingPassword">Password</label>
            </div>

            <button className="btn btn-primary w-100 py-2" onClick={handleLogin}>
                Login
            </button>
            <a className="mt-5 mb-3 text-body-secondary" onClick={goRegister}>
                Register
            </a>
        </div>
    );
};
