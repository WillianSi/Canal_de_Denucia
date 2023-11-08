import React, { useEffect, useState } from "react";
import Auth from "layouts/Auth.js";
import { Navigate } from "react-router-dom";
import { getFirestore, doc, getDoc } from "firebase/firestore";
import { getAuth, signInAnonymously } from "firebase/auth";
import logoImg from '../../assets/img/theme/logo.png';
import {
  Alert,
  Button,
  Card,
  CardHeader,
  CardBody,
  FormGroup,
  Form,
  Input,
  InputGroupAddon,
  InputGroupText,
  InputGroup,
  Col,
} from "reactstrap";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const [redirectTo, setRedirectTo] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [alertColor, setAlertColor] = useState("");
  const [alertTitle, setAlertTitle] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const imageStyle = {
    maxWidth: "60%",
    maxHeight: "100px",
    marginBottom: "20px",
  };

  useEffect(() => {
    if (loading) {
      setAlertColor("default");
      setAlertTitle("Aguarde:");
      showErrorMessage("Conectando...");
    }
  }, [loading]);

  const handleSignIn = async () => {
    try {
      setLoading(true);
      const db = getFirestore();
      const userDoc = doc(db, "users", username);
      const userDocSnapshot = await getDoc(userDoc);

      if (userDocSnapshot.exists()) {
        const userData = userDocSnapshot.data();
        if (userData.password === password) {
          const auth = getAuth();

          signInAnonymously(auth)
            .then((userCredential) => {
              setRedirectTo(`/admin/index/${userData.incidentId}`);
            })
            .catch((error) => {
              console.error("Anonymous sign-in error", error);
            });
        } else {
          setAlertColor("danger");
          setAlertTitle("Erro:");
          showErrorMessage("Senha incorreta.");
        }
      } else {
        setAlertColor("danger");
        setAlertTitle("Erro:");
        showErrorMessage("Usuário não encontrado.");
      }
    } catch (error) {
      setAlertColor("danger");
      setAlertTitle("Erro:");
      showErrorMessage("Erro ao autenticar o usuário.");
    }
  };

  const showErrorMessage = (message) => {
    setErrorMessage(message);
    setShowAlert(true);
    setTimeout(() => {
      setShowAlert(false);
    }, 3000);
  };

  return (
    <>
      {redirectTo && <Navigate to={redirectTo} />}
      <Auth>
        <Col lg="5" md="7">
          <Card className="bg-secondary shadow border-0">
            <CardHeader className="bg-transparent">
              <div className="header-body text-center">
              <img src={logoImg} alt="Logo" style={imageStyle} />
                <h1 className="text-muted">Bem-vindo(a)!</h1>
                <p className="text-muted">
                  Faça login com o usuário e senha recebidos para continuar!
                </p>
                {showAlert && (
                  <Alert color={alertColor}>
                    <strong>{alertTitle}</strong> {errorMessage}
                  </Alert>
                )}
              </div>
            </CardHeader>
            <CardBody className="px-lg-5 ">
              <Form role="form">
                <FormGroup className="mb-3">
                  <InputGroup className="input-group-alternative">
                    <InputGroupAddon addonType="prepend">
                      <InputGroupText>
                        <i className="ni ni-circle-08" />
                      </InputGroupText>
                    </InputGroupAddon>
                    <Input
                      placeholder="Usuário"
                      onChange={(e) => setUsername(e.target.value)}
                    />
                  </InputGroup>
                </FormGroup>
                <FormGroup>
                  <InputGroup className="input-group-alternative">
                    <InputGroupAddon addonType="prepend">
                      <InputGroupText>
                        <i
                          className="ni ni-lock-circle-open"
                          onClick={togglePasswordVisibility}
                          style={{ cursor: "pointer" }}
                        />
                      </InputGroupText>
                    </InputGroupAddon>
                    <Input
                      placeholder="Senha"
                      type={showPassword ? "text" : "password"}
                      autoComplete="new-password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                  </InputGroup>
                </FormGroup>
                <div className="text-center">
                  <Button
                    className="my-3"
                    color="default"
                    type="button"
                    onClick={handleSignIn}
                  >
                    Entrar
                  </Button>
                </div>
              </Form>
            </CardBody>
          </Card>
        </Col>
      </Auth>
    </>
  );
};

export default Login;