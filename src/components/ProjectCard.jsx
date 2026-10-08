import { useEffect, useState } from "react"
import { Link } from "react-router-dom";
import { FaPlay, FaTrash, FaPlusSquare  } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

import AddImagesDatasetModal from "./AddImagesDatasetModal"

function ProjectCard({ project, reloadDatasetList }) {
  const navigate = useNavigate()
  const [modalAddImagesOpen, setModalAddImagesOpen] = useState(false);

  return (
    <div className="dataset-card">
      <div className="dataset-card-header">
        <h2>{project.name}</h2>
      </div>
      
      <div className="dataset-card-content">

        <p>
          <strong>Dataset padrão</strong>: {project.datasetVersion != null ? project.datasetVersion : "Nenhum"}
        </p>

        <span
          className={
            project.training_status == "TRAINED" ? "status trained"
              : project.training_status == "TRAINING" ? "status training" : 
              "status not-trained"
          }
        >
          {
            project.training_status == "TRAINED" ? "Treinado"
            : project.training_status == "TRAINING" ? "Em treinamento"
            : "Sem treinamento"
          }
        </span>

      </div>

       <div className="dataset-card-footer">

        <button
            className="button-footer-unique"
            onClick={() => navigate(`/project/${encodeURIComponent(project.name)}/datasets`)}>
            Verificar datasets
        </button>

        {/* <Link
          to={`/project/${encodeURIComponent(project.name)}/datasets`}
          className="icon-button train-button"
          title="Verificar datasets"
        >
          <FaPlay />
        </Link> */}

       {/*  <button
          className="icon-button delete-button"
          title="Excluir dataset"
        >
          <FaTrash />
        </button>
 */}
        {/* <button
          className="icon-button add-button"
          title="Adicionar imagens"
          onClick={() => setModalAddImagesOpen(true)}
        >
          <FaPlusSquare  />
        </button> */}

      </div>

      <AddImagesDatasetModal
        datasetName= {project.name}
        isOpen={modalAddImagesOpen}
        onClose={() => setModalAddImagesOpen(false)}
        onImagesAdd={reloadDatasetList}
      />
      
    </div>
  );
}

export default ProjectCard;