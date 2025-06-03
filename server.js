// server.js
const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const app = express();

require('dotenv').config();
const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

app.post('/guardar-cotizacion', async (req, res) => {
  const { nombre, correo, telefono, descripcion } = req.body;
  try {
    await pool.query(
      'INSERT INTO cotizaciones (nombre_cliente, correo_cliente, telefono_cliente, descripcion) VALUES ($1, $2, $3, $4)',
      [nombre, correo, telefono, descripcion]
    );
    res.send('Cotización guardada');
  } catch (err) {
    console.error(err);
    res.status(500).send('Error al guardar la cotización');
  }
});

app.get('/ver-cotizaciones', async (req, res) => {
  try {
    const resultado = await pool.query('SELECT * FROM cotizaciones ORDER BY fecha DESC');
    res.json(resultado.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error al obtener cotizaciones');
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
});
