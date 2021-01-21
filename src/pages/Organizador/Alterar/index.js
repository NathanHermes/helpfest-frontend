import React, { useState, useEffect } from "react";
import { Link, useHistory } from "react-router-dom";
import { mask } from "remask";
import { uniqueId } from "lodash";
import filesize from "filesize";
import api from "../../../services/api";
import Dropzone from "react-dropzone";
import {
  DropContainer,
  UploadMessage,
} from "../../../components/Upload/styles";
import FileList from "../../../components/FileList";

import { BsArrowLeftShort, BsPencil } from "react-icons/bs";
import Swal from "sweetalert2";
import "./styles.css";

export default function AlterarPerfil() {
  const [uploadedFiles, setUploadedFiles] = useState([]);

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
  };

  const handleInput = (e) => {
    const input = document.getElementById(`alterar-${e.target.id}`);
    const button = document.getElementById(e.target.id);

    if (input !== null) {
      input.removeAttribute("disabled");
      button.style.display = "none";
    }
  };

  const [organizador, setOrganizador] = useState("");
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
      });
  }, [email]);

  const [nome, setNome] = useState("");
  const [telefone, setTelefone] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [cnpj, setCnpj] = useState("");
  const [rua, setRua] = useState("");
  const [numero, setNumero] = useState("");
  const [cidade, setCidade] = useState("");
  const [uf, setUf] = useState("");

  

  return (
    <div id="alterar-user-background">
      <main className="alterar-user-container">
        <header className="alterar-user-navbar">
          <Link to="/user/perfil">
            <BsArrowLeftShort
              color="rgba(16, 14, 33, 1)"
              size={75}
              className="mouse-hover"
            />
          </Link>

          <h1>ALTERAR</h1>
        </header>

        <section className="alterar-user-card">
          <form onSubmit={() => {}}>
            <div className="alterar-user-upload">
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
                        id="alterar-user-img"
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
                onClick={handleInput}
                className="btn-editar"
                id="user-img"
              >
                <BsPencil
                  id="user-img"
                  color="rgba(255, 164, 196, 1)"
                  size={25}
                />
              </button>
            </div>

            <div className="alterar-user-group-input">
              <strong htmlFor="alterar-user-nome">Nome: </strong>

              <div className="alterar-user-input">
                <input
                  id="alterar-user-nome"
                  placeholder={organizador.nome}
                  type="text"
                  value={nome}
                  onChange={(e) => setNome(e.target.value)}
                  disabled
                />

                <button
                  type="button"
                  className="btn-editar"
                  id="user-nome"
                  onClick={handleInput}
                >
                  <BsPencil
                    id="user-nome"
                    color="rgba(255, 164, 196, 1)"
                    size={25}
                  />
                </button>
              </div>
            </div>

            <div className="alterar-user-group-input">
              <strong htmlFor="alterar-user-telefone">Telefone: </strong>

              <div className="alterar-user-input">
                <input
                  id="alterar-user-telefone"
                  type="text"
                  placeholder={organizador.telefone}
                  value={telefone}
                  onChange={(e) =>
                    setTelefone(mask(e.target.value, ["(99) 99999-9999"]))
                  }
                  disabled
                />

                <button
                  type="button"
                  className="btn-editar"
                  id="user-telefone"
                  onClick={handleInput}
                >
                  <BsPencil
                    id="user-telefone"
                    color="rgba(255, 164, 196, 1)"
                    size={25}
                  />
                </button>
              </div>
            </div>

            <div className="alterar-user-group-input">
              <strong htmlFor="alterar-user-whatsapp">Whatsapp: </strong>

              <div className="alterar-user-input">
                <input
                  id="alterar-user-whatsapp"
                  type="text"
                  placeholder={organizador.whatsapp}
                  value={whatsapp}
                  onChange={(e) =>
                    setWhatsapp(mask(e.target.value, ["(99) 99999-9999"]))
                  }
                  disabled
                />

                <button
                  type="button"
                  className="btn-editar"
                  id="user-whatsapp"
                  onClick={handleInput}
                >
                  <BsPencil
                    id="user-whatsapp"
                    color="rgba(255, 164, 196, 1)"
                    size={25}
                  />
                </button>
              </div>
            </div>

            <div className="alterar-user-group-input">
              <strong htmlFor="alterar-user-cnpj">CNPJ: </strong>

              <div className="alterar-user-input">
                <input
                  id="alterar-user-cnpj"
                  placeholder={organizador.cnpj}
                  type="text"
                  value={cnpj}
                  onChange={(e) =>
                    setCnpj(mask(e.target.value, ["99.999.999/9999-99"]))
                  }
                  disabled
                />

                <button
                  type="button"
                  className="btn-editar"
                  id="user-cnpj"
                  onClick={handleInput}
                >
                  <BsPencil
                    id="user-cnpj"
                    color="rgba(255, 164, 196, 1)"
                    size={25}
                  />
                </button>
              </div>
            </div>

            <div className="alterar-user-localizacao">
              <div className="alterar-user-group-input">
                <strong htmlFor="alterar-user-rua">Rua: </strong>

                <div className="alterar-user-input">
                  <input
                    id="alterar-user-rua"
                    placeholder={organizador.rua}
                    type="text"
                    value={rua}
                    onChange={(e) => setRua(e.target.value)}
                    disabled
                  />

                  <button
                    type="button"
                    className="btn-editar"
                    id="user-rua"
                    onClick={handleInput}
                  >
                    <BsPencil
                      id="user-rua"
                      color="rgba(255, 164, 196, 1)"
                      size={25}
                    />
                  </button>
                </div>
              </div>

              <div className="alterar-user-group-input">
                <strong htmlFor="alterar-user-numero">Número: </strong>

                <div className="alterar-user-input">
                  <input
                    id="alterar-user-numero"
                    placeholder={organizador.numero}
                    type="text"
                    value={numero}
                    onChange={(e) => setNumero(e.target.value)}
                    disabled
                  />

                  <button
                    type="button"
                    className="btn-editar"
                    id="user-numero"
                    onClick={handleInput}
                  >
                    <BsPencil
                      id="user-numero"
                      color="rgba(255, 164, 196, 1)"
                      size={25}
                    />
                  </button>
                </div>
              </div>
            </div>

            <div className="alterar-user-localizacao">
              <div className="alterar-user-group-input">
                <strong htmlFor="alterar-user-cidade">Cidade: </strong>

                <div className="alterar-user-input">
                  <input
                    id="alterar-user-cidade"
                    placeholder={organizador.cidade}
                    type="text"
                    value={cidade}
                    onChange={(e) => setCidade(e.target.value)}
                    disabled
                  />

                  <button
                    type="button"
                    className="btn-editar"
                    id="user-cidade"
                    onClick={handleInput}
                  >
                    <BsPencil
                      id="user-cidade"
                      color="rgba(255, 164, 196, 1)"
                      size={25}
                    />
                  </button>
                </div>
              </div>

              <div className="alterar-user-group-input">
                <strong htmlFor="alterar-user-uf">UF: </strong>

                <div className="alterar-user-input">
                  <input
                    id="alterar-user-uf"
                    placeholder={organizador.uf}
                    type="text"
                    value={uf}
                    onChange={(e) => setUf(e.target.value)}
                    disabled
                  />

                  <button
                    type="button"
                    className="btn-editar"
                    id="user-uf"
                    onClick={handleInput}
                  >
                    <BsPencil
                      id="user-uf"
                      color="rgba(255, 164, 196, 1)"
                      size={25}
                    />
                  </button>
                </div>
              </div>
            </div>

            

            <div className="alterar-user-btn">
              <button type="submit" className="mouse-hover">
                ALTERAR
              </button>
            </div>
          </form>
        </section>
      </main>
    </div>
  );
}
