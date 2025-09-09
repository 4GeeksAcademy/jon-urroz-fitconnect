import React, { useState } from "react";

const modalBg = {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100vw",
    height: "100vh",
    background: "rgba(0,0,0,0.32)",
    zIndex: 9999,
    display: "flex",
    alignItems: "center",
    justifyContent: "center"
};

const modalBox = {
    background: "#fff",
    borderRadius: 24,
    boxShadow: "0 4px 32px #38b2ac33",
    padding: "48px 32px 32px 32px",
    minWidth: 340,
    maxWidth: 420,
    width: "100%",
    position: "relative"
};

const closeBtn = {
    position: "absolute",
    top: 18,
    right: 24,
    fontSize: 28,
    color: "#319795",
    cursor: "pointer",
    border: "none",
    background: "none"
};

const inputStyle = {
    width: "100%",
    padding: "16px 18px",
    fontSize: 18,
    borderRadius: 12,
    border: "1px solid #b2dfdb",
    marginBottom: 18,
    background: "#f4faff"
};

const btnStyle = {
    width: "100%",
    background: "#319795",
    color: "#fff",
    fontWeight: 700,
    fontSize: 20,
    borderRadius: 18,
    border: "none",
    padding: "14px 0",
    marginTop: 8,
    boxShadow: "0 2px 12px #38b2ac33",
    cursor: "pointer"
};

export default function AuthModal({ show, onClose }) {
    const [view, setView] = useState("register");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [repeatPassword, setRepeatPassword] = useState("");

    if (!show) return null;

    const handleBgClick = e => {
        if (e.target === e.currentTarget) onClose();
    };

    const handleSubmitRegister = e => {
        e.preventDefault();
        fetch(`${import.meta.env.VITE_BACKEND_URL}/api/register`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ email, password, role:"user" })
        })
            .then(res => res.json())
            .then(data => {
                alert(data.msg);
                setView("login");
            });
    }

    const handleSubmitLogin = e => {
        e.preventDefault();
        fetch(`${import.meta.env.VITE_BACKEND_URL}/api/login`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ email, password })
        })
            .then(res => res.json())
            .then(data => {
                if (data.token) {
                    localStorage.setItem("token", data.token);
                    localStorage.setItem("role", data.role);
                    alert("Login exitoso");
                    onClose();
                    window.location.reload();
                } else {
                    alert(data.msg || "Error en el login");
                }
            });
    }


    return (
        <div style={modalBg} onClick={handleBgClick}>
            <div style={modalBox}>
                <button style={closeBtn} onClick={onClose} aria-label="Cerrar">×</button>
                {view === "register" ? (
                    <>
                        <h2 style={{ textAlign: "center", color: "#319795", fontWeight: 800, marginBottom: 24 }}>Regístrate</h2>
                        <input
                            style={inputStyle}
                            type="text"
                            placeholder="Correo electrónico"
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                        />
                        <input
                            style={inputStyle}
                            type="password"
                            placeholder="Contraseña"
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                        />
                        <input
                            style={inputStyle}
                            type="password"
                            placeholder="Repite la contraseña"
                            value={repeatPassword}
                            onChange={e => setRepeatPassword(e.target.value)}
                        />
                        <button onClick={handleSubmitRegister} style={btnStyle}>Regístrate</button>
                        <div style={{ textAlign: "center", marginTop: 18, fontSize: 16 }}>
                            ¿Ya tienes una cuenta? <span style={{ color: "#319795", fontWeight: 700, cursor: "pointer", textDecoration: "underline" }} onClick={() => setView("login")}>Inicia sesión</span>
                        </div>
                    </>
                ) : (
                    <>
                        <h2 style={{ textAlign: "center", color: "#319795", fontWeight: 800, marginBottom: 24 }}>Inicia sesión</h2>
                        <input
                            style={inputStyle}
                            type="text"
                            placeholder="Correo electrónico"
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                        />
                        <input
                            style={inputStyle}
                            type="password"
                            placeholder="Contraseña"
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                        />
                        <button onClick={handleSubmitLogin} style={btnStyle}>Entrar</button>
                        <div style={{ textAlign: "center", marginTop: 18, fontSize: 16 }}>
                            ¿No tienes cuenta? <span style={{ color: "#319795", fontWeight: 700, cursor: "pointer", textDecoration: "underline" }} onClick={() => setView("register")}>Regístrate</span>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}
