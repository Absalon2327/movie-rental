// src/services/MovieService.js
import axios from "axios";

const BACKEND_URL = "http://localhost:5000/api"; // URL de la API

const MovieService = {
  getAllMovies: async () => {
    try {
      const response = await axios.get(`${BACKEND_URL}/movies`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        }, // Importante para recibir la imagen como un blob
      });
      return response.data;
    } catch (error) {
      console.error("Error al obtener películas:", error);
      throw error;
    }
  },

  getMovieById: async (id) => {
    try {
      const response = await axios.get(`${BACKEND_URL}/movies/${id}`);
      return response.data;
    } catch (error) {
      console.error("Error al obtener película:", error);
      throw error;
    }
  },

  createMovie: async (formData) => {
    console.log('formData: ', formData)


    const response = await axios.post(`${BACKEND_URL}/movies`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    return response.data;
  },

  updateMovie: async (id, movieData) => {
    try {
      const response = await axios.put(
        `${BACKEND_URL}/movies/${id}`,
        movieData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error("Error al actualizar película:", error);
      throw error;
    }
  },

  deleteMovie: async (id) => {
    try {
      const response = await axios.delete(`${BACKEND_URL}/movies/${id}`, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      return response.data;
    } catch (error) {
      console.error("Error al eliminar película:", error);
      throw error;
    }
  },
};

export default MovieService;
