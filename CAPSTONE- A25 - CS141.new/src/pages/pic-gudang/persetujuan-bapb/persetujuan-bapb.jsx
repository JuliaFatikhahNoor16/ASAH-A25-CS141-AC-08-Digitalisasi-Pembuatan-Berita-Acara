import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import Sidebar from '../../../components/common/sidebar';
import Header from '../../../components/common/header';
import { useAuth } from '../../../contexts/authcontext';
import { ArrowLeft, FileText, Package, CheckCircle2, XCircle } from 'lucide-react';

const PersetujuanBapb = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { userEmail, logout } = useAuth();

  const [dokumen, setDokumen] = useState(null);
  const [barangList, setBarangList] = useState([]);
  const [isApprovalModalOpen, setIsApprovalModalOpen] = useState(false);
  const [approvalNote, setApprovalNote] = useState('');

  useEffect(() => {
    // Get dokumen and barangList from navigation state
    if (location.state?.dokumen && location.state?.barangList) {
      setDokumen(location.state.dokumen);
      setBarangList(location.state.barangList);
    } else {
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

  const handleKembaliKePengecekan = () => {
    navigate(`/pic-gudang/persetujuan-bapb/pengecekan/${id}`, {
      state: { dokumen, barangList }
    });
  };

  const handleSetujui = () => {
    setIsApprovalModalOpen(true);
    setApprovalNote('');
  };

  const handleKonfirmasiApproval = () => {
    alert(`BAPB berhasil disetujui!${approvalNote ? `\nCatatan: ${approvalNote}` : ''}`);
    setIsApprovalModalOpen(false);
    setApprovalNote('');
    navigate('/pic-gudang/persetujuan-bapb');
  };

  const handleBatalApproval = () => {
    setIsApprovalModalOpen(false);
    setApprovalNote('');
  };

  const handleTolak = () => {
    const alasan = window.prompt('Masukkan alasan penolakan:');
    if (alasan) {
      alert(`BAPB ditolak dengan alasan: ${alasan}`);
      navigate('/pic-gudang/persetujuan-bapb');
    }
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
              onClick={handleKembaliKePengecekan}
              className="mb-6 flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ArrowLeft size={20} />
              <span className="font-medium">Kembali ke Pengecekan</span>
            </button>

            {/* Page Title */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900">Persetujuan BAPB</h1>
              <p className="text-gray-500 mt-1">Review hasil pengecekan dan lakukan persetujuan</p>
            </div>

            {/* Step Indicator */}
            <div className="mb-8">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-100 text-gray-500">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center bg-gray-300 text-gray-600">
                    1
                  </div>
                  <span className="font-medium">Pengecekan Barang</span>
                </div>

                <div className="h-1 w-12 bg-gray-300"></div>

                <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-100 text-blue-700">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center bg-blue-600 text-white">
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

                {/* List Barang - Hasil Pengecekan */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <Package className="text-blue-600" size={24} />
                    <h2 className="text-xl font-bold text-gray-900">List Barang - Hasil Pengecekan</h2>
                  </div>

                  <div className="space-y-4">
                    {barangList.map((barang) => (
                      <div 
                        key={barang.id} 
                        className="border border-gray-200 rounded-lg p-4"
                      >
                        <div className="flex items-start gap-4">
                          {/* Check Icon */}
                          <CheckCircle2 className="mt-1 text-green-600 flex-shrink-0" size={20} />

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

                            {/* Display Catatan */}
                            <div className="bg-gray-50 rounded-lg p-3">
                              <p className="text-xs font-medium text-gray-500 mb-1">Catatan Pengecekan:</p>
                              <p className="text-sm text-gray-700">
                                {barang.catatan || 'Tidak ada catatan'}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Summary */}
                  <div className="mt-6 pt-4 border-t border-gray-200">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Total Barang Dicek:</span>
                      <span className="font-semibold text-green-600">
                        {barangList.length} / {barangList.length} barang ✓
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column - Actions & Info */}
              <div className="lg:col-span-1">
                <div className="space-y-6">
                  {/* Action Buttons */}
                  <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    <h3 className="font-bold text-gray-900 mb-4">Tindakan</h3>
                    
                    <div className="space-y-3">
                      <button
                        onClick={handleSetujui}
                        className="w-full px-6 py-3 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
                      >
                        <CheckCircle2 size={20} />
                        Setujui BAPB
                      </button>

                      <button
                        onClick={handleTolak}
                        className="w-full px-6 py-3 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors flex items-center justify-center gap-2"
                      >
                        <XCircle size={20} />
                        Tolak BAPB
                      </button>
                    </div>
                  </div>

                  {/* Status Info */}
                  <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    <h3 className="font-bold text-gray-900 mb-4">Status Saat Ini</h3>
                    
                    <div className="space-y-3">
                      <div className="inline-block px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm font-medium">
                        {dokumen.status}
                      </div>

                      <div>
                        <p className="text-sm text-gray-500">Tanggal Pengajuan</p>
                        <p className="font-semibold text-gray-900">{dokumen.tanggalPengajuan}</p>
                      </div>

                      <div>
                        <p className="text-sm text-gray-500">No BAPB</p>
                        <p className="font-semibold text-gray-900">{dokumen.noBapb}</p>
                      </div>

                      <div>
                        <p className="text-sm text-gray-500">Vendor</p>
                        <p className="font-semibold text-gray-900">{dokumen.vendor}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Modal Konfirmasi Approval */}
      {isApprovalModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6">
            {/* Modal Header */}
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Setujui BAPB
            </h2>

            {/* Confirmation Text */}
            <p className="text-gray-600 mb-6">
              Anda yakin ingin menyetujui BAPB {dokumen.noBapb}?
            </p>

            {/* Catatan (Opsional) */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Catatan (Opsional)
              </label>
              <textarea
                value={approvalNote}
                onChange={(e) => setApprovalNote(e.target.value)}
                placeholder="Tambahkan catatan..."
                rows={4}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none text-gray-900 placeholder-gray-400"
              />
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <button
                onClick={handleBatalApproval}
                className="flex-1 px-6 py-3 bg-gray-800 text-white rounded-xl font-semibold hover:bg-gray-900 transition-colors"
              >
                Batal
              </button>
              <button
                onClick={handleKonfirmasiApproval}
                className="flex-1 px-6 py-3 bg-green-600 text-white rounded-xl font-semibold hover:bg-green-700 transition-colors"
              >
                Konfirmasi
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PersetujuanBapb;