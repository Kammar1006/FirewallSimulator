import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';
import { BrowserRouter } from 'react-router-dom';
import RulesContextProvider from './context/RulesContext.jsx';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useEffect } from 'react';

const CustomCursor = () => {
  useEffect(() => {
    const cursor = document.createElement('div');
    cursor.classList.add('custom-cursor');
    document.body.appendChild(cursor);

    const moveCursor = (e) => {
      cursor.style.left = `${e.clientX}px`;
      cursor.style.top = `${e.clientY}px`;
    };

    const addDraggingClass = () => cursor.classList.add('dragging');
    const removeDraggingClass = () => cursor.classList.remove('dragging');

    document.addEventListener('mousemove', moveCursor);
    document.addEventListener('dragstart', addDraggingClass);
    document.addEventListener('dragend', removeDraggingClass);

    return () => {
      document.removeEventListener('mousemove', moveCursor);
      document.removeEventListener('dragstart', addDraggingClass);
      document.removeEventListener('dragend', removeDraggingClass);
      document.body.removeChild(cursor);
    };
  }, []);

  return null;
};

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RulesContextProvider>
      <BrowserRouter>
        <ToastContainer />
        <CustomCursor />
        <App />
      </BrowserRouter>
    </RulesContextProvider>
  </StrictMode>,
);