import React, { useState } from "react";
import { Link, useHistory } from "react-router-dom";
import { uniqueId } from "lodash";
import filesize from "filesize";
import api from "../../../services/api";
import Dropzone from "react-dropzone";
import { DropContainer, UploadMessage } from "../../../components/Upload/styles";
import FileList from "../../../components/FileList";

import { BsArrowLeftShort } from "react-icons/bs";
import Swal from "sweetalert2";
import { parseISO, format } from "date-fns";
import "./styles.css";

export default function CriarEvento() {
  const renderDragMessage = (isDragActive, isDragReject) => {
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

  const handleDelete = async (id) => {
    setUploadedFiles(uploadedFiles.filter((file) => file.id !== id));
  };

  const handleCriarEvento = async (e) => {
    e.preventDefault();

    if (uploadedFiles.length === 0) {
      return Swal.fire({
        icon: "error",
        title: "Oops...",
        text:
          "Não foi possivel criar o evento.\nColoque uma imagem no campo e tente novamente.",
        confirmButtonColor: "var(--secondary-color)",
      });
    }

    var email = localStorage.getItem("email");
    if (email === null) {
      email = sessionStorage.getItem("email");
    }

    const parsedDate = parseISO(dataEvento);

    const data_festa = format(parsedDate, "dd/MM/yyyy");

    const data = new FormData();

    data.append('nome_festa', nome_festa);
    data.append('data_festa', data_festa);
    data.append('horario_inicio', horario_inicio);
    data.append('horario_fim', horario_fim);
    data.append('convidados', convidados);
    data.append('outros', outros);
    data.append('rua', rua);
    data.append('numero', numero);
    data.append('cidade', cidade);
    data.append('uf', uf);

    data.append('file', uploadedFiles[0].file, uploadedFiles[0].name);

    try {
      await api.post("/festa/create", data,{
        headers: {
          Authorization: email,
        },
  
      });

      Swal.fire({
        position: "top-end",
        icon: "success",
        title: "Evento cadastro com sucesso!",
        showConfirmButton: false,
        timer: 1500,
      });

      history.push("/home");
    } catch {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text:
          "Não foi possivel concluir a criação do evento.\nTente novamente mais tarde.",
        confirmButtonColor: "#4C83BF",
      });
    }
  }

  return (
    <div id="criar-evento-background">
      <main className="criar-evento-container">
        <header className="criar-evento-navbar animate-up">
          <Link to="/home">
            <BsArrowLeftShort
              color="var(--text-color)"
              size={75}
              className="mouse-hover"
            />
          </Link>

          <h1>CRIAR</h1>
        </header>

        <section className="criar-evento-card animate-up-2">
          <form onSubmit={handleCriarEvento}>
            <div className="criar-evento-upload">
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
                      <input {...getInputProps()} />
                      {renderDragMessage(isDragActive, isDragReject)}
                    </DropContainer>
                  )}
                </Dropzone>
              )}

              {!!uploadedFiles.length && (
                <FileList files={uploadedFiles} onDelete={handleDelete} />
              )}
            </div>

            <div className="criar-evento-input">
              <strong htmlFor="criar-evento-nome">Nome: </strong>
              <input
                id="criar-evento-nome"
                placeholder="Digite o nome do evento"
                type="text"
                value={nome_festa}
                onChange={(e) => setNomeFesta(e.target.value)}
              />
            </div>

            <div className="criar-evento-input">
              <strong htmlFor="criar-evento-data">Data: </strong>
              <input
                id="criar-evento-data"
                type="date"
                value={dataEvento}
                onChange={(e) => setDataEvento(e.target.value)}
              />
            </div>

            <div className="criar-evento-input">
              <strong htmlFor="criar-evento-horario">Horário: </strong>
              <div className="criar-evento-input-horario" id="criar-evento-horario">
                <input
                  id="horario-inicio"
                  type="time"
                  value={horario_inicio}
                  onChange={(e) => setHorarioInicio(e.target.value)}
                />

                <span>às</span>

                <input
                  id="horario-fim"
                  type="time"
                  value={horario_fim}
                  onChange={(e) => setHorarioFim(e.target.value)}
                />
              </div>
            </div>

            <div className="criar-evento-localizacao">
              <div className="criar-evento-input">
                <strong htmlFor="criar-evento-rua">Rua: </strong>
                <input
                  id="criar-evento-rua"
                  placeholder="Digite a rua do evento"
                  type="text"
                  value={rua}
                  onChange={(e) => setRua(e.target.value)}
                />
              </div>

              <div className="criar-evento-input">
                <strong htmlFor="criar-evento-numero">Número: </strong>
                <input
                  id="criar-evento-numero"
                  placeholder="Número"
                  type="number"
                  value={numero}
                  onChange={(e) => setNumero(e.target.value)}
                />
              </div>
            </div>

            <div className="criar-evento-localizacao">
              <div className="criar-evento-input">
                <strong htmlFor="criar-evento-cidade">Cidade: </strong>
                <input
                  id="criar-evento-cidade"
                  placeholder="Digite a cidade do evento"
                  type="text"
                  value={cidade}
                  onChange={(e) => setCidade(e.target.value)}
                />
              </div>

              <div className="criar-evento-input">
                <strong htmlFor="criar-evento-uf">UF: </strong>
                <input
                  id="criar-evento-uf"
                  placeholder="UF"
                  type="text"
                  value={uf}
                  onChange={(e) => setUf(e.target.value)}
                />
              </div>
            </div>

            <div className="criar-evento-input">
              <strong htmlFor="criar-evento-celebridades">Celebridades: </strong>
              <input
                id="criar-evento-celebridades"
                type="text"
                placeholder="Digite aqui as celebridades"
                value={convidados}
                onChange={(e) => setConvidados(e.target.value)}
              />
            </div>

            <div className="criar-evento-textarea">
              <h2>O U T R O S</h2>
              <textarea
                name="textarea"
                id="criar-evento-descricoes-adicionais"
                cols="30"
                rows="8"
                value={outros}
                onChange={(e) => setOutros(e.target.value)}
              ></textarea>
            </div>

            <div className="criar-evento-btn">
              <button className="mouse-hover" type="submit">
                CRIAR EVENTO
              </button>
            </div>
          </form>
        </section>
      </main>
    </div>
  );
}
