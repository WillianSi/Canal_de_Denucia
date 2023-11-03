import { Link } from "react-router-dom";
import {
  Form,
  FormGroup,
  InputGroupAddon,
  InputGroupText,
  Input,
  InputGroup,
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
          <Link
            className="h4 mb-0 text-white text-uppercase d-none d-lg-inline-block"
            to="/"
          >
            {props.brandText}
          </Link>
          <Form className="navbar-search navbar-search-dark form-inline mr-3 d-none d-md-flex ml-lg-auto">
            <FormGroup className="mb-0">
              <InputGroup className="input-group-alternative">
                <InputGroupAddon addonType="prepend">
                  <InputGroupText>
                    <i className="fas fa-search" />
                  </InputGroupText>
                </InputGroupAddon>
                <Input placeholder="Pesquisar" type="text" />
              </InputGroup>
            </FormGroup>
          </Form>
          <Nav className="align-items-center d-none d-md-flex" navbar>
            <Media className="align-items-center" style={{ color: "white" }}>
              <span className="avatar avatar-sm rounded-circle">
                <img
                  alt="..."
                  src={require("../../assets/img/theme/MZZI-icon.jpeg")}
                />
              </span>
              <Media className="ml-2 d-none d-lg-block">
                <span className="mb-0 text-sm font-weight-bold">
                  MZZI thinks Digital
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
