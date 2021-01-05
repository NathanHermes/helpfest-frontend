import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { BsArrowLeftShort, BsPencilSquare } from "react-icons/bs";
import { RiPhoneLine, RiWhatsappLine } from "react-icons/ri";

import api from "../../../services/api";
import "./styles.css";

export default function DetalheEvento() {
  const [festa, setFesta] = useState("");

  const params = useParams("/:id");

  var email = localStorage.getItem("email");
  if(email === null) {
    email = sessionStorage.getItem("email");
}
  const id = params.id;

  useEffect(() => {
      
    api.get(`/festas/search/${id}`, {
        headers: {
          Authorization: email,
        },
      })
      .then(response => {
          setFesta(response.data[0]);
      });
  }, [email, id]);

  return (
    <div className="detalhe-evento-background">
      <main className="detalhe-evento-container">
        <header className="detalhe-evento-navbar animate-down">
          <Link to="/home">
            <BsArrowLeftShort
              color="var(--text-color)"
              size={75}
              className="mouse-hover"
            />
          </Link>

          <h1>DETALHE</h1>
        </header>
        <section key={id} className="detalhe-evento-card animate-up-2">
          <div className="detalhe-evento-capa">
            <img src={festa.url} alt="" />
            <h1>{festa.nome_festa}</h1>
          </div>

          <div className="detalhe-evento-info">
            <ul>
              <li>
                <strong>Data: </strong> {festa.data_festa}
              </li>
              <li>
                <strong>Horário: </strong> {festa.horario_inicio} às{" "}
                {festa.horario_fim}
              </li>
              <li>
                <strong>Local: </strong>
                <p> {festa.rua}, {festa.numero} {festa.cidade}/{festa.uf} </p>
              </li>
              <li>
                <strong>Convidados: </strong>
                <p>{festa.convidados}</p>
              </li>
            </ul>
            <div className="detalhe-evento-outros">
              <h2>Descrições adicionais</h2>
              <div className="detalhe-evento-panel">{festa.outros}</div>
            </div>
          </div>

          <div className="detalhe-evento-footer">
            <Link to={`/eventos/editar/${id}`} className="mouse-hover">
              <BsPencilSquare color="var(--text-color)" size={30} />
            </Link>

            <p>
              <span>
                <RiPhoneLine color="#282A36" size={15} /> {festa.telefone}
              </span>
              <span>
                <RiWhatsappLine color="#282A36" size={15} /> {festa.whatsapp}
              </span>
              <span>
                {festa.email_organizador}
              </span>
            </p>
          </div>
        </section>
      </main>
    </div>
  );
}
