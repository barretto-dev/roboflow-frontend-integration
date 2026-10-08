import { Routes, Route } from "react-router-dom";

import Datasets from "./pages/Datasets";
import Projects from "./pages/Projects"
import TrainingStart from "./pages/TrainingStart";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Projects />} />
      <Route path="/project/:projectName/datasets" element={<Datasets />} />
      <Route path="/project/:projectName/dataset/:datasetVersion/training" element={<TrainingStart />}/>
    </Routes>
  );
}

export default App;