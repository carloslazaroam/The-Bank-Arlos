const { User } = require('../models/modelUser');
const nodemailer = require('nodemailer');

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
        res.send(JSON.stringify(users));
    } catch (err) {
        console.error("Error al obtener los usuarios:", err);
        res.status(500).send("Error interno del servidor");
    }
}

async function createUser(req, res) {
    try {
        const user = new User({
            nombre: req.body.nombre,
            dni: req.body.dni,
            apellido1: req.body.apellido1,
            apellido2: req.body.apellido2,
            email: req.body.email,
            telefono: req.body.telefono,
            direccion: req.body.direccion,
            pais: req.body.pais,
            contra: req.body.contra,
            usertype: req.body.usertype || '6632846b043b8bf3927f1af0',
            fotoDni: req.file ? req.file.path : undefined
        });
        await user.save();
        res.send(user);
    } catch (err) {
        console.error("Error al crear el usuario:", err);
        res.status(500).send("Error interno del servidor");
    }
}

async function updateUser(req, res) {
    try {
        const userId = req.params.id;
        const updateData = req.body;
        if (req.file) {
            updateData.fotoDni = req.file.path;
        }
        const updatedUser = await User.findOneAndUpdate({ id: userId }, updateData, { new: true });
        res.send(updatedUser);
    } catch (err) {
        console.error("Error al actualizar el usuario:", err);
        res.status(500).send("Error interno del servidor");
    }
}

async function deleteUser(req, res) {
    try {
        const userName = req.params.nombre;
        const deletedUser = await User.findOneAndDelete({ nombre: userName });
        if (!deletedUser) {
            return res.status(404).send("Usuario no encontrado");
        }
        res.send("Usuario eliminado exitosamente");
    } catch (err) {
        console.error("Error al eliminar el usuario:", err);
        res.status(500).send("Error interno del servidor");
    }
}

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'polanskirichard513@gmail.com',
        pass: 'nuxu xanb qtgm anod'
    }
});

async function recuperarContrasena(req, res) {
    const email = req.body.email;
    const dni = req.body.dni;

    try {
        const usuario = await User.findOne({ email: email });

        if (!usuario) {
            return res.status(404).send("Usuario no encontrado");
        }

        if (usuario.dni !== dni) {
            return res.status(400).send("El DNI proporcionado no coincide con el del usuario");
        }

        const correoRecuperacion = {
            from: email,
            to: email,
            subject: 'Recuperación de contraseña',
            text: `Hola ${usuario.nombre}, has solicitado la recuperación de tu contraseña. Tu contraseña es: ${usuario.contra}`
        };

        transporter.sendMail(correoRecuperacion, function (error, info) {
            if (error) {
                console.error("Error al enviar el correo de recuperación:", error);
                res.status(500).send("Error interno del servidor al enviar el correo de recuperación");
            } else {
                console.log('Correo de recuperación enviado:', info.response);
                res.status(200).send("Correo de recuperación enviado correctamente");
            }
        });
    } catch (err) {
        console.error("Error al recuperar la contraseña:", err);
        res.status(500).send("Error interno del servidor al recuperar la contraseña");
    }
}

module.exports = { getUsers, getUserById, createUser, updateUser, deleteUser, recuperarContrasena };
