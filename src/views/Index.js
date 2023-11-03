import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Chart from "chart.js";
import { app } from "services/firebaseConfig.js";
import { chartOptions, parseOptions } from "variables/charts.js";
import { doc, getDoc, getFirestore } from "firebase/firestore";
import Header from "components/Headers/HeaderHome.js";
import {
  Col,
  CardBody,
  Form,
  Card,
  CardHeader,
  Table,
  Container,
  Row,
} from "reactstrap";

const Index = (props) => {
  const { incidentId } = useParams();
  const [incidentData, setIncidentData] = useState(null);

  useEffect(() => {
    fetchIncidentData(incidentId);
  }, [incidentId]);

  if (window.Chart) {
    parseOptions(Chart, chartOptions());
  }

  const fetchIncidentData = async (incidentId) => {
    try {
      const db = getFirestore(app);
      const incidentRef = doc(db, "incident", incidentId);
      const incidentSnapshot = await getDoc(incidentRef);

      if (incidentSnapshot.exists()) {
        const data = incidentSnapshot.data();
        setIncidentData(data);
      } else {
        console.log(`Incident with ID ${incidentId} not found.`);
      }
    } catch (error) {
      console.error("Error fetching incident data:", error);
    }
  };

  const renderPerguntasERespostas = () => {
    const perguntas = incidentData?.pergunta || [];
    const respostas = incidentData?.resposta || [];
  
    return perguntas.map((pergunta, index) => (
      <tr key={index}>
        <td style={{ whiteSpace: 'normal', textJustify: 'inter-word' }}>{pergunta}</td>
        <td className="text-center align-middle" style={{ whiteSpace: 'normal', textJustify: 'inter-word' }}>
          {respostas[index].startsWith("https://firebasestorage.googleapis.com") ? (
            <a
              href={respostas[index]}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-default btn-sm"
            >
              Abrir arquivo
            </a>
          ) : (
            <span style={{ whiteSpace: 'normal', textAlign: 'justify', textJustify: 'inter-word' }}>{respostas[index]}</span>
          )}
        </td>
      </tr>
    ));
  };

  return (
    <>
      <Header />
      <Container className="mt--7" fluid>
        <Row>
          <Col className="order-xl-1" xl="12">
            <Card className="bg-secondary shadow">
              <CardHeader className="bg-white border-0">
                <Row className="border-0 d-flex justify-content-between">
                  <Col xs="8">
                    <h2 className="text-dark px-4">
                    Informações para incidente: {incidentData?.referencia}
                    </h2>
                  </Col>
                </Row>
              </CardHeader>
              <CardBody>
                <Form>
                  <div className="pl-lg-4">
                    <Row>
                      <Col lg="3">
                        <label
                          className="form-control-label"
                          htmlFor="input-email"
                        >
                          Data de abertura: {incidentData?.data_criacao}
                        </label>
                      </Col>
                      <Col lg="3">
                        <label
                          className="form-control-label"
                          htmlFor="input-email"
                        >
                          Status:{" "}
                          <span
                            className={`${
                              incidentData?.status === 0
                                ? "text-danger"
                                : incidentData?.status === 1
                                ? "text-info"
                                : incidentData?.status === 2
                                ? "text-success"
                                : ""
                            }`}
                          >
                            {incidentData?.status === 0
                              ? "Aguardando"
                              : incidentData?.status === 1
                              ? "Analisando"
                              : incidentData?.status === 2
                              ? "Finalizado"
                              : "N/A"}
                          </span>
                        </label>
                      </Col>
                      <Col lg="4">
                        <label
                          className="form-control-label"
                          htmlFor="input-email"
                        >
                          Dia:{" "}
                          {incidentData?.finalizado
                            ? incidentData.finalizado
                                .toDate()
                                .toLocaleDateString()
                            : "N/A"}
                        </label>
                      </Col>
                    </Row>
                  </div>
                  <hr className="my-4" />
                  <div className="pl-lg-4">
                    <Row>
                      <div className="col">
                        <Card className="shadow">
                          <CardHeader className="border-0 d-flex justify-content-between align-items-center">
                            <h3 className="mb-0">Perguntas e Respostas</h3>
                          </CardHeader>
                          <Table
                            className="align-items-center table-flush"
                            responsive
                          >
                            <thead className="text-center thead-light">
                              <tr>
                                <th scope="col">Pergunta</th>
                                <th scope="col">Resposta</th>
                              </tr>
                            </thead>
                            <tbody className="text-center">
                              {renderPerguntasERespostas()}
                            </tbody>
                          </Table>
                        </Card>
                      </div>
                    </Row>
                  </div>
                  <hr className="my-4" />
                </Form>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default Index;
