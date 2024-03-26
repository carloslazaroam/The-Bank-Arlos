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

module.exports = { getTipoCuentas, getTipoCuentaName, createTipoCuenta };