// cuentasController.js
const { Cuenta } = require('../models/modelCuenta');


async function getCuentas(req, res) {
    try {
        const cuentas = await Cuenta.find({});
        res.send(cuentas);
    } catch (err) {
        console.error("Error al obtener las cuentas:", err);
        res.status(500).send("Error interno del servidor");
    }
}

async function getCuentaByIban(req,res) {
    try {
        const ibans = Cuenta.find({iban:req.params.iban})
        res.send(ibans)
    } catch (err) {
        console.log("Error al obtener el iban")
        res.status(500).send("Error interno del servidor")
    }
}

async function createCuenta(req, res) {
    try {
       
        const cuenta = new Cuenta({
            
            activa: req.body.activa,
            iban: req.body.iban,
            validado: req.body.validado,
            saldo: req.body.saldo,
            id_usuario: req.body.id_usuario,
            id_tipocuenta: req.body.id_tipocuenta
        });
        await cuenta.save();
        res.send(cuenta);
    } catch (err) {
        console.error("Error al postear cuenta:", err);
        res.status(500).send("Error interno del servidor");
    }
}

async function getCuentaByIban(req, res) {
    try {
        const cuenta = await Cuenta.find({ iban: req.params.iban });
        res.send(cuenta);
    } catch (err) {
        console.error("Error al obtener las cuentas:", err);
        res.status(500).send("Error interno del servidor");
    }
}

async function deleteCuenta(req, res) {
    try {
        const cuentaIBAN = req.params.iban;
        await Cuenta.deleteMany({ iban: cuentaIBAN });
        res.send("Cuenta eliminada exitosa.");
    } catch (err) {
        console.error("Error al eliminar la cuenta:", err);
        res.status(500).send("Error interno del servidor");
    }
}

async function updateCuenta(req, res) {
    try {
        const cuentaIBAN = req.params.iban;
        const updatedCuenta = await Cuenta.findOneAndUpdate({ iban: cuentaIBAN }, req.body, { new: true });
        res.send(updatedCuenta);
    } catch (err) {
        console.error("Error al actualizar la cuenta:", err);
        res.status(500).send("Error interno del servidor");
    }
}


// Exportar las funciones para su uso en app.js
module.exports = { getCuentas,getCuentaByIban, createCuenta,updateCuenta, deleteCuenta };

