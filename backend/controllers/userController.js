import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import express from "express";
import {db} from "../src/firebase.js";
const app = express();

app.use(express.json());

const getAlUser = async (req, res) => {
  try {
    const snapshot = await db.collection("users").get();
    //console.log('entrando a getAllMovies');
    const movies = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    res.status(200).json(movies);
  } catch (error) {
    res
      .status(500)
      .json({ message: "No se pudieron obtener los usuarios", error });
  }
};

// Obtener un usuario por ID
const getUserById = async (req, res) => {
  try {
    const { id } = req.params;
    const doc = await db.collection("users").doc(id).get();
    if (!doc.exists) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json({ id: doc.id, ...doc.data() });
  } catch (error) {
    res.status(500).json({ message: "Error retrieving the User", error });
  }
};

const registerUser = async (req, res) => {
  try {
    console.log(req.body);
    const { name, lastname, email, pasword, rol } = req.body;

    // Verifica que la contraseña no esté vacía
    if (!pasword) {
      return res
        .status(400)
        .json({ message: "La contraseña es requerida" });
    }

    // Encriptar la contraseña
    const hashedPassword = bcrypt.hashSync(pasword, 10);

    const newUser = {
      name,
      lastname,
      email,
      rol,
      pasword: hashedPassword,
      created_at: new Date().toISOString(),
    };

    console.log("newUser", newUser);

    // Agregar el nuevo usuario a la colección de Firestore
    const docRef = await db.collection("users").add(newUser);

    res
      .status(201)
      .json({ message: "Usuario creado exitosamente", id: docRef.id });
  } catch (error) {
    console.error("Error creando el usuario: ", error); // Agrega más contexto al error
    res.status(500).json({ message: "Error al crear el usuario", error });
  }
};

const updateUser = async (req, res) => {
  try {
    
    const { id } = req.params;
    const updates = req.body;
    console.log('updates: ', updates);
    
    // Verifica que la contraseña no esté vacía
    const userRef = db.collection("users").doc(id);
    const userDoc = await userRef.get();

    if (!userDoc.exists) {
      return res.status(404).json({ message: "User not found" });
    }
    // Encriptar la contraseña
    const hashedPassword = bcrypt.hashSync(updates.pasword, 10);

    updates.pasword = hashedPassword;

    await userRef.update({
      ...updates,
      updated_at: new Date().toISOString(),
    }); 
    res
      .status(201)
      .json({ message: "User updated successfully"});
  } catch (error) {
    console.error("Error actualizando el usuario: ", error); // Agrega más contexto al error
    res.status(500).json({ message: "Error updating the user", error });
  }
};

const loginUser = async (req, res) => {
  const { email, pasword } = req.body;
  const snapshot = await db
    .collection("users")
    .where("email", "==", email)
    .get();
  if (snapshot.empty) return res.status(400).send("User not found");

  const user = snapshot.docs[0].data();
  const isMatch = await bcrypt.compare(pasword, user.pasword);
  if (!isMatch) return res.status(400).send("Invalid credentials");

  const token = jwt.sign(
    { email: user.email, role: user.role },
    process.env.JWT_SECRET
  );
  res.json({user, token });
};

const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    const userRef = db.collection("users").doc(id);
    const userDoc = await userRef.get();

    if (!userDoc.exists) {
      return res.status(404).json({ message: "User not found" });
    }

    await userRef.delete();
    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting the User", error });
  }
};
export {getUserById, registerUser, updateUser, deleteUser, loginUser, getAlUser };
