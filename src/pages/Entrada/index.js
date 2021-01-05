import React from "react";
import { Link, useHistory } from "react-router-dom";

import "./styles.css";

import titleImg from "../../assets/title.svg";
import peoplesDancing from "../../assets/people_dancing_SVG.svg";

export default function Entrada() {
  const history = useHistory();

  const isLogado = () => {
    const email = localStorage.getItem('email');

    switch (email) {
      case null:
        history.push('/user/login');
        break;
      default:
        history.push('/home');
    }
  }
  
  return (
    <div id="entrada-background">
      <main className="entrada-container">
        <header>
          <img src={peoplesDancing} className="entrada-people-img animate-up" alt="Pessoas bançando"/>
          <img src={titleImg} className="titleHELPFSET animate-up" alt="HELPFEST" />
        </header>
        <section>
          <Link to="/user/cadastrar" className="animate-up animate-up-four mouse-hover">CADASTRAR</Link>
          <Link onClick={isLogado} to="#" className="animate-up animate-up-six mouse-hover">ENTRAR</Link>
        </section>
      </main>
    </div>
  );
}
