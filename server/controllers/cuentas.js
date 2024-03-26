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

async function createCuenta(req, res) {
    try {
        const cuenta = new Cuenta({
            fechacreacion: req.body.fechacreacion,
            activa: req.body.activa,
            iban: req.body.iban
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
        const cuenta = await User.find({ iban: req.params.iban });
        res.send(cuenta);
    } catch (err) {
        console.error("Error al obtener las cuentas:", err);
        res.status(500).send("Error interno del servidor");
    }
}

// Exportar las funciones para su uso en app.js
module.exports = { getCuentas,getCuentaByIban, createCuenta };
