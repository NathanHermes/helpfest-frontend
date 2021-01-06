import React, { useState, useEffect } from "react";
import { Link, useHistory } from "react-router-dom";
import api from "../../services/api";

import { FiMenu, FiPlusCircle, FiLogOut, FiDelete } from "react-icons/fi";
import { FaUser } from "react-icons/fa";
import Swal from "sweetalert2";
import "./styles.css";

export default function Home() {
  const history = useHistory();

  var email = localStorage.getItem("email");
  if (email === null) {
    email = sessionStorage.getItem("email");

    if(email === null) {
      history.push("/");
    }
  }

  const [eventos, setEventos] = useState([]);
  
  const nome = localStorage.getItem("nome");

  useEffect(() => {
    api
      .get("/festas/index", {
        headers: {
          Authorization: email,
        },
      })
      .then((response) => {
        setEventos(response.data);
      });
  }, [email]);

  const handleLogout = () => {
    localStorage.clear();
    sessionStorage.clear();

    history.push("/");
  };

  const showDropdown = () => {
    var dropdown = document.getElementById("dropdown");

    if (dropdown.style.display === "") {
      dropdown.style.display = "flex";
    } else {
      document.getElementById("dropdown").style.display = "";
    }
  };

  const handleDeleteFesta = async (id) => {
    await Swal.fire({
      title: "Você tem certeza que deseja deletar esse evento?",
      text: "Esse evento será deletado definitivamente.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "var(--secondary-dark-color)",
      cancelButtonColor: "var(--secondary-light-color)",
      confirmButtonText: "Deletar",
    }).then((result) => {
      if (result.isConfirmed) {
        try {
          api.delete(`/festa/delete/${id}`, {
            headers: {
              Authorization: email,
            },
          });

          Swal.fire({
            position: "top-end",
            icon: "success",
            title: "Evento Deletado com sucesso!",
            showConfirmButton: false,
            timer: 1500,
          });

          setEventos(eventos.filter((evento) => evento.id !== id));
        } catch (err) {
          Swal.fire({
            icon: "error",
            title: "Oops...",
            text:
              "Não foi possivel deletar esse evento.\nTente novamente mais tarde.",
            confirmButtonColor: "var(--secondary-color)",
          });
        }
      }
    });
  };

  return (
    <div id="home-background">
      <main className="home-container">
        <header className="home-navbar animate-down">
          <div className="home-navbar-title">
            <h1>H E L P F E S T</h1>

            <p>
              Bem Vindo, <span>{nome}</span>
            </p>
          </div>

          <div className="home-dropdown">
            <div className="home-dropdown-dropdown animate-left" id="dropdown">
              <Link to="/user/perfil" className="mouse-hover">
                <FaUser color="var(--text-color)" size={25} /> P E R F I L
              </Link>

              <button
                type="button"
                className="mouse-hover"
                onClick={handleLogout}
              >
                <FiLogOut color="var(--text-color)" size={5} /> S A I R
              </button>
            </div>
            
            <button
              type="button"
              className="home-dropdown-btn mouse-hover"
              onClick={showDropdown}
            >
              <FiMenu color="var(--text-color)" size={60} className="menu" />
            </button>
          </div>
        </header>

        <section className="home-festas">
          <div className="home-festas-header">
            <h1>E V E N T O S</h1>

            <Link
              to="/eventos/cadastrar"
              className="home-btn-novo-evento mouse-hover"
            >
              <FiPlusCircle
                color="rgba(16, 14, 33, 1)"
                size={40}
                className="home-add"
              />
              NOVO EVENTO
            </Link>
          </div>

          <div className="home-festas-cards animate-up-2">
            <ul>
              {eventos.map((evento) => (
                <li key={evento.id} className="mouse-hover">
                  <Link to={`/eventos/detalhes/${evento.id}`}>
                    
                    <img src={evento.url} className="home-img-festa" alt="" />
                    <p>
                      <strong>{evento.nome_festa}</strong> - {evento.data_festa}
                    </p>
                  </Link>
                  <button
                    type="button"
                    onClick={() => handleDeleteFesta(evento.id)}
                    className="mouse-hover"
                  >
                    <FiDelete color="var(--text-color)" size={25} />
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </section>
      </main>
    </div>
  );
}
