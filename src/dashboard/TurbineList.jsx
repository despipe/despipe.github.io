import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
} from "chart.js";
import "./TurbineList.css";
import NavBar from "../components/NavBar";
import farms from "../data/parques.json";
import BackButton from "../components/BackButton";
import CameraTurbine from "../components/CameraTurbine";

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

const TurbineList = () => {
  const { farmId } = useParams();
  const farm = farms.find((f) => f.id.toString() === farmId);

  const [selectedTurbine, setSelectedTurbine] = useState(null); // Estado para la turbina seleccionada
  const [selectedBlade, setSelectedBlade] = useState(1); // Estado para el ala seleccionada
  const [selectedFade, setSelectedFade] = useState(1); // Estado para la cara seleccionada
  const [viewMode, setViewMode] = useState("graphs"); // Estado para alternar entre gráficos y lista de defectos

  const calculateSeverityData = (farm) => {
    const severityCounts = [0, 0, 0, 0, 0, 0];

    farm.turbines.forEach((turbine) => {
      turbine.defects.forEach((defect) => {
        severityCounts[defect.severity]++;
      });
    });

    return severityCounts;
  };

  const calculateDefectTypes = (farm) => {
    const defectTypeCounts = {};

    farm.turbines.forEach((turbine) => {
      turbine.defects.forEach((defect) => {
        defectTypeCounts[defect.type] =
          (defectTypeCounts[defect.type] || 0) + 1;
      });
    });

    return defectTypeCounts;
  };

  const calculatePercentageData = (data) => {
    const total = data.reduce((sum, value) => sum + value, 0); // Suma total de los datos
    return data.map((value) => ((value / total) * 100).toFixed(2)); // Convierte cada valor a porcentaje
  };
  useEffect(() => {
    if (farm && farm.turbines.length > 0) {
      setSelectedTurbine(farm.turbines[0]); // Selecciona la primera turbina por defecto
    }
  }, [farm]);

  if (!farm) {
    return <div className="loading">Loading...</div>;
  }

  // Filtrar defectos según el ala y la cara seleccionados
  const filteredDefect = selectedTurbine?.defects.find(
    (defect) => defect.blade === selectedBlade && defect.fade === selectedFade
  );

  // Verificar qué Blades tienen defectos
  const bladesWithDefects = [1, 2, 3].filter((blade) =>
    selectedTurbine?.defects.some((defect) => defect.blade === blade)
  );

  // Verificar qué Fades tienen defectos para el Blade seleccionado
  const fadesWithDefects = [1, 2, 3, 4].filter((fade) =>
    selectedTurbine?.defects.some(
      (defect) => defect.blade === selectedBlade && defect.fade === fade
    )
  );

  // Datos del gráfico
  const barData = {
    labels: [selectedTurbine?.name || ""],
    datasets: [
      {
        label: "Distance (m)",
        data: [filteredDefect ? filteredDefect.distance : 0],
        borderColor: "red",
        borderWidth: {
          top: 4,
          right: 0,
          bottom: 0,
          left: 0,
        },
        backgroundColor: "transparent",
      },
    ],
  };

  const barOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: "Turbines",
        },
      },
      y: {
        title: {
          display: true,
          text: "Distance (m)",
        },
        beginAtZero: true,
        max: 44,
      },
    },
  };

  const severityBarData = farm
    ? {
        labels: [
          "Severity 0",
          "Severity 1",
          "Severity 2",
          "Severity 3",
          "Severity 4",
          "Severity 5",
        ],
        datasets: [
          {
            label: "Percentaje of Defects by Severity",
            data: calculatePercentageData(calculateSeverityData(farm)),
            backgroundColor: [
              "#28a745",
              "#d5e72e",
              "#ffdf2c",
              "#ffae35",
              "#ff792b",
              "#ff2929",
            ],
          },
        ],
      }
    : null;

  const defectTypeBarData = farm
    ? {
        labels: Object.keys(calculateDefectTypes(farm)),
        datasets: [
          {
            label: "Percentaje of Defects by Type",
            data: calculatePercentageData(
              Object.values(calculateDefectTypes(farm))
            ),
            backgroundColor: [
              "#FF6384",
              "#36A2EB",
              "#FFCE56",
              "#4BC0C0",
              "#9966FF",
              "#FF9F40",
            ],
          },
        ],
      }
    : null;

  const barFarmOptions = {
    plugins: {
      legend: {
        display: true,
        position: "top",
      },
      tooltip: {
        callbacks: {
          label: (context) => {
            const value = context.raw; // Valor numérico
            const total = context.dataset.data.reduce(
              (sum, val) => sum + val,
              0
            ); // Suma total de los datos
            const percentage = ((value / total) * 100).toFixed(2); // Calcula el porcentaje
            return `${value} (${percentage}%)`; // Muestra el valor numérico y el porcentaje
          },
        },
      },
    },
    responsive: true,
    scales: {
      x: {
        title: {
          display: true,
          text: "Categorías",
        },
      },
      y: {
        title: {
          display: true,
          text: "Porcentaje",
        },
        beginAtZero: true,
        max: 100, // Asegura que el rango máximo sea 100%
        ticks: {
          callback: (value) => `${value}%`, // Muestra los valores en porcentaje
        },
      },
    },
  };

  return (
    <>
      <NavBar />
      <div className="turbine-list-container">
        <div className="turbine-list-item">
          <BackButton />
          <div className="top-info">
            <div className="park-details-horizontal">
              <h1>{farm.name}</h1>
              <p>Wind Velocity: {farm.wind_velocity} m/s</p>
              <p>
                Production:{" "}
                {farm.turbines.reduce(
                  (total, turbine) => total + turbine.production,
                  0
                )}{" "}
                kW
              </p>
              {selectedTurbine && (
                <>
                  <h2>{selectedTurbine.name}</h2>
                  <p>Status: {selectedTurbine.state}</p>
                  <p>Production: {selectedTurbine.production} kW</p>
                </>
              )}
            </div>
            <Link to={`/${farm.id}/cameras`} className="security-button">
              <img src="/camera-icon.png" alt="Camera Icon" />
              <span>Security Cameras</span>
            </Link>
          </div>
          <ul className="turbine-grided">
            {farm.turbines.map((turbine) => (
              <div
                key={turbine.id}
                className={`turbine-carded ${
                  selectedTurbine?.id === turbine.id ? "selected" : ""
                }`}
                onClick={() => setSelectedTurbine(turbine)}
              >
                <div className="turbine-icon">
                  <span
                    className={`defect-indicator ${
                      turbine.defects.length > 0 ? "red" : "green"
                    }`}
                  ></span>
                  <img src="/wind-turbine.svg" alt="Turbine Icon" />
                  {turbine.defects.length > 0 && (
                    <span className="defect-counter">
                      {turbine.defects.length}
                    </span>
                  )}
                </div>
                <p className="turbine-name">{turbine.name}</p>
              </div>
            ))}
          </ul>
          <div className="info-division">
            {/* Contenido dinámico basado en el modo seleccionado */}
            {viewMode === "graphs" ? (
              <div className="graphs">
                <div className="view-toggle-buttons">
                  <button
                    className={`toggle-button ${
                      viewMode === "graphs" ? "active" : ""
                    }`}
                    onClick={() => setViewMode("graphs")}
                  >
                    <img src="/graph-icon.png" alt="graph icon" />
                  </button>
                  <button
                    className={`toggle-button ${
                      viewMode === "defects" ? "active" : ""
                    }`}
                    onClick={() => setViewMode("defects")}
                  >
                    <img src="/defect-icon.png" alt="defect icon" />
                  </button>
                </div>
                <div className="severity-graph">
                  <Bar data={severityBarData} options={barFarmOptions} />
                </div>
                <div className="type-graph">
                  <Bar data={defectTypeBarData} options={barFarmOptions} />
                </div>
              </div>
            ) : (
              <div className="defect-list">
                <div className="view-toggle-buttons">
                    <button
                    className={`toggle-button ${
                        viewMode === "graphs" ? "active" : ""
                    }`}
                    onClick={() => setViewMode("graphs")}
                    >
                    <img src="/graph-icon.png" alt="graph icon" />
                    </button>
                    <button
                    className={`toggle-button ${
                        viewMode === "defects" ? "active" : ""
                    }`}
                    onClick={() => setViewMode("defects")}
                    >
                    <img src="/defect-icon.png" alt="defect icon" />
                    </button>
                </div>
                <h3>Defects for {selectedTurbine?.name}</h3>
                {selectedTurbine?.defects.length > 0 ? (
                    <table className="defect-table">
                    <thead>
                        <tr>
                        <th>Type</th>
                        <th>Severity</th>
                        <th>Blade</th>
                        <th>Fade</th>
                        </tr>
                    </thead>
                    <tbody>
                        {selectedTurbine.defects.map((defect, index) => (
                        <tr key={index}>
                            <td>{defect.type}</td>
                            <td>{defect.severity}</td>
                            <td>{defect.blade}</td>
                            <td>{defect.fade}</td>
                        </tr>
                        ))}
                    </tbody>
                    </table>
                ) : (
                    <p>No defects found for this turbine.</p>
                )}
                </div>
            )}
            <CameraTurbine
              selectedTurbine={selectedTurbine}
              selectedBlade={1}
            />
          </div>
        </div>
        <div className="turbine-profile-container">
          <div className="selectors">
            <div className="selector-group">
              {[1, 2, 3].map((blade) => (
                <button
                  key={blade}
                  className={`selector-button ${
                    selectedBlade === blade ? "selected" : ""
                  } ${bladesWithDefects.includes(blade) ? "has-defect" : ""}`}
                  onClick={() => setSelectedBlade(blade)}
                >
                  {blade}
                </button>
              ))}
            </div>
            <div className="selector-group">
              {[1, 2, 3, 4].map((fade) => (
                <button
                  key={fade}
                  className={`selector-button ${
                    selectedFade === fade ? "selected" : ""
                  } ${fadesWithDefects.includes(fade) ? "has-defect" : ""}`}
                  onClick={() => setSelectedFade(fade)}
                >
                  {fade}
                </button>
              ))}
            </div>
          </div>
          <div className="turbine-profile-info">
            <div className="bar-chart-container">
              <Bar data={barData} options={barOptions} />
            </div>

            <div className="profile-chart-container">
              <svg width="90" height="580">
                <polygon points="15,580 0,0 30,0" fill="url(#gradient)" />
                <defs>
                  <linearGradient
                    id="gradient"
                    x1="0%"
                    y1="0%"
                    x2="100%"
                    y2="200%"
                  >
                    <stop
                      offset={"0%"}
                      style={{ stopColor: "#444444", stopOpacity: 1 }}
                    />
                    <stop
                      offset="100%"
                      style={{ stopColor: "#000", stopOpacity: 0.1 }}
                    />
                  </linearGradient>
                </defs>
              </svg>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default TurbineList;
