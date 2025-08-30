import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import HomePage from './components/Home/HomePage.jsx'
import Navbar from './components/Header/Navbar.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Navbar />
    <HomePage />
  </StrictMode>,
)
