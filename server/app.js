const express = require('express');
const path = require('path');
const multer = require('multer');
const mongoose = require('mongoose');
const { getUsers, getUserById, createUser ,updateUser, deleteUser} = require('./controllers/users.js');
const { getCuentas,getCuentaByIban, createCuenta,updateCuenta,deleteCuenta } = require('./controllers/cuentas.js');
const { getTipoCuentas,getTipoCuentaName, createTipoCuenta,updateTipoCuenta,deleteTipoCuenta } = require('./controllers/tipocuenta.js');
const { getTipoOperacion, createTipoOperacion, updateTipoOperacion, deleteTipoOperacion, getTipoOperacionByName, getTipoOperacionById} = require('./controllers/tipoOperacion.js');
const { getOperacion, createOperacion, deleteOperacion, updateOperacion, getOperacionById, getOperacionById } = require('./controllers/operacion.js');
const { getTipoUsers, createTipoUser } = require('./controllers/tipousuario.js');


const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/images'); // Guarda las imágenes en la carpeta public/uploads
    },
    filename: function (req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname)); // Nombre único para la imagen
    }
});
const upload = multer({ storage: storage });

mongoose.connect('mongodb://localhost:27017/bank', { useNewUrlParser: true, useUnifiedTopology: true });

app.get('/users', getUsers);
app.get('/users/:nombre', getUserById);
app.post('/users/post', createUser);
app.put('/users/:nombre', updateUser); 
app.delete('/users/:nombre', deleteUser);

app.get('/tipousers', getTipoUsers);
app.post('/tipousers/post', createTipoUser);

app.get('/cuentas', getCuentas);
app.get('/cuentas/:iban', getCuentaByIban);
app.post('/cuentas/post', createCuenta);
app.put('/cuentas/:iban', updateCuenta); 
app.delete('/cuentas/:iban', deleteCuenta);

app.get('/tipocuentas', getTipoCuentas);
app.get('/tipocuentas/:nombre', getTipoCuentaName);
app.post('/tipocuentas/post', createTipoCuenta);
app.put('/tipocuentas/:nombre', updateTipoCuenta);
app.delete('/tipocuentas/:nombre', deleteTipoCuenta);

app.get('/tipoperacion', getTipoOperacion);
app.get('/tipoperacion/:id',getTipoOperacionById);
app.post('/tipoperacion/post', createTipoOperacion);
app.put('/tipoperacion/:id', updateTipoOperacion);
app.delete('/tipoperacion/:id', deleteTipoOperacion)

app.get('/operacion', getOperacion);
app.get('/operacion/:id', getOperacionById)
app.post('/operacion/post', createOperacion);
app.put('/operacion/:id', updateOperacion);
app.delete('/operacion/:id', deleteOperacion)

// Resto del código para las rutas put y delete...

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Servidor iniciado en el puerto ${PORT}`);
});


