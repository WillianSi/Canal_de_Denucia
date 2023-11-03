import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Alert, Modal, Button, Spinner } from "reactstrap";

const End = (props) => {
  const {
    isOpen,
    toggle,
    submitAnswers,
    isSaving,
    isSaved,
    username,
    password,
  } = props;
  const [isCopied, setIsCopied] = useState(false);

  const [showAlert, setShowAlert] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [alertColor, setAlertColor] = useState("");
  const [alertTitle, setAlertTitle] = useState("");

  const showErrorMessage = (message) => {
    setErrorMessage(message);
    setShowAlert(true);
    setTimeout(() => {
      setShowAlert(false);
    }, 3000);
  };

  const handleCopy = () => {
    const textToCopy = `Nome de Usuário: ${username}\nSenha: ${password}`;

    const textArea = document.createElement("textarea");
    textArea.value = textToCopy;
    document.body.appendChild(textArea);
    textArea.select();

    try {
      document.execCommand("copy");
      setIsCopied(true);
    } catch (err) {
      setAlertColor("danger");
      setAlertTitle("Erro!");
      showErrorMessage("Falha ao copiar o texto.");
    }

    document.body.removeChild(textArea);
  };

  return (
    <Modal
      isOpen={isOpen}
      className="modal-dialog-centered modal-danger"
      contentClassName="bg-gradient-danger"
    >
      <div className="modal-header">
        <button
          aria-label="Close"
          className="close"
          data-dismiss="modal"
          type="button"
          onClick={toggle}
        >
          <span aria-hidden={true}>×</span>
        </button>
      </div>
      <div className="modal-body">
        <div className="py-3 text-center">
          {showAlert && (
            <Alert color={alertColor}>
              <strong>{alertTitle}</strong> {errorMessage}
            </Alert>
          )}
          {isSaving ? (
            <div>
              <Spinner color="light" />
              <h4 className="heading mt-4">Salvando...</h4>
              <p>Aguarde enquanto os dados estão sendo salvos.</p>
            </div>
          ) : isSaved ? (
            <div>
              <i className="ni ni-bell-55 ni-3x" />
              <h4 className="heading mt-4">Denúncia Salva!</h4>
              <p>
                Se possível tire print ou anote também, pois se perdê-lo não
                poderá acompanhar sua denúncia.
                <br />
                Seu usuário e senha para acompanhamento da denuncia:
              </p>
              <p>
                <strong>Nome de Usuário:</strong> {username}
                <br />
                <strong>Senha:</strong> {password}
              </p>
              <Button
                color="default"
                type="button"
                onClick={handleCopy}
                disabled={isCopied}
              >
                Copiar
              </Button>
              <Link to="/login">
              <Button
                className="btn-white ml-auto"
                color="default"
                type="button"
                onClick={toggle}
              >
                Logar
              </Button>
              </Link>
            </div>
          ) : (
            <div>
              <i className="ni ni-bell-55 ni-3x" />
              <h4 className="heading mt-4">
                Você tem certeza que deseja finalizar a denúncia?
              </h4>
              <p>Se você finalizar, não poderá mudar as informações.</p>
            </div>
          )}
        </div>
      </div>
      <div className="modal-footer">
        {isSaving ? (
          <Button className="btn-white" color="default" type="button" disabled>
            Aguarde! Poderá demorar um pouco para salvar arquivos mais pesados...
          </Button>
        ) : isSaved ? null : (
          <>
            <Button
              className="btn-white"
              color="default"
              type="button"
              onClick={() => {
                submitAnswers();
              }}
            >
              Sim
            </Button>
            <Button
              className="btn-white ml-auto"
              color="default"
              type="button"
              onClick={toggle}
            >
              Não
            </Button>
          </>
        )}
      </div>
    </Modal>
  );
};

export default End;