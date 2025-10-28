import { useState } from 'react';
import PropTypes from 'prop-types';
import './Camera.css';

const CameraTurbine = ({ selectedTurbine, selectedBlade }) => {
    const [selectedFade, setSelectedFade] = useState(1); // Estado para el fade seleccionado
    const [isPopupOpen, setIsPopupOpen] = useState(false); // Estado para controlar el popup

    // Verifica si hay cámaras disponibles para la pala seleccionada
    const camerasForBlade = selectedTurbine?.cameras[selectedBlade - 1] || [];

    return (
        <div className="camera-vision">
            {camerasForBlade.length > 0 ? (
                <>
                    <div className="camera-display-container">
                        {/* Botón para cambiar al fade anterior */}
                        <button
                            className="navigation-button left"
                            onClick={() => setSelectedFade((prev) => (prev > 1 ? prev - 1 : camerasForBlade.length))}
                        >
                            ◀
                        </button>

                        {/* Imagen de ejemplo simulando una cámara conectada */}
                        <div className="camera-display">
                            <img
                                src="/example-camara.jpg" // Ruta de la imagen de ejemplo
                                alt={`Camera for Blade ${selectedBlade}, Fade ${selectedFade}`}
                                className="camera-image"
                            />
                            <div className="camera-info">
                                <ul className="camera-list">
                                    {camerasForBlade
                                        .filter((_, index) => index + 1 === selectedFade) // Filtrar por fade seleccionado
                                        .map((camera, index) => (
                                            <li key={index} className="camera-item">
                                                <p>{camera.name}</p>
                                                <p><strong>Status:</strong> {camera.status}</p>
                                                <p>
                                                    <strong>Link:</strong>{' '}
                                                    <a href={camera.link} target="_blank" rel="noopener noreferrer">
                                                        {camera.link}
                                                    </a>
                                                </p>
                                            </li>
                                        ))}
                                </ul>
                            </div>
                        </div>

                        {/* Botón para cambiar al siguiente fade */}
                        <button
                            className="navigation-button right"
                            onClick={() => setSelectedFade((prev) => (prev < camerasForBlade.length ? prev + 1 : 1))}
                        >
                            ▶
                        </button>
                    </div>

                    {/* Botón para abrir el popup */}
                    <button className="popup-button" onClick={() => setIsPopupOpen(true)}>
                        <img src="/full-icon.webp" alt="fullscreen" />
                    </button>

                    {/* Popup para pantalla completa */}
                    {isPopupOpen && (
                        <div className="popup-overlay" onClick={() => setIsPopupOpen(false)}>
                            <div
                                className="popup-content"
                                onClick={(e) => e.stopPropagation()} // Evita cerrar el popup al hacer clic dentro
                            >
                                <button className="close-button" onClick={() => setIsPopupOpen(false)}>
                                    ✖
                                </button>
                                <div className="popup-camera-display">
                                    <img
                                        src="/example-camara.jpg"
                                        alt={`Camera for Blade ${selectedBlade}, Fade ${selectedFade}`}
                                        className="popup-camera-image"
                                    />
                                    <div className="popup-camera-info">
                                        <ul className="camera-list">
                                            {camerasForBlade
                                                .filter((_, index) => index + 1 === selectedFade)
                                                .map((camera, index) => (
                                                    <li key={index} className="camera-item">
                                                        <p>{camera.name}</p>
                                                        <p><strong>Status:</strong> {camera.status}</p>
                                                        <p>
                                                            <strong>Link:</strong>{' '}
                                                            <a href={camera.link} target="_blank" rel="noopener noreferrer">
                                                                {camera.link}
                                                            </a>
                                                        </p>
                                                    </li>
                                                ))}
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </>
            ) : (
                <p>No cameras available for this blade and fade.</p>
            )}
        </div>
    );
};

// Definición de los tipos de las propiedades
CameraTurbine.propTypes = {
    selectedTurbine: PropTypes.shape({
        cameras: PropTypes.arrayOf(
            PropTypes.arrayOf(
                PropTypes.shape({
                    name: PropTypes.string.isRequired,
                    status: PropTypes.string.isRequired,
                    link: PropTypes.string.isRequired,
                })
            )
        ),
    }),
    selectedBlade: PropTypes.number.isRequired,
};

export default CameraTurbine;