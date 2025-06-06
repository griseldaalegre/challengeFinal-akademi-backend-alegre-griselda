# Challenge Final - Plataforma de Cursos Online

## 📚 Proyecto Integrador Final

Este proyecto consiste en el desarrollo de una **plataforma completa de cursos online**, que incluye tanto frontend como backend. El sistema implementa autenticación y autorización por roles (Superadmin, Profesor y Alumno) y permite la gestión de cursos, inscripciones y calificaciones.

---

## 🛠 Tecnologías Utilizadas

### Backend
- Node.js
- Express.js
- MongoDB + Mongoose
- JWT para autenticación
- Nodemailer (para recuperación de contraseña)
- Validator + Middleware personalizados
- Dotenv

### Frontend
- React.js con Hooks
- Redux (clásico)
- React Router
- Axios
- Styled Components / Tailwind CSS

---

## 🔐 Sistema de Roles

| Rol         | Descripción |
|-------------|-------------|
| **Superadmin** | Registro de profesores, gestión total de usuarios y cursos, estadísticas generales. |
| **Profesor**   | Alta y gestión de cursos propios, visualización de alumnos, carga de calificaciones. |
| **Alumno**     | Registro libre, inscripción a cursos, consulta de calificaciones. |

---

## 🖥 Funcionalidades por Rol

### 👤 Superadmin
- Dashboard con estadísticas generales
- Crear/editar/eliminar usuarios (profesores y superadmins)
- Ver lista de cursos

### 👨‍🏫 Profesor
- Crear, editar y eliminar sus cursos
- Ver alumnos inscriptos a sus cursos
- Cargar y editar calificaciones

### 👨‍🎓 Alumno
- Registro y login
- Navegar por catálogo de cursos
- Inscripción y cancelación
- Visualización de calificaciones

---

## 📂 Endpoints del Backend

### Autenticación
- `POST /auth/login`
- `POST /auth/register` (solo alumnos)
- `POST /auth/forgot-password`
- `POST /auth/reset-password`

### Usuarios
- `GET /users`
- `GET /users/:id`
- `PUT /users/:id`
- `DELETE /users/:id`
- `POST /users` (crear profesor o superadmin)

### Cursos
- `GET /courses`
- `GET /courses/:id`
- `POST /courses`
- `PUT /courses/:id`
- `DELETE /courses/:id`
- `GET /courses/professor/:id`

### Inscripciones
- `GET /enrollments/student/:id`
- `POST /enrollments`
- `DELETE /enrollments/:id`
- `GET /enrollments/course/:id`

### Calificaciones
- `GET /grades/student/:id`
- `POST /grades`
- `PUT /grades/:id`

---

## 🖼 Pantallas del Frontend

- Login / Registro / Recuperación
- Dashboard personalizado según rol
- Lista y detalle de cursos
- Formularios con validaciones
- Paginación y filtros por categoría, nivel, etc.
- Inscripciones y gestión de calificaciones
- Navegación protegida por roles

---

## ✅ Requisitos

### Backend
- Autenticación JWT completa
- CRUD completo para todas las entidades
- Validaciones de negocio y errores
- Paginación y filtros en listados
- Recuperación de contraseña por email

### Frontend
- Manejo de estado con Redux
- Navegación con React Router
- Formularios con validaciones
- Gestión completa de entidades
- Estados de carga, errores y protección por roles

---

## 🚀 Instrucciones de Instalación

### Clonar el repositorio

```bash
git clone https://github.com/griseldaalegre/challengeFinal-akademi-backend-alegre-griselda.git
```

### Backend

1. Instalar dependencias:

```bash
npm install
```

3. Crear un archivo `.env` con las siguientes variables:

```
PORT=5000
MONGO_URI=mongodb://localhost:27017/cursos
JWT_SECRET=tu_clave_secreta
EMAIL_USER=tu_email
EMAIL_PASS=tu_contraseña
```

4. Iniciar el servidor:

```bash
npm run dev
```

### Frontend

1. Ir a la carpeta `/frontend`
2. Instalar dependencias:

```bash
npm install
```

3. Iniciar la aplicación:

```bash
npm start
```

---

## 📬 Colección de Postman

Incluida coleccion `postman` con ejemplos de cada endpoint.

---

## 👨‍💻 Autor

- **Nombre:** Griselda Alegre  
- **Repositorio GitHub:** [github.com/griseldaalegre](https://github.com/griseldaalegre)

---
