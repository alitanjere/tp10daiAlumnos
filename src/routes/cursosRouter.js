import express from 'express';
import pool from '../configs/pool.js';
import { StatusCodes } from 'http-status-codes';

const router = express.Router();

// Ejemplo de ruta GET para /api/cursos
router.get('/', async (req, res, next) => {
    try {
        // Aquí iría la lógica para obtener los cursos, por ejemplo:
        // const result = await pool.query('SELECT * FROM cursos');
        // res.status(StatusCodes.OK).json(result.rows);
        res.status(StatusCodes.OK).json({ message: 'Endpoint de cursos - GET todos los cursos (a implementar)' });
    } catch (error) {
        next(error);
    }
});

// Ejemplo de ruta GET para /api/cursos/:id
router.get('/:id', async (req, res, next) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
        const err = new Error('El ID del curso debe ser numérico.');
        err.status = StatusCodes.BAD_REQUEST;
        return next(err);
    }
    try {
        // Aquí iría la lógica para obtener un curso por ID
        // const result = await pool.query('SELECT * FROM cursos WHERE id = $1', [id]);
        // if (result.rows.length === 0) { ... }
        res.status(StatusCodes.OK).json({ message: `Endpoint de cursos - GET curso con ID ${id} (a implementar)` });
    } catch (error) {
        next(error);
    }
});

// Puedes añadir más rutas (POST, PUT, DELETE) aquí

export default router;
