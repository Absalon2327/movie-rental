import express from "express";
import { initializeApp, cert } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import { getStorage } from "firebase-admin/storage";
import dotenv from "dotenv";
import cors from 'cors';

// Cargar variables de entorno
dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());
// Leer el archivo de credenciales JSON
/* const serviceAccount = JSON.parse(
  readFileSync(process.env.GCLOUD_PROJECT) // Usa la variable de entorno
); */
const firebaseConfig = {
  type: process.env.TYPE,
  project_id: process.env.PROYECT_ID,
  private_key_id: process.env.PRIVATE_KEY_ID,
  private_key: process.env.PRIVATE_KEY.replace(/\\n/g, '\n'),
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
