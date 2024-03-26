const express = require('express');
const path = require('path');
const multer = require('multer');
const mongoose = require('mongoose');
const { getUsers, getUsersByName, createUser } = require('./controllers/users.js');
const { getCuentas,getCuentaByIban, createCuenta } = require('./controllers/cuentas.js');
const { getTipoCuentas,getTipoCuentaName, createTipoCuenta } = require('./controllers/tipocuenta.js');


const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/public', express.static(path.join(__dirname, '/public')));
const upload = multer({ dest: 'public/' });

mongoose.connect('mongodb://localhost:27017/bank', { useNewUrlParser: true, useUnifiedTopology: true });

app.get('/users', getUsers);
app.get('/users/:name', getUsersByName);
app.post('/users/post', createUser);

app.get('/cuentas', getCuentas);
app.get('cuentas/iban', getCuentaByIban);
app.post('/cuentas/post', createCuenta);

app.get('/tipocuentas', getTipoCuentas);
app.get('/tipocuentas/nombre', getTipoCuentaName);
app.post('/tipocuentas/post', createTipoCuenta);


// Resto del código para las rutas put y delete...

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Servidor iniciado en el puerto ${PORT}`);
});
