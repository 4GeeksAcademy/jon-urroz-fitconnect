import React, { useState } from "react";
import useGlobalReducer from "../hooks/useGlobalReducer.jsx";
import { useNavigate } from "react-router-dom";
import AvailabilityModal from "./AvailabilityModal.jsx";

const cardStyle = {
    background: "#fff",
    borderRadius: 32,
    boxShadow: "0 4px 32px #38b2ac33",
    overflow: "hidden",
    width: 320,
    margin: "0 18px 36px 0",
    display: "flex",
    flexDirection: "column"
};

const imgStyle = {
    width: "100%",
    height: 220,
    objectFit: "cover"
};

const infoBox = {
    padding: "22px 22px 16px 22px",
    display: "flex",
    flexDirection: "column"
};

const nameStyle = {
    fontWeight: 700,
    fontSize: 22,
    color: "#222",
    marginBottom: 4
};

const locationStyle = {
    fontSize: 16,
    color: "#666",
    marginBottom: 10
};

const descStyle = {
    fontSize: 15,
    color: "#444",
    marginBottom: 10
};

const priceStyle = {
    fontSize: 16,
    color: "#319795",
    fontWeight: 600
};

const opinionsStyle = {
    fontSize: 15,
    color: "#222",
    marginBottom: 8,
    display: "flex",
    alignItems: "center"
};

export default function TrainerCard({ trainer }) {
    const { dispatch } = useGlobalReducer();
    const navigate = useNavigate();
    const [showModal, setShowModal] = useState(false);

    const handleAvailability = () => {
        setShowModal(true);
    };

    const handlePhotoClick = () => {
        navigate(`/trainer/${trainer.name}`);
    };

    const handleSelectDate = (date) => {
        // Esta función ya no se usa directamente, se maneja en HourModal
        setShowModal(false);
        navigate(`/trainer/${trainer.name}`);
    };

    return (
        <div style={cardStyle}>
            <div style={{ position: "relative", cursor: "pointer" }} onClick={handlePhotoClick}>
                <img src={trainer.photo} alt={trainer.name} style={imgStyle} />
                <div style={{
                    position: "absolute",
                    bottom: 12,
                    left: 18,
                    color: "#fff",
                    padding: "10px 18px 6px 18px",
                    textAlign: "left",
                    borderRadius: 18,
                    maxWidth: "80%",
                    textShadow: "0 2px 8px rgba(0,0,0,0.45)"
                }}>
                    <div style={{ fontWeight: 700, fontSize: 20, color: "#fff", marginBottom: 2 }}>{trainer.name}</div>
                    <div style={{ fontSize: 15, color: "#fff" }}>{trainer.location}</div>
                </div>
            </div>
            <div style={infoBox}>
                <div style={opinionsStyle}>
                    <span style={{ color: '#f7b731', fontSize: 18, marginRight: 6 }}>★</span>
                    {trainer.rating} ({trainer.opinions} opiniones)
                </div>
                <div style={descStyle}>{trainer.description}</div>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 8 }}>
                    <span style={priceStyle}>{trainer.price}/h</span>
                    {localStorage.getItem("token") && (
                        <button
                            style={{
                                background: "#319795",
                                color: "#fff",
                                border: "none",
                                borderRadius: 18,
                                padding: "6px 18px",
                                fontWeight: 600,
                                fontSize: 15,
                                cursor: "pointer",
                                boxShadow: "0 2px 8px #38b2ac33",
                                transition: "background 0.2s"
                            }}
                            onMouseOver={e => e.currentTarget.style.background = '#24706b'}
                            onMouseOut={e => e.currentTarget.style.background = '#319795'}
                            onClick={handleAvailability}
                        >
                            Disponibilidad
                        </button>
                    )}
                </div>
            </div>
            <AvailabilityModal
                show={showModal}
                onClose={() => setShowModal(false)}
                onSelectDate={handleSelectDate}
                trainer={trainer}
            />
        </div>
    );
}
