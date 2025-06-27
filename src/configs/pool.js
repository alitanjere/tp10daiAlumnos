import pkg from 'pg';
import dbConfig from './db-config.js';

const { Pool } = pkg;

const pool = new Pool(dbConfig);

pool.query('SELECT NOW()', (err, res) => {
  if (err) {
    console.error('Error al conectar con la base de datos usando el pool:', err.stack);
  } else {
    console.log('Pool de conexiones conectado exitosamente a la base de datos. Hora actual:', res.rows[0].now);
  }
});

export default pool;
