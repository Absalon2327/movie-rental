// src/services/MovieService.js
import axios from "axios";

const BACKEND_URL = "http://localhost:5000/api"; // URL de la API

const MovieService = {
  getAllUers: async () => {
    try {
      const response = await axios.get(`${BACKEND_URL}/users`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      return response.data;
    } catch (error) {
      console.error("Error al obtener usuarios:", error);
      throw error;
    }
  },

  createUser: async (formData) => {
    console.log('formData: ', formData)
    const response = await axios.post(`${BACKEND_URL}/users/register`, formData, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    return response.data;
  },

  updateUser: async (id, userData) => {
    try {
      const response = await axios.put(
        `${BACKEND_URL}/users/update/${id}`,
        userData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error("Error al actualizar el usuario:", error);
      throw error;
    }
  },
  deleteUser: async (id) => {
    try {
      const response = await axios.delete(`${BACKEND_URL}/users/delete/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      return response.data;
    } catch (error) {
      console.error("Error al eliminar el usuario:", error);
      throw error;
    }
  },

  /* getuserById: async (id) => {
    try {
      const response = await axios.get(`${BACKEND_URL}/movies/${id}`);
      return response.data;
    } catch (error) {
      console.error("Error al obtener película:", error);
      throw error;
    }
  },

  

  

   */
};

export default MovieService;
