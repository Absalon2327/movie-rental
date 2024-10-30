import express from "express";
import verifyToken from "../middlewares/authMiddleware.js";
import multer from "multer";

import cors from "cors";
const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static("public"));
app.use(
  cors({
    origin: "http://localhost:5000", // Cambia esto al puerto donde esté tu frontend
  })
);

const routerMovies = express.Router();
// Importar las funciones con nombres
import {
  getAllMovies,
  getMovieById,
  createMovie,
  updateMovie,
  deleteMovie,
} from "../controllers/movieController.js";

  
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });
// Obtener todas las películas
routerMovies.get("/movies", getAllMovies);

// Obtener una película por ID
routerMovies.get("/movies/:id", getMovieById);

// Añadir una película (Solo Admin)
routerMovies.post("/movies", upload.single("imageUrl"), createMovie);

// Modificar una película (Solo Admin)
routerMovies.put("/movies/:id", upload.single("imageUrl"), verifyToken, updateMovie);

// Eliminar una película (Solo Admin)
routerMovies.delete("/movies/:id", verifyToken, deleteMovie);

export default routerMovies;
