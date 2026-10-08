import { useParams, Link  } from "react-router-dom"

import { useEffect, useState } from "react"

import DatasetCard from "../components/DatasetCard"
import AddDatasetModal from "../components/AddDatasetModal"

import { getDatasets, getRoboflowDatasets } from "../services/dataset"
import "../styles/Datasets.css"

import { FaPlus } from "react-icons/fa"

function DatasetList() {

  const { projectName } = useParams();

  const [datasets, setDatasets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [modalAddDatasetOpen, setModalAddDatasetOpen] = useState(false);

  async function loadDatasets() {
    try {
      const datasetsApi = await getRoboflowDatasets(projectName);
      setDatasets(datasetsApi);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadDatasets();
  }, []);

  if (loading)
    return <p>Carregando datasets...</p>;

  if (error)
    return <p>Erro: {error}</p>;

  return (
    <main className="container">
      <h1 style={{paddingBottom: 15}}>Datasets</h1>

      <div className="dataset-list">
        {datasets.map((dataset) => (
          <DatasetCard
            key={dataset.version} 
            dataset={dataset}
            reloadDatasetList={loadDatasets}
          />
        ))}
      </div>

      {/* <button
        className="floating-add-button"
        title="Adicionar dataset"
        onClick={() => setModalAddDatasetOpen(true)}
      >
        <FaPlus />
      </button> */}

     {/*  <AddDatasetModal
        isOpen={modalAddDatasetOpen}
        onClose={() => setModalAddDatasetOpen(false)}
        onDatasetCreated={loadDatasets}
      /> */}

    </main>
  );
}

export default DatasetList;