import React from "react";
import HourSelect from "./HourSelect";
import useGlobalReducer from "../hooks/useGlobalReducer.jsx";
import { useNavigate } from "react-router-dom";

export default function HourModal({ show, onClose, selectedHour, setSelectedHour, selectedDate, trainer }) {
    const { dispatch } = useGlobalReducer();
    const navigate = useNavigate();
    if (!show) return null;
    const handleContract = () => {
        if (!selectedHour) return;
        // Aseguramos que se envíen todos los datos relevantes del entrenador
        dispatch({
            type: "add_to_cart",
            payload: {
                name: trainer.name,
                photo: trainer.photo,
                price: trainer.price,
                location: trainer.location,
                date: selectedDate,
                hour: selectedHour
            }
        });
        onClose();
        navigate("/cart");
    };
    return (
        <div
            style={{
                position: "fixed",
                top: 0,
                left: 0,
                width: "100vw",
                height: "100vh",
                background: "rgba(0,0,0,0.35)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                zIndex: 9999
            }}
            onClick={onClose}
        >
            <div
                style={{
                    background: "#fff",
                    borderRadius: 24,
                    padding: "32px 28px",
                    minWidth: 340,
                    boxShadow: "0 4px 32px #38b2ac33",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center"
                }}
                onClick={e => e.stopPropagation()}
            >
                <h2 style={{ color: "#319795", fontWeight: 800, marginBottom: 18 }}>
                    Selecciona una hora
                </h2>
                <HourSelect value={selectedHour} onChange={setSelectedHour} />
                <button
                    style={{
                        marginTop: 28,
                        background: selectedHour ? "#319795" : "#bbb",
                        color: "#fff",
                        border: "none",
                        borderRadius: 18,
                        padding: "10px 28px",
                        fontWeight: 700,
                        fontSize: 17,
                        cursor: selectedHour ? "pointer" : "not-allowed",
                        boxShadow: "0 2px 8px #38b2ac33",
                        transition: "background 0.2s"
                    }}
                    disabled={!selectedHour}
                    onClick={handleContract}
                >
                    Contratar servicio
                </button>
            </div>
        </div>
    );
}
