import { randomBytes } from 'crypto';
import fs from 'fs';
import dotenv from 'dotenv';

// Cargar las variables de entorno existentes
dotenv.config();

// Generar un nuevo JWT_SECRET
const generateJWTSecret = () => {
  return randomBytes(64).toString('hex');
};

// Obtener el secreto generado
const jwtSecret = generateJWTSecret();
console.log('Generated JWT Secret:', jwtSecret);

// Leer el archivo .env existente o crear uno nuevo
const envFilePath = '.env';
let envContent = fs.existsSync(envFilePath) ? fs.readFileSync(envFilePath, 'utf8') : '';

// Reemplazar o agregar la línea JWT_SECRET
const newEnvContent = envContent.replace(/JWT_SECRET=.*/g, `JWT_SECRET=${jwtSecret}`) + `\nJWT_SECRET=${jwtSecret}\n`;

// Escribir el nuevo contenido en el archivo .env
fs.writeFileSync(envFilePath, newEnvContent.trim());
console.log('.env file updated with JWT_SECRET.');
