// uploadsController.js
import multer from 'multer';
import path from 'path';

// Configurar multer para guardar las imágenes en la carpeta 'public/uploads'
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'public/uploads'); // Carpeta donde se guardarán las imágenes
  },
  filename: (req, file, cb) => {
    console.log('file: ', file);
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname)); // Nombre único para evitar colisiones
  }
});

export const upload = multer({ storage: storage });


// Controlador para manejar la carga de imágenes
export const uploads = async (req, res) => {
  
  try {
    const { title, description } = req.body;
    const imagePath = `/uploads/${req.file.filename}`; // Ruta pública de la imagen
   

    // Aquí puedes guardar los detalles en tu base de datos junto con la ruta de la imagen
    res.json({
      message: 'Película subida correctamente',
      data: { title, description, imagePath }
    });
  } catch (error) {
    res.status(500).json({ message: "Error subiendo la imagen", error });
  }
};
