import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import Sidebar from '../../../components/common/sidebar';
import Header from '../../../components/common/header';
import { useAuth } from '../../../contexts/authcontext';
import { ArrowLeft, FileText, Package } from 'lucide-react';

const PengecekanBarang = () => {
  const { id } = useParams(); // BAPB number from URL
  const navigate = useNavigate();
  const location = useLocation();
  const { userEmail, logout } = useAuth();

  const [dokumen, setDokumen] = useState(null);
  const [barangList, setBarangList] = useState([]);

  useEffect(() => {
    // Get dokumen from navigation state
    if (location.state?.dokumen) {
      const dok = location.state.dokumen;
      setDokumen(dok);
      // Initialize barangList with checked and catatan fields
      setBarangList(dok.barangList.map(item => ({ 
        ...item, 
        checked: false, 
        catatan: '' 
      })));
    } else {
      // If no state, redirect back
      alert('Data dokumen tidak ditemukan');
      navigate('/pic-gudang/persetujuan-bapb');
    }
  }, [location, navigate]);

  const handleLogout = () => {
    const confirm = window.confirm('Apakah Anda yakin ingin logout?');
    if (confirm) {
      logout();
      navigate('/login');
    }
  };

  const user = {
    name: 'PIC Gudang',
    role: 'gudang',
    email: userEmail
  };

  const handleKembaliKeList = () => {
    const confirm = window.confirm('Apakah Anda yakin ingin kembali? Progress pengecekan akan hilang.');
    if (confirm) {
      navigate('/pic-gudang/persetujuan-bapb');
    }
  };

  const handleCheckboxChange = (itemId) => {
    setBarangList(barangList.map(item => 
      item.id === itemId ? { ...item, checked: !item.checked } : item
    ));
  };

  const handleCatatanChange = (itemId, value) => {
    setBarangList(barangList.map(item => 
      item.id === itemId ? { ...item, catatan: value } : item
    ));
  };

  const allItemsChecked = barangList.every(item => item.checked);

  const handleLanjutKePersetujuan = () => {
    if (!allItemsChecked) {
      alert('Harap lakukan pengecekan untuk semua barang terlebih dahulu!');
      return;
    }

    // Navigate to persetujuan page with updated data
    navigate(`/pic-gudang/persetujuan-bapb/persetujuan/${id}`, {
      state: { dokumen, barangList }
    });
  };

  if (!dokumen) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar */}
      <Sidebar role="gudang" />
      
      {/* Main Content */}
      <div className="ml-64">
        {/* Header */}
        <Header user={user} onLogout={handleLogout} />
        
        {/* Page Content */}
        <main className="p-8">
          <div className="max-w-7xl mx-auto">
            {/* Back Button */}
            <button
              onClick={handleKembaliKeList}
              className="mb-6 flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ArrowLeft size={20} />
              <span className="font-medium">Kembali ke Daftar Dokumen</span>
            </button>

            {/* Page Title */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900">Pengecekan Barang</h1>
              <p className="text-gray-500 mt-1">Lakukan pengecekan dan verifikasi kondisi barang</p>
            </div>

            {/* Step Indicator */}
            <div className="mb-8">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-100 text-blue-700">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center bg-blue-600 text-white">
                    1
                  </div>
                  <span className="font-medium">Pengecekan Barang</span>
                </div>

                <div className="h-1 w-12 bg-gray-300"></div>

                <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-100 text-gray-500">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center bg-gray-300 text-gray-600">
                    2
                  </div>
                  <span className="font-medium">Persetujuan</span>
                </div>
              </div>
            </div>

            {/* Content Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Left Column - Overview & List Barang */}
              <div className="lg:col-span-2 space-y-6">
                {/* Overview Dokumen */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <FileText className="text-blue-600" size={24} />
                    <h2 className="text-xl font-bold text-gray-900">Overview Dokumen</h2>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <p className="text-sm text-gray-500">No BAPB</p>
                      <p className="font-semibold text-gray-900">{dokumen.noBapb}</p>
                    </div>
                    
                    <div>
                      <p className="text-sm text-gray-500">Nama Proyek</p>
                      <p className="font-semibold text-gray-900">{dokumen.namaProyek}</p>
                    </div>

                    <div>
                      <p className="text-sm text-gray-500">Deskripsi</p>
                      <p className="text-gray-700">{dokumen.deskripsi}</p>
                    </div>

                    <div className="grid grid-cols-2 gap-4 pt-3 border-t border-gray-200">
                      <div>
                        <p className="text-sm text-gray-500">PIC Proyek</p>
                        <p className="font-medium text-gray-900">{dokumen.picProyek}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">PIC Vendor</p>
                        <p className="font-medium text-gray-900">{dokumen.picVendor}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* List Barang - Pengecekan */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <Package className="text-blue-600" size={24} />
                    <h2 className="text-xl font-bold text-gray-900">List Barang - Pengecekan</h2>
                  </div>

                  <div className="space-y-4">
                    {barangList.map((barang) => (
                      <div 
                        key={barang.id} 
                        className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 transition-colors"
                      >
                        <div className="flex items-start gap-4">
                          {/* Checkbox */}
                          <input
                            type="checkbox"
                            checked={barang.checked}
                            onChange={() => handleCheckboxChange(barang.id)}
                            className="mt-1 w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
                          />

                          {/* Info Barang */}
                          <div className="flex-1">
                            <div className="flex items-start justify-between mb-2">
                              <div>
                                <h3 className="font-semibold text-gray-900">{barang.namaBarang}</h3>
                                <p className="text-sm text-gray-600">
                                  {barang.quantity} {barang.satuan}
                                </p>
                              </div>
                            </div>

                            <p className="text-sm text-gray-600 mb-3">{barang.spesifikasi}</p>

                            {/* Catatan Field */}
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                Catatan Kondisi Barang
                              </label>
                              <textarea
                                value={barang.catatan}
                                onChange={(e) => handleCatatanChange(barang.id, e.target.value)}
                                placeholder="Tulis catatan kondisi barang (opsional)"
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                                rows={2}
                                disabled={!barang.checked}
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Progress Indicator */}
                  <div className="mt-6 pt-4 border-t border-gray-200">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Progress Pengecekan:</span>
                      <span className="font-semibold text-blue-600">
                        {barangList.filter(item => item.checked).length} / {barangList.length} barang
                      </span>
                    </div>
                    <div className="mt-2 h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-blue-600 transition-all duration-300"
                        style={{ 
                          width: `${(barangList.filter(item => item.checked).length / barangList.length) * 100}%` 
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column - Info & Actions */}
              <div className="lg:col-span-1">
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 sticky top-6 space-y-6">
                  {/* Info Dokumen */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">Informasi Dokumen</h3>
                    
                    <div className="space-y-3">
                      <div>
                        <p className="text-xs text-gray-500">Vendor</p>
                        <p className="text-sm font-medium text-gray-900 mt-0.5">{dokumen.vendor}</p>
                      </div>

                      <div>
                        <p className="text-xs text-gray-500">Tanggal Pengajuan</p>
                        <p className="text-sm font-medium text-gray-900 mt-0.5">{dokumen.tanggalPengajuan}</p>
                      </div>

                      <div>
                        <p className="text-xs text-gray-500">Total Barang</p>
                        <p className="text-sm font-medium text-gray-900 mt-0.5">{dokumen.jumlahBarang} item</p>
                      </div>

                      <div>
                        <p className="text-xs text-gray-500">Status</p>
                        <span className="inline-flex items-center px-2 py-1 bg-yellow-50 text-yellow-700 rounded-full text-xs font-medium mt-0.5">
                          {dokumen.status}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="pt-4 border-t border-gray-200">
                    <button
                      onClick={handleLanjutKePersetujuan}
                      disabled={!allItemsChecked}
                      className={`w-full py-3 rounded-lg font-semibold transition-colors ${
                        allItemsChecked
                          ? 'bg-blue-600 text-white hover:bg-blue-700'
                          : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      }`}
                    >
                      {allItemsChecked ? 'Lanjut ke Persetujuan' : 'Selesaikan Pengecekan'}
                    </button>

                    {!allItemsChecked && (
                      <p className="text-xs text-center text-gray-500 mt-2">
                        {barangList.filter(item => !item.checked).length} barang belum dicek
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default PengecekanBarang;