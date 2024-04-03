const mongoose = require('mongoose');

const counterCuentaSchema = new mongoose.Schema({
    _id: { type: String, required: true },
    sequence_value: { type: Number, default: 0 }
});
const CounterCuenta = mongoose.model('CounterCuenta', counterCuentaSchema);

const cuentaSchema = new mongoose.Schema({
    id: { type: Number, unique: true },
    fechacreacion: Date,
    activa: Boolean,
    iban:  {type: String, unique: true},
    id_usuario: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    id_cuenta: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'TipoCuenta'
    }
});
cuentaSchema.pre('save', async function (next) {
    if (!this.id) {
        this.id = await getNextSequenceValue('cuenta_id');
    }
    next();
});

async function getNextSequenceValue(sequenceName) {
    const sequenceDocument = await CounterCuenta.findByIdAndUpdate(sequenceName, { $inc: { sequence_value: 1 } }, { new: true, upsert: true });
    return sequenceDocument.sequence_value;
}

const Cuenta = mongoose.model('Cuenta', cuentaSchema);



module.exports = { Cuenta };
