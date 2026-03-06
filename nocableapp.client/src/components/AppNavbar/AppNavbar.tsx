import { Navbar, Container, Nav } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthProvider'

export default function AppNavbar() {
  const { user } = useAuth()

  return (
    <Navbar variant="dark" bg="dark" expand="md">
      <Container fluid>
        <Navbar.Brand as={Link} to="/">No-Cable.com</Navbar.Brand>
        <Navbar.Toggle aria-controls="main-nav" />
        <Navbar.Collapse id="main-nav">
          <Nav className="me-auto">
            <Nav.Link as={Link} to="/">Home</Nav.Link>
            <Nav.Link as={Link} to="/webapp">StoryMap</Nav.Link>
          </Nav>
          {user && (
            <Nav>
              <Navbar.Text>{user.email}</Navbar.Text>
            </Nav>
          )}
        </Navbar.Collapse>
      </Container>
    </Navbar>
  )
}
