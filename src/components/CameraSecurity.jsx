import PropTypes from "prop-types";
import { useState } from "react";
import "./Camera.css";

const CameraSecurity = ({
  selectedCamera,
  handlePreviousCamera,
  handleNextCamera,
}) => {
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  return (
    <div className="camera-vision">
      {selectedCamera ? (
        <div className="camera-display-container">
          {/* Botón para cambiar a la cámara anterior */}
          <button
            className="navigation-button left"
            onClick={handlePreviousCamera}
          >
            ◀
          </button>

          {/* Imagen de ejemplo simulando una cámara conectada */}
          <div className="camera-display">
            <img
              src="/example-camara.jpg" // Ruta de la imagen de ejemplo
              alt={`Camera feed for ${selectedCamera.name}`}
              className="camera-image"
            />
            <div className="camera-info">
              <ul className="camera-list">
                <li className="camera-item">
                  <p>{selectedCamera.name}</p>
                  <p>
                    <strong>Status:</strong> {selectedCamera.status}
                  </p>
                  <p>
                    <strong>Link:</strong>{" "}
                    <a
                      href={selectedCamera.link}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {selectedCamera.link}
                    </a>
                  </p>
                </li>
              </ul>
            </div>
          </div>

          {/* Botón para cambiar a la siguiente cámara */}
          <button
            className="navigation-button right"
            onClick={handleNextCamera}
          >
            ▶
          </button>
        </div>
      ) : (
        <p>No camera selected.</p>
      )}
      <button className="popup-button" onClick={() => setIsPopupOpen(true)}>
        <img src="/full-icon.webp" alt="fullscreen" />
      </button>
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
                alt={`Camera feed for ${selectedCamera.name}`}
                className="popup-camera-image"
              />
              <div className="popup-camera-info">
                <ul className="camera-list">
                  <li className="camera-item">
                    <p>{selectedCamera.name}</p>
                    <p>
                      <strong>Status:</strong> {selectedCamera.status}
                    </p>
                    <p>
                      <strong>Link:</strong>{" "}
                      <a
                        href={selectedCamera.link}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {selectedCamera.link}
                      </a>
                    </p>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Definición de los tipos de las propiedades
CameraSecurity.propTypes = {
  selectedCamera: PropTypes.shape({
    name: PropTypes.string.isRequired,
    status: PropTypes.string.isRequired,
    link: PropTypes.string.isRequired,
  }),
  handlePreviousCamera: PropTypes.func.isRequired,
  handleNextCamera: PropTypes.func.isRequired,
};

export default CameraSecurity;
