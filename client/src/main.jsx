import React, { StrictMode } from 'react'  // Added React import
import { createRoot } from 'react-dom/client'
import './index.css'
import './App.css'
import App from './App.jsx'  // Fixed: removed curly braces

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)

