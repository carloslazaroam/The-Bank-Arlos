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
    //console.log(req.params.id);

   // if(req.userId !=req.params.id ) return res.status(403).json({ message: 'Acceso denegado' });

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
            direccion: req.body.direccion,
            pais: req.body.pais,
            contra: req.body.contra,
            usertype: req.body.usertype,
            
            // Asegúrate de que req.body.id_tipousuario sea el _id del tipoUsuario
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
        const updatedUser = await User.findOneAndUpdate({ id: userId }, req.body, { new: true });
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





// Exportar las funciones para su uso en app.js
module.exports = { getUsers, getUserById, createUser,updateUser,deleteUser};



