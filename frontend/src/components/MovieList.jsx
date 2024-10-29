import { useEffect, useState } from 'react';
import { Card, Button, Container, Row, Col, Pagination } from 'react-bootstrap';
import axios from 'axios';

const MovieList = () => {
  const [movies, setMovies] = useState([]);
  const [page, setPage] = useState(1);

  useEffect(() => {
    axios.get(`http://localhost:5000/api/movies?page=${page}`).then(res => setMovies(res.data), {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    });
  }, [page]);

  return (
    <Container>
      <Row>
        {movies.map(movie => (
          <Col key={movie.id} md={4}>
            <Card>
              <Card.Img variant="top" src={movie.image} />
              <Card.Body>
                <Card.Title>{movie.title}</Card.Title>
                <Card.Text>{movie.description}</Card.Text>
                <Button variant="primary">Rent</Button>
                <Button variant="success" className="ml-2">Buy</Button>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
      <Pagination className="mt-4">
        <Pagination.Prev onClick={() => setPage(page - 1)} disabled={page === 1} />
        <Pagination.Next onClick={() => setPage(page + 1)} />
      </Pagination>
    </Container>
  );
};

export default MovieList;
