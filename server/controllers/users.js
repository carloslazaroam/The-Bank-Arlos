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
        const users = await User.find({ name: req.params.name });
        res.send(users);
    } catch (err) {
        console.error("Error al obtener los usuarios:", err);
        res.status(500).send("Error interno del servidor");
    }
}

async function createUser(req, res) {
    try {
        const user = new User({
            name: req.body.name,
            username: req.body.username,
            email: req.body.email,
            edad: req.body.edad,
            img: req.body.img
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
