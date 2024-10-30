import express from "express";
import { initializeApp, cert } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import { getStorage } from "firebase-admin/storage";
import { readFileSync } from "fs"; // Para leer el archivo de credenciales
import dotenv from "dotenv";

const app = express();
// Cargar variables de entorno
dotenv.config();
// Leer el archivo de credenciales JSON
/* const serviceAccount = JSON.parse(
  readFileSync(process.env.GCLOUD_PROJECT) // Usa la variable de entorno
); */
const firebaseConfig = {
  type: process.env.TYPE,
  project_id: process.env.PROYECT_ID,
  private_key_id: process.env.PRIVATE_KEY_ID,
  private_key: process.env.PRIVATE_KEY,
  client_email: process.env.CLIENT_EMAIL,
  client_id: process.env.CLIENT_ID,
  auth_uri: process.env.AUTH_URI,
  token_uri: process.env.TOKEN_URI,
  auth_provider_x509_cert_url: process.env.AUTH_PROVIDER_X509_CERT_URL,
  client_x509_cert_url: process.env.CLIENT_X509_CERT_URL,
  universe_domain: process.env.UNIVERSE_DOMAIN,
};

// Inicializar Firebase con credenciales
initializeApp({
  credential: cert(firebaseConfig),
  storageBucket: process.env.STORAGE_BUCKET, // Usa la variable de entorno
});

const db = getFirestore();
const bucket = getStorage().bucket();
export { db, bucket };
