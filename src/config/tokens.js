require("dotenv").config;
const jwt = require("jsonwebtoken");

//Autentificacion del jwt
exports.authenticateJWT = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (authHeader) {
    const token = authHeader.split(" ")[1];
    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
      if (err) {
        return res.sendStatus(403);
      }
      req.user = user;
      next();
    });
  } else {
    res.sendStatus(400);
  }
};

exports.getUserIdToken = (token) => {
  try {
    // Decodifica el token y obtiene el payload
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Devuelve el ID del usuario (ajusta 'userId' a tu clave de usuario)
    return decoded.sub;
  } catch (error) {
    console.error("Error al decodificar el token:", error);
    return null;
  }
};
