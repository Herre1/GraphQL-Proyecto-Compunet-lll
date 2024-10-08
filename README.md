# Taller Nest 

## Desarrolladores
- **Victor Manuel Garzon Meneses**
- **Santiago Jose Belalcazar**
- **Manuel Herrera**

Este proyecto es una API backend construida con Node.js y TypeScript utilizando el framework NestJS. Permite la gestión de usuarios, contenido, comentarios, listas y reacciones. Incluye autenticación y autorización mediante JWT, y operaciones CRUD (Crear, Leer, Actualizar, Eliminar). La base de datos utilizada es PostgreSQL, interactuando con ella mediante TypeORM.

## Tabla de contenidos

   - Requisitos Previos
   - Instalación
   - Configuración
   - Endpoints
   - Tecnologías Utilizadas
   - Funcionalidades
   - Dificultades
   - Pruebas
   - Despliegue

## Requisitos Previos

Asegúrate de tener instalados los siguientes requisitos:

- [Nest.js](https://nestjs.com)
- [npm](https://www.npmjs.com/) o [yarn](https://yarnpkg.com/)
- [PostgreSQL](https://www.postgresql.org)

## Instalación

1. Clona este repositorio:
   ```bash
   git clone https://github.com/Lacragh/Proyecto-Compunet-lll.git
   cd Proyecto-Compunet-III
  
2. Instala las dependencias con npm o yarn:
   ```bash
   npm install
   # o
   yarn install
  
## Configuracion:

1. Renombra el archivo .env.example a .env y actualiza las variables de entorno con tus credenciales. Ejemplo:
   
     ```bash 
     POSTGRES_DB=miBaseDeDatos
     POSTGRES_USER=usuario
     POSTGRES_PASSWORD=miContraseña
     JWT_SECRET=tuClaveSecretaParaJWT
     PORT=3000
     ```

2. Inicia el servidor:

     ```bash
     npm run start
     ```
     
## Correr tests

  ```bash
    # unit tests
    $ npm run test
    
    # e2e tests
    $ npm run test:e2e
    
    # test coverage
    $ npm run test:cov
  ```

## Endpoints

En el repositorio se incluye un JSON de Postman que tiene pruebas en un entorno local de los endpoints, en el puede encontrar cada una de las operaciones que se tuvieron en cuenta para la aplicacion.

### Gestión de Usuarios

   - GET /users/ - Obtiene una lista de todos los usuarios.
   - GET /users/:id/ - Obtiene la información de un usuario por su ID.
   - PUT /users/:id/ - Actualiza la información del usuario indicado.
   - DELETE /users/:id/ - Elimina el usuario indicado.

### Gestión de Autenticacion y Autorizacion

   - POST /auth/register/ - Registra un nuevo usuario.
   - POST /auth/login/ - Autentica un usuario y devuelve un token JWT.

### Gestión de Contenido

   - POST /api/v1/content/ - Crea un nuevo contenido (accesible solo para admins).
   - GET /api/v1/content/ - Lista todo el contenido disponible.
   - GET /api/v1/content/:id/ - Obtiene un contenido específico por ID.
   - PATCH /api/v1/content/:id/ - Actualiza un contenido existente (solo admins).
   - DELETE /api/v1/content/:id/ - Elimina un contenido (solo admins).

### Gestión de Comentarios

   - POST /api/v1/comments/ - Crea un nuevo comentario.
   - GET /api/v1/comments/ - Obtiene todos los comentarios.
   - GET /api/v1/comments/:id/ - Obtiene un comentario específico por ID.
   - POST /api/v1/comments/reply/:id/ - Responde a un comentario existente.
   - GET /api/v1/comments/parent/:id/ - Obtiene todas las respuestas a un comentario.
   - PATCH /api/v1/comments/:id/ - Actualiza un comentario existente.
   - DELETE /api/v1/comments/:id/ - Elimina un comentario (solo admins).

### Gestión de Reacciones

   - POST /api/v1/reactions: Crea una reacción en un comentario.
   - GET /api/v1/reactions: Obtiene todas las reacciones.
   - GET /api/v1/reactions/comment/:id: Obtiene las reacciones de un comentario.
   - GET /api/v1/reactions/user/:userId: Obtiene las reacciones de un usuario.
   - DELETE /api/v1/reactions/:id: Elimina una reacción.

### Gestión de Listas

   - POST /api/v1/lists: Crea una nueva lista de contenido para un usuario.
   - GET /api/v1/lists/:userId: Obtiene las listas de un usuario.
   - DELETE /api/v1/lists/:id: Elimina una lista específica.

## Tecnologías Utilizadas

  - Node.js: Entorno de ejecución para JavaScript en el servidor.
  - TypeScript: Superconjunto de JavaScript que añade tipado estático.
  - NestJS: Framework para construir aplicaciones escalables del lado del servidor.
  - PostgreSQL: Base de datos relacional.
  - JWT: Para la autenticación y autorización segura de los usuarios.
  - TypeORM: ORM para interactuar con PostgreSQL.
  - Passport: Middleware de autenticación.

## Funcionalidades de la aplicacion

  - **Autenticación y Autorización**: Registro e inicio de sesión de usuarios mediante JWT.
  - **Roles de Usuario**: Soporte para diferentes roles de usuario, como admin y usuario regular.
  - **Operaciones CRUD**: Gestión completa de usuarios, contenido, comentarios, listas y reacciones.
  - **Protección de Rutas**: Las rutas CRUD están protegidas con middleware de autenticación y autorización, asegurando que solo usuarios con roles adecuados accedan a las rutas protegidas.
  - **Gestión de Contenido**: Operaciones CRUD para administrar el contenido de películas, series y animes.
  - **Gestión de Comentarios**: Los usuarios pueden realizar comentarios en el contenido, así como responder a otros comentarios, creando hilos de discusión.
  - **Reacciones**: Los usuarios pueden reaccionar a los comentarios de otros usuarios, añadiendo interactividad.
  - **Gestión de Listas**: Los usuarios pueden crear listas de contenido personalizado.
  - **Validaciones**: Validaciones de datos utilizando class-validator para asegurar la entrada de datos correcta.

## Pruebas

Se incluye un archivo JSON de Postman en el proyecto (Archivo_JSON_POSTMAN.json) que contiene pruebas de cada una de las funcionalidades de la API.
Este archivo contiene todas las solicitudes y scripts de test utilizados para validar la funcionalidad de la API.


**Cómo importar el archivo de Postman**

1. Abre Postman.
2. Haz clic en "Import" en la parte superior izquierda.
3. Selecciona el archivo `Archivo_JSON_POSTMAN.json` .
4. Ejecuta las pruebas desde la colección importada.

## Dificultades encontradas:
   
  - **Gestión de Reacciones**: Durante el desarrollo de la funcionalidad de reacciones, se encontraron desafíos al evitar que los usuarios reaccionaran múltiples veces al mismo comentario. Esto se resolvió mediante verificaciones adicionales en los controladores.
  - **Autenticación y Autorización**: Manejar múltiples roles y la verificación del token JWT fue un desafío inicial, especialmente en rutas protegidas con diferentes niveles de acceso.

## Despliegue
   https://tallernode-production.up.railway.app/
