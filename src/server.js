import express from "express";
import cors from "cors";
import pkg from 'pg';
import dotenv from 'dotenv';

dotenv.config();
import { StatusCodes } from 'http-status-codes';
import pool from './configs/pool.js';

import alumnosRouter from './routes/alumnosRouter.js';
import cursosRouter from './routes/cursosRouter.js';

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.use('/api/alumnos', alumnosRouter);
app.use('/api/cursos', cursosRouter);

import errorHandlerMiddleware from './middlewares/error.js';
app.use(errorHandlerMiddleware);

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});

process.on('SIGINT', async () => {
    console.log('Cerrando pool de conexiones a la base de datos...');
    await pool.end();
    console.log('Pool de conexiones a la base de datos cerrado.');
    process.exit(0);
});
