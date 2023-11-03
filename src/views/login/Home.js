import { Link } from "react-router-dom";
import Auth from "layouts/Auth.js";
import {
  Button,
  Card,
  CardHeader,
  CardBody,
  FormGroup,
  Form,
  Row,
  Col,
} from "reactstrap";

const Home = () => {
  return (
    <>
      <Auth>
        <Col lg="5" md="7">
          <Card className="bg-secondary shadow border-0">
            <CardHeader className="bg-transparent">
              <div className="header-body text-center">
                <h1 className="text-muted">Bem-vindo(a)!</h1>
                <p className="text-muted">Se você já fez uma denúncia e deseja acompanhar a situação, clique em 'Logar'. Se deseja fazer uma denúncia, clique em 'Fazer Denúncia'</p>
              </div>
            </CardHeader>
            <CardBody className="px-lg-5 py-lg-5">
              <Form role="form">
                <Row>
                  <Col md="6">
                    <FormGroup>
                    <Link to="/login">
                        <Button
                          color="primary"
                          block
                          type="button"
                        >
                          Logar
                        </Button>
                      </Link>
                    </FormGroup>
                  </Col>
                  <Col md="6">
                    <FormGroup>
                    <Link to="/Question">
                      <Button
                        color="danger"
                        block
                        type="button"
                      >
                        Fazer Denúncia
                      </Button>
                      </Link>
                    </FormGroup>
                  </Col>
                </Row>
              </Form>
            </CardBody>
          </Card>
        </Col>
      </Auth>
    </>
  );
};

export default Home;