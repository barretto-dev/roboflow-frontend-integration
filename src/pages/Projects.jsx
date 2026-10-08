import { useEffect, useState } from "react"

import ProjectCard from "../components/ProjectCard"
import AddDatasetModal from "../components/AddDatasetModal"

import { getRoboflowProjects } from "../services/project"
import "../styles/Datasets.css"

function ProjectList() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [modalAddDatasetOpen, setModalAddDatasetOpen] = useState(false);

  async function loadDatasets() {
    try {
      const projects_roboflow = await getRoboflowProjects()
      setProjects(projects_roboflow)
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
    return <p>Carregando projetos...</p>;

  if (error)
    return <p>Erro: {error}</p>;

  return (
    <main className="container">
      <h1 style={{paddingBottom: 15}}>Projetos</h1>

      <div className="dataset-list">
        {projects.map((project) => (
          <ProjectCard
            key={project.name} 
            project={project}
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

      {/* <AddDatasetModal
        isOpen={modalAddDatasetOpen}
        onClose={() => setModalAddDatasetOpen(false)}
        onDatasetCreated={loadDatasets}
      /> */}

    </main>
  );
}

export default ProjectList;