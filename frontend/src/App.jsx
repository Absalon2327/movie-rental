import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Home from "./pages/Home";
import Login from "./components/Login";
import Admin from "./pages/Admin";
import CreateMovie from "./components/CreateMovies";

function App() {
  const user = JSON.parse(localStorage.getItem("user"));
  const isAuthenticated = !!localStorage.getItem("token");
  const isAdmin = user?.rol === "Administrador";

  
  return (
    
      <Router>
        <div className="App">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/movies-create" element={<CreateMovie />} />
            <Route
              path="/admin/*"
              element={
                isAuthenticated && isAdmin ? (
                  <Admin />
                ) : (
                  <Navigate to="/login" />
                )
              }
            />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </div>
      </Router>
  );
}

export default App;
