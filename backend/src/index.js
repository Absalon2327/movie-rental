
import express from 'express';
import routerMovies from '../routes/movies.js';
import routerUsers from '../routes/users.js';
import routerLogin from '../routes/auth.js';
import cors from 'cors';
import  verifyToken from '../middlewares/authMiddleware.js';
import uploadsRouter from '../routes/uploads.js';
const app = express();
const PORT = process.env.PORT || 5000;
app.use(cors());
app.use(express.json()); 


app.use('/api/', routerMovies);
app.use('/api/', verifyToken, routerUsers);
//app.use('/api/', uploadsRouter);
app.use('/', routerLogin);

/* app.get('/api/users', verifyToken, (req, res) => {
    res.status(200).json({ message: "Acceso concedido a ruta protegida!" });
}); */
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
