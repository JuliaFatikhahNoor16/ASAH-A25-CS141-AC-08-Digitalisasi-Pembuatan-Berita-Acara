// App.jsx
import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import VendorLayout from './layouts/vendor-layouts';
import VendorDashboard from './pages/vendor/vendor-dashboard';
import DokumenSaya from './pages/vendor/dokumen-saya';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Vendor Routes */}
        <Route path="/vendor" element={<VendorLayout />}>
          <Route index element={<VendorDashboard />} />
          <Route path="dashboard" element={<VendorDashboard />} />
          <Route path="dokumen-saya" element={<DokumenSaya />} />
          {/* Route lain nanti: */}
          {/* <Route path="tambah-dokumen" element={<TambahDokumen />} /> */}
          {/* <Route path="notifikasi" element={<NotifikasiVendor />} /> */}
        </Route>
        
        {/* Default redirect ke vendor dashboard */}
        <Route path="/" element={<Navigate to="/vendor/dashboard" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;