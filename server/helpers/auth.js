const jwt = require('jsonwebtoken');

// Función para generar un token JWT
function generateToken(user) {
    const token = jwt.sign({ id: user.id }, 'your_secret_key', { expiresIn: '1h' });
    return token;
}

// Función para verificar un token JWT
function verifyToken(req, res, next) {
    const token = req.headers['authorization'];
    if (!token) return res.status(401).json({ message: 'No token provided' });

    jwt.verify(token, 'your_secret_key', (err, decoded) => {
        if (err) return res.status(403).json({ message: 'Failed to authenticate token' });

        req.userId = decoded.id;
        next();
    });
}

module.exports = { generateToken, verifyToken };
