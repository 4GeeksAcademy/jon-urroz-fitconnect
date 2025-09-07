# Guía rápida de endpoints Fitconnect

---

## 1. Registro de usuario/entrenador

POST `/api/register`

```jsonc
// Usuario
{
  "email": "usuario@test.com",
  "password": "test1234",
  "role": "user"
}
// Entrenador
{
  "email": "entrenador@test.com",
  "password": "test1234",
  "role": "trainer",
  "name": "Entrenador Pro",
  "specialty": "Yoga",
  "price_per_session": 30
}
```

---

## 2. Login

POST `/api/login`

```jsonc
{
  "email": "usuario@test.com",
  "password": "test1234"
}
```

Respuesta: Guarda el campo `token` para las siguientes peticiones.

---

## 3. Crear perfil de entrenador (si no se creó en el registro)

POST `/api/trainer-profile`
Headers:
`Authorization: Bearer <token>`

```jsonc
{
  "name": "Entrenador Pro",
  "specialty": "Yoga",
  "description": "Clases personalizadas",
  "price_per_session": 30
}
```

---

## 4. Crear producto

POST `/api/product`
Headers:
`Authorization: Bearer <token>`

```jsonc
{
  "title": "Pack 5 sesiones",
  "description": "Entrenamiento personalizado",
  "price": 120
}
```

---

## 5. Crear orden (compra)

POST `/api/order`
Headers:
`Authorization: Bearer <token de usuario NO entrenador>`

```jsonc
{
  "product_id": 1,
  "amount": 120
}
```

---

## 6. Verificar salud y documentación

GET `/api/health`
Respuesta: `{ "status": "ok", "database": "ok" }`

GET `/api/docs`
Respuesta: Documentación Swagger/OpenAPI.

---

// Puedes usar Postman, Insomnia o cualquier cliente HTTP para probar estos endpoints.
// Si necesitas ejemplos para otros endpoints, ¡pídelo!
