const mongoose = require('mongoose');

const TipoCuentaSchema = new mongoose.Schema({

    nombre: String,
    porcentajebeneficio: Number,
    maxnegativo: Number,
    maxtransacciones: Number, 
    tasaInteresSobregiro: Number, 
    tarifaTransaccionExcedida: Number 
});

const TipoCuenta = mongoose.model('TipoCuenta', TipoCuentaSchema)

module.exports = { TipoCuenta };