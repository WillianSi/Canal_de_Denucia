import React, { useState, useEffect, useRef } from "react";
import { MdDriveFolderUpload } from "react-icons/md";
import loadingGif from "../../assets/img/theme/loading.gif";
import { format } from "date-fns";
import Auth from "layouts/Auth.js";
import End from "./End.js";
import logoImg from "../../assets/img/theme/logo.png";
import { ref, uploadBytes, getDownloadURL, getStorage } from "firebase/storage";
import { Link } from "react-router-dom";
import {
  addDoc,
  query,
  where,
  getFirestore,
  collection,
  getDocs,
  setDoc,
  doc,
  getDoc,
} from "firebase/firestore";
import {
  Alert,
  Button,
  Card,
  CardHeader,
  CardBody,
  FormGroup,
  Form,
  Input,
  Row,
  Col,
} from "reactstrap";

const db = getFirestore();
const storage = getStorage();

const Forms = () => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [answers, setAnswers] = useState({});
  const fileInput = useRef(null);
  const [generatedUsername, setGeneratedUsername] = useState("");
  const [generatedPassword, setGeneratedPassword] = useState("");

  const [isSaved, setIsSaved] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isModalOpen, setModalOpen] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [alertColor, setAlertColor] = useState("");
  const [alertTitle, setAlertTitle] = useState("");

  const imageStyle = {
    maxWidth: "60%",
    maxHeight: "100px",
    marginBottom: "20px",
  };

  const openModal = () => {
    const lastQuestion = questions[currentQuestion];
    const lastAnswer = answers[lastQuestion.id];
  
    if (lastQuestion.validation && (
      (lastQuestion.tipo === "Dropdown" && lastAnswer.selectedOption === "") ||
      (lastQuestion.tipo === "Arquivo" && lastAnswer.file === null) ||
      (lastQuestion.tipo === "PerguntaAberta" && lastAnswer.answer === "")
    )) {
      setAlertColor("danger");
      setAlertTitle("Atenção!");
      showErrorMessage("Preencha a pergunta antes de prosseguir.");
    } else {
      setModalOpen(true);
    }
  };

  const showErrorMessage = (message) => {
    setErrorMessage(message);
    setShowAlert(true);
    setTimeout(() => {
      setShowAlert(false);
    }, 3000);
  };

  const previousQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    } else {
      return <Link to="/home" />;
    }
  };

  const nextQuestion = () => {
    const currentAnswer = answers[questions[currentQuestion].id];

    if (
      questions[currentQuestion].validation && 
      ((questions[currentQuestion].tipo === "Dropdown" &&
        currentAnswer.selectedOption === "") ||
        (questions[currentQuestion].tipo === "Arquivo" &&
          currentAnswer.file === null) ||
        (questions[currentQuestion].tipo === "PerguntaAberta" &&
          currentAnswer.answer === ""))
    ) {
      setAlertColor("danger");
      setAlertTitle("Atenção!");
      showErrorMessage("Preencha a pergunta antes de prosseguir.");
    } else {
      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion(currentQuestion + 1);
      }
    }
  };

  const handleAnswerChange = (event) => {
    const updatedAnswers = { ...answers };
    updatedAnswers[questions[currentQuestion].id].answer = event.target.value;
    setAnswers(updatedAnswers);
  };

  const handleDropdownChange = (event) => {
    const updatedAnswers = { ...answers };
    updatedAnswers[questions[currentQuestion].id].selectedOption =
      event.target.value;
    setAnswers(updatedAnswers);
  };

  const handleFileChange = (event) => {
    const updatedAnswers = { ...answers };
    updatedAnswers[questions[currentQuestion].id].file = event.target.files[0];
    setAnswers(updatedAnswers);
  };

  const uploadFile = async (file) => {
    const storageRef = ref(storage, "documentos/" + file.name);

    try {
      const snapshot = await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(snapshot.ref);
      return downloadURL;
    } catch (error) {
      setAlertColor("danger");
      setAlertTitle("Erro!");
      showErrorMessage("Não foi possível subir o arquivo.");
    }
  };

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const questionsRef = collection(db, "forms");
        const querySnapshot = await getDocs(questionsRef);
        const questionsData = [];
        querySnapshot.forEach((doc) => {
          questionsData.push({
            id: doc.id,
            ...doc.data(),
          });
        });
        setQuestions(questionsData);
        setLoading(false);

        const initialAnswers = {};
        questionsData.forEach((question) => {
          initialAnswers[question.id] = {
            answer: "",
            selectedOption: "",
            file: null,
          };
        });
        setAnswers(initialAnswers);
      } catch (error) {
        setAlertColor("danger");
        setAlertTitle("Erro!");
        showErrorMessage("Erro ao buscar perguntas.");
        setLoading(false);
      }
    };
    fetchQuestions();
  }, []);

  const generateUniqueReference = async () => {
    let reference;
    let isUnique = false;

    while (!isUnique) {
      reference = Math.floor(1000 + Math.random() * 9000);
      const querySnapshot = await getDocs(
        query(collection(db, "incident"), where("referencia", "==", reference))
      );
      if (querySnapshot.empty) {
        isUnique = true;
      }
    }

    return reference.toString();
  };

  const generateUser = async (incidentId, setUsername, setPassword) => {
    const characters =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let username = "";
    let password = "";

    let isUnique = false;
    while (!isUnique) {
      for (let i = 0; i < 5; i++) {
        const randomIndex = Math.floor(Math.random() * characters.length);
        username += characters.charAt(randomIndex);
      }
      const userDoc = await getDoc(doc(db, "users", username));
      if (!userDoc.exists()) {
        isUnique = true;
      }
    }

    for (let i = 0; i < 8; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      password += characters.charAt(randomIndex);
    }

    try {
      const userRef = doc(db, "users", username);
      await setDoc(userRef, { password, incidentId });
      setUsername(username);
      setPassword(password);
    } catch (error) {
      setAlertColor("danger");
      setAlertTitle("Erro!");
      showErrorMessage("Erro ao salvar o usuário!");
    }
  };

  const submitAnswers = async () => {
    setIsSaving(true);

    const currentDate = new Date();
    const formattedDate = format(currentDate, "dd/MM/yyyy");

    const uploadAllFilesPromises = [];

    for (const question of questions) {
      const answer = answers[question.id];
      if (question.tipo === "Arquivo" && answer.file) {
        const uploadPromise = uploadFile(answer.file);
        uploadAllFilesPromises.push(uploadPromise);
        uploadPromise.then((downloadURL) => {
          const updatedAnswers = { ...answers };
          updatedAnswers[question.id].file = downloadURL;
          setAnswers(updatedAnswers);
        });
      }
    }

    try {
      await Promise.all(uploadAllFilesPromises);

      const reference = await generateUniqueReference();

      const formData = {
        data_criacao: formattedDate,
        pergunta: questions.map((question) => question.titulo),
        referencia: reference,
        resposta: questions.map((question) => {
          if (question.tipo === "Arquivo") {
            return answers[question.id].file || "No file available";
          }
          if (question.tipo === "Dropdown") {
            return answers[question.id].selectedOption;
          }
          return answers[question.id].answer;
        }),
        status: 0,
      };

      const incidentRef = await addDoc(collection(db, "incident"), formData);

      await generateUser(
        incidentRef.id,
        setGeneratedUsername,
        setGeneratedPassword
      );

      setIsSaved(true);
      setIsSaving(false);
    } catch (error) {
      setIsSaving(false);
    }
  };

  if (loading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <img
          src={loadingGif}
          alt="Carregando..."
          style={{
            width: "100px",
          }}
        />
      </div>
    );
  }

  return (
    <>
      <Auth>
        <Col lg="7" md="7">
          <Card className="bg-secondary shadow border-0">
            <CardHeader className="bg-transparent">
              <div className="header-body text-center">
                <img src={logoImg} alt="Logo" style={imageStyle} />
                {showAlert && (
                  <Alert color={alertColor}>
                    <strong>{alertTitle}</strong> {errorMessage}
                  </Alert>
                )}
                <p className="text-dark text-justify">
                  {questions[currentQuestion].titulo}
                </p>
              </div>
            </CardHeader>
            <CardBody>
              <Form role="form">
                <Row>
                  <Col md="10" className="mx-auto text-center">
                    <FormGroup>
                      {questions[currentQuestion].tipo === "Dropdown" && (
                        <Input
                          type="select"
                          className="form-control"
                          value={
                            answers[questions[currentQuestion].id]
                              .selectedOption
                          }
                          onChange={handleDropdownChange}
                        >
                          <option>Selecione uma opção</option>
                          {questions[currentQuestion].questoes.map(
                            (opcao, opcaoIndex) => (
                              <option key={opcaoIndex} value={opcao}>
                                {opcao}
                              </option>
                            )
                          )}
                        </Input>
                      )}
                      {questions[currentQuestion].tipo === "Arquivo" && (
                        <div>
                          <div className="input-group">
                            <input
                              type="text"
                              className="form-control"
                              value={
                                answers[questions[currentQuestion].id].file
                                  ? answers[questions[currentQuestion].id].file
                                      .name
                                  : "Nenhum arquivo escolhido"
                              }
                              readOnly
                            />
                            <div className="input-group-append">
                              <Button
                                color="default"
                                type="button"
                                onClick={() => fileInput.current.click()}
                              >
                                <MdDriveFolderUpload className="larger-icon" />{" "}
                              </Button>
                            </div>
                          </div>
                          <input
                            type="file"
                            style={{ display: "none" }}
                            ref={fileInput}
                            onChange={handleFileChange}
                          />
                        </div>
                      )}

                      {questions[currentQuestion].tipo === "PerguntaAberta" && (
                        <textarea
                          className="form-control"
                          value={answers[questions[currentQuestion].id].answer}
                          onChange={handleAnswerChange}
                          rows={5}
                        ></textarea>
                      )}
                    </FormGroup>
                    <Row>
                      <Col md="6">
                        <FormGroup>
                          <Button
                            color="default"
                            type="button"
                            onClick={previousQuestion}
                            block
                          >
                            {currentQuestion === 0 ? (
                              <Link to="/home" style={{ color: "white" }}>
                                Home
                              </Link>
                            ) : (
                              "Voltar"
                            )}
                          </Button>
                        </FormGroup>
                      </Col>
                      <Col md="6">
                        <FormGroup>
                          {currentQuestion === questions.length - 1 ? (
                            <Button
                              color="danger"
                              type="button"
                              block
                              onClick={openModal}
                            >
                              Denúnciar
                            </Button>
                          ) : (
                            <Button
                              color="default"
                              type="button"
                              onClick={nextQuestion}
                              block
                            >
                              Próximo
                            </Button>
                          )}
                        </FormGroup>
                      </Col>
                    </Row>
                  </Col>
                </Row>
              </Form>
            </CardBody>
          </Card>
        </Col>
      </Auth>
      {isModalOpen && (
        <End
          isOpen={isModalOpen}
          toggle={() => setModalOpen(false)}
          submitAnswers={submitAnswers}
          isSaving={isSaving}
          isSaved={isSaved}
          username={generatedUsername}
          password={generatedPassword}
        />
      )}
    </>
  );
};

export default Forms;
