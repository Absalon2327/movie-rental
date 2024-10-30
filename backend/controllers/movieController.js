import express from "express";
import { db, bucket } from "../src/firebase.js";
import { v4 as uuidv4 } from "uuid";
import dotenv from "dotenv";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import cors from "cors";

dotenv.config();
const app = express();

// Middleware para procesar JSON
app.use(express.json());
app.use(cors());
// Configurar Multer

// Obtener todas las películas
const getAllMovies = async (req, res) => {
  try {
    const snapshot = await db.collection("movies").get();
    //console.log('entrando a getAllMovies');
    const movies = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    res.status(200).json(movies);
  } catch (error) {
    res
      .status(500)
      .json({ message: "No se pudieron obtener las pelis", error });
  }
};

// Obtener una película por ID
const getMovieById = async (req, res) => {
  try {
    const { id } = req.params;
    const doc = await db.collection("movies").doc(id).get();
    if (!doc.exists) {
      return res.status(404).json({ message: "Movie not found" });
    }
    res.status(200).json({ id: doc.id, ...doc.data() });
  } catch (error) {
    res.status(500).json({ message: "Error retrieving the movie", error });
  }
};

// Crear una nueva película (solo admin)
// Endpoint para crear una película y subir imagen
// createMovie modificado
const createMovie = async (req, res) => {
  try {
    const { title, description, stock, rental_price, sales_price, available } =
      req.body;

      console.log('req.file: ', req.file);
    if (!req.file) {
      return res.status(400).json({ message: "Imagen es requerida" });
    }

    // Crear referencia a la imagen en Firebase Storage
    const uniqueFileName = `movies/images/${uuidv4()}`;
    const storageRef = bucket.file(uniqueFileName);

    const metadata = {
      contentType: req.file.mimetype,
    };

    // Subir imagen a Firebase Storage
    await storageRef.save(req.file.buffer, { metadata });
    const downloadURL = await storageRef.getSignedUrl({
      action: "read",
      expires: "03-17-2025", // Fecha de expiración del enlace
    });
    // Guardar URL de la imagen en Firestore
    const newMovie = {
      title,
      description,
      stock,
      rental_price,
      sales_price,
      available,
      imageUrl: downloadURL[0],
    };

    await db.collection("movies").add(newMovie);

    res
      .status(201)
      .json({ message: "Película creada exitosamente", movie: newMovie });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error al crear la película", error: error.message });
  }
};

// Actualizar una película por ID (solo admin)
const updateMovie = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, stock, rental_price, sales_price, available } =
      req.body;

    if (!req.file) {
      return res.status(400).json({ message: "Imagen es requerida" });
    }

    const movieRef = db.collection("movies").doc(id);
    const movieDoc = await movieRef.get();

    if (!movieDoc.exists) {
      return res.status(404).json({ message: "Movie not found" });
    }

    const uniqueFileName = `movies/images/${uuidv4()}`;
    const storageRef = bucket.file(uniqueFileName);

    const metadata = {
      contentType: req.file.mimetype,
    };

    // Subir imagen a Firebase Storage
    await storageRef.save(req.file.buffer, { metadata });
    const downloadURL = await storageRef.getSignedUrl({
      action: "read",
      expires: "03-17-2025", // Fecha de expiración del enlace
    });
    // Guardar URL de la imagen en Firestore
    const updates = {
      title,
      description,
      stock,
      rental_price,
      sales_price,
      available,
      imageUrl: downloadURL[0],
    };
    await movieRef.update({
      ...updates,
      updated_at: new Date().toISOString(),
    });

    res.status(200).json({ message: "Movie updated successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error updating the movie", error });
  }
};

// Eliminar una película por ID (solo admin)
const deleteMovie = async (req, res) => {
  try {
    const { id } = req.params;

    const movieRef = db.collection("movies").doc(id);
    const movieDoc = await movieRef.get();

    if (!movieDoc.exists) {
      return res.status(404).json({ message: "Movie not found" });
    }

    await movieRef.delete();
    res.status(200).json({ message: "Movie deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting the movie", error });
  }
};

export { getAllMovies, getMovieById, createMovie, updateMovie, deleteMovie };
