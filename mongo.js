const mongoose = require('mongoose');

// URL de conexión que viene de las variables de entorno
const mongoURI = process.env.MONGO_URI || 'mongodb+srv://deivy:%40123456789@cluster0.fym1s.mongodb.net/horoscopo_db?retryWrites=true&w=majority&appName=Cluster0';

const connectDB = async () => {
  try {
    await mongoose.connect(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('Conexión exitosa a MongoDB');
  } catch (error) {
    console.error('Error al conectar a MongoDB:', error);
    process.exit(1);
  }
};

module.exports = connectDB;
