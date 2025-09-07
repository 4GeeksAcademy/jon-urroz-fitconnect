import React, { useState, useEffect } from "react";

const Users = ({ backendUrl }) => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    fetch(`${backendUrl}/api/users`)
      .then(res => res.json())
      .then(data => setUsers(data));
  }, [backendUrl]);

  const addUser = async (newUser) => {
    await fetch(`${backendUrl}/api/users`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newUser)
    });
    fetch(`${backendUrl}/api/users`)
      .then(res => res.json())
      .then(data => setUsers(data));
  };

  const updateUser = async (id, updatedUser) => {
    await fetch(`${backendUrl}/api/users/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updatedUser)
    });
    fetch(`${backendUrl}/api/users`)
      .then(res => res.json())
      .then(data => setUsers(data));
  };

  const deleteUser = async (id) => {
    await fetch(`${backendUrl}/api/users/${id}`, { method: "DELETE" });
    fetch(`${backendUrl}/api/users`)
      .then(res => res.json())
      .then(data => setUsers(data));
  };

  return (
    <div>
      <h2>Usuarios</h2>
      {users.map((u) => (
        <div key={u.id}>
          <span>{u.email} - {u.role}</span>
          <button onClick={() => updateUser(u.id, { ...u, email: u.email + " (edit)" })}>Editar</button>
          <button onClick={() => deleteUser(u.id)}>Eliminar</button>
        </div>
      ))}
      <button onClick={() => addUser({ email: "nuevo@test.com", password: "123456", role: "user" })}>Añadir usuario demo</button>
    </div>
  );
};

export default Users;
