import React from 'react';
import { createRoot } from 'react-dom/client';
import '../styles/globals.css';

const Popup = () => {
  return (
    <div className="w-[300px] h-[400px] p-4">
      <h1 className="text-xl font-bold mb-4">ChatGPT Enhancer</h1>
      <p className="text-sm text-gray-600">
        Use the overlay panel to manage your prompts and folders.
      </p>
    </div>
  );
};

const root = createRoot(document.getElementById('root')!);
root.render(
  <React.StrictMode>
    <Popup />
  </React.StrictMode>
); 