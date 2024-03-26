// Cuenta.js
const mongoose = require('mongoose');

const cuentaSchema = new mongoose.Schema({
    fechacreacion: Date,
    activa: Boolean,
    iban: String,
    id_usuario: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
});

const Cuenta = mongoose.model('Cuenta', cuentaSchema);

module.exports = { Cuenta };
