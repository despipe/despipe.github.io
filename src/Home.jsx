import React from "react";
import { useEffect } from "react";
import "./Home.css";
import { motion } from "framer-motion";
import { MapPin, Search, Wind, Camera } from "lucide-react";
import NavBar from "./components/NavBar";
import Loader from "./components/Loader";

export default function Home() {
  const [loading, setLoading] = React.useState(true);

  useEffect(() => {
    // Simulate loading data
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2000); // Simulate a 2-second loading time
    return () => clearTimeout(timer);
  }, []);
  if (loading) {
    return <Loader />;
  }

  return (
    <>
      <NavBar />
      <div className="home-container">
        <section className="hero">
          <motion.div
            className="hero-content"
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
          >
            <h1 className="title">
              <img src="/logo-extend.png" alt="logo" />
            </h1>
            <p className="slogan">
              Vigilancia inteligente para la energía del futuro
            </p>
            <button className="cta-button">Explora nuestros parques</button>
          </motion.div>
        </section>

        <section className="features">
          <motion.div
            className="feature-card"
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.3 }}
          >
            <Camera className="feature-icon" />
            <h3>Monitoreo en tiempo real</h3>
            <p>Cámaras HD que vigilan cada turbina con precisión.</p>
          </motion.div>

          <motion.div
            className="feature-card"
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.3 }}
          >
            <Wind className="feature-icon" />
            <h3>Detección de defectos</h3>
            <p>
              IA avanzada para identificar fallas antes de que se conviertan en
              problemas.
            </p>
          </motion.div>

          <motion.div
            className="feature-card"
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.3 }}
          >
            <MapPin className="feature-icon" />
            <h3>Ubicación global</h3>
            <p>Accede al mapa mundial para encontrar parques monitoreados.</p>
          </motion.div>

          <motion.div
            className="feature-card"
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.3 }}
          >
            <Search className="feature-icon" />
            <h3>Búsqueda rápida</h3>
            <p>Encuentra cualquier parque por nombre</p>
          </motion.div>
        </section>

        <section className="map-preview">
          <h2>Explora el mapa global</h2>
          <div className="map-placeholder">[Mapa interactivo aquí]</div>
        </section>
      </div>
    </>
  );
}
