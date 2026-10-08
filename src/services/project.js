const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000"

export async function getRoboflowProjects() {
  const response = await fetch(`${API_URL}/roboflow/projects`);

  if (!response.ok) 
    throw new Error("Erro ao buscar projetos");

  const data = await response.json();

  return data.projects;
}