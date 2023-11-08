import { Link } from "react-router-dom";
import {
  Form,
  FormGroup,
  Navbar,
  Nav,
  Container,
  Media,
} from "reactstrap";

const AdminNavbar = (props) => {
  return (
    <>
      <Navbar className="navbar-top navbar-dark" expand="md" id="navbar-main">
        <Container fluid>
          <Form className="navbar-search navbar-search-dark form-inline mr-3 d-none d-md-flex ml-lg-auto">
            <FormGroup className="mb-0"/>
          </Form>
          <Nav className="align-items-center d-none d-md-flex" navbar>
            <Media className="align-items-center" style={{ color: "white" }}>
              <span className="avatar avatar-sm rounded-circle">
                <img
                  alt="..."
                  src={require("../../assets/img/brand/logo.jpg")}
                />
              </span>
              <Media className="ml-2 d-none d-lg-block">
                <span className="mb-0 text-sm font-weight-bold">
                Grupo Dínamo
                </span>
              </Media>
            </Media>
          </Nav>
        </Container>
      </Navbar>
    </>
  );
};

export default AdminNavbar;
