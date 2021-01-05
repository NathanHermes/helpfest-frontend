import React, { useState } from "react";
import { Link, useHistory } from "react-router-dom";
import api from "../../../services/api";

import { FiMail, FiUnlock } from "react-icons/fi";
import { BsEye, BsEyeSlash } from "react-icons/bs";
import Swal from "sweetalert2";
import "./styles.css";

import peoplesDancing from "../../../assets/people_dancing_SVG.svg";

export default function Login() {
  const history = useHistory();

  const mostrarSenha = () => {
    var tipo = document.getElementById("user-logar-senha");
    var eye = document.getElementById("user-logar-eye");
    var eyeSlash = document.getElementById("user-logar-eyeslash");

    if (tipo.type === "password") {
      tipo.type = "text";
      eye.style.display = "flex";
      eyeSlash.style.display = "none";
    } else {
      eyeSlash.style.display = "flex";
      eye.style.display = "none";
      tipo.type = "password";
    }
  }

  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");

  const isLogado = () => {
    localStorage.setItem("email", email);
  }

  const handleLogin = async (e) => {
    e.preventDefault();

    const data = {
      email,
      senha,
    };

    try {
      const response = await api.post("session/create", data);

      localStorage.setItem("nome", response.data);
      sessionStorage.setItem("email", email);

      history.push("/home");
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text:
          "Não foi possivel concluir o login.\nVerifique o email e/ou a senha e tente novamente.",
        confirmButtonColor: "var(--secondary-color)",
      });
    }
  }
  return (
    <div id="user-logar-background">
      <main className="user-logar-container">
        <section className="user-logar-ambiente">
          <img
            src={peoplesDancing}
            className="user-logar-img animate-up"
            alt="Pessoas dançando"
          />
          <h1 className="animate-up">HELPFEST, SEMPRE NOS DIVERTINDO COM VOCÊ!</h1>
        </section>

        <section className="user-logar-form">
          <form onSubmit={handleLogin}>
            <h1 className="animate-up">ENTRAR</h1>

            <div className="user-logar-group-input animate-up animate-up-one">
              <label htmlFor="user-logar-email">
                <FiMail color="var(--text-color)" size={25} />
              </label>

              <input
                id="user-logar-email"
                type="email"
                placeholder="Digite o email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="user-logar-group-input animate-up animate-up-two">
              <label htmlFor="user-logar-senha">
                <FiUnlock color="var(--text-color)" size={25} />
              </label>

              <input
                id="user-logar-senha"
                type="password"
                placeholder="Digite a senha"
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
              />

              <button
                type="button"
                className="user-logar-btn-eye"
                onClick={mostrarSenha}
              >
                <BsEye color="#8F8F97" id="user-logar-eye" size={25} />
                <BsEyeSlash
                  color="#8F8F97"
                  id="user-logar-eyeslash"
                  size={25}
                />
              </button>
            </div>

            <div className="user-logar-checkbox animate-up animate-up-three">
              <input onChange={isLogado} type="checkbox" />
              <label>Manter-me online</label>
            </div>

            <button
              type="submit"
              className="user-logar-btn animate-up animate-up-four mouse-hover"
            >
              E N T R A R
            </button>

            <p className="animate-up animate-up-five">
              Ainda não tem uma conta? <br />
              <Link to="/user/cadastrar" className="mouse-hover" href="#">
                Cadastre-se já
              </Link>
            </p>
          </form>
        </section>
      </main>
    </div>
  );
}
