const express = require('express');
const { urlencoded, json } = require('express');
const Usuario = require('./usuario');
const Signo = require('./signo');
const router = require('./routes/signos.routes.js');
const cors = require('cors');
const connectDB = require('./mongo');

const app = express();
const PORT = process.env.PORT || 4000;

// Configurar CORS antes de las rutas
app.use(cors({
  origin: 'https://proyecto-horoscopo-front.vercel.app' // Asegúrate de que esta URL sea correcta
}));

app.use(urlencoded({ extended: true }));
app.use(json());

connectDB()
  .then(() => {
    console.log('Connected to MongoDB');

    // Iniciar el servidor después de que la conexión a MongoDB haya sido exitosa
    app.listen(PORT, () => {
      console.log(`Servidor corriendo en el puerto ${PORT}`);
    });
  })
  .catch(err => {
    console.error('Error connecting to MongoDB:', err);
    process.exit(1);
  });

// Usar las rutas después de la configuración de CORS y el middleware
app.use('/v1/signos', router);
