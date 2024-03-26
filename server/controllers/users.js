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

// Exportar las funciones para su uso en app.js
module.exports = { getUsers, getUsersByName, createUser };
