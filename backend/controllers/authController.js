/**authController.js */
import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import {db} from "../src/firebase.js";
import dotenv from "dotenv";
const app = express();
dotenv.config();
app.use(express.json());


// Función para iniciar sesión y generar un token
const login = async (req, res) => {
  const { email, pasword } = req.body;
  const snapshot = await db
    .collection("users")
    .where("email", "==", email)
    .get();
  if (snapshot.empty) return res.status(400).send("User not found");

  const user = snapshot.docs[0].data();
  const isMatch = await bcrypt.compare(pasword, user.pasword);
  if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

  const token = jwt.sign(
    { email: user.email, role: user.role },
    process.env.JWT_SECRET, {expiresIn:'1h'}
  );
  res.json({ user, token, message: "Successfly" });
};
// Exportar la función
export default login;
