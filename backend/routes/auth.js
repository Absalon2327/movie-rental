/**auth.js */
import express from "express";
const routerLogin = express.Router();
import login  from '../controllers/authController.js';

// Ruta para iniciar sesión
routerLogin.post('/login', login);

export default routerLogin;
