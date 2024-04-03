const mongoose = require('mongoose');

const counterOperacionSchema = new mongoose.Schema({
    _id: { type: String, required: true },
    sequence_value: { type: Number, default: 0 }
});
const CounterOperacion = mongoose.model('CounterOperacion', counterOperacionSchema);

const operacionSchema = new mongoose.Schema({
    id: { type: Number, unique: true },
    nombre: String,
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

operacionSchema.pre('save', async function (next) {
    if (!this.id) {
        this.id = await getNextSequenceValue('operacion_id');
    }
    next();
});

async function getNextSequenceValue(sequenceName) {
    const sequenceDocument = await CounterOperacion.findByIdAndUpdate(sequenceName, { $inc: { sequence_value: 1 } }, { new: true, upsert: true });
    return sequenceDocument.sequence_value;
}

const Operacion = mongoose.model('Operacion', operacionSchema);

module.exports  = { Operacion };