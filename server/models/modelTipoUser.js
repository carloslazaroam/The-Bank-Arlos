const mongoose = require('mongoose');

const counterTipoUserSchema = new mongoose.Schema({
    _id: { type: String, required: true },
    sequence_value: { type: Number, default: 0 }
});
const CounterTipoUser = mongoose.model('CounterTipoUser', counterTipoUserSchema);

const tipoUserSchema = new mongoose.Schema({
    id: { type: Number, unique: true },
    nombre: String
})

tipoUserSchema.pre('save', async function (next) {
    if (!this.id) {
        this.id = await getNextSequenceValue('id_tipousuario');
    }
    next();
});

async function getNextSequenceValue(sequenceName) {
    const sequenceDocument = await CounterTipoUser.findByIdAndUpdate(sequenceName, { $inc: { sequence_value: 1 } }, { new: true, upsert: true });
    return sequenceDocument.sequence_value;
}


const tipoUsuario = mongoose.model('tipoUsuario', tipoUserSchema);

module.exports = { tipoUsuario }