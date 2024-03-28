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

async function getUsersByName(req, res) {
    try {
        const users = await User.find({ nombre: req.params.nombre });
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
        const userName = req.params.nombre;
        const updatedUser = await User.findOneAndUpdate({ nombre: userName }, req.body, { new: true });
        res.send(updatedUser);
    } catch (err) {
        console.error("Error al actualizar el usuario:", err);
        res.status(500).send("Error interno del servidor");
    }
}


async function deleteUser(req, res) {
    try {
        const userName = req.params.nombre;
        await User.deleteMany({ nombre: userName });
        res.send("Usuarios eliminados exitosamente");
    } catch (err) {
        console.error("Error al eliminar los usuarios:", err);
        res.status(500).send("Error interno del servidor");
    }
}


// Exportar las funciones para su uso en app.js
module.exports = { getUsers, getUsersByName, createUser,updateUser,deleteUser};

