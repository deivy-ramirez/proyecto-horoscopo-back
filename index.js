const express = require('express');
const { urlencoded, json } = require('express');
const Usuario = require('./usuario');
const Signo = require('./signo');
const router = require('./routes/signos.routes.js');
const cors = require('cors');
const connectDB = require('./mongo'); 

const app = express();

connectDB()
  .then(() => {
    console.log('Connected to MongoDB');
    app.listen(PORT, () => {
      console.log(`Servidor corriendo en el puerto ${PORT}`);
    });
  })
  .catch(err => {
    console.error('Error connecting to MongoDB:', err);
    process.exit(1);
  });

app.use(urlencoded({ extended: true }));
app.use(json());

app.use(cors({
  origin: 'https://proyecto-horoscopo-front.vercel.app'
}));

const PORT = process.env.PORT || 4000;