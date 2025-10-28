// Quiero hacer un loader que sea el logo de la empresa girando y que se muestre al cargar la página. El loader debe desaparecer cuando la página haya cargado completamente. Aquí tienes el código para el Loader.jsx:
import React, { useEffect, useState } from 'react';
import './Loader.css';
import logo from '/logo.png';

const Loader = ({ onFinish }) => {
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            setLoading(false);
            onFinish();
        }, 3000); // Simulate a 3-second loading time

        return () => clearTimeout(timer);
    }, [onFinish]);

    if (!loading) return null;

    return (
        <div className="loader">
            <img src={logo} alt="Loading..." className="loader-logo" />
        </div>
    );
}

export default Loader;