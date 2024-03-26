const mongoose = require('mongoose');

const TipoCuentaSchema = new mongoose.Schema({

    nombre: String,
    porcentajebeneficio: String,
    maxnegativo: String
});

const TipoCuenta = mongoose.model('TipoCuenta', TipoCuentaSchema)

module.exports = { TipoCuenta };