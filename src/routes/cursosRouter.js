import express from 'express';
import pool from '../configs/pool.js';
import { StatusCodes } from 'http-status-codes';

const router = express.Router();

router.get('/', async (req, res, next) => {
    try {
        res.status(StatusCodes.OK).json({ message: 'Endpoint de cursos - GET todos los cursos (a implementar)' });
    } catch (error) {
        next(error);
    }
});

router.get('/:id', async (req, res, next) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
        const err = new Error('El ID del curso debe ser numérico.');
        err.status = StatusCodes.BAD_REQUEST;
        return next(err);
    }
    try {
        res.status(StatusCodes.OK).json({ message: `Endpoint de cursos - GET curso con ID ${id} (a implementar)` });
    } catch (error) {
        next(error);
    }
});

export default router;
