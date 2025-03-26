import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'
import RulesContextProvider from './context/RulesContext.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RulesContextProvider>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </RulesContextProvider>
  </StrictMode>,
)