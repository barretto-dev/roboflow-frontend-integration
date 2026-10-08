const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000"

export async function getDatasets() {
  const response = await fetch(`${API_URL}/datasets`);

  if (!response.ok) 
    throw new Error("Erro ao buscar datasets");

  const data = await response.json();

  return data.datasets;
}

export async function getRoboflowDatasets(projectName) {
  const response = await fetch(`${API_URL}/roboflow/${projectName}/datasets`);

  if (!response.ok) 
    throw new Error("Erro ao buscar datasets");

  const data = await response.json();

  return data.datasets;
}

//API save dataset of give version locally
export async function useDatesetAsDefaultOnProject(projectName, datasetVersion) {
  const response = await fetch(
    `${API_URL}/roboflow/projects/${projectName}/versions/${datasetVersion}/download`,
    {method: "POST"}
  );

  if (!response.ok) 
    throw new Error(`Erro ao definir dataset v${datasetVersion} como padrão do projeto ${projectName}`);

  const data = await response.json();

  return data;
}

export async function addDataset(datasetName, file) {

  const formData = new FormData()
  formData.append("name", datasetName)
  formData.append("file", file)

  const response = await fetch(
    `${API_URL}/datasets/upload`,
    {method: "POST", body: formData}
  )

  const data = await response.json();

  if (!response.ok) {
    const error = new Error(data.message || "Erro ao adicionar dataset")
    error.data = data;
    throw error;
  }


  return data;
}

export async function addImagesDataset(datasetName, file) {

  const formData = new FormData()
  formData.append("name", datasetName)
  formData.append("file", file)

  const response = await fetch(
    `${API_URL}/datasets/images`,
    {method: "PUT", body: formData}
  )

  const data = await response.json();

  if (!response.ok) {
    const error = new Error(data.message || "Erro ao adicionar dataset")
    error.data = data;
    throw error;
  }


  return data;
}