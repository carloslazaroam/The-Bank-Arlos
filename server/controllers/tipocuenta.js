const {TipoCuenta} = require('../models/modelTipoCuenta');

async function getTipoCuentas(req,res) {

    try {
        const tipoCuentas = await TipoCuenta.find({});
        res.send(tipoCuentas)
    }catch (err) {
        console.log("Error al obtener las cuentas")
        res.status(500).send("Error interno del servidor");
    }
}

async function getTipoCuentaName(req,res) {

    try {
        const tipoCuentaName = await TipoCuenta.find({ nombre: req.params.nombre });
    } catch (err) {
        console.log("Error al obtener el nombre en específico");
        res.status(500).send("Error interno del servidor");
    }
}


async function createTipoCuenta(req,res) {
    try{
        const tipoCuenta = new TipoCuenta({
            nombre: req.body.nombre,
            porcentajebeneficio: req.body.porcentajebeneficio,
            maxnegativo: req.body.maxnegativo
        });
        await tipoCuenta.save();
        res.send(tipoCuenta);

        

    }catch (err){
        console.log("Error al crear la cuenta");
        res.status(500).send("Error interno del servidor");
    }
}


async function updateTipoCuenta(req,res) {
    try{
        const nombre = req.params.nombre;
        const updatedTipoCuenta = await TipoCuenta.findOneAndUpdate({nombre: nombre}, req.body, { new:true });
        res.send(updatedTipoCuenta);
    } catch (err) {
        console.log("Error al actualizar el tipo de cuenta");
        res.status(500).send("Error interno del servidor")
    }

}

async function deleteTipoCuenta(req,res) {

    try {
        const nombre = req.params.nombre;
        await TipoCuenta.deleteMany({ nombre: nombre});
        res.send("Tipo de cuenta eliminado")
    } catch (err) {
        console.log("Error al eliminar el tipo de cuenta", err);
        res.status(500).send("Error interno del servidor")

    }

}

module.exports = { getTipoCuentas, getTipoCuentaName, createTipoCuenta ,updateTipoCuenta, deleteTipoCuenta};

