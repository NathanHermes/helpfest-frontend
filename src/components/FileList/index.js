import React from "react";
import 'react-circular-progressbar/dist/styles.css';

import { Container, FileInfo, Preview } from "./styles";



const FileList = ({ files, onDelete }) => (
  

  <Container>
    { files.map(uploadedFiles => (
      <li key={uploadedFiles.id}>
        <FileInfo>
          <Preview src={uploadedFiles.preview} />
          <div>
            <strong>{uploadedFiles.name}</strong>
            <span>
              {uploadedFiles.readableSize} 
              <button type="button" onClick={() => onDelete(uploadedFiles.id)}>Excluir</button>
            </span>
          </div>
        </FileInfo>
      </li>
    )) }
  </Container>
);

export default FileList;
