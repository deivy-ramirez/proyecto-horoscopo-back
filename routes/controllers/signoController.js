
const path = require('path');
const Signo = require(path.resolve(__dirname, '../db/signo')); // Usa una ruta absoluta
//const Signo = require('../db/signo');
const Usuario = require('../db/usuario');

const getAllSignos = async (req, res) => {
  try {
    const signos = await Signo.find();
    res.json(signos);
  } catch (error) {
    console.error("Error al obtener los signos:", error);
    res.status(500).json({ mensaje: "Error al obtener los signos", error });
  }
};

const getOneSigno = async (req, res) => {
  const oneSigno = req.params.signo;
  try {
    const signo = await Signo.findOne({ nombre: oneSigno });
    if (!signo) {
      return res.status(404).json({ mensaje: "Signo no encontrado" });
    }
    res.json(signo);
  } catch (error) {
    console.error("Error al obtener el signo:", error);
    res.status(500).json({ mensaje: "Error al obtener el signo", error });
  }
};

const updateSigno = async (req, res) => {
  const signoEditar = req.params.signoEditar;
  const { textoEditar } = req.body;

  try {
    const signoActualizado = await Signo.findOneAndUpdate(
      { nombre: signoEditar },
      { descripcion: textoEditar },
      { new: true }
    );

    if (!signoActualizado) {
      return res.status(404).json({ mensaje: "Signo no encontrado" });
    }

    res.json({ mensaje: "Signo actualizado", signo: signoActualizado });
  } catch (error) {
    console.error("Error al actualizar el signo:", error);
    res.status(500).json({ mensaje: "Error al actualizar el signo", error });
  }
};

const compareLogin = async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ resultado: "Faltan credenciales" });
    }

    try {
        // Verificar administradores
        const admin = await Usuario.findOne({ username, password, role: 'admin' });
        if (admin) {
            return res.json({ resultado: "admin" });
        }

        // Verificar usuarios
        const user = await Usuario.findOne({ username, password, role: 'user' });
        if (user) {
            return res.json({ resultado: "user" });
        }

        return res.status(401).json({ resultado: "Credenciales incorrectas" });
    } catch (error) {
        console.error("Error en la base de datos:", error);
        return res.status(500).json({ resultado: "Error del servidor" });
    }
};

const updatepassword = async (req, res) => {
    const { username, password, update } = req.body; // Obtener los datos del cuerpo de la solicitud

    try {
        const user = await Usuario.findOne({ username }); // Buscar al usuario por su nombre de usuario

        if (!user) {
            return res.status(404).json({ resultado: "Usuario no encontrado" });
        }

        // Verificar si la contraseña actual coincide
        const isMatch = await user.comparePassword(password); // Asumiendo que tienes un método para comparar contraseñas
        if (!isMatch) {
            return res.status(401).json({ resultado: "Credenciales inválidas" });
        }

        // Actualizar la contraseña
        user.password = update;
        await user.save(); // Guardar los cambios en la base de datos

        return res.json({ resultado: "Contraseña actualizada correctamente" });
    } catch (error) {
        console.error("Error actualizando la contraseña:", error);
        return res.status(500).json({ resultado: "Error interno del servidor" });
    }
};

const crearuser = async (req, res) => {
    const { username, password, role } = req.body; // Obtener los datos del cuerpo de la solicitud

    try {
        // Verificar si el usuario ya existe
        const existingUser = await Usuario.findOne({ username });
        if (existingUser) {
            return res.status(400).json({ resultado: "El usuario ya existe" });
        }

        // Crear un nuevo usuario
        const newUser = new Usuario({
            username,
            password, // Asegúrate de encriptar la contraseña antes de guardarla
            role
        });

        await newUser.save(); // Guardar el nuevo usuario en la base de datos
        return res.json({ resultado: "Usuario creado correctamente" });
    } catch (error) {
        console.error("Error creando el usuario:", error);
        return res.status(500).json({ resultado: "Error interno del servidor" });
    }
};


module.exports = {
    getAllSignos,
    getOneSigno,
    updateSigno,
    compareLogin,
    updatepassword,
    crearuser
    
}