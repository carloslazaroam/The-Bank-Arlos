const mongoose = require('mongoose');

const operacionSchema = new mongoose.Schema({
    id: Number,
    cantidad: String,
    id_cuenta: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Cuenta'
    },

    id_tipoOperacion: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'TipoOperacion'
    },
    
    
});

const Operacion = mongoose.model('Operacion', operacionSchema);

module.exports  = { Operacion };