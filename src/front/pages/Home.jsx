import React, { useEffect, useState } from "react"
import { Navbar } from "../components/Navbar.jsx";
import TrainerCard from "../components/TrainerCard.jsx";
// Evita scroll horizontal en toda la página
if (typeof window !== 'undefined') {
	document.body.style.overflowX = '';
	document.body.style.overflowY = '';
}
import useGlobalReducer from "../hooks/useGlobalReducer.jsx";

// Datos de ejemplo para entrenadores (fuera del componente)
export const trainers = [
	{
		name: "Valentina",
		location: "Getafe (en línea)",
		photo: "https://images.unsplash.com/photo-1571732154690-f6d1c3e5178a?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OHx8ZW50cmVuYWRvcmVzJTIwZml0bmVzc3xlbnwwfHwwfHx8MA%3D%3D",
		rating: 5,
		opinions: 23,
		description: "Entrenadora con 8 años de experiencia ofrece sesiones personalizadas y grupales...",
		price: "15€"
	},
	{
		name: "Gabriel",
		location: "Madrid (presencial & en línea)",
		photo: "https://images.unsplash.com/photo-1549476464-37392f717541?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8ZW50cmVuYWRvcmVzJTIwZ2ltbmFzaW98ZW58MHx8MHx8fDA%3D",
		rating: 5,
		opinions: 112,
		description: "Entrenador personal graduado y dietista. Ex-atleta de alto rendimiento. A domicilio, ...",
		price: "20€"
	},
	{
		name: "Miguel",
		location: "Madrid (presencial & en línea)",
		photo: "https://plus.unsplash.com/premium_photo-1661284922598-ea8e3499fc25?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8ZW50cmVuYWRvcmVzJTIwZml0bmVzc3xlbnwwfHwwfHx8MA%3D%3D",
		rating: 5,
		opinions: 22,
		description: "Licenciado en inef y nutrición y dietética se ofrece para conseguir tus objetivos físico-...",
		price: "38€"
	},
	// Puedes agregar más entrenadores aquí
];

export const Home = () => {

	const { store, dispatch } = useGlobalReducer()
	const [showRegister, setShowRegister] = useState(false);

	useEffect(() => {
		loadMessage();
	}, []);

	// Estilos extraídos del código del usuario
	const fitconnectBg = {
		width: '100%',
		margin: 0,
		padding: 0,
		background: '#f8f8f8',
	};

	const heroTitle = {
		fontSize: 44,
		fontWeight: 800,
		color: '#222',
		lineHeight: 1.1,
		letterSpacing: 0.5,
	};

	const heroList = {
		listStyle: "none",
		padding: 0,
		margin: "24px 0"
	};

	const heroListItem = {
		fontSize: 20,
		marginBottom: 12
	};

	const loadMessage = async () => {
		try {
			const backendUrl = import.meta.env.VITE_BACKEND_URL;
			if (!backendUrl) throw new Error("VITE_BACKEND_URL is not defined in .env file");
			const response = await fetch(backendUrl + "/api/hello");
			const data = await response.json();
			if (response.ok) dispatch({ type: "set_hello", payload: data.message });
		} catch (error) {
			if (error.message) throw new Error(
				`Could not fetch the message from the backend.
				Please check if the backend is running and the backend port is public.`
			);
		}
	}

	return (
		<div style={fitconnectBg}>
			{/* HERO con background-image y overlay traslúcido */}
			<section style={{
				width: "100%",
				minHeight: 900,
				backgroundImage: "url('https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=1920&q=80')",
				backgroundSize: "cover",
				backgroundPosition: "center 20%",
				backgroundRepeat: "no-repeat",
				display: "flex",
				alignItems: "center",
				justifyContent: "flex-start",
				position: "relative",
				padding: "56px 0 120px 0"
			}}>
				<div style={{
					position: "relative",
					zIndex: 2,
					background: "rgba(255,255,255,0.68)",
					backdropFilter: "blur(8px)",
					WebkitBackdropFilter: "blur(8px)",
					borderRadius: "32px",
					boxShadow: "0 4px 32px #38b2ac33",
					padding: "120px 48px",
					maxWidth: 520,
					minHeight: 700,
					display: "flex",
					flexDirection: "column",
					justifyContent: "center",
					alignItems: "flex-start",
					marginLeft: 64
				}}>
					<h1 style={{ ...heroTitle, marginTop: 0, marginBottom: 10 }}>Encuentra un entrenador<br />personal cerca de ti en 2min</h1>
					<ul style={heroList}>
						<li style={heroListItem}><span style={{ fontSize: 22, marginRight: 8 }}>🔥</span> Aprende a domicilio o en línea</li>
						<li style={heroListItem}><span style={{ fontSize: 22, marginRight: 8 }}>✅</span> Clases de entrenador personal a la carta y ¡sin compromiso!</li>
						<li style={{ ...heroListItem, marginBottom: 0 }}><span style={{ fontSize: 22, marginRight: 8 }}>🎁</span> 1ª clase gratis</li>
					</ul>
					<div className="d-flex flex-column align-items-start mt-4">
						<button
							className="btn btn-primary"
							style={{
								borderRadius: 28,
								padding: "0.9rem 2.6rem",
								fontWeight: 700,
								fontSize: 20,
								background: "#319795",
								border: "none",
								boxShadow: "0 2px 12px #38b2ac33",
								letterSpacing: 1,
								transition: "background 0.2s, box-shadow 0.2s",
								marginLeft: 0
							}}
							onClick={() => setShowRegister(true)}
							onMouseOver={e => e.currentTarget.style.background = '#24706b'}
							onMouseOut={e => e.currentTarget.style.background = '#319795'}
						>
							Crear cuenta
						</button>
						<div className="mt-3 text-start" style={{ fontSize: 15, color: "#444" }}>
							¿No tienes una cuenta? <span style={{ cursor: "pointer", textDecoration: "underline", color: "#319795", fontWeight: 600 }} onClick={() => setShowRegister(true)}>Regístrate aquí</span>
						</div>
					</div>
				</div>
			</section>
			{/* Sección de muestra de entrenadores */}
			<section style={{ width: "100%", maxWidth: 1400, margin: "0 auto", padding: "32px 0" }}>
				<h2 style={{ textAlign: "center", fontWeight: 800, fontSize: 32, margin: "0 0 32px 0", color: "#222" }}>
					Nuestra selección de entrenadores personales
				</h2>
				<div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: 32 }}>
					{trainers.slice(0, 6).map((trainer, idx) => (
						<TrainerCard key={idx} trainer={trainer} />
					))}
				</div>
			</section>
		</div>
	);

}