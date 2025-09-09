import React from "react";
import useGlobalReducer from "../hooks/useGlobalReducer.jsx";
import { useNavigate } from "react-router-dom";


const cartBox = {
    maxWidth: 600,
    margin: "48px auto",
    background: "#fff",
    borderRadius: 24,
    boxShadow: "0 4px 32px #38b2ac33",
    padding: "48px 48px 32px 48px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center"
};

const itemBox = {
    width: "100%",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "16px 0",
    borderBottom: "1px solid #e0f2f1"
};

const btnStyle = {
    background: "#319795",
    color: "#fff",
    fontWeight: 700,
    fontSize: 16,
    borderRadius: 12,
    border: "none",
    padding: "10px 18px",
    marginTop: 16,
    boxShadow: "0 2px 12px #38b2ac33",
    cursor: "pointer",
    width: "100%"
};

const smallBtn = {
    background: "#e53e3e",
    color: "#fff",
    border: "none",
    borderRadius: 8,
    padding: "6px 12px",
    marginLeft: 8,
    cursor: "pointer",
    fontWeight: 600
};

const editBtn = {
    ...smallBtn,
    background: "#3182ce"
};

const Cart = () => {
    const { store, dispatch } = useGlobalReducer();
    const products = store.cart || [];
    const navigate = useNavigate();

    const removeFromCart = (idx) => {
        dispatch({ type: "remove_from_cart", payload: idx });
    };
    console.log(products);
    // Simulación de pago con Stripe
    const handleStripePayment = () => {
        const totalAmount = products.reduce((total, item) => {
            const numericValue = parseFloat(item.price.replace(/[^\d.,]/g, '').replace(',', '.'));
            return total + numericValue;
        }, 0);
        navigate(`/payment/${totalAmount}/EUR`);
    };


    return (
        <div style={{ minHeight: "100vh", background: "var(--navbar-bg)", paddingTop: "48px" }}>
            <div style={cartBox}>
                <h2 style={{ color: "#319795", fontWeight: 800, marginBottom: 24, fontSize: 28 }}>Carrito</h2>
                {products && products.length > 0 ? (
                    <div style={{ width: "100%" }}>
                        {products.map((p, i) => (
                            <div key={i} style={itemBox}>
                                <img
                                    src={p.photo}
                                    alt={p.name}
                                    style={{ width: 48, height: 48, borderRadius: "50%", objectFit: "cover", marginRight: 16, border: "2px solid #319795" }}
                                />
                                <div style={{ flex: 1 }}>
                                    <div style={{ fontWeight: 700, fontSize: 18 }}>{p.name}</div>
                                    <div style={{ color: "#319795", fontSize: 15 }}>{p.location}</div>
                                    <div style={{ color: "#666", fontSize: 14 }}>
                                        {p.date && <span>Fecha: {new Date(p.date).toLocaleDateString()}</span>}
                                        {p.hour && <span> | Hora: {p.hour}</span>}
                                    </div>
                                </div>
                                <span style={{ fontWeight: 700, fontSize: 18 }}>{p.price}</span>
                                <button style={smallBtn} onClick={() => removeFromCart(i)}>Eliminar</button>
                            </div>
                        ))}
                        <button style={btnStyle} onClick={handleStripePayment}>
                            Pagar con Stripe
                        </button>
                    </div>
                ) : (
                    <p style={{ color: "#b2dfdb", fontSize: 18, margin: "32px 0" }}>El carrito está vacío</p>
                )}
            </div>
        </div>
    );
};

export default Cart;
