import express from "express";
import cors from "cors";
import pkg from 'pg';
import dotenv from 'dotenv';

dotenv.config();
import { StatusCodes } from 'http-status-codes';
import config from './configs/db-config.js';

const { Client } = pkg;
const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

const client = new Client(config);
client.connect();

// Endpoints for /api/alumnos

// GET /api/alumnos
app.get('/api/alumnos', async (req, res) => {
    try {
        const result = await client.query('SELECT * FROM alumnos');
        res.status(StatusCodes.OK).json(result.rows);
    } catch (error) {
        console.error(error);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: error.message });
    }
});

// GET /api/alumnos/:id
app.get('/api/alumnos/:id', async (req, res) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
        return res.status(StatusCodes.BAD_REQUEST).send('El ID debe ser numérico.');
    }
    try {
        const result = await client.query('SELECT * FROM alumnos WHERE id = $1', [id]);
        if (result.rows.length === 0) {
            return res.status(StatusCodes.NOT_FOUND).send('Alumno no encontrado.');
        }
        res.status(StatusCodes.OK).json(result.rows[0]);
    } catch (error) {
        console.error(error);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: error.message });
    }
});

// POST /api/alumnos
app.post('/api/alumnos', async (req, res) => {
    const { nombre, apellido, id_curso, fecha_nacimiento, hace_deportes } = req.body;

    // Validations
    if (!nombre || nombre.trim().length < 3) {
        return res.status(StatusCodes.BAD_REQUEST).send('El nombre es obligatorio y debe tener al menos 3 caracteres.');
    }
    if (!apellido || apellido.trim().length < 3) {
        return res.status(StatusCodes.BAD_REQUEST).send('El apellido es obligatorio y debe tener al menos 3 caracteres.');
    }
    if (id_curso === undefined || typeof id_curso !== 'number') {
        return res.status(StatusCodes.BAD_REQUEST).send('id_curso es obligatorio y debe ser un número.');
    }
    // Basic date validation (YYYY-MM-DD)
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (fecha_nacimiento && !dateRegex.test(fecha_nacimiento)) {
        return res.status(StatusCodes.BAD_REQUEST).send('La fecha_nacimiento debe estar en formato YYYY-MM-DD.');
    }
     if (hace_deportes === undefined || typeof hace_deportes !== 'boolean') {
        // Allowing 0 or 1 as boolean representations as per issue's example
        if (hace_deportes !== 0 && hace_deportes !== 1) {
            return res.status(StatusCodes.BAD_REQUEST).send('hace_deportes es obligatorio y debe ser un valor booleano (true/false o 1/0).');
        }
    }

    try {
        const result = await client.query(
            'INSERT INTO alumnos (nombre, apellido, id_curso, fecha_nacimiento, hace_deportes) VALUES ($1, $2, $3, $4, $5) RETURNING *',
            [nombre, apellido, id_curso, fecha_nacimiento || null, hace_deportes]
        );
        res.status(StatusCodes.CREATED).json(result.rows[0]);
    } catch (error) {
        console.error(error);
        // Check for foreign key constraint violation for id_curso
        if (error.code === '23503' && error.constraint === 'alumnos_id_curso_fkey') {
            return res.status(StatusCodes.BAD_REQUEST).send('El id_curso proporcionado no existe.');
        }
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: error.message });
    }
});

// PUT /api/alumnos
app.put('/api/alumnos', async (req, res) => {
    const { id, nombre, apellido, id_curso, fecha_nacimiento, hace_deportes } = req.body;

    if (id === undefined || typeof id !== 'number') {
        return res.status(StatusCodes.BAD_REQUEST).send('El campo "id" es obligatorio y debe ser numérico para la actualización.');
    }
    // Validations
    if (!nombre || nombre.trim().length < 3) {
        return res.status(StatusCodes.BAD_REQUEST).send('El nombre es obligatorio y debe tener al menos 3 caracteres.');
    }
    if (!apellido || apellido.trim().length < 3) {
        return res.status(StatusCodes.BAD_REQUEST).send('El apellido es obligatorio y debe tener al menos 3 caracteres.');
    }
    if (id_curso === undefined || typeof id_curso !== 'number') {
        return res.status(StatusCodes.BAD_REQUEST).send('id_curso es obligatorio y debe ser un número.');
    }
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (fecha_nacimiento && !dateRegex.test(fecha_nacimiento)) {
        return res.status(StatusCodes.BAD_REQUEST).send('La fecha_nacimiento debe estar en formato YYYY-MM-DD.');
    }
    if (hace_deportes === undefined || typeof hace_deportes !== 'boolean') {
         // Allowing 0 or 1 as boolean representations
        if (hace_deportes !== 0 && hace_deportes !== 1) {
            return res.status(StatusCodes.BAD_REQUEST).send('hace_deportes es obligatorio y debe ser un valor booleano (true/false o 1/0).');
        }
    }

    try {
        const checkExist = await client.query('SELECT * FROM alumnos WHERE id = $1', [id]);
        if (checkExist.rows.length === 0) {
            return res.status(StatusCodes.NOT_FOUND).send('Alumno no encontrado con el ID proporcionado.');
        }

        const result = await client.query(
            'UPDATE alumnos SET nombre = $1, apellido = $2, id_curso = $3, fecha_nacimiento = $4, hace_deportes = $5 WHERE id = $6 RETURNING *',
            [nombre, apellido, id_curso, fecha_nacimiento || null, hace_deportes, id]
        );
        res.status(StatusCodes.CREATED).json(result.rows[0]);
    } catch (error) {
        console.error(error);
        // Check for foreign key constraint violation for id_curso
        if (error.code === '23503' && error.constraint === 'alumnos_id_curso_fkey') {
            return res.status(StatusCodes.BAD_REQUEST).send('El id_curso proporcionado no existe.');
        }
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: error.message });
    }
});

// DELETE /api/alumnos/:id
app.delete('/api/alumnos/:id', async (req, res) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
        return res.status(StatusCodes.BAD_REQUEST).send('El ID debe ser numérico.');
    }
    try {
        const result = await client.query('DELETE FROM alumnos WHERE id = $1 RETURNING *', [id]);
        if (result.rowCount === 0) {
            return res.status(StatusCodes.NOT_FOUND).send('Alumno no encontrado.');
        }
        res.status(StatusCodes.OK).json({ message: 'Alumno eliminado correctamente.', alumno: result.rows[0] });
    } catch (error) {
        console.error(error);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: error.message });
    }
});

// Start server
app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});

// Add a graceful shutdown for the database client
process.on('SIGINT', async () => {
    console.log('Cerrando conexión a la base de datos...');
    await client.end();
    console.log('Conexión a la base de datos cerrada.');
    process.exit(0);
});
