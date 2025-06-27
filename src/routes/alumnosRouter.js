import express from 'express';
import pool from '../configs/pool.js';
import { StatusCodes } from 'http-status-codes';

const router = express.Router();

router.get('/', async (req, res, next) => {
    try {
        const result = await pool.query('SELECT * FROM alumnos');
        res.status(StatusCodes.OK).json(result.rows);
    } catch (error) {
        next(error);
    }
});

router.get('/:id', async (req, res, next) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
        const err = new Error('El ID debe ser numérico.');
        err.status = StatusCodes.BAD_REQUEST;
        return next(err);
    }
    try {
        const result = await pool.query('SELECT * FROM alumnos WHERE id = $1', [id]);
        if (result.rows.length === 0) {
            const err = new Error('Alumno no encontrado.');
            err.status = StatusCodes.NOT_FOUND;
            return next(err);
        }
        res.status(StatusCodes.OK).json(result.rows[0]);
    } catch (error) {
        next(error);
    }
});

router.post('/', async (req, res, next) => {
    const { nombre, apellido, id_curso, fecha_nacimiento, hace_deportes } = req.body;

    if (!nombre || nombre.trim().length < 3) {
        const err = new Error('El nombre es obligatorio y debe tener al menos 3 caracteres.');
        err.status = StatusCodes.BAD_REQUEST;
        return next(err);
    }
    if (!apellido || apellido.trim().length < 3) {
        const err = new Error('El apellido es obligatorio y debe tener al menos 3 caracteres.');
        err.status = StatusCodes.BAD_REQUEST;
        return next(err);
    }
    if (id_curso === undefined || typeof id_curso !== 'number') {
        const err = new Error('id_curso es obligatorio y debe ser un número.');
        err.status = StatusCodes.BAD_REQUEST;
        return next(err);
    }
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (fecha_nacimiento && !dateRegex.test(fecha_nacimiento)) {
        const err = new Error('La fecha_nacimiento debe estar en formato YYYY-MM-DD.');
        err.status = StatusCodes.BAD_REQUEST;
        return next(err);
    }
    if (hace_deportes === undefined || typeof hace_deportes !== 'boolean') {
        if (hace_deportes !== 0 && hace_deportes !== 1) {
            const err = new Error('hace_deportes es obligatorio y debe ser un valor booleano (true/false o 1/0).');
            err.status = StatusCodes.BAD_REQUEST;
            return next(err);
        }
    }

    try {
        const result = await pool.query(
            'INSERT INTO alumnos (nombre, apellido, id_curso, fecha_nacimiento, hace_deportes) VALUES ($1, $2, $3, $4, $5) RETURNING *',
            [nombre, apellido, id_curso, fecha_nacimiento || null, hace_deportes]
        );
        res.status(StatusCodes.CREATED).json(result.rows[0]);
    } catch (error) {
        if (error.code === '23503' && error.constraint === 'alumnos_id_curso_fkey') {
            const err = new Error('El id_curso proporcionado no existe.');
            err.status = StatusCodes.BAD_REQUEST;
            return next(err);
        }
        next(error);
    }
});

router.put('/:id', async (req, res, next) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
        const err = new Error('El ID en la URL debe ser numérico.');
        err.status = StatusCodes.BAD_REQUEST;
        return next(err);
    }

    const { nombre, apellido, id_curso, fecha_nacimiento, hace_deportes } = req.body;

    if (!nombre || nombre.trim().length < 3) {
        const err = new Error('El nombre es obligatorio y debe tener al menos 3 caracteres.');
        err.status = StatusCodes.BAD_REQUEST;
        return next(err);
    }
    if (!apellido || apellido.trim().length < 3) {
        const err = new Error('El apellido es obligatorio y debe tener al menos 3 caracteres.');
        err.status = StatusCodes.BAD_REQUEST;
        return next(err);
    }
    if (id_curso === undefined || typeof id_curso !== 'number') {
        const err = new Error('id_curso es obligatorio y debe ser un número.');
        err.status = StatusCodes.BAD_REQUEST;
        return next(err);
    }
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (fecha_nacimiento && !dateRegex.test(fecha_nacimiento)) {
        const err = new Error('La fecha_nacimiento debe estar en formato YYYY-MM-DD.');
        err.status = StatusCodes.BAD_REQUEST;
        return next(err);
    }
    if (hace_deportes === undefined || typeof hace_deportes !== 'boolean') {
        if (hace_deportes !== 0 && hace_deportes !== 1) {
            const err = new Error('hace_deportes es obligatorio y debe ser un valor booleano (true/false o 1/0).');
            err.status = StatusCodes.BAD_REQUEST;
            return next(err);
        }
    }

    try {
        const checkExist = await pool.query('SELECT * FROM alumnos WHERE id = $1', [id]);
        if (checkExist.rows.length === 0) {
            const err = new Error('Alumno no encontrado con el ID proporcionado.');
            err.status = StatusCodes.NOT_FOUND;
            return next(err);
        }

        const result = await pool.query(
            'UPDATE alumnos SET nombre = $1, apellido = $2, id_curso = $3, fecha_nacimiento = $4, hace_deportes = $5 WHERE id = $6 RETURNING *',
            [nombre, apellido, id_curso, fecha_nacimiento || null, hace_deportes, id]
        );
        res.status(StatusCodes.OK).json(result.rows[0]);
    } catch (error) {
        if (error.code === '23503' && error.constraint === 'alumnos_id_curso_fkey') {
            const err = new Error('El id_curso proporcionado no existe.');
            err.status = StatusCodes.BAD_REQUEST;
            return next(err);
        }
        next(error);
    }
});

router.delete('/:id', async (req, res, next) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
        const err = new Error('El ID debe ser numérico.');
        err.status = StatusCodes.BAD_REQUEST;
        return next(err);
    }
    try {
        const result = await pool.query('DELETE FROM alumnos WHERE id = $1 RETURNING *', [id]);
        if (result.rowCount === 0) {
            const err = new Error('Alumno no encontrado.');
            err.status = StatusCodes.NOT_FOUND;
            return next(err);
        }
        res.status(StatusCodes.NO_CONTENT).send();
    } catch (error) {
        next(error);
    }
});

export default router;
