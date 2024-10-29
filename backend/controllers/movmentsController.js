// controllers/movementController.js
import express from "express";
import { db } from "../src/firebase.js";

const app = express();
app.use(express.json());
// Alquilar una película
const rentMovie = async (req, res) => {
    try {
        const { userId, movieId, rentDuration } = req.body;
        const rentDate = new Date();
        const returnDate = new Date(rentDate);
        returnDate.setDate(rentDate.getDate() + rentDuration);

        const newMovement = {
            userId,
            movieId,
            type: 'rent',
            rentDate: rentDate.toISOString(),
            returnDate: returnDate.toISOString(),
            price: 10, // Precio fijo o variable
            lateFee: 0,
            returned: false
        };

        const docRef = await db.collection('movements').add(newMovement);
        res.status(201).json({ message: `${newMovement.type} creada exitosamente`, id: docRef.id });
    } catch (error) {
        res.status(500).json({ message: `Error al crear ${newMovement.type}`, error });
    }
};

// Devolver una película y calcular penalización si es tarde
/* exports.returnMovie = async (req, res) => {
    try {
        const { userId, movieId } = req.body;
        const snapshot = await movementsCollection
            .where('userId', '==', userId)
            .where('movieId', '==', movieId)
            .where('type', '==', 'rent')
            .where('returned', '==', false)
            .limit(1)
            .get();

        if (snapshot.empty) {
            return res.status(404).json({ success: false, message: 'Alquiler no encontrado' });
        }

        const movementDoc = snapshot.docs[0];
        const movement = movementDoc.data();
        const today = new Date();
        let lateFee = 0;

        if (today > new Date(movement.returnDate)) {
            const daysLate = Math.ceil((today - new Date(movement.returnDate)) / (1000 * 60 * 60 * 24));
            lateFee = daysLate * 5; // $5 por día de retraso
        }

        await movementDoc.ref.update({ returned: true, lateFee });
        res.status(200).json({ success: true, data: { ...movement, returned: true, lateFee } });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}; */

// Comprar una película
const purchaseMovie = async (req, res) => {
    try {
        const { userId, movieId } = req.body;

        const newMovement = {
            userId,
            movieId,
            type: 'purchase',
            price: 20, // Precio fijo o variable
            date: new Date().toISOString()
        };

        const docRef = await db.collection('movements').add(newMovement);
        res.status(201).json({ message: `${newMovement.type} creada exitosamente`, id: docRef.id });
    } catch (error) {
        res.status(500).json({ message: `Error al crear ${newMovement.type}`, error });
    }
};

// Obtener historial de movimientos
exports.getMovements = async (req, res) => {
    try {
        const snapshot = await movementsCollection.get();
        const movements = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        res.status(200).json({ success: true, data: movements });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
