// uploadsRouter.js
import express from 'express';
import { uploads, upload } from '../controllers/uploadsController.js';

const uploadsRouter = express.Router();

// Ruta para manejar la carga de imágenes
uploadsRouter.post('/upload', upload.single('image'), uploads);

export default uploadsRouter;
