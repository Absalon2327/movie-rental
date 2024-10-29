import React from 'react';
import { Navbar, Container, Nav, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

const Topbar = () => {
  const navigate = useNavigate();
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/", { replace: true });
  };
  return (
    <Navbar bg="dark" variant="dark" expand="lg">
      <Container fluid>
        <Navbar.Brand>Panel de Administración</Navbar.Brand>
        <Nav className="ms-auto">
          <Button variant="outline-light" onClick={() => {
            handleLogout();
            navigate('/'); // Redirigir a la vista Home después de cerrar sesión
          }}>
            Cerrar Sesión
          </Button>
        </Nav>
      </Container>
    </Navbar>
  );
};

export default Topbar;
