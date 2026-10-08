
import { useEffect, useState } from "react"
import { useParams, useNavigate } from "react-router-dom";
import { FaPlay, FaTrash, FaPlusSquare  } from "react-icons/fa";

import AddImagesDatasetModal from "./AddImagesDatasetModal"
import ConfirmationModal from "./ConfirmationModal"

import { useDatesetAsDefaultOnProject } from "../services/dataset";

function DatasetCard({ dataset, reloadDatasetList }) {

  const { projectName } = useParams();
  const navigate = useNavigate()

  const [modalDefaultDataset, setModalDefaultDataset] = useState(false);
  
  async function useDatasetAsDefault() {
    try {
      await useDatesetAsDefaultOnProject(projectName, dataset.version);
    } catch (error) {
      throw error
    }
  }

  const handleButton = () => {
    if(!dataset.is_default)
      setModalDefaultDataset(true)
    else{
      navigate(`/project/${(projectName)}/dataset/${(dataset.version)}/training/`)
    }
  }

  return (
    <div className="dataset-card">
      <div className={
        dataset.is_default
        ? "dataset-card-header dataset-default" 
        : "dataset-card-header"
      }>
        <h2>{dataset.version}</h2>
      </div>
      
      <div className="dataset-card-content">

        <p><strong>Treino</strong>: {dataset.train} </p>
        <p><strong>Validação</strong>: {dataset.valid} </p>
        <p><strong>Teste</strong>: {dataset.test} </p>

        <p>
          <strong>Total</strong>: {dataset.total}
        </p>

        {
          dataset.is_default ?
          (
            <span
              className={
                dataset.training_status == "TRAINED" 
                  ? "status trained"
                  : dataset.training_status == "TRAINING" 
                    ? "status training" 
                    : "status not-trained"
              }
            >
              {
                dataset.training_status == "TRAINED" 
                ? "Treinado"
                : dataset.training_status == "TRAINING" 
                  ? "Em treinamento"
                  : "Não treinado"
              }
            </span>
          ) : (<div></div>)
        }

      </div>

       <div className="dataset-card-footer">

       {/*  <Link
          to={`/training/${encodeURIComponent(dataset.name)}`}
          className="icon-button train-button"
          title="Iniciar treinamento"
        >
          <FaPlay />
        </Link> */}

        <button
          className={
            dataset.is_default
            ? "button-footer-unique"
            : "button-footer-unique"
          }
          onClick={handleButton}
        >
          { !dataset.is_default 
              ? "Selecionar como padrão" 
              : dataset.training_status == "TRAINING" 
                ? "Verificar Treinamento" 
                : "Iniciar Treinamento"
          }
        </button>

       {/*  <button
          className="icon-button add-button"
          title="Adicionar imagens"
          onClick={() => setModalAddImagesOpen(true)}
        >
          <FaPlusSquare  />
        </button> */}
      </div>

      <ConfirmationModal
        isOpen={modalDefaultDataset}
        onClose={() => setModalDefaultDataset(false)}
        title= "Definir dataset como padrão"
        message= "Tem certeza que deseja tornar a versão do dataset para ser usada como padrão deste projeto?"
        onConfirm={useDatasetAsDefault}
        onFinished={reloadDatasetList}
      />
      
    </div>
  );
}

export default DatasetCard;