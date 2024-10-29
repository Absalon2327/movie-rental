import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const verifyToken = (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1]; // Se espera que el token se envíe en el formato "Bearer <token>"

  if (!token) {
    return res.status(403).json({ message: "Genere un Token!" });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: "Acceso denegado, el token expiro o es incorrecto" });
    }
    req.user = decoded; // Guarda el ID del usuario o cualquier información que necesites
    next();
  });
};

export default verifyToken;