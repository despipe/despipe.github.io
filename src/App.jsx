import { Link, Routes, Route,BrowserRouter } from 'react-router-dom'
import { useState, useEffect } from 'react'
import Loader from './components/Loader'
import Map from './dashboard/Map'
import TurbineList from './dashboard/TurbineList'
import Home from './Home'
import CameraMap from './dashboard/CameraMap'

function App() {
  const [loading, setLoading] = useState(true) // Cambiar a true para mostrar el loader inicialmente

  if (loading) return <Loader onFinish={() => setLoading(false)} /> // El loader se mostrará al inicio

  return (
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/map" element={<Map />} />
        <Route path="/:farmId/turbines" element={<TurbineList />} />
        <Route path="/:id/cameras" element={<CameraMap />} />
      </Routes> 
  )
}

export default App