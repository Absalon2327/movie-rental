import express from "express";
const routerUsers = express.Router();
import {
  getUserById,
  registerUser,
  updateUser,
  deleteUser,
  loginUser,
  getAlUser,
} from "../controllers/userController.js";

// Ruta para ver tofos los usuarios
routerUsers.get("/users", getAlUser);

// Obtener un user por ID
routerUsers.get("/users/:id", getUserById);

// Ruta para registrar un usuario
routerUsers.post("/users/register", registerUser);

// Ruta para actualizar un usuario
routerUsers.put("/users/update/:id", updateUser);

// Modificar una película (Solo Admin)
routerUsers.delete("/users/delete/:id", deleteUser);

// Ruta para iniciar sesión
routerUsers.post("/login", loginUser);

export default routerUsers;
