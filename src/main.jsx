import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';
import { BrowserRouter as Router } from 'react-router-dom';
import { GameProvider } from './contexts/Game.jsx';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <GameProvider>
      <Router
      // basename='/age-guesser'
      >
        <App />
      </Router>
    </GameProvider>
  </React.StrictMode>,
);
