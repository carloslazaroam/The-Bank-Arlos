// Cuenta.js
const mongoose = require('mongoose');

const cuentaSchema = new mongoose.Schema({
    fechacreacion: Date,
    activa: Boolean,
    iban: String
});

const Cuenta = mongoose.model('Cuenta', cuentaSchema);

module.exports = { Cuenta };
