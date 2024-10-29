import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Container,
  Row,
  Col,
  Button,
  Card,
  Navbar,
  Nav,
  Carousel,
  Modal,
  Form,
} from "react-bootstrap";
import MovieService from "../service/MovieService";
import axios from "axios";
import Loading from "../components/Loading";

const Home = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [movies, setMovies] = useState([]);
  const [likes, setLikes] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();
  const [isRental, setIsRental] = useState(false);
  const [formData, setFormData] = useState({
    date_movements: "",
    date_return: "",
    penalty: "",
    total_cancel: "",
    type_movement: "",
    user: "",
    movie: "",
    name_tarjet: "",
    number_tarjet: "",
    ccv_tarjet: "",
    date_vto_tarjet: "",
    ccv_tarjet: "",
  });
  const user = JSON.parse(localStorage.getItem("user"));
  const isAuthenticated = !!localStorage.getItem("token");

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/"); // Redirigir a Home tras cerrar sesión
  };
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
      } finally {
        setIsLoading(false); // Termina la carga
      }
    };

    fetchMovies();
  }, []);

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
  const handleLike = (id) => {
    setLikes((prevLikes) => ({
      ...prevLikes,
      [id]: (prevLikes[id] || 0) + 1,
    }));
  };
  const handleSales = (movie) => {
    setFormData(movie); // Llena los datos del formulario con los datos de la película
    // setCurrentMovieId(movie.id); // Almacena el ID de la película que se va a editar
    setIsRental(false);
    setShowModal(true); // Muestra el modal
  };
  const handleRental = (movie) => {
    setFormData(movie); // Llena los datos del formulario con los datos de la película
    // setCurrentMovieId(movie.id); // Almacena el ID de la película que se va a editar
    setIsRental(true);
    setShowModal(true); // Muestra el modal
  };
  const toggleModal = () => {
    setShowModal(!showModal);
    if (!showModal) {
      setFormData({
        date_movements: "",
        date_return: "",
        penalty: "",
        total_cancel: "",
        type_movement: "",
        user: "",
        movie: "",
      });
      setErrors("");
    }
  };
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

  const handleSaveMovement = async () => {
    if (!validateForm()) return;

    /* try {
      console.log("Aquí");
      if (isRental) {
        // Actualiza la película existente
        await MovieService.updateMovie(currentMovieId, formData);
      } else {
        // Crea una nueva película

        await MovieService.createMovie(formData);
      }

      setShowModal(false);
      setFormData({
        date_movements: "",
        date_return: "",
        penalty: "",
        total_cancel: "",
        type_movement: "",
        user: "",
        movie: "",
      });
      setErrors({});
      setIsRental(false);
    } catch (error) {
      console.error("Error al guardar la película:", error);
    } */
  };

  return (
    <>
      {/* Navbar */}
      <Navbar bg="dark" variant="dark" expand="lg">
        <Container>
          <Navbar.Brand as={Link} to="/">
            🎥 Movie Rental
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="ms-auto">
              {isAuthenticated ? (
                <>
                  <Nav.Link onClick={handleLogout}>Cerrar Sesión</Nav.Link>
                </>
              ) : (
                <Nav.Link as={Link} to="/login">
                  Iniciar Sesión
                </Nav.Link>
              )}
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      {/* Hero Section */}
      <div className="bg-dark text-white text-center py-5">
        <h1 className="display-4">¡Explora tus películas favoritas!</h1>
        <p className="lead">
          Alquila o compra las películas más populares del momento
        </p>
        {/*  <Button as={Link} to="/login" variant="primary" className="mt-3">
          Comienza Ahora
        </Button> */}
      </div>

      {/* Carousel Compacto */}
      <Container className="py-5">
        <h2 className="text-center mb-4">Catálogo de Películas</h2>
        <Carousel variant="dark" indicators={false} interval={3000}>
          {movies.map((movie) => (
            <Carousel.Item key={movie.id}>
              <Row className="justify-content-center">
                <Col md={4}>
                  <Card className="text-center">
                    <Card.Img
                      variant="top"
                      src={`${movie.image}`}
                      alt={movie.title}
                      style={{ height: "200px", objectFit: "cover" }}
                    />
                    <Card.Body>
                      <Card.Title>{movie.title}</Card.Title>
                      <Card.Text>{movie.description}</Card.Text>
                      <Button
                        variant="outline-primary"
                        onClick={() => handleLike(movie.id)}
                      >
                        👍 {likes[movie.id] || 0} Likes
                      </Button>
                      <Button
                        variant="outline-primary"
                        onClick={() => handleSales(movie)}
                      >
                        {" "}
                        Comprar
                      </Button>
                      <Button
                        variant="outline-primary"
                        onClick={() => handleRental(movie)}
                      >
                        {" "}
                        Alquilar
                      </Button>
                    </Card.Body>
                  </Card>
                </Col>
              </Row>
            </Carousel.Item>
          ))}
        </Carousel>
        <Modal show={showModal} onHide={toggleModal} size="lx">
          <Modal.Header closeButton>
            <Modal.Title>
              {isRental ? "Alquilar Película" : "Comprar Película"}
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <Row>
                <Col className="col-6">
                  <Form.Group className="mb-3">
                    <Form.Label>Película</Form.Label>
                    <Form.Control
                      type="text"
                      name="title"
                      value={formData.title}
                      onChange={handleInputChange}
                      isInvalid={!!errors.title}
                      disabled
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
                      disabled
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
                    <Form.Label>Precio $</Form.Label>
                    <Form.Control
                      type="number"
                      name="rental_price"
                      value={formData.rental_price}
                      onChange={handleInputChange}
                      isInvalid={!!errors.rental_price}
                      disabled
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.rental_price}
                    </Form.Control.Feedback>
                  </Form.Group>
                </Col>
                <Col className="col-6">
                  <Form.Group className="mb-3">
                    <Form.Label>Método de pago</Form.Label>
                    <Form.Select
                      aria-label="Rol"
                      name="rol"
                      onChange={handleInputChange}
                      isInvalid={!!errors.rol}
                      value={formData.rol}
                    >
                      <option value="">Seleccione</option>{" "}
                      <option value="efectivo">Efectivo en tienda</option>
                      <option value="tarjeta">Tarjeta</option>
                    </Form.Select>
                    <Form.Control.Feedback type="invalid">
                      {errors.rental_price}
                    </Form.Control.Feedback>
                  </Form.Group>
                </Col>
              </Row>
              <Row>
                <Col className="col-6">
                  <Form.Group className="mb-3">
                    <Form.Label>Nombre según tarjeta</Form.Label>
                    <Form.Control
                      type="text"
                      name="name_tarjet"
                      value={formData.name_tarjet}
                      onChange={handleInputChange}
                      isInvalid={!!errors.name_tarjet}
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.name_tarjet}
                    </Form.Control.Feedback>
                  </Form.Group>
                </Col>
                <Col className="col-6">
                  <Form.Group className="mb-3">
                    <Form.Label>Número</Form.Label>
                    <Form.Control
                      type="number"
                      name="number_tarjet"
                      value={formData.number_tarjet}
                      onChange={handleInputChange}
                      isInvalid={!!errors.number_tarjet}
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.number_tarjet}
                    </Form.Control.Feedback>
                  </Form.Group>
                </Col>
              </Row>
              <Row>
                <Col className="col-6">
                  <Form.Group className="mb-3">
                    <Form.Label>Fecha Vto.</Form.Label>
                    <Form.Control
                      type="date"
                      name="date_vto_tarjet"
                      value={formData.date_vto_tarjet}
                      onChange={handleInputChange}
                      isInvalid={!!errors.date_vto_tarjet}
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.date_vto_tarjet}
                    </Form.Control.Feedback>
                  </Form.Group>
                </Col>
                <Col className="col-6">
                  <Form.Group className="mb-3">
                    <Form.Label>CCV</Form.Label>
                    <Form.Control
                      type="number"
                      name="ccv_tarjet"
                      value={formData.ccv_tarjet}
                      onChange={handleInputChange}
                      isInvalid={!!errors.ccv_tarjet}
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.ccv_tarjet}
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
            <Button variant="primary" onClick={handleSaveMovement}>
              {isRental ? "Alquilar" : "Comprar"}
            </Button>
          </Modal.Footer>
        </Modal>
      </Container>

      {/* Footer */}
      <footer className="bg-dark text-white text-center py-3">
        <p className="mb-0">
          © {new Date().getFullYear()} Movie Rental. Todos los derechos
          reservados.
        </p>
      </footer>
    </>
  );
};

export default Home;
