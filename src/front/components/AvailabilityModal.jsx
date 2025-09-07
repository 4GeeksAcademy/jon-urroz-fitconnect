import React, { useState } from "react";
import Calendar from "react-calendar";
import HourModal from "./HourModal";
import 'react-calendar/dist/Calendar.css';
export default function AvailabilityModal({ show, onClose, onSelectDate, trainer }) {
    // Declarar 'today' antes de cualquier uso
    const today = new Date();
    const [selectedDate, setSelectedDate] = useState(today);
    const [selectedHour, setSelectedHour] = useState("");
    const [showHourModal, setShowHourModal] = useState(false);
    // Color FitConnect
    const fitColor = "#319795";
    // Generar días disponibles aleatorios para el mes actual
    const year = today.getFullYear();
    const month = today.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    // Generar días disponibles solo una vez al montar el componente
    const [availableDays] = useState(() => {
        let arr = [];
        for (let i = 1; i <= daysInMonth; i++) {
            const dateObj = new Date(year, month, i);
            if (dateObj < today) continue;
            if (Math.random() > 0.65) arr.push(i);
        }
        return arr;
    });

    if (!show) return null;

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
                    Selecciona una fecha
                </h2>
                <Calendar
                    onChange={date => {
                        setSelectedDate(date);
                        setShowHourModal(true);
                    }}
                    value={selectedDate}
                    locale="es-ES"
                    minDate={today}
                    style={{ marginBottom: 18 }}
                    tileContent={() => null}
                    tileClassName={({ date, view }) => {
                        // Marcar solo los días disponibles
                        if (
                            view === 'month' &&
                            date.getMonth() === month &&
                            availableDays.includes(date.getDate())
                        ) {
                            return 'fitconnect-available-day';
                        }
                        return null;
                    }}
                    tileDisabled={({ date, view }) => {
                        // Deshabilitar días no disponibles y días pasados
                        if (view === 'month' && date < today) return true;
                        if (view === 'month' && date.getMonth() === month) {
                            return !availableDays.includes(date.getDate());
                        }
                        return false;
                    }}
                />
                {/* Modal de horas */}
                <HourModal
                    show={showHourModal}
                    trainer={trainer}
                    onClose={() => setShowHourModal(false)}
                    selectedHour={selectedHour}
                    setSelectedHour={setSelectedHour}
                    selectedDate={selectedDate}
                />
            </div>
        </div>
    );
}
