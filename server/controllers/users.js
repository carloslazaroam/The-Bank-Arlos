// usersController.js
const { User } = require('../models/modelUser');

async function getUsers(req, res) {
    try {
        const users = await User.find({});
        res.send(users);
    } catch (err) {
        console.error("Error al obtener los usuarios:", err);
        res.status(500).send("Error interno del servidor");
    }
}

async function getUserById(req, res) {
    try {
        const users = await User.find({ id: req.params.id });
        res.send(users);
    } catch (err) {
        console.error("Error al obtener los usuarios:", err);
        res.status(500).send("Error interno del servidor");
    }
}

async function createUser(req, res) {
    try {
        const user = new User({
            nombre: req.body.nombre,
            apellido1: req.body.apellido1,
            apellido2: req.body.apellido2,
            direccion: req.body.direccion,
            pais: req.body.pais,
            img: req.file ? req.file.path : null // Guarda la ruta de la imagen si existe
        });
        await user.save();
        res.send(user);
    } catch (err) {
        console.error("Error al obtener los usuarios:", err);
        res.status(500).send("Error interno del servidor");
    }
}

async function updateUser(req, res) {
    try {
        const userName = req.params.id;
        const updatedUser = await User.findOneAndUpdate({ id: userName }, req.body, { new: true });
        res.send(updatedUser);
    } catch (err) {
        console.error("Error al actualizar el usuario:", err);
        res.status(500).send("Error interno del servidor");
    }
}




async function deleteUser(req, res) {
    try {
        const userName = req.params.id;
        await User.deleteMany({ id: userName });
        res.send("Usuarios eliminados exitosamente");
    } catch (err) {
        console.error("Error al eliminar los usuarios:", err);
        res.status(500).send("Error interno del servidor");
    }
}


// Exportar las funciones para su uso en app.js
module.exports = { getUsers, getUserById, createUser,updateUser,deleteUser};



