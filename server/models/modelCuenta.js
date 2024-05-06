const mongoose = require('mongoose');

const counterCuentaSchema = new mongoose.Schema({
    _id: { type: String, required: true },
    sequence_value: { type: Number, default: 0 }
});
const CounterCuenta = mongoose.model('CounterCuenta', counterCuentaSchema);

const cuentaSchema = new mongoose.Schema({
    id: { type: Number, unique: true },
    fechacreacion: { type: Date, default: Date.now }, // Cambiado para generar automáticamente la fecha de creación
    activa: Boolean,
    saldo: Number,
    validado: Boolean,
    iban: { type: String, unique: true },
    id_usuario: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    id_tipocuenta: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'TipoCuenta'
    },
    empresa: {
        type: String,
        
    }
});

async function getNextSequenceValue(sequenceName) {
    const sequenceDocument = await CounterCuenta.findByIdAndUpdate(sequenceName, { $inc: { sequence_value: 1 } }, { new: true, upsert: true });
    return sequenceDocument.sequence_value;
}

cuentaSchema.pre('save', async function (next) {
    if (!this.id) {
        this.id = await getNextSequenceValue('cuenta_id');
    }
    next();
});

const Cuenta = mongoose.model('Cuenta', cuentaSchema);

module.exports = { Cuenta };
