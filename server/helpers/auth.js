// auth.js
const jwt = require('jsonwebtoken');
const secret = process.env.JWT_SECRET;

// Función para generar un token JWT
function generateToken(user) {
    const token = jwt.sign({ id: user.id, usertype: user.usertype,dni: user.dni,id2: user._id }, secret, { expiresIn: '1h' });
    return token;
}

// Función para verificar un token JWT
const  verifyToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token  = authHeader.split(' ')[1];
  
    if (!token) return res.status(401).json({ message: 'No token provided' });

    jwt.verify(token, secret, (err, decoded) => {
        if (err) return res.status(403).json({ message: 'Failed to authenticate token' });
        
        req.userId = decoded.id;
        req.usertype = decoded.usertype;
        req.dni = decoded.dni;
        req.id2 = decoded.id2;
        next();
    });
}

const verifyId = (req,res,next) => {

    if( req.usertype === '6632844e043b8bf3927f1aed') {
        next()
        return
    }

    if(req.userId !=req.params.id) return res.status(403).json({ message: 'Acceso denegado' });
    next()
}



module.exports = { generateToken, verifyToken, verifyId};
