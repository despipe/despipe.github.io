import './App.css';
import React, { useState } from 'react';
import Plot from 'react-plotly.js';
import * as Tone from 'tone';

function App() {
  const [isPlaying, setIsPlaying] = useState(false); // Estado para controlar si la canción está reproduciéndose

  const playSong = async () => {
    if (!isPlaying) {
      setIsPlaying(true); 
  
      const player = new Tone.Player({
        url: process.env.PUBLIC_URL + "/numb.mp3",
        autostart: false,  // No iniciar hasta que el archivo esté cargado
        onload: () => {
          player.start();  // Inicia la reproducción cuando esté listo
          console.log("El archivo de audio ha sido cargado y se está reproduciendo");
        },
        onerror: (error) => {
          console.error("Error al cargar el archivo de audio:", error);
          setIsPlaying(false);
        },
        onstop: () => {
          setIsPlaying(false);
        }
      }).toDestination();
  
      await Tone.start();  // Inicia el contexto de audio
    } else {
      console.log("La canción ya está reproduciéndose");
    }
  };

  return (
    <>
    <div className="App">
      <header className="App-header">
        <img src="linkin.png" className="App-logo" alt="logo" />
        <p>
          <h1 className='title'>Linkin Park</h1>
        </p>
      </header>
    </div>
    <div className='plot-container'>
    <Plot
      data={[

        {
          x: ["Hybrid Theory", "Meteora", "Minutes to Midnight", "A Thousand Suns", "Living Things", "The Hunting Party", "One More Light"],
          y: [10500000, 8500000, 5000000, 900000, 750000, 550000, 100000],
          type: 'scatter',
          mode: 'lines+markers',
          marker: {color: 'red'},
        },
        {
          type: 'bar',
          x: ["Hybrid Theory", "Meteora", "Minutes to Midnight", "A Thousand Suns", "Living Things", "The Hunting Party", "One More Light"],
          y: [10500000, 8500000, 5000000, 900000, 750000, 550000, 100000],
        },

      ]}
      layout={ {width: 1000, height: 700, title: 'Ventas de los álbumes más vendidos de Linkin Park'} }
      />
    </div>
    <div className='repro-container'>
      <img src="repro.jpeg" className="repro-logo" alt="logo" />
      <button onClick={playSong} className="play-button" disabled={isPlaying}>
        {isPlaying ? "Reproduciendo..." : "Reproducir canción"}
      </button>
    </div>
    </>
    
  );
}

export default App;
