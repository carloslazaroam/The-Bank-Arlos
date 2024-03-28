const mongoose = require('mongoose');

const TipoOperacionSchema = new mongoose.Schema({

    id: Number,
    nombre: String
});

const TipoOperacion = mongoose.model('TipoOperacion', TipoOperacionSchema);

module.exports  = { TipoOperacion };