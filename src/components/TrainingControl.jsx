import { useEffect, useRef, useState } from "react";
import { FaPlay, FaStop } from "react-icons/fa";

import "../styles/TrainingControl.css";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000"

function TrainingControl({ projectName, datasetVersion }) {

  const [status, setStatus] = useState("idle");

  const [activeProject, setActiveProject]= useState(null)
  const [activeVersion, setActiveVersion] = useState(null)

  const [pid, setPid] = useState(null)
  const [logs, setLogs] = useState("")
  const [error, setError] = useState(null)
  
  const terminalRef = useRef(null);


  /*
    Conexão SSE com o backend.
  */
  useEffect(() => {

    const eventSource = new EventSource(`${API_URL}/trains/events`);

    /*
      O snapshot é recebido assim que a página
      se conecta ao backend.

      Ele contém:
      - status atual
      - dataset treinando
      - PID
      - logs anteriores
    */
    eventSource.addEventListener(
      "snapshot",
      (event) => {

        const data = JSON.parse(event.data);

        //setConnected(true);
        setActiveProject(data.projectName)
        setActiveVersion(data.datasetVersion);
        setPid(data.pid);

        /*
          Como o backend guarda um treinamento
          global, verificamos se os logs pertencem
          ao dataset desta página.
        */
        const datasetLogs = (data.logs || [])
            .filter((log) => (log.datasetVersion == datasetVersion && log.projectName == projectName))
            .map((log) => log.text)
            .join("");
        
        setLogs(datasetLogs);

        /*
          Se existe um treinamento rodando,
          usamos o status recebido normalmente.
        */
        if (data.running) {
          setStatus(data.status);
          return;
        }

        /*
          Se nenhum treinamento está rodando,
          mas existem logs deste dataset,
          podemos mostrar o último estado conhecido.
        */
        if (datasetLogs.length > 0) 
          setStatus(data.status);
        else 
          setStatus("idle");
      }
    );


    /*
      Recebe todos os novos eventos emitidos
      pelo service.
    */
    eventSource.addEventListener(
      "training",
      (event) => {

        const data = JSON.parse(event.data);
        if (data.type === "log") {

          /*
            Só exibimos no terminal logs
            do dataset desta página.
          */
          if (data.datasetVersion == datasetVersion && data.projectName == projectName) 
            setLogs((previousLogs) => previousLogs + data.text);

          return;
        }

        if (data.type === "status") {

          setStatus(data.status);
          setActiveProject(data.projectName || null)
          setActiveVersion(data.datasetVersion || null)
          if (data.pid !== undefined)
            setPid(data.pid);


          /*
            Quando o treinamento termina,
            não existe mais PID ativo.
          */
          if (data.status === "completed" || data.status === "stopped" || data.status === "error") 
            setPid(null);
        }
      }
    );


    /*
      EventSource tenta reconectar
      automaticamente se a conexão cair.
    */
    eventSource.onopen = () =>
      //setConnected(true);

    eventSource.onerror = () => {
      //setConnected(false);
      console.log("Conexão com os logs temporariamente perdida")
    }

    /*
      Fecha a conexão quando o componente
      for desmontado.
    */
    return () => {eventSource.close();};

  }, [datasetVersion]);


  /*
    Scroll automático do terminal.
  */
  useEffect(() => {

    if (terminalRef.current) 
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;

  }, [logs]);


  /*
    Inicia treinamento.
  */
  async function handleStart() {

    try {

      setError(null);
      setLogs("");
      setStatus("starting");

      const response = await fetch(
        `${API_URL}/trains/${encodeURIComponent(projectName)}/start`,
        {method: "POST"}
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Erro ao iniciar treinamento");
      }


      /*
        Não precisamos definir running manualmente.

        O backend enviará:
        status: running

        através do SSE.
      */

    } catch (error) {
      setError(error.message);
      setStatus("idle");
    }
  }


  /*
    Interrompe o treinamento atual.
  */
  async function handleStop() {

    try {

      setError(null);
      const response = await fetch(`${API_URL}/trains/stop`, {method: "DELETE"})
      const data = await response.json();

      if (!response.ok) 
        throw new Error(data.message || "Erro ao parar treinamento")


      /*
        O backend enviará:
        status: stopping

        e posteriormente:
        status: stopped

        através do SSE.
      */

    } catch (error) {
      setError(error.message);
    }
  }


  /*
    Existe algum treinamento ativo?
  */
  const trainingActive =
    status === "running" ||
    status === "stopping" ||
    status === "starting";


  /*
    O treinamento ativo pertence
    ao dataset desta página?
  */
  const thisDatasetIsTraining =
    activeVersion == datasetVersion &&
    activeProject == projectName &&
    (
      status === "running" ||
      status === "stopping"
    );


  /*
    Existe outro dataset sendo treinado?
  */
  const anotherDatasetIsTraining =
    trainingActive && (
      (activeProject != null && activeProject != projectName) ||
      (activeVersion != null && activeVersion != datasetVersion)
    )


  function getStatusText() {
    console.log(activeProject)
    console.log(projectName)
    
    console.log(activeVersion)
    console.log(datasetVersion)
    
    if (anotherDatasetIsTraining) {
      return "Outro treinamento em execução";
    }


    switch (status) {

      case "starting":
        return "Iniciando";

      case "running":
        return "Treinando";

      case "stopping":
        return "Encerrando";

      case "completed":
        return "Concluído";

      case "stopped":
        return "Interrompido";

      case "error":
        return "Erro";

      default:
        return "Parado";
    }
  }


  return (

    <div className="training-control">


      {/* CABEÇALHO */}
      <div className="training-header">

        <div>

          <h2 style={{textAlign: "left"}}>Treinamento</h2>

          <p>
            <strong>Projeto:{" "}</strong>
            {projectName}
          </p>
          <p>
            <strong>Versão Dataset:{" "}</strong>
            {datasetVersion}
          </p>

        </div>


        <div className="training-header-status">
          <span className={`training-status ${status}`}>
            {getStatusText()}
          </span>
        </div>
      </div>


      {/* AVISO DE OUTRO DATASET */}

      {anotherDatasetIsTraining && (

        <div className="training-warning">

          Já existe um treinamento em execução:

          {" "}

          <strong>
            {` Projeto(${activeProject}) e Versão do Dataset(${activeVersion})`}
          </strong>

        </div>
      )}


      {/* INFORMAÇÕES */}

      {thisDatasetIsTraining && pid && (

        <div className="training-info">
          <span>
            Processo PID:
          </span>

          <strong>
            {pid}
          </strong>

        </div>
      )}

      {/* BOTÕES */}

      <div className="training-buttons">

        <button
          className="start-button"
          onClick={handleStart}
          disabled={trainingActive || anotherDatasetIsTraining}

        >
          <FaPlay />
          Iniciar treinamento
        </button>


        <button
          className="stop-button"
          onClick={handleStop}
          disabled={!thisDatasetIsTraining || status === "stopping"}
        >
          <FaStop />
          Parar treinamento
        </button>

      </div>


      {/* ERRO */}

      {error && (
        <div className="training-error">
          {error}
        </div>
      )}


      {/* TERMINAL */}

      <div className="terminal-container">

        <div className="terminal-header">
          <span>
            Saída do treinamento
          </span>
        </div>


        <div ref={terminalRef} className="training-terminal">

          <pre>
            {logs ||"Aguardando início do treinamento..."}
          </pre>

        </div>
      </div>
    </div>
  );
}


export default TrainingControl;