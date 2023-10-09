import { App } from './App'
import './index.css'
import './markdown.css'
import React from 'react'
import ReactDOM from 'react-dom/client'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <div className="border-rosePineDawn-highlight-high divide-rosePineDawn-highlight-high flex h-screen divide-x-2 overflow-hidden bg-rosePineDawn-base text-rosePineDawn-text">
      <App />
    </div>
  </React.StrictMode>,
)
