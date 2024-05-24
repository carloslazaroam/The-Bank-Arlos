const express = require('express');
const path = require('path');
const multer = require('multer');
const mongoose = require('mongoose');
const nodemailer = require('nodemailer');
require('dotenv').config();


// Importar controladores
const { getUsers, getUserById, createUser ,updateUser, deleteUser, recuperarContrasena} = require('./controllers/users.js');
const { getCuentas,getCuentaByIban, createCuenta,updateCuenta,deleteCuenta, getEmpresas, getCuentas2 } = require('./controllers/cuentas.js');
const { getTipoCuentas,getTipoCuentaName, createTipoCuenta,updateTipoCuenta,deleteTipoCuenta } = require('./controllers/tipocuenta.js');
const { getTipoOperacion, createTipoOperacion, updateTipoOperacion, deleteTipoOperacion, getTipoOperacionById} = require('./controllers/tipoOperacion.js');
const { getOperacion, createOperacion, deleteOperacion, updateOperacion, getOperacionById, getOperacionesByCuentaId, retirarDinero, transferirSaldo, vaciarCuenta, hacerBizum, enviarBizum, sacarPorcentajes } = require('./controllers/operacion.js');
const { getTipoUsers, createTipoUser } = require('./controllers/tipousuario.js');
const {verifyToken, verifyId} = require('./helpers/auth.js')
const { getCuentasByUserId } = require('./controllers/cuentas.js');
// Importar modelos y rutas de autenticación
const authRoutes = require('./routes/authRoutes');
const protectedRoutes = require('./routes/protectedRoutes');
const { verify } = require('crypto');


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

mongoose.connect('mongodb://127.0.0.1:27017/bank', { useNewUrlParser: true, useUnifiedTopology: true });

// Rutas para usuarios
app.get('/users', getUsers);
app.get('/users/:id', verifyToken,verifyId, getUserById);
app.post('/users/post', createUser);
app.put('/users/:id', updateUser); 
app.delete('/users/:nombre', deleteUser);
app.get('/users/:id/accounts',verifyToken, getCuentasByUserId);

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'carloslazaroam@gmail.com',
        pass: 'Rompeolas69'
    }
});

app.post('/forgotpassword', recuperarContrasena);

// Rutas para tipos de usuarios
app.get('/tipousers', getTipoUsers);
app.post('/tipousers/post', createTipoUser);

// Rutas para cuentas
app.get('/cuentas', getCuentas);
app.get('/cuentas/:iban', getCuentaByIban);
app.post('/cuentas/post', createCuenta);
app.put('/cuentas/:id', updateCuenta); 
app.delete('/cuentas/:id', deleteCuenta);
app.get('/empresas',getEmpresas);
app.get('/cuentas2/', getCuentas2)



// Rutas para tipos de cuentas
app.get('/tipocuentas', getTipoCuentas);
app.get('/tipocuentas/:nombre', getTipoCuentaName);
app.post('/tipocuentas/post', createTipoCuenta);
app.put('/tipocuentas/:nombre', updateTipoCuenta);
app.delete('/tipocuentas/:nombre', deleteTipoCuenta);

// Rutas para tipos de operación
app.get('/tipoperacion', getTipoOperacion);
app.get('/tipoperacion/:id',getTipoOperacionById);
app.post('/tipoperacion/post', createTipoOperacion);
app.put('/tipoperacion/:id', updateTipoOperacion);
app.delete('/tipoperacion/:id', deleteTipoOperacion);

// Rutas para operaciones
app.get('/operacion', getOperacion);
app.get('/operacion/:id', getOperacionById)
app.post('/operacion/post', createOperacion);
app.put('/operacion/:nombre', updateOperacion);
app.delete('/operacion/:id', deleteOperacion);
app.get('/operaciones/cuenta/:id', getOperacionesByCuentaId);
app.post('/operacion/retirar', retirarDinero);
app.post('/operacion/transferencia', transferirSaldo);
app.post('/operacion/bizum', enviarBizum)
app.post('/operacion/porcentajes', sacarPorcentajes);


// Rutas de Autenticación
app.use('/auth', authRoutes);

// Rutas Protegidas
app.use('/api', protectedRoutes);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Servidor iniciado en el puerto ${PORT}`);
});
