import { Routes, Route } from 'react-router-dom'
import './App.css'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import Resources from './pages/Resources'
import Bookings from './pages/Bookings'
import Tickets from './pages/Tickets'
import Dashboard from './pages/Dashboard'

function App() {
  return (
    <div className="app-container">
      <Navbar />
      <main className="main-content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/resources" element={<Resources />} />
          <Route path="/bookings" element={<Bookings />} />
          <Route path="/tickets" element={<Tickets />} />
          <Route path="/dashboard" element={<Dashboard />} />
        </Routes>
      </main>
    </div>
  )
}

export default App
