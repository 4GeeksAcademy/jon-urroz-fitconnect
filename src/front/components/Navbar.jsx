import { Link } from "react-router-dom";
import React, { useState } from "react";
import AuthModal from "./AuthModal.jsx";

export const Navbar = () => {
	const [showAuth, setShowAuth] = useState(false);
	return (
		<>
			<nav className="navbar navbar-light" style={{ padding: '0.5rem 0', background: '#f8f8f8', boxShadow: 'none', border: 'none' }}>
				<div className="container d-flex justify-content-between align-items-center" style={{ maxWidth: '1400px', width: '100%', padding: '0 48px' }}>
					<Link to="/" style={{ textDecoration: 'none' }}>
						<span className="navbar-brand mb-0 h1" style={{ fontWeight: 700, fontSize: '2rem', letterSpacing: '0.5px', color: '#319795' }}>FitConnect</span>
					</Link>
					<div className="d-flex gap-2">
						<Link to="/trainers">
							<button className="btn" style={{ background: 'var(--primary-color)', color: 'white', fontWeight: 600 }}>Ver entrenadores/as</button>
						</Link>
						<Link to="/give-class">
							<button className="btn btn-outline-teal" style={{ borderColor: 'var(--primary-color)', color: '#319795', fontWeight: 600 }}>Dar clase</button>
						</Link>
						<Link to="/cart">
							<button className="btn btn-outline-teal" style={{ borderColor: 'var(--primary-color)', color: '#319795', fontWeight: 600 }}>Carrito</button>
						</Link>
						<button className="btn btn-outline-teal" style={{ borderColor: 'var(--primary-color)', color: '#319795', fontWeight: 600 }} onClick={() => setShowAuth(true)}>Conectarse</button>
					</div>
				</div>
			</nav>
			<AuthModal show={showAuth} onClose={() => setShowAuth(false)} />
		</>
	);
};