import express from "express";
import cors from "cors";
import pkg from 'pg';
import dotenv from 'dotenv';

dotenv.config();
import { StatusCodes } from 'http-status-codes';
import pool from './configs/pool.js'; // Importar el pool

import alumnosRouter from './routes/alumnosRouter.js';
import cursosRouter from './routes/cursosRouter.js'; // Asumiendo que también tendrás un router para cursos

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Ya no se necesita client.connect() porque el pool maneja las conexiones.

// Rutas Modulares
app.use('/api/alumnos', alumnosRouter);
app.use('/api/cursos', cursosRouter); // Puedes comentar esto si aún no tienes rutas de cursos

// Middleware de manejo de errores (debe ir al final)
import errorHandlerMiddleware from './middlewares/error.js';
app.use(errorHandlerMiddleware);

// Start server
app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});

// Add a graceful shutdown for the database pool
process.on('SIGINT', async () => {
    console.log('Cerrando pool de conexiones a la base de datos...');
    await pool.end(); // Usar pool.end()
    console.log('Pool de conexiones a la base de datos cerrado.');
    process.exit(0);
});
