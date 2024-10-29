import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Movies from "../components/Movies";
import Users from "../components/Users";
import { Container, Row } from "react-bootstrap";
import Topbar from "../components/Topbar";
import Sidebar from "../components/Sidebar";
import { PrimeReactProvider } from "primereact/api";
import Loading from "../components/Loading";
const Admin = ({ handleLogout }) => {
  const navigate = useNavigate();

  const [currentView, setCurrentView] = useState("admin");
  const [isLoading, setLoading] = useState(true);
  const [isOpen] = useState(true);
  useEffect(() => {
    const token = localStorage.getItem("token");
    const user = JSON.parse(localStorage.getItem("user"));

    if (!token || user?.rol !== "Administrador") {
      navigate("/", { replace: true });
    } else {
      window.history.pushState(null, "", window.location.href);
      window.addEventListener("popstate", handleBackButton);
      setTimeout(() => {
        setLoading(false); // Cambia a false después de cargar
      }, 1000);
      return () => {
        window.removeEventListener("popstate", handleBackButton);
      };
    }
  }, [navigate]);

  const handleBackButton = () => {
    window.history.pushState(null, "", window.location.href);
  };

  if (isLoading) {
    return <Loading />; // Muestra el componente Loading mientras se cargan los datos
  }
  /*  const logoutHandler = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/", { replace: true });
  }; */

  const value = {
    appendTo: "self",
  };
  return (
    <PrimeReactProvider value={value}>
      <div
        style={{ display: "flex", flexDirection: "column", height: "100vh" }}
      >
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
              {currentView === "users" && <Users />}
            </Row>
          </Container>
        </div>
      </div>
    </PrimeReactProvider>
  );
};

export default Admin;
