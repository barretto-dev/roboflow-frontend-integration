import { useState } from "react";

import { FaTimes, FaFileArchive, FaUpload} from "react-icons/fa"

import { addDataset } from "../services/dataset";

import "../styles/AddDatasetModal.css";


function AddDatasetModal({isOpen, onClose, onDatasetCreated}) {

  const [datasetName, setDatasetName] = useState("")
  const [file, setFile] = useState(null)
  const [error, setError] = useState(null)
  const [missingFolders, setMissingFolders] = useState([])
  const [loading, setLoading] = useState(false)

  if (!isOpen) 
    return null
  
  function resetModal() {
    setDatasetName("")
    setFile(null)
    setError(null)
    setMissingFolders([])
  }


  function handleClose() {
    if (loading) 
      return;

    resetModal();
    onClose();
  }


  function handleFileChange(event) {

    const selectedFile = event.target.files[0]
    setError(null);
    setMissingFolders([]);

    if (!selectedFile) {
      setFile(null);
      return;
    }


    if (!selectedFile.name.toLowerCase().endsWith(".zip")) {

      setFile(null)
      setError("O arquivo selecionado deve ser um arquivo .zip")
      event.target.value = ""
      return
    }

    setFile(selectedFile)
  }


  async function handleSubmit(event) {

    event.preventDefault()
    setError(null)
    setMissingFolders([])

    if (!datasetName.trim()) {
      setError("Informe o nome do dataset")
      return;
    }

    if (!file) {
      setError("Selecione o arquivo .zip do dataset")
      return
    }


    try {
      setLoading(true)
      await addDataset(datasetName.trim(),file);
      resetModal();

      /*
        A página principal pode usar isso
        para buscar novamente os datasets.
      */
      if (onDatasetCreated) 
        await onDatasetCreated();

      onClose();

    } catch (error) {

      const responseData = error.data;
      setError( responseData?.message || error.message || "Erro ao adicionar dataset");

      /*
        {
          message: "...",
          missing: [...]
        }
      */
      if (Array.isArray(responseData?.missing)) 
        setMissingFolders(responseData.missing);

    } finally {
      setLoading(false);
    }
  }


  return (

    <div className="modal-overlay">

      <div className="dataset-modal">
        {/* HEADER */}

        <div className="modal-header">

          <div>
            <h2>Adicionar dataset</h2>
          </div>

          <button
            type="button"
            className="modal-close-button"
            onClick={handleClose}
            disabled={loading}
            title="Fechar"
          >
            <FaTimes />
          </button>
        </div>


        <form onSubmit={handleSubmit}>

          {/* NOME */}
          <div className="form-group">

            <label htmlFor="dataset-name">
              Nome do dataset
            </label>

            <input
              id="dataset-name"
              type="text"
              value={datasetName}
              onChange={(event) => setDatasetName(event.target.value)}
              placeholder="Ex.: vagoes"
              disabled={loading}
            />

          </div>


          {/* ZIP */}
          <div className="form-group">

            <label htmlFor="dataset-file">
              Arquivo do dataset
            </label>


            <label
              htmlFor="dataset-file"
              className="file-selector"
            >
              <FaFileArchive />
              <div>
                <strong>
                  {file
                    ? file.name
                    : "Selecionar arquivo ZIP"}
                </strong>
              </div>
            </label>


            <input
              id="dataset-file"
              className="file-input"
              type="file"
              accept=".zip,application/zip"
              onChange={handleFileChange}
              disabled={loading}
            />

          </div>


          {/* ESTRUTURA */}
          <div className="dataset-structure">

            <h3>Estrutura esperada do ZIP</h3>

            <p>
              O arquivo deve conter as pastas
              de treino, validação e teste,
              cada uma com imagens e labels.
            </p>

            <pre>
{
`train/
        ├── images/
        └── labels/

valid/
        ├── images/
        └── labels/

test/
        ├── images/
        └── labels/

data.yaml`
}
            </pre>


            <p className="structure-warning">
              As pastas devem estar diretamente
              dentro do arquivo ZIP.
            </p>

          </div>


          {/* ERROS */}

          {error && (

            <div className="modal-error">

              <strong>
                {error}
              </strong>


              {missingFolders.length > 0 && (

                <div className="missing-folders">

                  <p>
                    Os seguintes diretórios
                    não foram encontrados:
                  </p>

                  <ul>

                    {missingFolders.map(
                      (folder) => (
                        <li key={folder}>
                          {folder}
                        </li>
                      )
                    )}

                  </ul>

                </div>
              )}

            </div>
          )}


          {/* FOOTER */}

          <div className="modal-footer">

            <button
              type="button"
              className="cancel-button"
              onClick={handleClose}
              disabled={loading}
            >
              Cancelar
            </button>


            <button
              type="submit"
              className="upload-button"
              disabled={loading}
            >

              <FaUpload />

              {loading
                ? "Enviando..."
                : "Adicionar dataset"}

            </button>

          </div>

        </form>

      </div>

    </div>
  )
}


export default AddDatasetModal