import React, { useEffect, useState } from "react";
import { Link, useNavigate } from 'react-router-dom';
import {
  Container,
  Row,
  Col,
  Button,
  Card,
  Navbar,
  Nav,
  Carousel,
} from "react-bootstrap";
import axios from "axios";

const Home = () => {
  const [movies, setMovies] = useState([]);
  const [likes, setLikes] = useState({});
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));
  const isAuthenticated = !!localStorage.getItem('token');
  
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/'); // Redirigir a Home tras cerrar sesión
  };
  useEffect(() => {
    // Función para obtener las películas desde la API
    const fetchMovies = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/movies", {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }); // Ajusta la URL según tu configuración
        setMovies(response.data);
        console.log('response: ',response.data);
      } catch (error) {
        console.error("Error fetching movies:", error);
      }
    };

    fetchMovies();
  }, []);

  const handleLike = (id) => {
    setLikes((prevLikes) => ({
      ...prevLikes,
      [id]: (prevLikes[id] || 0) + 1,
    }));
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
                  {user.rol === 'Administrador' && (
                    <Nav.Link as={Link} to="/admin">Administrador</Nav.Link>
                  )}
                  <Nav.Link as={Link} to="/movies-create">Películas</Nav.Link>
                  <Nav.Link onClick={handleLogout}>Cerrar Sesión</Nav.Link>
                </>
              ) : (
                <Nav.Link as={Link} to="/login">Iniciar Sesión</Nav.Link>
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
                    </Card.Body>
                  </Card>
                </Col>
              </Row>
            </Carousel.Item>
          ))}
        </Carousel>
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
