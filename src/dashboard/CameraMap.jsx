import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import './CameraMap.css';
import NavBar from '../components/NavBar';
import farms from '../data/parques.json';
import BackButton from '../components/BackButton';
import CameraSecurity from '../components/CameraSecurity';

const CameraMap = () => {
    const { id } = useParams();
    const [selectedFarm, setSelectedFarm] = useState(null);
    const [map, setMap] = useState(null);
    const [selectedCameraIndex, setSelectedCameraIndex] = useState(0);


    useEffect(() => {
        const farm = farms.find((farm) => farm.id === parseInt(id));
        setSelectedFarm(farm);
    }, [id]);

    useEffect(() => {
    if (!selectedFarm) return;

    

    const mapInstance = L.map('map', {
        center: [selectedFarm.latitude, selectedFarm.longitude],
        zoom: 13,
        zoomControl: false,
        worldCopyJump: false,
        maxZoom: 19, 
        minZoom: 13, 
        maxBounds: [
            [selectedFarm.latitude - 0.1, selectedFarm.longitude - 0.1], // Coordenadas suroeste
            [selectedFarm.latitude + 0.1, selectedFarm.longitude + 0.1], // Coordenadas noreste
        ], // Limita el rango de movimiento del mapa
        layers: [
            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                maxZoom: 19,
            }),
        ],
    });

    setMap(mapInstance);
    setTimeout(() => {
        mapInstance.invalidateSize();
    }, 0);


    // Crear marcadores para las cámaras de seguridad
    selectedFarm.security_cameras.forEach((camera, index) => {
        const marker = L.marker([camera.latitude, camera.longitude], {
            icon: L.divIcon({
                className: 'custom-camera-marker',
                html: `
                    <div class="camera-marker-content">
                        <img src="/camera-icon.png" alt="Camera Icon" class="camera-marker-icon" />
                        <div class="camera-marker-text">
                            <span>${camera.name}</span>
                        </div>
                    </div>
                `,
                iconSize: [100, 50],
                iconAnchor: [50, 25],
            }),
        }).addTo(mapInstance);

        // Evento para seleccionar la cámara al hacer clic en el marcador
        marker.on('click', () => {
            setSelectedCameraIndex(index);
            mapInstance.setView([camera.latitude, camera.longitude], 15); // Centra el mapa en la cámara seleccionada
        });
    });

    return () => {
        mapInstance.remove();
    };
}, [selectedFarm]);

    const handleNextCamera = () => {
        if (!selectedFarm) return;
        setSelectedCameraIndex((prevIndex) => {
            const nextIndex = (prevIndex + 1) % selectedFarm.security_cameras.length;
            const nextCamera = selectedFarm.security_cameras[nextIndex];
            map.setView([nextCamera.latitude, nextCamera.longitude], 15); // Centra el mapa en la siguiente cámara
            return nextIndex;
        });
    };

    const handlePreviousCamera = () => {
        if (!selectedFarm) return;
        setSelectedCameraIndex((prevIndex) => {
            const newIndex = (prevIndex - 1 + selectedFarm.security_cameras.length) % selectedFarm.security_cameras.length;
            const prevCamera = selectedFarm.security_cameras[newIndex];
            map.setView([prevCamera.latitude, prevCamera.longitude], 15); // Centra el mapa en la cámara anterior
            return newIndex;
        });
    };

    const selectedCamera = selectedFarm?.security_cameras[selectedCameraIndex];

    return (
        <div className="camera-map">
            <NavBar />
            <BackButton />
            <h2 className="camera-map-title">
                Cameras for {selectedFarm ? selectedFarm.name : 'Loading...'}
            </h2>
            <div className="camera-map-container">
                <div className="minimap-container">
                    {selectedFarm ? (
                        <div id="map" style={{ height: '100%', width: '100%' }}></div>
                    ) : (
                        <p className="error-message">No farm selected. Please select a farm to view the map.</p>
                    )}
                </div>
                <CameraSecurity
                    selectedCamera={selectedCamera}
                    handlePreviousCamera={handlePreviousCamera}
                    handleNextCamera={handleNextCamera}
                />
            </div>
        </div>
    );
};

export default CameraMap;