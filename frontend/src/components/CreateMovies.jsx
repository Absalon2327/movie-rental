import React, { useState, useEffect } from "react";
import axios from "axios"; // Librería para realizar peticiones HTTP
import MUIDataTable from "mui-datatables"; // Librería para mostrar tablas con funcionalidades de ordenamiento, búsqueda y paginación
const CreateMovie = () => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    stock: "",
    rental_price: "",
    sales_price: "",
    available: "",
  });

  const [movies, setMovies] = useState([]);

  useEffect(() => {
    // Función para obtener las películas desde la API
    const fetchMovies = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/movies", {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }); // Ajusta la URL según tu configuración
        setMovies(response.data);
        console.log("response: ", response.data);
      } catch (error) {
        console.error("Error fetching movies:", error);
      }
    };

    fetchMovies();
  }, []);

  const columns = [
    {
      name: "title",
      label: "Película",
    },
    {
      name: "description",
      label: "Descripción",
    },
    {
      name: "stock",
      label: "Stock",
    },
    {
      name: "rental_price",
      label: "Precio de Alquiler",
    },
    {
      name: "sales_price",
      label: "Precio de Venta",
    },
    {
      name: "available",
      label: "Dsiponible",
    },
  ];
  const [imagePath, setImagePath] = useState("");

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];

    // Crear la ruta para almacenar la imagen
    const filePath = `public/uploads/${file.name}`;
    setImagePath(filePath);

    // Leer el archivo y guardarlo en el directorio público
    const reader = new FileReader();
    reader.onloadend = () => {
      const buffer = reader.result;
      const blob = new Blob([buffer], { type: file.type });

      // Crear un enlace temporal para descargar la imagen en la carpeta 'public/uploads'
      const a = document.createElement("a");
      a.href = URL.createObjectURL(blob);
      a.download = file.name;
      a.click();

      // Almacenar la imagen en la ruta de destino
      const destinationPath = `public/${filePath}`;
      const fs = window.require("fs"); // Solo si estás usando Electron o un entorno similar
      fs.writeFile(destinationPath, buffer, (err) => {
        if (err) {
          console.error("Error saving the file:", err);
        } else {
          console.log("File saved to", destinationPath);
        }
      });
    };

    reader.readAsArrayBuffer(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = {
      ...formData,
      image: imagePath, // Guardar solo la ruta de la imagen
    };

    try {
      const response = await axios.post(
        "http://localhost:5000/api/movies",
        data,
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      console.log(response.data);
      alert("Película creada con éxito");
    } catch (error) {
      console.error(error);
      alert("Error al crear la película");
    }
  };

  return (
    <>
      <MUIDataTable
        title={<h1>Películas</h1>}
        data={movies}
        columns={columns}
      />

      {/* <div className="container my-5">
        <div className="row justify-content-center">
          <div className="col-md-8">
            <div className="bg-dark text-white text-center py-5">
              <h2>Agregar Nueva Película</h2>
              <form onSubmit={handleSubmit} className="mt-4 p-3">
                <div className="mb-3">
                  <label htmlFor="title" className="form-label">
                    Título
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="title"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="mb-3">
                  <label htmlFor="description" className="form-label">
                    Descripción
                  </label>
                  <textarea
                    className="form-control"
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="mb-3">
                  <label htmlFor="stock" className="form-label">
                    Stock
                  </label>
                  <input
                    type="number"
                    className="form-control"
                    id="stock"
                    name="stock"
                    value={formData.stock}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="mb-3">
                  <label htmlFor="rental_price" className="form-label">
                    Precio de Alquiler
                  </label>
                  <input
                    type="number"
                    className="form-control"
                    id="rental_price"
                    name="rental_price"
                    value={formData.rental_price}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="mb-3">
                  <label htmlFor="sales_price" className="form-label">
                    Precio de Venta
                  </label>
                  <input
                    type="number"
                    className="form-control"
                    id="sales_price"
                    name="sales_price"
                    value={formData.sales_price}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="mb-3">
                  <label htmlFor="available" className="form-label">
                    Disponibilidad
                  </label>
                  <input
                    type="number"
                    className="form-control"
                    id="available"
                    name="available"
                    value={formData.available}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="mb-3">
                  <label htmlFor="image" className="form-label">
                    Imagen
                  </label>
                  <input
                    type="file"
                    className="form-control"
                    id="image"
                    name="image"
                    onChange={handleImageChange}
                    required
                  />
                </div>

                <button type="submit" className="btn btn-primary w-100">
                  Guardar Película
                </button>
              </form>
            </div>
          </div>
        </div>
      </div> */}
    </>
  );
};

export default CreateMovie;
