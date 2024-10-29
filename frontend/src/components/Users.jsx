// src/components/Movies.jsx
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
import UserService from "../service/UserService";
import Icon from "@mdi/react";
import { mdiPencil, mdiTrashCanOutline } from "@mdi/js";
import Loading from "./Loading";
const BACKEND_URL = "http://localhost:5000/api";
const Users = () => {
  const [users, setUser] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [usersPerPage] = useState(5); // Películas por página
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false); // Estado para saber si estamos editando
  const [currentUserId, setCurrentUserId] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    lastname: "",
    email: "",
    rol: "",
    pasword: "",
    repasword: "",
  });
  const [movieData, setMovieData] = useState({
    title: "",
    description: "",
    image: null,
  });
  const [previewImage, setPreviewImage] = useState(null);

  useEffect(() => {
    loadUsers();
  }, []);
  const [errors, setErrors] = useState({});
  const validateForm = () => {
    const newErrors = {};
    if (!formData.name) newErrors.name = "El nombre es obligatorio";
    if (!formData.lastname) newErrors.lastname = "El apellido es obligatorio";
    if (!formData.email) newErrors.email = "Ingrese un email";
    if (!formData.rol) newErrors.rol = "Defina un rol";
    if (!formData.pasword) newErrors.pasword = "Escriba una contraseña";
    if (!formData.repasword) newErrors.repasword = "Confirme la contraseña";
    setErrors(newErrors); // Actualiza el estado de errores
    return Object.keys(newErrors).length === 0; // Retorna true si no hay errores
  };

  const loadUsers = async () => {
    try {
      const data = await UserService.getAllUers();
      setUser(data);
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
    const { name, value } = e.target;

    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value, // Si es archivo, guarda el primer archivo seleccionado
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setMovieData({ ...formData, image: file });
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  const handleSaveUser = async () => {
    if (!validateForm()) return;

    try {
      console.log("Aquí");
      if (isEditing) {
        // Actualiza la película existente
        await UserService.updateUser(currentUserId, formData);
      } else {
        // Crea una nueva película

        await UserService.createUser(formData);
      }

      setShowModal(false);
      setFormData({
        name: "",
        lastname: "",
        email: "",
        rol: "",
        pasword: "",
        repasword: "",
      });
      setErrors({});
      setIsEditing(false);
      loadUsers();
    } catch (error) {
      console.error("Error al guardar el usuario:", error);
    }
  };

  // Función para abrir el modal en modo edición con los datos de la película seleccionada
  const handleEditUser = (user) => {
    setFormData(user); // Llena los datos del formulario con los datos de la película
    setCurrentUserId(user.id); // Almacena el ID de la película que se va a editar
    setIsEditing(true); // Cambia a modo edición
    setShowModal(true); // Muestra el modal
  };

  const handleDelete = async (id) => {
    try {
      await UserService.deleteUser(id);
      loadUsers();
    } catch (error) {
      console.error("Error al eliminar el usuario:", error);
    }
  };

  const toggleModal = () => {
    setShowModal(!showModal);
    if (!showModal) {
      setIsEditing(false); // Reinicia el estado de edición si se cierra el modal
      setFormData({
        name: "",
        lastname: "",
        email: "",
        rol: "",
        pasword: "",
        repasword: "",
      });
      setErrors("");
      setPreviewImage("");
    }
  };

  // Control de paginación
  const indexOfLastMovie = currentPage * usersPerPage;
  const indexOfFirstMovie = indexOfLastMovie - usersPerPage;
  const currentUser = users.slice(indexOfFirstMovie, indexOfLastMovie);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Generación de botones de paginación
  const pageNumbers = [];
  for (let i = 1; i <= Math.ceil(users.length / usersPerPage); i++) {
    pageNumbers.push(i);
  }

  return (
    <div className="container my-4">
      <h1>Gestión de Usuarios</h1>
      <Button variant="primary" onClick={toggleModal}>
        Agregar Usuario
      </Button>

      <Table striped bordered hover responsive className="mt-3">
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Apellido</th>
            <th>Correo</th>
            <th>Rol</th>
            <th>Opciones</th>
          </tr>
        </thead>
        <tbody>
          {currentUser.map((user) => (
            <tr key={user.id}>
              <td>{user.name}</td>
              <td>{user.lastname}</td>
              <td>{user.email}</td>
              <td>{user.rol}</td>
              <td>
                <Icon
                  path={mdiPencil}
                  size={1}
                  onClick={() => handleEditUser(user)}
                />
                <Icon
                  path={mdiTrashCanOutline}
                  size={1}
                  color={"red"}
                  onClick={() => handleDelete(user.id)}
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
            {isEditing ? "Editar Usuario" : "Agregar Nueva Usuario"}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Row>
              <Col className="col-6">
                <Form.Group className="mb-3">
                  <Form.Label>Nombre</Form.Label>
                  <Form.Control
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    isInvalid={!!errors.name}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.name}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
              <Col className="col-6">
                <Form.Group className="mb-3">
                  <Form.Label>Apellido</Form.Label>
                  <Form.Control
                    type="text"
                    name="lastname"
                    value={formData.lastname}
                    onChange={handleInputChange}
                    isInvalid={!!errors.lastname}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.lastname}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col className="col-6">
                <Form.Group className="mb-3">
                  <Form.Label>Email</Form.Label>
                  <Form.Control
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    isInvalid={!!errors.email}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.email}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
              <Col className="col-6">
                <Form.Group className="mb-3">
                  <Form.Label>Rol</Form.Label>
                  <Form.Select
                    aria-label="Rol"
                    name="rol"
                    onChange={handleInputChange}
                    isInvalid={!!errors.rol}
                    value={formData.rol}
                  >
                    <option value="">Selecciona un rol</option>{" "}
                    <option value="Administrador">Administrador</option>
                    <option value="Vendedor">Vendedor</option>
                    <option value="Usuario">Usuario</option>
                  </Form.Select>
                  <Form.Control.Feedback type="invalid">
                    {errors.rol}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col className="col-6">
                <Form.Group className="mb-3">
                  <Form.Label>Contraseña</Form.Label>
                  <Form.Control
                    type="password"
                    name="pasword"
                    value={formData.pasword}
                    onChange={handleInputChange}
                    isInvalid={!!errors.pasword}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.pasword}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
              <Col className="col-6">
                <Form.Group className="mb-3">
                  <Form.Label>Confirmar Contraseña</Form.Label>
                  <Form.Control
                    type="password"
                    name="repasword"
                    value={formData.repasword}
                    onChange={handleInputChange}
                    isInvalid={!!errors.repasword}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.repasword}
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
          <Button variant="primary" onClick={handleSaveUser}>
            {isEditing ? "Guardar Cambios" : "Guardar"}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Users;
