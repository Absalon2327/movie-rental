// src/components/Loading.jsx
import React from "react";
import { Spinner, Container } from "react-bootstrap";

const Loading = () => {
  return (
    <Container fluid className="d-flex justify-content-center align-items-center" style={{ height: "100vh" }}>
      <Spinner animation="border" variant="primary" role="status">
        <span className="visually-hidden">Loading...</span>
      </Spinner>
    </Container>
  );
};

export default Loading;
