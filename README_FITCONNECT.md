# FitConnect

FitConnect es una plataforma web que conecta entrenadores personales con usuarios que buscan clases, productos y servicios relacionados con el fitness. Permite a los usuarios registrarse, explorar entrenadores, reservar clases, comprar productos y gestionar sus pedidos, mientras que los entrenadores pueden crear su perfil, ofrecer productos y gestionar su disponibilidad.

## Funcionalidades principales

- Registro y autenticación de usuarios y entrenadores.
- Búsqueda y filtrado de entrenadores.
- Visualización de perfiles de entrenadores y productos.
- Carrito de compras y gestión de pedidos.
- Reserva de clases y horarios disponibles.
- Integración de pagos.
- Panel de administración para gestión de usuarios, productos y reservas.

## Instalación general

### Requisitos previos

- Python 3.10+
- Node.js (versión 20 recomendada)
- Pipenv
- Motor de base de datos (PostgreSQL recomendado)

### Backend

1. Clona el repositorio:
   ```bash
   git clone https://github.com/4GeeksAcademy/jon-urroz-fitconnect.git
   cd jon-urroz-fitconnect
   ```
2. Instala las dependencias de Python:
   ```bash
   pipenv install
   ```
3. Copia el archivo de entorno:
   ```bash
   cp .env.example .env
   ```
4. Configura la variable `DATABASE_URL` en `.env` según tu motor de base de datos.
5. Realiza las migraciones:
   ```bash
   pipenv run migrate
   pipenv run upgrade
   ```
6. Inicia el backend:
   ```bash
   pipenv run start
   ```

### Frontend

1. Instala las dependencias:
   ```bash
   npm install
   ```
2. Inicia el servidor de desarrollo:
   ```bash
   npm run start
   ```

## Uso de la aplicación

1. Accede a la web y regístrate como usuario o entrenador.
2. Explora entrenadores, productos y servicios disponibles.
3. Añade productos o clases al carrito y realiza el pago.
4. Los entrenadores pueden gestionar su perfil, productos y disponibilidad desde su panel.
5. Los administradores pueden gestionar usuarios, productos y reservas.

## Despliegue

FitConnect está listo para desplegarse en Render.com o Heroku. Consulta la documentación oficial para más detalles.

## Créditos

Desarrollado como parte del bootcamp de 4Geeks Academy.
