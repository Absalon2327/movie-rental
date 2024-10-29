import express from "express";
import { initializeApp, cert } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import { getStorage} from "firebase-admin/storage";
import { readFileSync } from "fs"; // Para leer el archivo de credenciales
import dotenv from "dotenv";

const app = express();
// Cargar variables de entorno
dotenv.config();
// Leer el archivo de credenciales JSON
const serviceAccount = JSON.parse(
  readFileSync(process.env.GCLOUD_PROJECT, "utf8") // Usa la variable de entorno
);

// Inicializar Firebase con credenciales
initializeApp({
  credential: cert(serviceAccount),
  storageBucket: process.env.STORAGE_BUCKET // Usa la variable de entorno
});

const db = getFirestore();
const bucket = getStorage().bucket();
export { db, bucket };
