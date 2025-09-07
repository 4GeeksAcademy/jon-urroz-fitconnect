import React, { useState, useEffect } from "react";
import useGlobalReducer from "../hooks/useGlobalReducer.jsx";

const cartBox = {
    maxWidth: 520,
    margin: "48px auto",
    background: "#fff",
    borderRadius: 24,
    boxShadow: "0 4px 32px #38b2ac33",
    padding: "48px 32px 32px 32px",
    minHeight: 220,
    display: "flex",
    flexDirection: "column",
    alignItems: "center"
};

const productItemStyle = {
    width: "100%",
    padding: "16px 18px",
    marginBottom: 16,
    background: "#f4faff",
    borderRadius: 12,
    border: "1px solid #b2dfdb",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center"
};

const btnStyle = {
    background: "#319795",
    color: "#fff",
    fontWeight: 700,
    fontSize: 16,
    borderRadius: 12,
    border: "none",
    padding: "10px 16px",
    marginLeft: 8,
    cursor: "pointer"
};

const btnDangerStyle = {
    ...btnStyle,
    background: "#e53e3e"
};

const btnPrimaryStyle = {
    ...btnStyle,
    background: "#3182ce"
};

const btnSuccessStyle = {
    ...btnStyle,
    background: "#38a169",
    width: "100%",
    marginTop: 16,
    padding: "14px 0"
};

const Cart = ({ backendUrl }) => {
    const [products, setProducts] = useState([]);

    useEffect(() => {
        fetch(`${backendUrl}/api/products`)
            .then(res => res.json())
            .then(data => setProducts(data));
    }, [backendUrl]);

    const addProduct = async (newProduct) => {
        await fetch(`${backendUrl}/api/products`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(newProduct)
        });
        fetch(`${backendUrl}/api/products`)
            .then(res => res.json())
            .then(data => setProducts(data));
    };

    const updateProduct = async (id, updatedProduct) => {
        await fetch(`${backendUrl}/api/products/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(updatedProduct)
        });
        fetch(`${backendUrl}/api/products`)
            .then(res => res.json())
            .then(data => setProducts(data));
    };

    const deleteProduct = async (id) => {
        await fetch(`${backendUrl}/api/products/${id}`, {
            method: "DELETE"
        });
        fetch(`${backendUrl}/api/products`)
            .then(res => res.json())
            .then(data => setProducts(data));
    };

    const handleStripePayment = async () => {
        if (!products || products.length === 0) {
            alert("No hay productos en el carrito");
            return;
        }
        const product = products[0];
        const response = await fetch(`${backendUrl}/api/create-checkout-session`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                name: product.name,
                price: product.price,
                description: product.location,
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

    return (
        <div style={{ minHeight: "100vh", background: "var(--navbar-bg)", paddingTop: "48px" }}>
            <div style={cartBox}>
                <h2 style={{ color: "#319795", fontWeight: 800, marginBottom: 24, fontSize: 28 }}>Carrito</h2>
                {products && products.length > 0 ? (
                    <div style={{ width: "100%" }}>
                        {products.map((p, i) => (
                            <div key={i} style={productItemStyle}>
                                <div>
                                    <p style={{ fontWeight: 600, margin: 0, color: "#2d3748" }}>{p.name}</p>
                                    <p style={{ fontSize: 14, color: "#718096", margin: "4px 0 0 0" }}>{p.location}</p>
                                </div>
                                <div style={{ display: "flex", alignItems: "center" }}>
                                    <span style={{ fontWeight: 700, color: "#319795", marginRight: 16 }}>{p.price} €</span>
                                    <button
                                        onClick={() => updateProduct(p.id, { ...p, name: p.name + " (edit)" })}
                                        style={btnPrimaryStyle}
                                    >
                                        Editar
                                    </button>
                                    <button
                                        onClick={() => deleteProduct(p.id)}
                                        style={btnDangerStyle}
                                    >
                                        Eliminar
                                    </button>
                                </div>
                            </div>
                        ))}
                        <button onClick={handleStripePayment} style={btnSuccessStyle}>
                            Pagar con Stripe
                        </button>
                    </div>
                ) : (
                    <div style={{ textAlign: "center", color: "#718096", marginBottom: 24 }}>
                        <p style={{ fontSize: 18, margin: 0 }}>El carrito está vacío</p>
                    </div>
                )}
                <button
                    onClick={() => addProduct({ name: "Nuevo", price: 10, location: "Demo" })}
                    style={{
                        ...btnStyle,
                        background: "#38a169",
                        width: "100%",
                        marginTop: 8,
                        padding: "14px 0"
                    }}
                >
                    Añadir producto demo
                </button>
            </div>
        </div>
    );
};

// ...existing code...
export default Cart;
