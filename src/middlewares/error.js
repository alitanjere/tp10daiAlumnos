import { StatusCodes } from 'http-status-codes';

// Middleware de manejo de errores
// eslint-disable-next-line no-unused-vars
const errorHandlerMiddleware = (err, req, res, next) => {
    console.error("ERROR DETECTADO POR EL MIDDLEWARE:")
    console.error("Nombre:", err.name);
    console.error("Mensaje:", err.message);
    console.error("Status:", err.status);
    console.error("Stack:", err.stack);


    const statusCode = err.status || StatusCodes.INTERNAL_SERVER_ERROR;
    const message = err.message || 'Ocurrió un error interno en el servidor.';

    // Enviar una respuesta de error JSON
    res.status(statusCode).json({
        error: {
            message: message,
            status: statusCode,
            // Podrías querer omitir el stack en producción
            ...(process.env.NODE_ENV !== 'production' && { stack: err.stack })
        }
    });
};

export default errorHandlerMiddleware;
