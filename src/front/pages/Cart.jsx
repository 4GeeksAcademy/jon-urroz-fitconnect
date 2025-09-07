import React, { useState, useEffect } from "react";
import useGlobalReducer from "../hooks/useGlobalReducer.jsx";

const cartBox = {
    maxWidth: 520,
    margin: "0 auto",
    background: "var(--navbar-bg)",
    borderRadius: 24,
    boxShadow: "0 4px 32px #38b2ac33",
    padding: "48px 32px 32px 32px",
    minHeight: 220,
    display: "flex",
    flexDirection: "column",
    alignItems: "center"
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
        <div className="p-6">
            <h2 className="text-xl font-semibold mb-4">Carrito</h2>
            {products && products.length > 0 ? (
                <div className="space-y-4">
                    {products.map((p, i) => (
                        <div key={i} className="flex justify-between items-center p-4 border rounded-lg shadow-sm">
                            <div>
                                <p className="font-medium">{p.name}</p>
                                <p className="text-sm text-gray-500">{p.location}</p>
                            </div>
                            <span className="font-semibold">{p.price} €</span>
                            <button onClick={() => deleteProduct(p.id)} className="ml-4 text-red-600">Eliminar</button>
                            <button onClick={() => updateProduct(p.id, { ...p, name: p.name + " (edit)" })} className="ml-2 text-blue-600">Editar</button>
                        </div>
                    ))}
                    <button onClick={handleStripePayment} className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition">
                        Pagar con Stripe
                    </button>
                </div>
            ) : (
                <p className="text-gray-500">El carrito está vacío</p>
            )}
            <button onClick={() => addProduct({ name: "Nuevo", price: 10, location: "Demo" })} className="mt-4 bg-green-600 text-white py-2 px-4 rounded-lg">Añadir producto demo</button>
        </div>
    );
};

// ...existing code...
export default Cart;
