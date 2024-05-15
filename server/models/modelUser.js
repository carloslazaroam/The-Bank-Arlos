const mongoose = require('mongoose');


const counterUserSchema = new mongoose.Schema({
    _id: { type: String, required: true },
    sequence_value: { type: Number, default: 0 }
});
const CounterUser = mongoose.model('CounterUser', counterUserSchema);


const userSchema = new mongoose.Schema({
    id: { type: Number, unique: true },
    dni: { type: String, unique: true },
    nombre: String,
    email: { type: String, unique: true },
    apellido1: String,
    apellido2: String,
    direccion: String,
    contra: String,
    validado: { type: Boolean, default: false },
    pais: String,
    usertype: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'TipoUsuario'
    }
    
});

userSchema.pre('save', async function (next) {
    if (!this.id) {
        this.id = await getNextSequenceValue('user_id');
    }
    next();
});

async function getNextSequenceValue(sequenceName) {
    const sequenceDocument = await CounterUser.findByIdAndUpdate(sequenceName, { $inc: { sequence_value: 1 } }, { new: true, upsert: true });
    return sequenceDocument.sequence_value;
}


const User = mongoose.model('User', userSchema);

module.exports = { User };
