import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App.jsx';
import './index.css';

/* dev(npm run dev) 일 때는 '/', build 후 배포는 '/journal-app' */
const base = import.meta.env.DEV ? '/' : '/journal-app';

ReactDOM.createRoot(document.getElementById('root')).render(
  <BrowserRouter basename={base}>
    <App />
  </BrowserRouter>
);
