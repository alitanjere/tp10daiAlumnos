# TP10 - DAI Alumnos API

This project implements a RESTful API for managing "alumnos" (students), with CRUD operations and a PostgreSQL database backend hosted on Supabase.

## Table of Contents

- [Prerequisites](#prerequisites)
- [Database Setup (Supabase)](#database-setup-supabase)
- [Installation](#installation)
- [Configuration](#configuration)
- [Running the Application](#running-the-application)
- [API Endpoints](#api-endpoints)
- [Postman Collection](#postman-collection)

## Prerequisites

- Node.js (v18.x or later recommended)
- npm (usually comes with Node.js)
- A Supabase account and an active Supabase project.

## Database Setup (Supabase)

This application uses a PostgreSQL database hosted on Supabase.

1.  **Supabase Account and Project**:
    Ensure you have an active Supabase account and have created a project.

2.  **Create the Database**:
    The application expects a database named `tp10_dbAlumnos`.
    - Navigate to your Supabase project dashboard.
    - Go to the "SQL Editor" section.
    - If the database `tp10_dbAlumnos` does not exist, you can create it, although Supabase projects usually come with a default `postgres` database that can be used. For this project, we are using a specific database name as configured. Often, you connect to the default `postgres` database and the tables are created within its default `public` schema. The `db-config.js` specifies `tp10_dbAlumnos`, so it's best to ensure your connection string targets this or adjust the config. *For simplicity, we will assume tables are created in the default `postgres` database provided by Supabase under its `public` schema, and `tp10_dbAlumnos` in the config refers to this default database context.*

3.  **Create Tables and Insert Data**:
    The necessary SQL script to create tables (`cursos`, `alumnos`, `grupos_pdp`, and `alumnos_grupos_pdp`) and insert initial data is located at `src/configs/database.sql`. This script defines the structure for managing students, courses, and project groups. You need to run this script against your Supabase database.

    **Option 1: Using Supabase SQL Editor (Recommended for simplicity)**
    - Open the `src/configs/database.sql` file in your code editor.
    - Copy the entire content of the file.
    - Go to the "SQL Editor" in your Supabase project dashboard.
    - Paste the copied SQL content into a new query window.
    - Click "Run".

    **Option 2: Using `psql` (Command-Line Tool)**
    If you have `psql` installed and prefer the command line, you can connect to your Supabase database and execute the script.
    The connection string details (host, port, user) are available in your Supabase project's database settings.
    ```bash
    psql -h aws-0-us-east-2.pooler.supabase.com -p 5432 -U postgres.ecixggguhynivdpbuacb -d tp10_dbAlumnos -f src/configs/database.sql
    ```
    - Replace `aws-0-us-east-2.pooler.supabase.com`, `postgres.ecixggguhynivdpbuacb`, and `tp10_dbAlumnos` with your actual Supabase host, user, and database name if they differ from what's in `src/configs/db-config.js`.
    - You will be prompted for the password for your Supabase database user.

4.  **Configuration File**:
    The application's database connection is configured in `src/configs/db-config.js`. This file has already been updated with the Supabase credentials:
    ```javascript
    export default {
        host: 'aws-0-us-east-2.pooler.supabase.com', // Or your specific Supabase host
        port: 5432,
        user: 'postgres.ecixggguhynivdpbuacb', // Your Supabase user
        password: 'zoloalan11...', // Your Supabase password
        database: 'tp10_dbAlumnos' // The database name, typically 'postgres' for Supabase default
    };
    ```
    Ensure the `password` field matches your Supabase database password.

## Installation

1.  **Clone the repository (if you haven't already):**
    ```bash
    git clone <repository-url>
    cd <repository-directory>
    ```

2.  **Install dependencies:**
    Navigate to the project's root directory (where `package.json` is located) and run:
    ```bash
    npm install
    ```

## Configuration

-   **Database:** Ensure `src/configs/db-config.js` is correctly configured with your Supabase database credentials as described in the [Database Setup (Supabase)](#database-setup-supabase) section. The most important field to verify and update is the `password`.

## Running the Application

1.  **Start the server:**
    Once the dependencies are installed and the database is set up and configured, you can start the server using:
    ```bash
    npm start
    ```
    This command uses `nodemon` to run `src/server.js`, so the server will automatically restart if you make changes to the source files.

2.  The API will be running at `http://localhost:3000`.

## API Endpoints

The API provides the following endpoints for managing "alumnos" (students), which aligns with the schema in `src/configs/database.sql`.

-   `GET /api/alumnos`: Retrieves all alumnos.
-   `GET /api/alumnos/:id`: Retrieves a specific alumno by ID.
-   `POST /api/alumnos`: Creates a new alumno.
    -   Request body example:
        ```json
        {
            "nombre": "Juan",
            "apellido": "Perez",
            "id_curso": 1,
            "fecha_nacimiento": "2000-05-15",
            "hace_deportes": true
        }
        ```
-   `PUT /api/alumnos`: Updates an existing alumno. The ID of the alumno to update must be included in the request body.
    -   Request body example:
        ```json
        {
            "id": 1,
            "nombre": "Juancito",
            "apellido": "Perez Actualizado",
            "id_curso": 2,
            "fecha_nacimiento": "2000-05-16",
            "hace_deportes": false
        }
        ```
    -   Returns `201 Created` on successful update.
-   `DELETE /api/alumnos/:id`: Deletes an alumno by ID.

## Postman Collection

A Postman collection is available in `documents/postman/TP04-Alumnos.postman_collection.json`. You can import this into Postman to test the API endpoints.
It includes requests for all defined endpoints and uses environment variables like `{{base_url}}` and `{{alumno_id}}`.
The "Update Alumno" request description notes that it expects a `201 Created` status on success.
