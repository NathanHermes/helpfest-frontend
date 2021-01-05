import React, { useState } from "react";
import { Link, useHistory } from "react-router-dom";
import api from "../../../services/api";
import { mask } from "remask";

import { FiUser, FiHash, FiMail, FiPhone, FiUnlock } from "react-icons/fi";
import { FaWhatsapp, FaRoad, FaCity } from "react-icons/fa";
import { BsEye, BsEyeSlash } from "react-icons/bs";
import Swal from "sweetalert2";
import "./styles.css";

import peoplesDancing from "../../../assets/people_dancing_SVG.svg";

export default function CadastrarUsuario() {
  const history = useHistory();

  const mostrarSenha = () => {
    var senha = document.getElementById("user-senha");
    var eye = document.getElementById("user-cadastrar-eye-senha");
    var eyeSlash = document.getElementById("user-cadastrar-eyeslash-senha");

    if (senha.type === "password") {
      senha.type = "text";
      eye.style.display = "flex";
      eyeSlash.style.display = "none";
    } else {
      eyeSlash.style.display = "flex";
      eye.style.display = "none";
      eyeSlash.style.animationDelay = "0";
      senha.type = "password";
    }
  }

  const mostrarConfirmarSenha = () => {
    var confirmaSenha = document.getElementById(
      "user-cadastrar-confirmar-senha"
    );
    var eye = document.getElementById("user-cadastrar-eye-confirmar-senha");
    var eyeSlash = document.getElementById(
      "user-cadastrar-eyeslash-confirmar-senha"
    );

    if (confirmaSenha.type === "password") {
      confirmaSenha.type = "text";
      eye.style.display = "flex";
      eyeSlash.style.display = "none";
    } else {
      eyeSlash.style.display = "flex";
      eye.style.display = "none";
      confirmaSenha.type = "password";
    }
  }

  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [telefone, setTelefone] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [cnpj, setCnpj] = useState("");
  const [rua, setRua] = useState("");
  const [numero, setNumero] = useState("");
  const [cidade, setCidade] = useState("");
  const [uf, setUf] = useState("");
  const [password, setPassword] = useState("");
  const [confirmaSenha, setConfirmaSenha] = useState("");

  const handleRegistrar = async (e) => {
    e.preventDefault();

    if (password !== confirmaSenha) {
      document.getElementById("user-senha").style.border =
        "2px solid var(--secondary-dark-color)";
      document.getElementById("user-senha").value = "";
      document.getElementById("user-cadastrar-confirmar-senha").style.border =
        "2px solid var(--secondary-dark-color)";
      document.getElementById("user-cadastrar-confirmar-senha").value = "";

      return Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "As senhas não conhecidem, verifique-as e tente novamente.",
        confirmButtonColor: "var(--secondary-color)",
      });
    }

    const data = {
      nome,
      cnpj,
      email,
      telefone,
      whatsapp: `+55 ${whatsapp}`,
      rua,
      numero,
      cidade,
      uf,
      password,
    };

    try {
      const response = await api.post("organizador/create", data);

      Swal.fire({
        position: "top-end",
        icon: "success",
        title: response.data,
        showConfirmButton: false,
        timer: 1500,
      });

      history.push("/user/login");
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text:
          "Não foi possivel concluir o cadastro.\nJá existe uma instituição com esse email.",
        confirmButtonColor: "var(--secondary-color)",
      });
    }
  }

  return (
    <div id="user-cadastrar-background">
      <main className="user-cadastrar-container">
        <section className="user-cadastrar-ambiente">
          <img
            src={peoplesDancing}
            className="user-cadastrar-img animate-up animate-up-four"
            alt="Pessoas bançando"
          />

          <h1 className="animate-up animate-up-five">
            VENHA FAZER PARTE DA NOSSA FAMÍLIA!
          </h1>
        </section>

        <section className="user-cadastrar-form">
          <h1 className="animate-up">C A D A S T R O </h1>

          <form onSubmit={handleRegistrar}>
            <div className="user-cadastrar-group-inputs animate-up animate-up-one">
              <div className="user-cadastrar-input">
                <label htmlFor="user-nome">
                  <FiUser color="rgba(16, 14, 33, 1)" size={25} />
                </label>

                <input
                  id="user-nome"
                  placeholder="Digite o nome"
                  value={nome}
                  onChange={(e) => setNome(e.target.value)}
                />
              </div>

              <div className="user-cadastrar-input">
                <label htmlFor="user-email">
                  <FiMail color="rgba(16, 14, 33, 1)" size={25} />
                </label>

                <input
                  id="email-email"
                  type="email"
                  placeholder="Digite o email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            <div className="user-cadastrar-group-inputs animate-up animate-up-one">
              <div className="user-cadastrar-input">
                <label htmlFor="user-telefone">
                  <FiPhone color="rgba(16, 14, 33, 1)" size={25} />
                </label>

                <input
                  id="user-telefone"
                  placeholder="Digite o telefone"
                  value={telefone}
                  onChange={(e) =>
                    setTelefone(mask(e.target.value, ["(99) 99999-9999"]))
                  }
                />
              </div>

              <div className="user-cadastrar-input">
                <label htmlFor="user-whatsapp">
                  <FaWhatsapp color="rgba(16, 14, 33, 1)" size={25} />
                </label>

                <input
                  id="user-whatsapp"
                  placeholder="Digite o whatsapp"
                  value={whatsapp}
                  onChange={(e) =>
                    setWhatsapp(mask(e.target.value, ["(99) 99999-9999"]))
                  }
                />
              </div>
            </div>

            <div className="user-cadastrar-group-inputs animate-up animate-up-two">
              <div className="user-cadastrar-input " id="false">
                <label htmlFor="user-cnpj">
                  <FiHash color="rgba(16, 14, 33, 1)" size={25} />
                </label>

                <input
                  id="user-cnpj"
                  placeholder="Digite o cnpj"
                  value={cnpj}
                  onChange={(e) =>
                    setCnpj(mask(e.target.value, ["99.999.999/9999-99"]))
                  }
                />
              </div>
            </div>

            <div className="user-cadastrar-group-inputs animate-up animate-up-two">
              <div className="user-cadastrar-input">
                <label htmlFor="-user-rua">
                  <FaRoad color="rgba(16, 14, 33, 1)" size={25} />
                </label>

                <input
                  id="user-rua"
                  placeholder="Digite a rua"
                  value={rua}
                  onChange={(e) => setRua(e.target.value)}
                />
              </div>

              <div className="user-cadastrar-input">
                <label htmlFor="user-numero">
                  <strong>Nº</strong>
                </label>

                <input
                  id="user-numero"
                  placeholder="Digite o numero"
                  type="number"
                  value={numero}
                  onChange={(e) => setNumero(e.target.value)}
                />
              </div>
            </div>

            <div className="user-cadastrar-group-inputs animate-up animate-up-three">
              <div className="user-cadastrar-input">
                <label htmlFor="user-cidade">
                  <FaCity color="rgba(16, 14, 33, 1)" size={25} />
                </label>

                <input
                  id="user-cidade"
                  placeholder="Digite a cidade"
                  value={cidade}
                  onChange={(e) => setCidade(e.target.value)}
                />
              </div>

              <div className="user-cadastrar-input">
                <label htmlFor="user-uf">
                  <strong>UF</strong>
                </label>

                <input
                  id="user-uf"
                  placeholder="Digite o uf"
                  value={uf}
                  onChange={(e) => setUf(e.target.value)}
                />
              </div>
            </div>

            <div className="user-cadastrar-group-inputs animate-up animate-up-three">
              <div className="user-cadastrar-input">
                <label htmlFor="user-senha">
                  <FiUnlock color="rgba(16, 14, 33, 1)" size={25} />
                </label>

                <input
                  type="password"
                  id="user-senha"
                  placeholder="Digite a senha"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />

                <button
                  type="button"
                  className="user-cadastrar-eye-btn"
                  onClick={mostrarSenha}
                >
                  <BsEye
                    color="#8F8F97"
                    id="user-cadastrar-eye-senha"
                    size={30}
                  />

                  <BsEyeSlash
                    color="#8F8F97"
                    id="user-cadastrar-eyeslash-senha"
                    size={30}
                  />
                </button>
              </div>

              <div className="user-cadastrar-input">
                <label
                  htmlFor="user-cadastrar-confirmar-senha"
                  className="mg-left"
                >
                  <FiUnlock color="rgba(16, 14, 33, 1)" size={25} />
                </label>

                <input
                  type="password"
                  id="user-cadastrar-confirmar-senha"
                  placeholder="Digite a senha"
                  value={confirmaSenha}
                  onChange={(e) => setConfirmaSenha(e.target.value)}
                />

                <button
                  type="button"
                  className="user-cadastrar-eye-btn"
                  onClick={mostrarConfirmarSenha}
                >
                  <BsEye
                    color="#8F8F97"
                    id="user-cadastrar-eye-confirmar-senha"
                    display="none"
                    size={30}
                  />

                  <BsEyeSlash
                    color="#8F8F97"
                    id="user-cadastrar-eyeslash-confirmar-senha"
                    size={30}
                  />
                </button>
              </div>
            </div>

            <button className="animate-up animate-up-four mouse-hover" type="submit">
              C A D A S T R A R
            </button>
          </form>

          <p className="animate-up animate-up-four">
            Já possui cadastro? <br />
            <Link to="/user/login">Entre agora mesmo</Link>
          </p>
        </section>
      </main>
    </div>
  );
}
