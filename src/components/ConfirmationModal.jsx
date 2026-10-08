import { useState } from "react";

import { FaTimes, FaFileArchive, FaUpload} from "react-icons/fa"

import { addDataset } from "../services/dataset";

import "../styles/AddDatasetModal.css";


function ConfirmationModal({isOpen, onClose, title, message, onConfirm, onFinished}) {

  const [datasetName, setDatasetName] = useState("")
  const [file, setFile] = useState(null)
  const [error, setError] = useState(null)
  const [missingFolders, setMissingFolders] = useState([])
  const [loading, setLoading] = useState(false)

  if (!isOpen) 
    return null

  function handleClose() {
    if (loading) 
      return;

    setError(null)
    onClose();
  }


  async function handleSubmit(event) {

    event.preventDefault()
    setError(null)

    try {
      setLoading(true)
      await onConfirm()
      setError(null)

      /*
        A página principal pode usar isso
        para buscar novamente os datasets.
      */
      if (onFinished) 
        await onFinished();

      onClose();

    } catch (error) {

      const responseData = error.data;
      setError( responseData?.message || error.message || "Erro na operação");
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
            <h2>{title}</h2>
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
          {/* ZIP */}
          <div className="form-group">

            <label htmlFor="dataset-file">
              {message}
            </label>
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
              {loading
                ? "Enviando..."
                : "Confirmar"}

            </button>

          </div>

        </form>

      </div>

    </div>
  )
}


export default ConfirmationModal