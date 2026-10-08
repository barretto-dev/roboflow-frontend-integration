import { useParams, Link  } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";

import TrainingControl from "../components/TrainingControl";
import "../styles/TrainingStart.css";

function TrainingStart() {

  const { projectName, datasetVersion } = useParams();

  const datasetListUrl = `/project/${projectName}/datasets`

  return (
    <main className="training-page">

      <div className="training-page-header">
        <Link to={datasetListUrl} className="back-button">
          <FaArrowLeft />
          Voltar para datasets
        </Link>
      </div>

      <TrainingControl
        datasetVersion={datasetVersion}
        projectName={projectName}
      />
    </main>
  );
}


export default TrainingStart;