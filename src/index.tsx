import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Route, Routes, HashRouter } from 'react-router-dom';
import './index.css';

// Ваши компоненты
import { App } from './App';
import { Staking } from './Staking';

// Импортируем ваш WebProvider
import { WebProvider } from './WebProvider';

// Переключатель ENV (development/production)
const ENV:string = "productiom";

// Создаём root
const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  <React.StrictMode>
    {/* Оборачиваем приложение в WebProvider */}
    <WebProvider>
      {
        ENV === 'development' ? (
          <HashRouter>
            <Routes>
              <Route path="/" element={<App />} />
              <Route path="/staking" element={<Staking />} />
            </Routes>
          </HashRouter>
        ) : (
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<App />} />
              <Route path="/staking" element={<Staking />} />
            </Routes>
          </BrowserRouter>
        )
      }
    </WebProvider>
  </React.StrictMode>
);
