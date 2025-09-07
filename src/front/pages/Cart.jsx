import React from "react";
import useGlobalReducer from "../hooks/useGlobalReducer.jsx";

const cartContainerStyle = {
    minHeight: "100vh",
    background: "var(--navbar-bg)",
    paddingTop: "48px"
};

const cartBox = {
    maxWidth: 800,
    margin: "0 auto",
    background: "#fff",
    borderRadius: 32,
    boxShadow: "0 4px 32px #38b2ac33",
    padding: "48px 32px 32px 32px",
    minHeight: 400,
    display: "flex",
    flexDirection: "column"
};

const titleStyle = {
    textAlign: "center",
    fontWeight: 800,
    fontSize: 36,
    marginBottom: 32,
    color: "#222"
};

const emptyCartStyle = {
    textAlign: "center",
    color: "#666",
    fontSize: 18,
    marginTop: 60
};

const cartItemStyle = {
    background: "#f8f9fa",
    borderRadius: 20,
    padding: "24px",
    marginBottom: 20,
    display: "flex",
    alignItems: "center",
    boxShadow: "0 2px 16px rgba(0,0,0,0.05)"
};

const trainerImageStyle = {
    width: 80,
    height: 80,
    borderRadius: 16,
    objectFit: "cover",
    marginRight: 20
};

const trainerInfoStyle = {
    flex: 1
};

const trainerNameStyle = {
    fontWeight: 700,
    fontSize: 20,
    color: "#222",
    marginBottom: 4
};

const trainerLocationStyle = {
    fontSize: 16,
    color: "#666",
    marginBottom: 8
};

const sessionDetailsStyle = {
    fontSize: 14,
    color: "#319795",
    fontWeight: 600,
    marginBottom: 4
};

const priceStyle = {
    fontSize: 18,
    color: "#319795",
    fontWeight: 700
};

const removeButtonStyle = {
    background: "#ff4757",
    color: "#fff",
    border: "none",
    borderRadius: 12,
    padding: "8px 16px",
    fontWeight: 600,
    fontSize: 14,
    cursor: "pointer",
    transition: "background 0.2s"
};

const checkoutButtonStyle = {
    background: "#319795",
    color: "#fff",
    border: "none",
    borderRadius: 20,
    padding: "16px 32px",
    fontWeight: 700,
    fontSize: 18,
    cursor: "pointer",
    boxShadow: "0 4px 16px #38b2ac33",
    transition: "background 0.2s",
    marginTop: 20,
    width: "100%"
};

const totalStyle = {
    textAlign: "center",
    fontSize: 24,
    fontWeight: 700,
    color: "#222",
    marginTop: 20,
    padding: "20px",
    background: "#f8f9fa",
    borderRadius: 16
};

const Cart = () => {
    const { store, dispatch } = useGlobalReducer();
    const { cart } = store;
    const backendUrl = import.meta.env.VITE_BACKEND_URL;

    const removeFromCart = (index) => {
        dispatch({ type: "remove_from_cart", payload: index });
    };

    const calculateTotal = () => {
        return cart.reduce((total, item) => {
            const price = parseFloat(item.price.replace('€', ''));
            return total + price;
        }, 0);
    };

    const handleStripePayment = async () => {
        if (!cart || cart.length === 0) {
            alert("No hay servicios en el carrito");
            return;
        }

        // Crear sesión de pago para todos los items del carrito
        const response = await fetch(`${backendUrl}/api/create-checkout-session`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                items: cart.map(item => ({
                    name: `${item.name} - ${item.date} ${item.hour}`,
                    price: parseFloat(item.price.replace('€', '')),
                    description: `${item.location} - ${item.date} ${item.hour}`
                })),
                success_url: window.location.origin + "/success",
                cancel_url: window.location.origin + "/cart"
            })
        });

        const data = await response.json();
        if (data.checkout_url) {
            window.location.href = data.checkout_url;
        } else {
            alert("Error al crear la sesión de pago");
            console.error("Respuesta del backend:", data);
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return "";
        const date = new Date(dateString);
        return date.toLocaleDateString('es-ES', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    return (
        <div style={cartContainerStyle}>
            <div style={cartBox}>
                <h1 style={titleStyle}>Carrito</h1>

                {cart && cart.length > 0 ? (
                    <>
                        <div>
                            {cart.map((item, index) => (
                                <div key={index} style={cartItemStyle}>
                                    <img
                                        src={item.photo}
                                        alt={item.name}
                                        style={trainerImageStyle}
                                    />
                                    <div style={trainerInfoStyle}>
                                        <div style={trainerNameStyle}>{item.name}</div>
                                        <div style={trainerLocationStyle}>{item.location}</div>
                                        <div style={sessionDetailsStyle}>
                                            📅 {formatDate(item.date)} a las {item.hour}
                                        </div>
                                    </div>
                                    <div style={priceStyle}>{item.price}/h</div>
                                    <button
                                        style={removeButtonStyle}
                                        onClick={() => removeFromCart(index)}
                                        onMouseOver={e => e.currentTarget.style.background = '#ff3742'}
                                        onMouseOut={e => e.currentTarget.style.background = '#ff4757'}
                                    >
                                        Eliminar
                                    </button>
                                </div>
                            ))}
                        </div>

                        <div style={totalStyle}>
                            Total: {calculateTotal().toFixed(2)}€
                        </div>

                        <button
                            style={checkoutButtonStyle}
                            onClick={handleStripePayment}
                            onMouseOver={e => e.currentTarget.style.background = '#24706b'}
                            onMouseOut={e => e.currentTarget.style.background = '#319795'}
                        >
                            Proceder al pago
                        </button>
                    </>
                ) : (
                    <div style={emptyCartStyle}>
                        <p>El carrito está vacío</p>
                        <p style={{ fontSize: 16, marginTop: 8 }}>
                            Selecciona un entrenador y reserva tu sesión
                        </p>
                        {/* Botón de prueba temporal - eliminar en producción */}
                        <button
                            style={{
                                background: "#319795",
                                color: "#fff",
                                border: "none",
                                borderRadius: 12,
                                padding: "8px 16px",
                                fontWeight: 600,
                                fontSize: 14,
                                cursor: "pointer",
                                marginTop: 16
                            }}
                            onClick={() => dispatch({
                                type: "add_to_cart",
                                payload: {
                                    name: "Entrenador Demo",
                                    photo: "https://randomuser.me/api/portraits/men/32.jpg",
                                    price: "20€",
                                    location: "Madrid (presencial)",
                                    date: new Date(),
                                    hour: "10:00"
                                }
                            })}
                        >
                            Añadir entrenador demo
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

// ...existing code...
export default Cart;
