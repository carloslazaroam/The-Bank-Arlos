const express = require('express');
const router = express.Router();
const { verifyToken } = require('../helpers/auth');
const { getUsers } = require('../controllers/users');

// Ruta protegida que requiere autenticación
router.get('/users', verifyToken, getUsers);

module.exports = router;
