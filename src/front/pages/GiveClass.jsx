import React, { useState } from "react";

const formBox = {
    maxWidth: 420,
    margin: "48px auto",
    background: "#fff",
    borderRadius: 24,
    boxShadow: "0 4px 32px #38b2ac33",
    padding: "48px 32px 32px 32px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center"
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

export default function GiveClass() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [name, setName] = useState("");
    const [specialty, setSpecialty] = useState("");

    return (
        <div style={{ minHeight: "100vh", background: "var(--navbar-bg)", paddingTop: "48px" }}>
            <form style={formBox}>
                <h2 style={{ color: "#319795", fontWeight: 800, marginBottom: 24 }}>Crea tu perfil</h2>
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
                    type="text"
                    placeholder="Nombre"
                    value={name}
                    onChange={e => setName(e.target.value)}
                />
                <input
                    style={inputStyle}
                    type="text"
                    placeholder="Especialidad"
                    value={specialty}
                    onChange={e => setSpecialty(e.target.value)}
                />
                <button style={btnStyle} type="submit">Regístrate</button>
            </form>
        </div>
    );
}
