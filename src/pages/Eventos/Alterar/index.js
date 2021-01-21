import React, { useState, useEffect } from "react";
import { Link, useHistory, useParams } from "react-router-dom";
import { uniqueId } from "lodash";
import filesize from "filesize";
import api from "../../../services/api";
import { BsArrowLeftShort, BsPencil } from "react-icons/bs";
import Swal from "sweetalert2";
import { parseISO, format } from "date-fns";

import Dropzone from "react-dropzone";
import {
  DropContainer,
  UploadMessage,
} from "../../../components/Upload/styles";
import FileList from "../../../components/FileList";

import "./styles.css";

export default function AlterarEvento() {
  const [festa, setFesta] = useState("");

  const params = useParams("/:id");
  const id = params.id;

  const [uploadedFiles, setUploadedFiles] = useState([]);

  const [nome_festa, setNomeFesta] = useState("");
  const [dataEvento, setDataEvento] = useState("");
  const [horario_inicio, setHorarioInicio] = useState("");
  const [horario_fim, setHorarioFim] = useState("");
  const [rua, setRua] = useState("");
  const [numero, setNumero] = useState("");
  const [cidade, setCidade] = useState("");
  const [uf, setUf] = useState("");
  const [convidados, setConvidados] = useState("");
  const [outros, setOutros] = useState("");

  const history = useHistory();

  var email = localStorage.getItem("email");
  if (email === null) {
    email = sessionStorage.getItem("email");
  }

  useEffect(() => {
    api
      .get(`/festas/search/${id}`, {
        headers: {
          Authorization: email,
        },
      })
      .then((response) => {
        setFesta(response.data[0]);
      });
  }, [email, id]);

  function handleInput(e) {
    const input = document.getElementById(`alterar-${e.target.id}`);
    const button = document.getElementById(e.target.id);

    if (e.target.id === "evento-data") {
      input.type = "date";
    } else if (
      e.target.id === "evento-horario-inicio" ||
      e.target.id === "evento-horario-fim"
    ) {
      input.type = "time";
    }

    if (input !== null) {
      input.removeAttribute("disabled");
      button.style.display = "none";
    }
  }

  const handleUpload = (files) => {
    const uploadedFile = files.map((file) => ({
      file,
      id: uniqueId(),
      name: file.name,
      readableSize: filesize(file.size),
      preview: URL.createObjectURL(file),
      progress: 0,
      uploaded: false,
      error: false,
      url: null,
    }));

    setUploadedFiles(uploadedFiles.concat(uploadedFile));
  };

  function renderDragMessage(isDragActive, isDragReject) {
    if (!isDragActive) {
      return <UploadMessage>Arraste um arquivo aqui ...</UploadMessage>;
    }
    if (isDragReject) {
      return <UploadMessage type="error">Arquivo não suportado </UploadMessage>;
    }

    return (
      <UploadMessage type="success">Solte os aquivos aqui ...</UploadMessage>
    );
  }

  async function handleAlterar(e) {
    e.preventDefault();

    var data_evento = "";
    const data = new FormData();

    if (nome_festa === "") {
      data.append("nome_festa", festa.nome_festa);
    } else {
      data.append("nome_festa", nome_festa);
    }
    if (dataEvento !== "") {
      const parsedDate = parseISO(dataEvento);
      data_evento = format(parsedDate, "dd/MM/yyyy");
      data.append("data_evento", data_evento);
    } else {
      data.append("data_evento", festa.data_evento);
    }
    if (horario_inicio === "") {
      data.append("horario_inicio", festa.horario_inicio);
    } else {
      data.append("horario_inicio", horario_inicio);
    }
    if (horario_fim === "") {
      data.append("horario_fim", festa.horario_fim);
    } else {
      data.append("horario_fim", horario_fim);
    }
    if (convidados === "") {
      data.append("convidados", festa.convidados);
    } else {
      data.append("convidados", convidados);
    }
    if (outros === "") {
      data.append("outros", festa.outros);
    } else {
      data.append("outros", outros);
    }
    if (rua === "") {
      data.append("rua", festa.rua);
    } else {
      data.append("rua", rua);
    }
    if (numero === "") {
      data.append("numero", festa.numero);
    } else {
      data.append("numero", numero);
    }
    if (cidade === "") {
      data.append("cidade", festa.cidade);
    } else {
      data.append("cidade", cidade);
    }
    if (uf === "") {
      data.append("uf", festa.uf);
    } else {
      data.append("uf", uf);
    }

    const imgurFile = new FormData();

    if (uploadedFiles.length !== 0) {
      data.append("file", uploadedFiles[0].file, uploadedFiles[0].name);
      imgurFile.append("image", uploadedFiles[0].file);
    }

    try {
      if (uploadedFiles.length !== 0) {
        var imgURL = "";
        await fetch("https://api.imgur.com/3/image/", {
          method: "post",
          headers: {
            Authorization: "Client-ID 6563c4d48628124",
          },
          body: imgurFile,
        }).then((imgur) =>
          imgur.json().then((imgur) => {
            imgURL = imgur.data.link;
          })
        );

        data.append("imgurURL", imgURL);
      }
      
      await api.put(`/festa/update/${id}`, data, {
        headers: {
          Authorization: email,
        },
      });

      Swal.fire({
        position: "top-end",
        icon: "success",
        title: "Evento editado com sucesso!",
        showConfirmButton: false,
        timer: 1500,
      });

      history.push(`/eventos/detalhes/${id}`);
    } catch {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Não foi possivel editar do evento.\nTente novamente mais tarde.",
        confirmButtonColor: "#4C83BF",
      });
    }
  }

  return (
    <div id="alterar-evento-background">
      <main className="alterar-evento-container">
        <header className="alterar-evento-navbar animate-up">
          <Link to={`/eventos/detalhes/${id}`}>
            <BsArrowLeftShort
              color="rgba(16, 14, 33, 1)"
              size={75}
              className="mouse-hover"
            />
          </Link>

          <h1>ALTERAR</h1>
        </header>

        <section className="alterar-evento-card animate-up-2">
          <form onSubmit={handleAlterar}>
            <div className="alterar-evento-upload">
              {!!uploadedFiles.length || (
                <Dropzone accept="image/*" onDropAccepted={handleUpload}>
                  {({
                    getRootProps,
                    getInputProps,
                    isDragActive,
                    isDragReject,
                  }) => (
                    <DropContainer
                      {...getRootProps()}
                      isDragActive={isDragActive}
                      isDragReject={isDragReject}
                    >
                      <input
                        {...getInputProps()}
                        id="alterar-evento-img"
                        disabled
                      />
                      {renderDragMessage(isDragActive, isDragReject)}
                    </DropContainer>
                  )}
                </Dropzone>
              )}

              {!!uploadedFiles.length && <FileList files={uploadedFiles} />}
              <button
                type="button"
                className="btn-editar"
                id="evento-img"
                onClick={handleInput}
              >
                <BsPencil
                  id="evento-img"
                  color="rgba(255, 164, 196, 1)"
                  size={25}
                />
              </button>
            </div>

            <div className="alterar-evento-group-input">
              <label htmlFor="alterar-evento-nome">Nome: </label>

              <div className="alterar-evento-input">
                <input
                  id="alterar-evento-nome"
                  placeholder={festa.nome_festa}
                  type="text"
                  value={nome_festa}
                  onChange={(e) => setNomeFesta(e.target.value)}
                  disabled
                />
                <button
                  type="button"
                  className="btn-editar"
                  id="evento-nome"
                  onClick={handleInput}
                >
                  <BsPencil
                    id="evento-nome"
                    color="rgba(255, 164, 196, 1)"
                    size={25}
                  />
                </button>
              </div>
            </div>

            <div className="alterar-evento-group-input">
              <label htmlFor="alterar-evento-data">Data: </label>

              <div className="alterar-evento-input">
                <input
                  id="alterar-evento-data"
                  type="text"
                  placeholder={festa.data_festa}
                  value={dataEvento}
                  onChange={(e) => setDataEvento(e.target.value)}
                  disabled
                />
                <button
                  type="button"
                  className="btn-editar"
                  id="evento-data"
                  onClick={handleInput}
                >
                  <BsPencil
                    id="evento-data"
                    color="rgba(255, 164, 196, 1)"
                    size={25}
                  />
                </button>
              </div>
            </div>

            <div className="alterar-evento-group-input">
              <label>Horário: </label>

              <div className="alterar-evento-input">
                <input
                  id="alterar-evento-horario-inicio"
                  type="text"
                  placeholder={festa.horario_inicio}
                  value={horario_inicio}
                  onChange={(e) => setHorarioInicio(e.target.value)}
                  disabled
                />
                <button
                  type="button"
                  className="btn-editar"
                  id="evento-horario-inicio"
                  onClick={handleInput}
                >
                  <BsPencil
                    id="evento-horario-inicio"
                    color="rgba(255, 164, 196, 1)"
                    size={25}
                  />
                </button>

                <span>às</span>

                <input
                  id="alterar-evento-horario-fim"
                  type="text"
                  placeholder={festa.horario_fim}
                  value={horario_fim}
                  onChange={(e) => setHorarioFim(e.target.value)}
                  disabled
                />
                <button
                  type="button"
                  className="btn-editar"
                  id="evento-horario-fim"
                  onClick={handleInput}
                >
                  <BsPencil
                    id="evento-horario-fim"
                    color="rgba(255, 164, 196, 1)"
                    size={25}
                  />
                </button>
              </div>
            </div>

            <div className="alterar-evento-group-input-localizacao">
              <div className="alterar-evento-group-input">
                <label>Rua: </label>
                <div className="alterar-evento-input">
                  <input
                    id="alterar-evento-rua"
                    placeholder={festa.rua}
                    type="text"
                    value={rua}
                    onChange={(e) => setRua(e.target.value)}
                    disabled
                  />
                  <button
                    type="button"
                    className="btn-editar"
                    id="evento-rua"
                    onClick={handleInput}
                  >
                    <BsPencil
                      id="evento-rua"
                      color="rgba(255, 164, 196, 1)"
                      size={25}
                    />
                  </button>
                </div>
              </div>

              <div className="alterar-evento-group-input">
                <label>Número: </label>
                <div className="alterar-evento-input">
                  <input
                    id="alterar-evento-numero"
                    placeholder={festa.numero}
                    type="number"
                    value={numero}
                    onChange={(e) => setNumero(e.target.value)}
                    disabled
                  />
                  <button
                    type="button"
                    className="btn-editar"
                    id="evento-numero"
                    onClick={handleInput}
                  >
                    <BsPencil
                      id="evento-numero"
                      color="rgba(255, 164, 196, 1)"
                      size={25}
                    />
                  </button>
                </div>
              </div>
            </div>

            <div className="alterar-evento-group-input-localizacao">
              <div className="alterar-evento-group-input">
                <label>Cidade: </label>
                <div className="alterar-evento-input">
                  <input
                    id="alterar-evento-cidade"
                    placeholder={festa.cidade}
                    type="text"
                    value={cidade}
                    onChange={(e) => setCidade(e.target.value)}
                    disabled
                  />
                  <button
                    type="button"
                    className="btn-editar"
                    id="evento-cidade"
                    onClick={handleInput}
                  >
                    <BsPencil
                      id="evento-cidade"
                      color="rgba(255, 164, 196, 1)"
                      size={25}
                    />
                  </button>
                </div>
              </div>

              <div className="alterar-evento-group-input">
                <label>Uf: </label>
                <div className="alterar-evento-input">
                  <input
                    id="alterar-evento-uf"
                    placeholder={festa.uf}
                    type="text"
                    value={uf}
                    onChange={(e) => setUf(e.target.value)}
                    disabled
                  />
                  <button
                    type="button"
                    className="btn-editar"
                    id="evento-uf"
                    onClick={handleInput}
                  >
                    <BsPencil
                      id="evento-uf"
                      color="rgba(255, 164, 196, 1)"
                      size={25}
                    />
                  </button>
                </div>
              </div>
            </div>

            <div className="alterar-evento-group-input">
              <label>Celebridades: </label>

              <div className="alterar-evento-input">
                <input
                  id="alterar-evento-celebridades"
                  type="text"
                  placeholder={festa.convidados}
                  value={convidados}
                  onChange={(e) => setConvidados(e.target.value)}
                  disabled
                />
                <button
                  type="button"
                  className="btn-editar"
                  id="evento-celebridades"
                  onClick={handleInput}
                >
                  <BsPencil
                    id="evento-celebridades"
                    color="rgba(255, 164, 196, 1)"
                    size={25}
                  />
                </button>
              </div>
            </div>

            <div className="alterar-evento-group-input">
              <h2>O U T R O S</h2>

              <div className="alterar-evento-textarea">
                <textarea
                  name="textarea"
                  id="alterar-evento-outros"
                  cols="30"
                  rows="8"
                  placeholder={festa.outros}
                  value={outros}
                  onChange={(e) => setOutros(e.target.value)}
                  disabled
                ></textarea>
                <button
                  type="button"
                  className="btn-editar"
                  id="evento-outros"
                  onClick={handleInput}
                >
                  <BsPencil
                    id="evento-outros"
                    color="rgba(255, 164, 196, 1)"
                    size={25}
                  />
                </button>
              </div>
            </div>

            <div className="alterar-evento-btn">
              <button className="mouse-hover" type="submit">
                ALTERAR INFORMAÇÕES
              </button>
            </div>
          </form>
        </section>
      </main>
    </div>
  );
}
