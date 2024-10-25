import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Movies from "../components/Movies";
import { Container, Row } from "react-bootstrap";
import Topbar from "../components/Topbar";
import Sidebar from "../components/Sidebar";
import { PrimeReactProvider } from "primereact/api";
const Admin = ({ handleLogout }) => {
  const navigate = useNavigate();

  const [currentView, setCurrentView] = useState("admin");
  useEffect(() => {
    const token = localStorage.getItem("token");
    const user = JSON.parse(localStorage.getItem("user"));

    if (!token || user?.rol !== "Administrador") {
      navigate("/", { replace: true });
    } else {
      window.history.pushState(null, "", window.location.href);
      window.addEventListener("popstate", handleBackButton);

      return () => {
        window.removeEventListener("popstate", handleBackButton);
      };
    }
  }, [navigate]);

  const handleBackButton = () => {
    window.history.pushState(null, "", window.location.href);
  };

 /*  const logoutHandler = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/", { replace: true });
  }; */

  const [isOpen] = useState(true);
  const value = {
    appendTo: "self",
  };
  return (
    <PrimeReactProvider value={value}>
    <div style={{ display: "flex", flexDirection: "column", height: "100vh" }}>
      <Topbar />
      <div style={{ display: "flex", flex: 1 }}>
      <Sidebar isOpen={isOpen} setCurrentView={setCurrentView} />
        <Container
          fluid
          style={{
            flex: 1,
            padding: "20px",
          }}
        >
          <Row>
            {currentView === "admin" && (
              <>
                <h1>Bienvenido al Panel de Administración</h1>
                <p>Aquí puedes gestionar películas y usuarios.</p>
              </>
            )}
            {currentView === "movies" && <Movies />}
            {currentView === "users" && (
              <>
                <h1>Gestión de Usuarios</h1>
                <p>Aquí puedes gestionar usuarios.</p>
              </>
            )}
          </Row>
        </Container>
      </div>
    </div>
    </PrimeReactProvider>
  );
};

export default Admin;
