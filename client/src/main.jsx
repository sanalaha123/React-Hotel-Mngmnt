import React from 'react';
import ReactDOM from 'react-dom/client';
import { Toaster } from 'react-hot-toast';
import App from './App.jsx';
import { SocketProvider } from './context/SocketContext.jsx';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <SocketProvider>
      <Toaster position="top-right" />
      <App />
    </SocketProvider>
  </React.StrictMode>
);
