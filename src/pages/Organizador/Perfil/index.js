import React, { useState, useEffect } from "react";
import { Link, useHistory } from "react-router-dom";

import { BsArrowLeftShort } from "react-icons/bs";
import Swal from "sweetalert2";

import api from "../../../services/api";
import "./styles.css";

export default function Perfil() {
  const [organizador, setOrganizador] = useState("");
  const [file, setFile] = useState([]);

  const history = useHistory();

  var email = localStorage.getItem("email");
  if (email === null) {
    email = sessionStorage.getItem("email");
  }

  useEffect(() => {
    api
      .get(`/organizador/search`, {
        headers: {
          Authorization: email,
        },
      })
      .then((response) => {
        setOrganizador(response.data.organizador[0]);
        setFile(response.data.files_organizador[0]);
      });
  }, [email]);

  const handleDeleteOrganizador = async (e) => {
    e.preventDefault();

    await Swal.fire({
      title: "Você tem certeza que deseja deletar sua conta?",
      text: "Essa conta será deletada definitivamente.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "var(--secondary-dark-color)",
      cancelButtonColor: "var(--secondary-light-color)",
      confirmButtonText: "Deletar",
    }).then((result) => {
      if (result.isConfirmed) {
        try {
          api.delete(`/organizador/delete`, {
            headers: {
              Authorization: email,
            },
          });

          Swal.fire({
            position: "top-end",
            icon: "success",
            title: "Conta detetada com sucesso!",
            showConfirmButton: false,
            timer: 1500,
          });

          history.push("/");
        } catch (err) {
          Swal.fire({
            icon: "error",
            title: "Oops...",
            text:
              "Não foi possivel deletar essa conta.\nTente novamente mais tarde.",
            confirmButtonColor: "var(--secondary-color)",
          });
        }
      }
    });
  };

  return (
    <div className="user-background">
      <main className="user-container">
        <header className="user-navbar animate-down">
          <Link to="/home">
            <BsArrowLeftShort
              color="var(--text-color)"
              size={75}
              className="mouse-hover"
            />
          </Link>

          <h1>PERFIL</h1>
        </header>

        <section className="user-card animate-up-2">
          <div className="user-card-header">
            <img src={file.url} alt="Foto do organizador" />

            <div className="user-card-header-descricao">
              <h1>{organizador.nome}</h1>

              <div className="perfil-email">
                <p>
                  <strong>Email: </strong> {email}
                </p>
              </div>
            </div>
          </div>

          <div className="user-card-descricao">
            <ul>
              <li>
                <strong>Telefone: </strong> {organizador.telefone}
              </li>

              <li>
                <strong>Whatsapp: </strong> {organizador.whatsapp}
              </li>

              <li>
                <strong>Rua: </strong> {organizador.rua}, {organizador.numero}
              </li>

              <li>
                <strong>Cidade: </strong> {organizador.cidade} / {organizador.uf}
              </li>
            </ul>
          </div>

          <div className="user-card-footer">
            <Link className="mouse-hover" to="/user/editar">
              EDITAR
            </Link>

            <button
              onClick={handleDeleteOrganizador}
              type="button"
              className="mouse-hover"
            >
              DELETAR
            </button>
          </div>
        </section>
      </main>
    </div>
  );
}
