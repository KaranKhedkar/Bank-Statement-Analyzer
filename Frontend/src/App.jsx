// import React from 'react';
// import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
// import Homepage from './pages/homepage';
// import AppLayout from './components/layout/AppLayout';
// import Overview from './pages/overview';
// import UploadData from './pages/upload';
// import Transactions from './pages/Transactions/Transactions';
// import Forecast from './pages/forecast';
// import Anomalies from './pages/aromalies';
// import ModelInfo from './pages/modelInfo';
// import Categories from './pages/categories';



// export default function App() {
//   return (
//     <BrowserRouter>
//       <Routes>

//         <Route path="/" element={<Homepage />} />


//         <Route path="/dashboard" element={<AppLayout />}>
//           <Route index element={<Navigate to="overview" replace />} />
          

//           <Route path="overview" element={<Overview/>} />
//           <Route path="upload" element={<UploadData/>} />
          

//           <Route path="transactions" element={<Transactions/>} />
//           <Route path="forecast" element={<Forecast/>} />
//           <Route path="anomalies" element={<Anomalies/>} />
//           <Route path="model-info" element={<ModelInfo/>} />
//           <Route path="categories" element={<Categories/>} />
//         </Route>
        
        

//         <Route path="*" element={<Navigate to="/" replace />} />
//       </Routes>
//     </BrowserRouter>
//   );
// }




import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Homepage from './pages/homepage';
import AppLayout from './components/layout/AppLayout';
import Overview from './pages/overview';
import Copilot from './pages/copilot';
import UploadData from './pages/upload';
import Transactions from './pages/Transactions/Transactions';
import Forecast from './pages/forecast';
import Anomalies from './pages/anomalies';
import ModelInfo from './pages/modelInfo';
import Categories from './pages/categories';
import Auth from './pages/Auth';
import ProtectedRoute from './components/ProtectedRoute';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>

        <Route path="/" element={<Homepage />} />
        <Route path="/auth" element={<Auth />} />

        <Route path="/dashboard" element={
          <ProtectedRoute>
            <AppLayout />
          </ProtectedRoute>
        }>
          <Route index element={<Navigate to="overview" replace />} />

          <Route path="overview" element={<Overview />} />
          <Route path="copilot" element={<Copilot />} />
          <Route path="upload" element={<UploadData />} />
          <Route path="transactions" element={<Transactions />} />
          <Route path="forecast" element={<Forecast />} />
          <Route path="anomalies" element={<Anomalies />} />
          <Route path="model-info" element={<ModelInfo />} />
          <Route path="categories" element={<Categories />} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />

      </Routes>
    </BrowserRouter>
  );
}
