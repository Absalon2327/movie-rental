import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  Alert,
  Form,
  Button,
  Container,
  Row,
  Col,
  Card,
  Spinner,
} from "react-bootstrap";
import LoginService from "../service/LoginService";
const Login = () => {
  const [email, setEmail] = useState("");
  const [pasword, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [errors, setErrors] = useState({});
  const [alerts, setAlertErrors] = useState({});
  const [formData, setFormData] = useState({
    email: "",
    pasword: "",
  });
  const handleLogin = async () => {
    if (!validateForm()) {
      return;
    } else {
      setLoading(true);
      try {
       const response = await LoginService.login(formData);
        localStorage.setItem("token", response.token);
        localStorage.setItem("user", JSON.stringify(response.user));
        const user = response.user;
        // Redirigir según el rol
        if (user.rol === "Administrador") {
          console.log('user.rol: ', user.rol)
          navigate("/admin/");
        } else {
          navigate("/home");
        }
      } catch (err) {
        setError("Email o contraseña incorrectos");
      } finally {
        setLoading(false); // Cambia el estado a false al final
      }
    }
  };
  const validateForm = () => {
    const newErrors = {};
    if (!formData.email) newErrors.email = "Ingrese su email";
    if (!formData.pasword) newErrors.pasword = "Ingrese su contraseña";
    setErrors(newErrors); // Actualiza el estado de errores
    return Object.keys(newErrors).length === 0; // Retorna true si no hay errores
  };
  const handleInputChange = (e) => {
    const { name, value } = e.target;

    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value, // Si es archivo, guarda el primer archivo seleccionado
    }));
  };

  return (
    <Container
      className="d-flex align-items-center justify-content-center"
      style={{ minHeight: "100vh" }}
    >
      <Row className="w-100">
        <Col md={{ span: 6, offset: 3 }}>
          <Card>
            <Card.Body>
              <h2 className="text-center mb-4">Iniciar Sesión</h2>

              {error && <Alert variant="danger">{error}</Alert>}

              <Form>
                <Form.Group className="mb-3">
                  <Form.Label>Email</Form.Label>
                  <Form.Control
                    type="email"
                    name="email"
                    placeholder="Ingresa tu email"
                    value={formData.email}
                    onChange={handleInputChange}
                    isInvalid={!!errors.email}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.email}
                  </Form.Control.Feedback>
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Contraseña</Form.Label>
                  <Form.Control
                    type="password"
                    name="pasword"
                    placeholder="Ingresa tu contraseña"
                    value={formData.pasword}
                    onChange={handleInputChange}
                    isInvalid={!!errors.pasword}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.pasword}
                  </Form.Control.Feedback>
                </Form.Group>

                <Button
                  variant="primary"
                  className="w-100"
                  disabled={isLoading}
                  onClick={handleLogin}
                >
                  {isLoading ? (
                    <>
                      Iniciando sesión...
                      <Spinner
                        as="span"
                        animation="border"
                        size="sm"
                        role="status"
                        aria-hidden="true"
                        className="ms-2"
                      />
                    </>
                  ) : (
                    "Iniciar Sesión"
                  )}
                </Button>
              </Form>

              <div className="text-center mt-3">
                <small>
                  ¿No tienes cuenta? <a href="/register">Regístrate aquí</a>
                </small>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Login;
