import React, { useState, useEffect } from "react";

const Products = ({ backendUrl }) => {
  const [products, setProducts] = useState([]);

  // GET
  useEffect(() => {
    fetch(`${backendUrl}/api/products`)
      .then(res => res.json())
      .then(data => setProducts(data));
  }, [backendUrl]);

  // POST
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

  // PUT
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

  // DELETE
  const deleteProduct = async (id) => {
    await fetch(`${backendUrl}/api/products/${id}`, { method: "DELETE" });
    fetch(`${backendUrl}/api/products`)
      .then(res => res.json())
      .then(data => setProducts(data));
  };

  return (
    <div>
      <h2>Productos</h2>
      {products.map((p) => (
        <div key={p.id}>
          <span>{p.name} - {p.price}€</span>
          <button onClick={() => updateProduct(p.id, { ...p, name: p.name + " (edit)" })}>Editar</button>
          <button onClick={() => deleteProduct(p.id)}>Eliminar</button>
        </div>
      ))}
      <button onClick={() => addProduct({ name: "Nuevo", price: 10, location: "Demo" })}>Añadir producto demo</button>
    </div>
  );
};

export default Products;
