import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";

import "assets/plugins/nucleo/css/nucleo.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
import "assets/scss/argon-dashboard-react.scss";

import AdminLayout from "layouts/Admin.js";
import Home from "views/login/Home.js";
import Login from "views/login/Login.js";
import Question from "views/questions/Forms.js";

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <BrowserRouter>
    <Routes>
      {/* Rota para a página de login como rota raiz */}
      <Route path="/*" element={<Home />} />
      {/* Caminho para a página de Login */}
      <Route path="/login" element={<Login />} />
      {/* Caminho para a página de formulario */}
      <Route path="/question" element={<Question />} />
      {/* Rota para o layout de admin */}
      <Route path="/admin/*" element={<AdminLayout />} />
      {/* Rota padrão redireciona para a página de login */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  </BrowserRouter>
);