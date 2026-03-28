import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import PoliticalApp from './PoliticalApp.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <PoliticalApp />
  </StrictMode>,
)
