const fs = require('fs/promises');
const path = require('path');

const getAllSignos = async (req, res)=>{
    const signo = await fs.readFile(path.join(__dirname,'../../db/signos.json'));
    const signosJson = JSON.parse(signo)
    res.json(signosJson);
}

const getOneSigno = async (req, res)=>{
    const oneSigno = req.params.signo;
    const allSignos = await fs.readFile(path.join(__dirname,'../../db/signos.json'));
    const objSignos = JSON.parse(allSignos);
    const result = objSignos[oneSigno];
    res.json(result)
}

const updateSigno = async (req, res)=>{
    const signoEditar = req.params.signoEditar;
    const {textoEditar} = req.body;
    const allSignos = await fs.readFile(path.join(__dirname,'../../db/signos.json'));
    const objSignos = JSON.parse(allSignos);

    const objUpdate = {
        ...objSignos,
        [signoEditar]: textoEditar
    }

    // console.log(objUpdate);
    await fs.writeFile(path.join(__dirname,'../../db/signos.json'), JSON.stringify(objUpdate, null, 2), {encoding: 'utf-8'})

    res.json({
        message: "Updated"
    })
}

const compareLogin = async (req, res) => {
    const { username, password } = req.body;

    console.log("recibi user: " + username);
    console.log("recibi pass: " + password);

    if (!username || !password) {
        return res.status(400).json({ resultado: "Faltan credenciales" });
    }

    try {
        const credencialesPath = path.join(__dirname, '../../db/credenciales.json');
        const data = await fs.readFile(credencialesPath, 'utf8');
        const credenciales = JSON.parse(data);

        // Verificar administradores
        const admin = credenciales.admins.find(admin => admin.adminName === username && admin.password === password);
        if (admin) {
            return res.json({ resultado: "admin" });
        }

        // Verificar usuarios
        const user = credenciales.users.find(user => user.username === username && user.password === password);
        if (user) {
            return res.json({ resultado: "user" });
        }

        return res.status(401).json({ resultado: "Credenciales incorrectas" });

    } catch (error) {
        console.error("Error leyendo credenciales:", error);
        return res.status(500).json({ resultado: "Error del servidor" });
    }
}

const updatepassword = async (req, res) => {
    const { username, password, update } = req.body;

    console.log("Recibí user: " + username);
    console.log("Recibí pass: " + password);
    console.log("Nuevo pass: " + update);

    try {
        const credencialesPath = path.join(__dirname, '../../db/credenciales.json');
        const data = await fs.readFile(credencialesPath, 'utf-8');
        const credenciales = JSON.parse(data);

        // Verificar y actualizar administradores
        const adminIndex = credenciales.admins.findIndex(admin => admin.adminName === username && admin.password === password);
        if (adminIndex !== -1) {
            console.log(`Actualizando contraseña para admin: ${username}`);
            credenciales.admins[adminIndex].password = update;
            await fs.writeFile(credencialesPath, JSON.stringify(credenciales, null, 2), 'utf-8');
            console.log("Contraseña actualizada para admin");
            return res.json({ resultado: "Contraseña de administrador actualizada correctamente" });
        }

        // Verificar y actualizar usuarios
        const userIndex = credenciales.users.findIndex(user => user.username === username && user.password === password);
        if (userIndex !== -1) {
            console.log(`Actualizando contraseña para usuario: ${username}`);
            credenciales.users[userIndex].password = update;
            await fs.writeFile(credencialesPath, JSON.stringify(credenciales, null, 2), 'utf-8');
            console.log("Contraseña actualizada para usuario");
            return res.json({ resultado: "Contraseña de usuario actualizada correctamente" });
        }

        console.log("Credenciales inválidas");
        return res.json({ resultado: "Credenciales inválidas" });

    } catch (error) {
        console.error("Error leyendo o escribiendo los archivos:", error);
        return res.status(500).json({ resultado: "Error interno del servidor" });
    }
};


const crearuser = async (req, res) => {
    const { username, password, role } = req.body;

    console.log("Recibí user: " + username);
    console.log("Recibí pass: " + password);
    console.log("Rol: " + role);

    try {
        const credencialesPath = path.join(__dirname, '../../db/credenciales.json');
        const data = await fs.readFile(credencialesPath, 'utf-8');
        const credenciales = JSON.parse(data);

        if (role === "admin") {
            // Verificar si hay una lista de admins, si no, crearla
            if (!credenciales.admins) {
                credenciales.admins = [];
            }

            // Verificar si el admin ya existe
            const adminExists = credenciales.admins.some(admin => admin.adminName === username);
            if (adminExists) {
                return res.json({ resultado: "El admin ya existe" });
            }

            // Crear nuevo admin
            credenciales.admins.push({ adminName: username, password });
            await fs.writeFile(credencialesPath, JSON.stringify(credenciales, null, 2), 'utf-8');
            return res.json({ resultado: "Admin creado correctamente" });

        } else if (role === "user") {
            // Verificar si hay una lista de usuarios, si no, crearla
            if (!credenciales.users) {
                credenciales.users = [];
            }

            // Verificar si el usuario ya existe
            const userExists = credenciales.users.some(user => user.username === username);
            if (userExists) {
                return res.json({ resultado: "El usuario ya existe" });
            }

            // Crear nuevo usuario
            credenciales.users.push({ username, password });
            await fs.writeFile(credencialesPath, JSON.stringify(credenciales, null, 2), 'utf-8');
            return res.json({ resultado: "Usuario creado correctamente" });

        } else {
            return res.json({ resultado: "Rol inválido" });
        }

    } catch (error) {
        console.error("Error leyendo o escribiendo el archivo de credenciales:", error);
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