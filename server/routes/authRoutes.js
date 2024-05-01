const express = require('express');
const router = express.Router();
const { generateToken } = require('../helpers/auth');
const { User } = require('../models/modelUser');

// Ruta para iniciar sesión
router.post('/login', async (req, res) => {
    const { dni, contra } = req.body;
    console.log(req.body);
    try {
        const user = await User.findOne({ dni, contra});
        if (!user) return res.status(401).json({ message: 'Invalid credentials' });

        const token = generateToken(user);
        // console.log(user.usertype);
        res.json({ token, id: user.id, usertype: user.usertype });
    } catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Ruta para registro de usuarios
router.post('/register', async (req, res) => {
    // Implementa la lógica para registrar nuevos usuarios
});

module.exports = router;
