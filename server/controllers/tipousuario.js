const { tipoUsuario } = require('../models/modelTipoUser');



async function getTipoUsers(req,res) {
    try {
        const tipousers = await tipoUsuario.find({});
        res.send(tipousers);
    } catch (err) {
        console.log("Error al obtener los tipos de usuario");
        res.send(500).status("Error interno del servidor")
    }

}

async function createTipoUser(req, res) {
    try {
        const user = new tipoUsuario({
            nombre: req.body.nombre
            
            
        });
        await user.save();
        res.send(user);
    } catch (err) {
        console.error("Error al obtener los usuarios:", err);
        res.status(500).send("Error interno del servidor");
    }
}

module.exports = { getTipoUsers ,createTipoUser}

