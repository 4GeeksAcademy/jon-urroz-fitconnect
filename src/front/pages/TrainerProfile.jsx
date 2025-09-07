import React, { useState } from "react";
import { useParams } from "react-router-dom";
import TrainerCard from "../components/TrainerCard.jsx";
import 'bootstrap/dist/css/bootstrap.min.css';
import { trainers } from "./Home.jsx";
import AvailabilityModal from "../components/AvailabilityModal.jsx";

export default function TrainerProfile() {
    // ...existing code...
    const { name } = useParams();
    const trainer = trainers.find(t => t.name === name);

    const [showModal, setShowModal] = useState(false);

    if (!trainer) {
        return <div style={{ padding: 48, textAlign: "center" }}>Entrenador no encontrado.</div>;
    }

    const handleSelectDate = (date) => {
        // Aquí podrías guardar la cita en el backend o en el carrito
        setShowModal(false);
        // ...acción extra si lo necesitas
    };

    return (
        <div style={{ minHeight: "100vh", background: "#f8f8f8", display: "flex", flexDirection: "row", justifyContent: "center", alignItems: "flex-start", gap: 48, padding: "64px 0" }}>
            {/* Sección principal de información */}
            <div style={{ flex: 1, maxWidth: 700 }}>
                {/* Etiquetas de especialidad */}
                <div style={{ display: "flex", gap: 12, marginBottom: 32 }}>
                    {['Entrenador personal', 'Ponerse en forma', 'Fitness', 'Musculación', 'Cross training'].map((tag, idx) => (
                        <span key={idx} style={{ background: '#e6f7f6', color: '#319795', borderRadius: 18, padding: '6px 18px', fontWeight: 600, fontSize: 13 }}>{tag}</span>
                    ))}
                </div>
                {/* Título grande */}
                <h1 style={{ fontWeight: 800, fontSize: 38, color: '#222', marginBottom: 32, lineHeight: 1.15 }}>
                    ENTRENADOR PERSONAL GRADUADO Y DIETISTA. Ex-Atleta de Alto Rendimiento. A domicilio, gimnasio, aire libre y online
                </h1>
                {/* Lugar de las clases */}
                <h3 style={{ fontWeight: 700, fontSize: 22, color: '#222', marginBottom: 18 }}>Lugar de las clases</h3>
                <div className="d-flex flex-wrap gap-3 mb-3">
                    <div className="d-flex align-items-center px-4 py-2" style={{ background: '#e6f7f6', borderRadius: 32, fontWeight: 600, fontSize: 14, boxShadow: '0 1px 8px #eee', gap: 6 }}>
                        <span style={{ fontSize: 16, marginRight: 4 }}>🏠</span>
                        En casa del profesor: {trainer.location}
                    </div>
                    <div className="d-flex align-items-center px-4 py-2" style={{ background: '#e6f7f6', borderRadius: 32, fontWeight: 600, fontSize: 14, boxShadow: '0 1px 8px #eee', gap: 6 }}>
                        <span style={{ fontSize: 16, marginRight: 4 }}>💻</span>
                        En línea
                    </div>
                </div>
                <div className="d-flex align-items-center px-4 py-2 mb-3" style={{ background: '#e6f7f6', borderRadius: 32, fontWeight: 600, fontSize: 14, boxShadow: '0 1px 8px #eee', gap: 6, width: '100%' }}>
                    <span style={{ fontSize: 16, marginRight: 4 }}>📍</span>
                    En tu domicilio o en un lugar público : <span style={{ fontWeight: 400, marginLeft: 4 }}>Desplazamientos hasta 20 km <span style={{ color: '#888', fontWeight: 500 }}>desde {trainer.location.split(' ')[0]}</span></span>
                </div>
                {/* Descripción extendida */}
                <h3 style={{ fontWeight: 700, fontSize: 24, color: '#222', marginTop: 40, marginBottom: 18 }}>Sobre Gabriel</h3>
                <div style={{ fontSize: 17, color: '#222', lineHeight: 1.6, textAlign: 'justify', marginBottom: 0 }}>
                    Formación Y Experiencia: - Graduado en Ciencias de la Actividad Física y Del Deporte - Máster en Nutrición y Dietética. - Entrenador de Cross L3, Entrenador Nacional de Atletismo y de otras titulaciones deportivas. - Más de 10 años de experiencia como entrenador personal y como entrenador de diversas modalidades deportivas y de fitness. - Ex-atleta de alto rendimiento deportivo en Atletismo entre 2006 y 2018. Campeón de España en 400 metros y en 4x400 metros.
                </div>
                {/* Acerca de la clase */}
                <h3 style={{ fontWeight: 700, fontSize: 24, color: '#222', marginTop: 40, marginBottom: 12 }}>Acerca de la clase</h3>
                <div style={{ display: 'flex', gap: 12, marginBottom: 18, marginTop: 0, alignItems: 'center' }}>
                    <span style={{ background: '#e6f7f6', color: '#319795', borderRadius: 18, padding: '6px 18px', fontWeight: 600, fontSize: 13 }}>Todos los niveles</span>
                    <span style={{ background: '#e6f7f6', color: '#319795', borderRadius: 18, padding: '6px 18px', fontWeight: 600, fontSize: 13 }}>Español</span>
                </div>
                <div style={{ fontSize: 17, color: '#222', lineHeight: 1.6, textAlign: 'justify', marginBottom: 0 }}>
                    <b>ENTRENADOR PERSONAL A DOMICILIO, AL AIRE LIBRE, ONLINE o GIMNASIO</b> Hola! Soy Gabriel, me encantaría ayudarte a conseguir tus metas de una manera sana, placentera y eficiente. Nuestro objetivo principal es ayudarte a conseguir tus metas con un camino atractivo, aportando conocimiento actualizado y contrastado, transmitiendo la mayor motivación posible, con un seguimiento adecuado y personalizado. Es hora de que experimentes de lo que eres capaz y superar tus metas y límites. - Funcionamos a domicilio, online, en gimnasio o al aire libre - Llevamos todo el material que necesites ya sea a tu domicilio, a uno de los cientos de parques que hay por Madrid, gimnasios, instalaciones deportivas municipales como pueden ser pistas de atletismo o pabellones, etc. - Contamos con diversas opciones: Individual, en pareja, en grupo, de manera online, etc. Pregunta para informarte <b>TE PROPORCIONAMOS TODA LA FACILIDAD Y COMODIDAD PARA AJUSTAR LOS DÍAS Y HORARIO EN EL QUE DESEES ENTRENAR</b> Contamos con muchas tarifas diferentes. El precio marcado es de manera simbólica. Pregunta sin compromiso, pincha en el vídeo, mira la descripción y dale al link Especializados en: - Mejora de la forma física, ya sea pérdida de grasa, aumento de masa muscular, definición, tonificación, etc.
                </div>
            </div>
            {/* Card del entrenador a la derecha */}
            <div style={{ minWidth: 320, maxWidth: 360, background: '#fff', borderRadius: 32, boxShadow: '0 4px 32px #38b2ac33', padding: 36, display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'sticky', top: 48, zIndex: 2 }}>
                <img src={trainer.photo} alt={trainer.name} style={{ width: 120, height: 120, borderRadius: '50%', objectFit: 'cover', marginBottom: 18 }} />
                <div style={{ fontWeight: 700, fontSize: 28, color: '#222', marginBottom: 6 }}>{trainer.name}</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8 }}>
                    <span style={{ color: '#f7b731', fontSize: 18 }}>★</span>
                    <span style={{ fontWeight: 600, fontSize: 16 }}>{trainer.rating}</span>
                    <span style={{ fontSize: 15, color: '#666' }}>({trainer.opinions} opiniones)</span>
                </div>
                <div style={{ fontSize: 17, color: '#222', marginBottom: 8 }}><b>Tarifa horaria</b> <span style={{ color: '#319795', fontWeight: 700 }}>{trainer.price}</span></div>
                <div style={{ fontSize: 15, color: '#222', marginBottom: 8 }}><b>Responde en</b> <span style={{ color: '#319795', fontWeight: 700 }}>5h</span></div>
                <div style={{ fontSize: 15, color: '#222', marginBottom: 18 }}><b>Nº alumnos</b> <span style={{ color: '#319795', fontWeight: 700 }}>50+</span></div>
                <button
                    style={{ background: '#319795', color: '#fff', border: 'none', borderRadius: 18, padding: '12px 32px', fontWeight: 700, fontSize: 18, cursor: 'pointer', marginBottom: 12, boxShadow: '0 2px 8px #31979533' }}
                    onClick={() => setShowModal(true)}
                >Disponibilidad</button>
                <AvailabilityModal
                    show={showModal}
                    onClose={() => setShowModal(false)}
                    onSelectDate={handleSelectDate}
                />
            </div>
        </div>
    );
}
