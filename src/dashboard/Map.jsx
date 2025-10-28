import React, { useEffect, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import './Map.css';
import farms from '../data/parques.json'; // Importa el archivo JSON
import dashboardData from '../data/dashboard.json'; // Importa el archivo JSON de datos del dashboard
import { Bar } from 'react-chartjs-2'; // Importa el gráfico de dona
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement } from 'chart.js';
import NavBar from '../components/NavBar';
import Loader from '../components/Loader'; 

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement);

const Map = () => {
    const [map, setMap] = useState(null);
    const [selectedFarm, setSelectedFarm] = useState(null); 
    const [searchTerm, setSearchTerm] = useState('');
    const [createdMarkers, setCreatedMarkers] = useState([]);

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
                defectTypeCounts[defect.type] = (defectTypeCounts[defect.type] || 0) + 1;
            });
        });

        return defectTypeCounts;
    };

    const calculatePercentageData = (data) => {
        const total = data.reduce((sum, value) => sum + value, 0); // Suma total de los datos
        return data.map((value) => ((value / total) * 100).toFixed(2)); // Convierte cada valor a porcentaje
    };

    const severityBarData = selectedFarm
        ? {
            labels: ['Severity 0', 'Severity 1', 'Severity 2', 'Severity 3', 'Severity 4', 'Severity 5'],
            datasets: [
                {
                    label: 'Percentaje of Defects by Severity',
                    data: calculatePercentageData(calculateSeverityData(selectedFarm)), 
                    backgroundColor: ['#28a745', '#d5e72e', '#ffdf2c', '#ffae35', '#ff792b', '#ff2929'],
                },
            ],
        }
        : null;

    const defectTypeBarData = selectedFarm
        ? {
            labels: Object.keys(calculateDefectTypes(selectedFarm)),
            datasets: [
                {
                    label: 'Percentaje of Defects by Type',
                    data: calculatePercentageData(Object.values(calculateDefectTypes(selectedFarm))), 
                    backgroundColor: [
                        '#FF6384',
                        '#36A2EB',
                        '#FFCE56',
                        '#4BC0C0',
                        '#9966FF',
                        '#FF9F40',
                    ],
                },
            ],
        }
        : null;

    const barOptions = {
        plugins: {
            legend: {
                display: true,
                position: 'top',
            },
            tooltip: {
                callbacks: {
                    label: (context) => {
                        const value = context.raw; // Valor numérico
                        const total = context.dataset.data.reduce((sum, val) => sum + val, 0); // Suma total de los datos
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
                    text: 'Categorías',
                },
            },
            y: {
                title: {
                    display: true,
                    text: 'Porcentaje',
                },
                beginAtZero: true,
                max: 100, // Asegura que el rango máximo sea 100%
                ticks: {
                    callback: (value) => `${value}%`, // Muestra los valores en porcentaje
                },
            },
        },
    };
 

    useEffect(() => {
    const mapInstance = L.map('map', {
        center: [37.7749, -122.4194],
        zoom: 6,
        zoomControl: false,
        worldCopyJump: false, // Evita que el mapa "salte" a otro mundo
        maxBounds: [
            [-90, -180], // Coordenadas suroeste (límite inferior izquierdo)
            [90, 180],   // Coordenadas noreste (límite superior derecho)
        ],
        layers: [
            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                maxZoom: 19,
                minZoom: 2,
            }),
        ],
    });
    
    setMap(mapInstance);

    const markers = farms.map((farm) => {
        const marker = L.marker([farm.latitude, farm.longitude], {
            icon: L.divIcon({
                className: 'custom-marker',
                html: `
                    <div class="marker-content">
                        <img src="/wind-farm.svg" alt="Parque Icono" class="marker-icon" />
                        <div class="marker-text">
                            <span>${farm.name}</span>
                            <span>${farm.turbines.length}</span>
                        </div>
                    </div>
                `,
                iconSize: [100, 50],
                iconAnchor: [50, 25],
            }),
        }).addTo(mapInstance);

        marker.on('click', () => {
            setSelectedFarm(farm);
        });

        return { farm, marker };
    });

    setCreatedMarkers(markers);

    // Escuchar el evento de zoom
    mapInstance.on('zoomend', () => {
        const zoomLevel = mapInstance.getZoom();

        markers.forEach(({ farm, marker }) => {
            if (zoomLevel > 6) {
                marker.setIcon(
                    L.divIcon({
                        className: 'custom-marker',
                        html: `
                            <div class="marker-wrapper">
                                <div class="marker-content">
                                    <img src="/wind-farm.svg" alt="Parque Icono" class="marker-icon" />
                                    <div class="marker-text">
                                        <span><strong>${farm.name}</strong></span>
                                        <span>${farm.turbines.length}</span>
                                    </div>
                                </div>
                                <div class="marker-base"></div>
                            </div>
                        `,
                        iconSize: [100, 70],
                        iconAnchor: [50, 70],
                    })
                );
            } else {
                marker.setIcon(
                    L.divIcon({
                        className: 'custom-marker',
                        html: `
                            <div class="marker-wrapper">
                                <div class="marker-content">
                                    <img src="/wind-farm.svg" alt="Parque Icono" class="marker-icon" />
                                </div>
                                <div class="marker-base"></div>
                            </div>
                        `,
                        iconSize: [40, 50],
                        iconAnchor: [20, 50],
                    })
                );
            }
        });
    });

    return () => {
        mapInstance.remove();
    };
}, []);

    const searchMarker = () => {
            const foundMarker = createdMarkers.find(({ farm }) =>
                farm.name.toLowerCase().includes(searchTerm.toLowerCase())
            );

            console.log('Buscando parque:', searchTerm, 'Resultado:', foundMarker);

            if (foundMarker) {
                map.setView([foundMarker.farm.latitude, foundMarker.farm.longitude], 10);
                foundMarker.marker.openPopup();
            } else {
                alert('No se encontró el parque eólico.');
            }
        };

    return (
    <>
        <NavBar />
        <div className="dashboard">
            <div className="search-bar">
                    <input
                        type="text"
                        placeholder="Search for a wind park..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <button onClick={searchMarker}>
                        <img src="/search-icon.png" alt="Search Icon" />
                    </button>
                </div>
            <div className="map-container">
                <div id="map" style={{ height: '100vh', width: '100%' }}></div>
            </div>
            <div className="card overview">
                <div className="overview-item">
                    <div className="icon-container">
                        <img src="/wind-farm.svg" alt="Wind Park Icon" />
                    </div>
                    <div className="text-container">
                        <p className="value">{dashboardData.overview.wind_parks}</p>
                        <p className="label">Wind Park</p>
                    </div>
                </div>
                <div className="overview-item">
                    <div className="icon-container">
                        <img src="/wind-turbine.svg" alt="Turbine Icon" />
                    </div>
                    <div className="text-container">
                        <p className="value">{dashboardData.overview.turbines}</p>
                        <p className="label">Turbine</p>
                    </div>
                </div>
            </div>
            {selectedFarm && (
                <>
                <div className="card inspection-overview">
                    <div className="content">
                        <h2>Inspection Overview</h2>
                        <p>WTG Inspected</p>
                        <p className='count-wtg'>
                            <h1>{selectedFarm.turbines.filter(turbine => turbine.condition === 'Defect').length}</h1>
                            <p>WTGs</p>
                        </p>
                        <p className='defect-amount'>
                            <h1>{selectedFarm.turbines.filter(turbine => turbine.condition === 'Defect').reduce((total, turbine) => total + turbine.defects.length, 0)}</h1>
                            <p>Defect amount</p>
                        </p>
                        <div className="warning">
                            <div className="item">
                                <h1>Lv5</h1>
                                <strong>{calculateSeverityData(selectedFarm)[5]}</strong>
                                <p> Defects</p>
                                <strong>{selectedFarm.turbines.filter(t => t.defects.some(d => d.severity === 5)).length}</strong>
                                <p> WTGs</p>
                            </div>
                            <div className="item">
                                <h2>Lv4</h2>
                                <strong>{calculateSeverityData(selectedFarm)[4]}</strong>
                                <p> Defects</p>
                                <strong>{selectedFarm.turbines.filter(t => t.defects.some(d => d.severity === 4)).length}</strong>
                                <p> WTGs</p>
                            </div>
                        </div>
                    </div>
                    <div className='turbine-list'>
                        <div className="title">
                            <h3>Turbine List</h3> <a
                                className="camera-view-button"
                                onClick={() => window.location.href = `/${selectedFarm.id}/cameras`}
                            >
                                <img src="/security-icon.png" alt="Camera Icon" />
                                    </a><a href={`/${selectedFarm.id}/turbines`}><img src="/grid.png" alt="all turbines" /></a>
                        </div>
                        <div className="turbine-grid">
                            {selectedFarm.turbines.filter(turbine => turbine.condition === 'Defect').map((turbine) => (
                                <div key={turbine.id} className="turbine-card">
                                    <div className="turbine-icon">
                                        <span className="defect-dot"></span>
                                        <img src="/wind-turbine.svg" alt="Turbine Icon" />
                                        <span className="defect-count">{turbine.defects.length}</span>
                                    </div>
                                    <p className="turbine-name">{turbine.name}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
                <div className="card asset-health">
                    <h2 className='title'>Severity</h2>
                    <div className="health-chart">
                        <div className='graph'>
                            <Bar data={severityBarData} options={barOptions}/>
                        </div>
                    </div>
                    <h2 className='title'>Defects Types</h2>
                    <div className="health-chart">
                        <div className='graph'>
                            <Bar data={defectTypeBarData} options={barOptions}/>
                        </div>
                    </div>
                </div>
                <div className="card selected-parque">
                    <h2>{selectedFarm.name}</h2>
                    <div className="parque-info-grid">
                        <div className="info-item">
                            <div className="text-container">
                                <p className="value">{selectedFarm.turbines.length}</p>
                                <p className="label">Total Turbines</p>
                            </div>
                        </div>
                        <div className="info-item">
                            <div className="text-container">
                                <p className="value">{selectedFarm.turbines.filter(turbine => turbine.state === 'Online').length}</p>
                                <p className="label">Online Turbines</p>
                            </div>
                        </div>
                        <div className="info-item">
                            <div className="text-container">
                                <p className="value">{selectedFarm.turbines.filter(turbine => turbine.state === 'Offline').length}</p>
                                <p className="label">Offline Turbines</p>
                            </div>
                        </div>
                        <div className="info-item">
                            <div className="text-container">
                                <p className="value">{selectedFarm.wind_velocity} m/s</p>
                                <p className="label">Wind Velocity</p>
                            </div>
                        </div>
                        <div className="info-item">
                            <div className="text-container">
                                <p className="value">{selectedFarm.turbines.reduce((total, turbine) => total + turbine.production, 0)} kWh</p>
                                <p className="label">Production</p>
                            </div>
                        </div>
                    </div>
                </div>
                </>
            )}
        </div>
    </>
    );
};

export default Map;