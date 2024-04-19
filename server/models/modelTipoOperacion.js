const mongoose = require('mongoose');

const counterTipoOperacionSchema = new mongoose.Schema({
    _id: { type: String, required: true },
    sequence_value: { type: Number, default: 0 }
});
const CounterTipoOperacion = mongoose.model('CounterTipoOperacion', counterTipoOperacionSchema);

const TipoOperacionSchema = new mongoose.Schema({
    
    id: { type: Number, unique: true },
    nombre: String
});

TipoOperacionSchema.pre('save', async function (next) {
    if (!this.id) {
        this.id = await getNextSequenceValue('tipoperacion_id');
    }
    next();
});

async function getNextSequenceValue(sequenceName) {
    const sequenceDocument = await CounterTipoOperacion.findByIdAndUpdate(sequenceName, { $inc: { sequence_value: 1 } }, { new: true, upsert: true });
    return sequenceDocument.sequence_value;
}


const TipoOperacion = mongoose.model('TipoOperacion', TipoOperacionSchema);

module.exports  = { TipoOperacion };