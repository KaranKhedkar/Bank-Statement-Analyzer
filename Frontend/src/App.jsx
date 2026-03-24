import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Homepage from './pages/homepage';
import AppLayout from './components/layout/AppLayout';
import Overview from './pages/overview';
import UploadData from './pages/upload';
import Transactions from './pages/Transactions/Transactions';
import Forecast from './pages/forecast';
import Anomalies from './pages/aromalies';
import ModelInfo from './pages/modelInfo';
import Categories from './pages/categories';

// Placeholder components so the app compiles immediately. 
// We will replace these with real files next!
const Placeholder = ({ title }) => (
  <div className="h-full flex items-center justify-center bg-white rounded-3xl border border-stone-200 shadow-sm min-h-[60vh]">
    <p className="text-stone-400 font-medium">{title} Component goes here.</p>
  </div>
);

export default function App() {
  return (
    <BrowserRouter>
      <Routes>

        <Route path="/" element={<Homepage />} />


        <Route path="/dashboard" element={<AppLayout />}>
          <Route index element={<Navigate to="overview" replace />} />
          

          <Route path="overview" element={<Overview/>} />
          <Route path="upload" element={<UploadData/>} />
          

          <Route path="transactions" element={<Transactions/>} />
          <Route path="forecast" element={<Forecast/>} />
          <Route path="anomalies" element={<Anomalies/>} />
          <Route path="model-info" element={<ModelInfo/>} />
          <Route path="categories" element={<Categories/>} />
        </Route>
        
        

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}



