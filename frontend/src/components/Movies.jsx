
import React, { useEffect, useState } from "react";
import {
  Table,
  Button,
  Modal,
  Form,
  Pagination,
  Row,
  Col,
} from "react-bootstrap";
import MovieService from "../service/MovieService";
import Icon from "@mdi/react";
import { mdiPencil, mdiTrashCanOutline } from "@mdi/js";
import Loading from "./Loading";
const Movies = () => {
  const [movies, setMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [moviesPerPage] = useState(5); // Películas por página
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false); // Estado para saber si estamos editando
  const [currentMovieId, setCurrentMovieId] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    stock: "",
    rental_price: "",
    sales_price: "",
    available: "",
    image: "",
  });

  useEffect(() => {
    loadMovies();
  }, []);
  const [errors, setErrors] = useState({});
  const validateForm = () => {
    const newErrors = {};
    if (!formData.title) newErrors.title = "El título es obligatorio";
    if (!formData.description)
      newErrors.description = "La descripción es obligatoria";
    if (!formData.stock) newErrors.stock = "El stock es obligatorio";
    if (!formData.rental_price)
      newErrors.rental_price = "El precio de alquiler es obligatorio";
    if (!formData.sales_price)
      newErrors.sales_price = "El precio de venta es obligatorio";
    if (!formData.available)
      newErrors.available = "La disponibilidad es obligatoria";
    if (!formData.image) newErrors.image = "La imagen es obligatoria";

    setErrors(newErrors); // Actualiza el estado de errores
    return Object.keys(newErrors).length === 0; // Retorna true si no hay errores
  };

  const loadMovies = async () => {
    try {
      const data = await MovieService.getAllMovies();
      console.log("Datos de películas:", data);
      setMovies(data);
    } catch (error) {
      console.error("Error al cargar películas:", error);
    } finally {
      setIsLoading(false); // Termina la carga
    }
  };

  if (isLoading) {
    return <Loading />; // Muestra el componente Loading mientras se cargan los datos
  }

  const handleInputChange = (e) => {
    const { name, value, files } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: name === "image" ? files[0] : value, // Si es archivo, guarda el primer archivo seleccionado
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData((prevFormData) => ({
        ...prevFormData,
        image: file, // Actualiza la imagen en el estado del formulario
      }));
      setPreviewImage(URL.createObjectURL(file)); // Crea una URL de objeto para la vista previa de la imagen
    }
  };

  const handleSaveMovie = async () => {
    if (!validateForm()) return;

    try {
      console.log("Aquí");
      if (isEditing) {
        // Actualiza la película existente
        await MovieService.updateMovie(currentMovieId, formData);
      } else {
        // Crea una nueva película

        await MovieService.createMovie(formData);
      }

      setShowModal(false);
      setFormData({
        title: "",
        description: "",
        stock: "",
        rental_price: "",
        sales_price: "",
        available: "",
        image: "",
      });
      setErrors({});
      setIsEditing(false);
      loadMovies();
    } catch (error) {
      console.error("Error al guardar la película:", error);
    }
  };

  // Función para abrir el modal en modo edición con los datos de la película seleccionada
  const handleEditMovie = (movie) => {
    setFormData(movie); // Llena los datos del formulario con los datos de la película
    setCurrentMovieId(movie.id); // Almacena el ID de la película que se va a editar
    setIsEditing(true); // Cambia a modo edición
    setShowModal(true); // Muestra el modal
  };

  const handleDelete = async (id) => {
    try {
      await MovieService.deleteMovie(id);
      loadMovies();
    } catch (error) {
      console.error("Error al eliminar la película:", error);
    }
  };

  const toggleModal = () => {
    setShowModal(!showModal);
    if (!showModal) {
      setIsEditing(false); // Reinicia el estado de edición si se cierra el modal
      setFormData({
        title: "",
        description: "",
        stock: "",
        rental_price: "",
        sales_price: "",
        available: "",
        image: "",
      });
      setErrors("");
      setPreviewImage("");
    }
  };

  // Control de paginación
  const indexOfLastMovie = currentPage * moviesPerPage;
  const indexOfFirstMovie = indexOfLastMovie - moviesPerPage;
  const currentMovies = movies.slice(indexOfFirstMovie, indexOfLastMovie) || [];;

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Generación de botones de paginación
  const pageNumbers = [];
  for (let i = 1; i <= Math.ceil(movies.length / moviesPerPage); i++) {
    pageNumbers.push(i);
  }

  return (
    <div className="container my-4">
      <h1>Gestión de Películas</h1>
      <Button variant="primary" onClick={toggleModal}>
        Agregar Película
      </Button>

      <Table striped bordered hover responsive className="mt-3">
        <thead>
          <tr>
            <th>Imagen</th>
            <th>Título</th>
            <th>Descripción</th>
            <th>Stock</th>
            <th>Precio Alquiler</th>
            <th>Precio Venta</th>
            <th>Disponibilidad</th>
            <th>Opciones</th>
          </tr>
        </thead>
        <tbody>
          {currentMovies.map((movie) => (
            <tr key={movie.id}>
              <td>
                {movie.image ? (
                  <img
                    src={`http://localhost:5000/api/backend${
                      movie.image
                    }?v=${Date.now()}`}
                    alt={movie.title}
                    width="80"
                    height="80"
                  />
                ) : (
                  "No disponible"
                )}
              </td>
              <td>{movie.title}</td>
              <td>{movie.description}</td>
              <td>{movie.stock}</td>
              <td>{movie.rental_price}</td>
              <td>{movie.sales_price}</td>
              <td>{movie.available ? "Sí" : "No"}</td>
              <td>
                <Icon
                  path={mdiPencil}
                  size={1}
                  onClick={() => handleEditMovie(movie)}
                />
                <Icon
                  path={mdiTrashCanOutline}
                  size={1}
                  color={"red"}
                  onClick={() => handleDelete(movie.id)}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      {/* Paginación */}
      <Pagination>
        {pageNumbers.map((number) => (
          <Pagination.Item
            key={number}
            active={number === currentPage}
            onClick={() => paginate(number)}
          >
            {number}
          </Pagination.Item>
        ))}
      </Pagination>

      {/* Modal para crear una nueva película */}
      <Modal show={showModal} onHide={toggleModal} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>
            {isEditing ? "Editar Película" : "Agregar Nueva Película"}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Row>
              <Col className="col-6">
                <Form.Group className="mb-3">
                  <Form.Label>Título</Form.Label>
                  <Form.Control
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    isInvalid={!!errors.title}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.title}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
              <Col className="col-6">
                <Form.Group className="mb-3">
                  <Form.Label>Stock</Form.Label>
                  <Form.Control
                    type="number"
                    name="stock"
                    value={formData.stock}
                    onChange={handleInputChange}
                    isInvalid={!!errors.stock}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.stock}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col className="col-6">
                <Form.Group className="mb-3">
                  <Form.Label>Precio Alquiler</Form.Label>
                  <Form.Control
                    type="number"
                    name="rental_price"
                    value={formData.rental_price}
                    onChange={handleInputChange}
                    isInvalid={!!errors.rental_price}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.rental_price}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
              <Col className="col-6">
                <Form.Group className="mb-3">
                  <Form.Label>Precio Venta</Form.Label>
                  <Form.Control
                    type="number"
                    name="sales_price"
                    value={formData.sales_price}
                    onChange={handleInputChange}
                    isInvalid={!!errors.sales_price}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.sales_price}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col className="col-6">
                <Form.Group className="mb-3">
                  {/*  <Form.Label>Disponibilidad</Form.Label>
                  <Form.Control
                    type="text"
                    name="available"
                    value={formData.available }
                    onChange={handleInputChange}
                    isInvalid={!!errors.available}
                  />
                   */}
                  <Form.Label>Disponibilidad</Form.Label>
                  <Form.Select
                    aria-label="Disponibilidad"
                    onChange={handleInputChange}
                    isInvalid={!!errors.available}
                  >
                    <option value={(formData.available = 1)}>Disponible</option>
                    <option value={(formData.available = 2)}>
                      No Disponible
                    </option>
                  </Form.Select>
                  <Form.Control.Feedback type="invalid">
                    {errors.available}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
              <Col className="col-6">
                <Form.Group>
                  <Form.Label>Portada</Form.Label>
                  <Form.Control
                    type="file"
                    accept="*"
                    onChange={handleImageChange}
                    isInvalid={!!errors.image}
                  />
                  {previewImage && (
                    <div style={{ marginTop: "10px" }}>
                      <img src={previewImage} alt="Vista previa" width="50%" />
                    </div>
                  )}
                  <Form.Control.Feedback type="invalid">
                    {errors.image}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col className="col-12">
                <Form.Group className="mb-3">
                  <Form.Label>Descripción</Form.Label>
                  <Form.Control
                    as="textarea"
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    isInvalid={!!errors.description}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.description}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
            </Row>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={toggleModal}>
            Cancelar
          </Button>
          <Button variant="primary" onClick={handleSaveMovie}>
            {isEditing ? "Guardar Cambios" : "Guardar"}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Movies;
