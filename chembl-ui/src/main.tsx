import React from 'react';
import ReactDOM from 'react-dom/client';
import { AuthProvider } from './auth/AuthProvider';
import { BrowserRouter } from 'react-router-dom';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import './agGridSetup'; // 👈 ADD THIS
import './index.css';
import App from './App';

ReactDOM.createRoot(document.getElementById('root')!).render(
  
  <React.StrictMode>
    <AuthProvider>
    <BrowserRouter>
      <App />
    </BrowserRouter>
    </AuthProvider>
  </React.StrictMode>
);
