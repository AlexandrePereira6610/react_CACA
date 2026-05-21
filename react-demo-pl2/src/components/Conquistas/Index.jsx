
import React, { useEffect, useRef } from "react";
import "./Conquistas.css";

import {Chart,CategoryScale, LinearScale,BarController,BarElement,Title, Tooltip, Legend,} from "chart.js";

Chart.register(CategoryScale, LinearScale, BarController, BarElement,Title,Tooltip,Legend);

export default function Index() {
  const canvasRef = useRef(null);
  const chartInstance = useRef(null);

  const loadData = async (file, title) => {
  try {
    const response = await fetch(file);
    const data = await response.json();

    const labels = data.map((item) => item.month);
    const values = data.map((item) => item.income);

    if (chartInstance.current) {
      chartInstance.current.destroy();
    }

    chartInstance.current = new Chart(canvasRef.current, {
      type: "bar",
      data: {
        labels,
        datasets: [
          { label: title,
            data: values,
            backgroundColor: "rgba(54, 162, 235, 0.5)",
            borderColor: "rgba(54, 162, 235, 1)",
            borderWidth: 1,
          },
        ],
      },
      options: { responsive: true,maintainAspectRatio: false,},
    });
  } catch (error) {
    console.error("Erro ao carregar JSON:", error);
  }
};

  useEffect(() => {loadData("/utils/datainvestigacao.json","Numero de investigadores mensal" );

    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, []);

  return (
    <>
      <div id="Conquistas">
        <h1>Conquistas</h1>
      </div>

      <div className="conquistas">
        <p>Em 2026 houve um aumento geral de 30%</p>

        <div className="conquistas-container">
          <div className="chart_types">
            <button
              onClick={() =>
                loadData("/utils/datainvestigacao.json","Numero de investigadores mensal")}>Investigadores</button>

            <button onClick={() => loadData("/utils/dataparceiros.json", "Numero de parceiros mensais")}>Parceiros</button>

            <button onClick={() =>loadData("/utils/dataprojetos.json","Numero de projetos mensais" ) } >Projetos</button>
          </div>

          <div className="grafico">
            <canvas ref={canvasRef}></canvas>
          </div>
        </div>
      </div>
    </>
  );
}