
import { initializeApp, cert } from "firebase-admin/app";
import { getFirestore } from 'firebase-admin/firestore';
import { readFileSync } from 'fs'; // Para leer el archivo de credenciales
import dotenv from 'dotenv';

// Cargar variables de entorno
dotenv.config();
// Leer el archivo de credenciales JSON
const serviceAccount = JSON.parse(
  readFileSync(process.env.GCLOUD_PROJECT, 'utf8') // Usa la variable de entorno
);

// Inicializar Firebase con credenciales
initializeApp({
  credential: cert(serviceAccount)
});

const db = getFirestore();

export default db;
