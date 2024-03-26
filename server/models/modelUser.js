// User.js
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    nombre: String,
    apellido1: String,
    apellido2: String,
    direccion: String,
    pais: String
});

const User = mongoose.model('User', userSchema);

module.exports = { User };
