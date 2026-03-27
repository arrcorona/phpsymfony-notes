import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { LoginForm } from "../auth/LoginForm";
import { RegisterForm } from "../auth/RegisterForm";
import { ConfirmPage } from "../auth/ConfirmPage";
import { Dashboard } from "../dashboard/Dashboard";

const Wrapper = styled.div`
    width: 100%;
    padding: 2rem;
`;
export interface User {
    id: number;
    email: string;
}
const IndexPage = () => {
    const [view, setView] = useState<"login" | "register" | "confirm" | "dashboard">("login");
    const [token, setToken] = useState("");
    const [user, setUser] = useState<User>(null);

    useEffect(() => {
        const savedUser = localStorage.getItem("user");
        if (savedUser) {
            setUser(JSON.parse(savedUser));
            setView("dashboard");
        }
    }, []);

    const handleLogout = () => {
        localStorage.removeItem("user");
        localStorage.removeItem("jwt");
        setUser(null);
        setView("login");
    };

    return (
        <>
            <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
                <div className="container-fluid">
                    <a className="navbar-brand" href="/">
                        Notes App
                    </a>
                    <button
                        className="navbar-toggler"
                        type="button"
                        data-bs-toggle="collapse"
                        data-bs-target="#navbarNavDropdown"
                        aria-controls="navbarNavDropdown"
                        aria-expanded="false"
                        aria-label="Toggle navigation"
                    >
                        <span className="navbar-toggler-icon"></span>
                    </button>

                    {localStorage.getItem("user") && (
                        <div className="collapse navbar-collapse" id="navbarNavDropdown">
                            <ul className="navbar-nav ms-auto">
                                <li className="nav-item dropdown">
                                    <a
                                        className="nav-link dropdown-toggle d-flex align-items-center"
                                        href="#"
                                        role="button"
                                        data-bs-toggle="dropdown"
                                        aria-expanded="false"
                                    >
                                        <i className="bi bi-person-circle me-2"></i>
                                        {localStorage.getItem("user")
                                            ? JSON.parse(localStorage.getItem("user")!).email
                                            : "Guest"}
                                    </a>

                                    <ul className="dropdown-menu dropdown-menu-dark dropdown-menu-end">
                                        <li>
                                            <button
                                                className="dropdown-item"
                                                onClick={() => {
                                                    localStorage.removeItem("jwt");
                                                    localStorage.removeItem("user");
                                                    window.location.reload();
                                                }}
                                            >
                                                <i className="bi bi-box-arrow-right me-2"></i> Logout
                                            </button>
                                        </li>
                                    </ul>
                                </li>
                            </ul>
                        </div>
                    )}
                </div>
            </nav>

            <Wrapper className="w-100 m-auto">
                {view === "login" && (
                    <LoginForm
                        onLogin={(user: User) => {
                            setUser(user);
                            setView("dashboard");
                        }}
                        goRegister={() => setView("register")}
                    />
                )}

                {view === "register" && (
                    <RegisterForm
                        onRegistered={(token: string) => {
                            setToken(token);
                            setView("confirm");
                        }}
                        goLogin={() => setView("login")}
                    />
                )}

                {view === "confirm" && <ConfirmPage token={token} goLogin={() => setView("login")} />}

                {user && view === "dashboard" && <Dashboard user={user} onLogout={handleLogout} />}
            </Wrapper>
        </>
    );
};

export { IndexPage };
