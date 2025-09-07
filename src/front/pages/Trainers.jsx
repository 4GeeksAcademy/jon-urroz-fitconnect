import React, { useEffect, useState } from "react";
import TrainerCard from "../components/TrainerCard.jsx";

export default function Trainers() {
    const [trainers, setTrainers] = useState([]);

    useEffect(() => {
        // Aquí iría la llamada real al backend
        // Por ahora, datos de ejemplo
        setTrainers([
            {
                name: "Valentina",
                location: "Getafe (en línea)",
                photo: "https://randomuser.me/api/portraits/women/44.jpg",
                rating: 5,
                opinions: 23,
                description: "Entrenadora con 8 años de experiencia ofrece sesiones personalizadas y grupales...",
                price: "15€"
            },
            {
                name: "Gabriel",
                location: "Madrid (presencial & en línea)",
                photo: "https://randomuser.me/api/portraits/men/32.jpg",
                rating: 5,
                opinions: 112,
                description: "Entrenador personal graduado y dietista. Ex-atleta de alto rendimiento. A domicilio, ...",
                price: "20€"
            },
            {
                name: "Miguel",
                location: "Madrid (presencial & en línea)",
                photo: "https://randomuser.me/api/portraits/men/45.jpg",
                rating: 5,
                opinions: 22,
                description: "Licenciado en inef y nutrición y dietética se ofrece para conseguir tus objetivos físico-...",
                price: "38€"
            },
            // Puedes agregar más entrenadores aquí
        ]);
    }, []);

    return (
        <div style={{ minHeight: "100vh", background: "var(--navbar-bg)", paddingTop: "48px" }}>
            <h1 style={{ textAlign: "center", fontWeight: 800, fontSize: 36, margin: "48px 0 32px 0", color: "#222" }}>
                Catálogo de entrenadores/as
            </h1>
            <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center" }}>
                {trainers.map((trainer, idx) => (
                    <TrainerCard key={idx} trainer={trainer} />
                ))}
            </div>
        </div>
    );
}
