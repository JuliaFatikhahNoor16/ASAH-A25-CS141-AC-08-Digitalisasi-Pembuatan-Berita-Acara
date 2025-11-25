// pages/vendor/DokumenSaya.jsx
import React, { useState } from 'react';
import DataTable from '../../components/common/datatable';
import EmptyState from '../../components/common/empty-state';
import LoadingSpinner from '../../components/common/loading-spinner';

const DokumenSaya = () => {
  const [loading, setLoading] = useState(false);
  const [filterStatus, setFilterStatus] = useState('semua');
  const [searchTerm, setSearchTerm] = useState('');

  // Mock data untuk dokumen vendor
  const dokumenData = [
    { 
      id: 1,
      noDokumen: 'BAPB-XYZ-234', 
      jenisDokumen: 'BAPB', 
      tanggalDibuat: '01/10/2025', 
      status: 'pending',
      projek: 'Renovasi Kantor Pusat',
      nilai: 'Rp 500 Juta',
      deadline: '15/10/2025',
      pic: 'Ahmad Syahroni'
    },
    { 
      id: 2,
      noDokumen: 'BAPP-ABC-235', 
      jenisDokumen: 'BAPP', 
      tanggalDibuat: '03/10/2025', 
      status: 'approved',
      projek: 'Infrastruktur IT',
      nilai: 'Rp 200 Juta',
      deadline: '20/10/2025',
      pic: 'Budi Santoso'
    },
    { 
      id: 3,
      noDokumen: 'BAPB-XYZ-236', 
      jenisDokumen: 'BAPB', 
      tanggalDibuat: '05/10/2025', 
      status: 'rejected',
      projek: 'Program Pelatihan',
      nilai: 'Rp 75 Juta',
      deadline: '25/10/2025',
      pic: 'Citra Dewi',
      catatan: 'Perlu revisi lampiran dokumen'
    },
    { 
      id: 4,
      noDokumen: 'BAPP-ABC-237', 
      jenisDokumen: 'BAPP', 
      tanggalDibuat: '07/10/2025', 
      status: 'draft',
      projek: 'Ekspansi Cabang',
      nilai: 'Rp 100 Juta',
      deadline: '30/10/2025',
      pic: '-'
    },
    { 
      id: 5,
      noDokumen: 'BAPB-XYZ-238', 
      jenisDokumen: 'BAPB', 
      tanggalDibuat: '09/10/2025', 
      status: 'approved',
      projek: 'Pengembangan Produk',
      nilai: 'Rp 65 Juta',
      deadline: '12/11/2025',
      pic: 'Dian Pratama'
    }
  ];

  // Filter data berdasarkan status dan pencarian
  const filteredData = dokumenData.filter(dokumen => {
    const matchesStatus = filterStatus === 'semua' || dokumen.status === filterStatus;
    const matchesSearch = dokumen.noDokumen.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         dokumen.projek.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  // Kolom untuk tabel
  const columns = [
    { key: 'noDokumen', title: 'No Dokumen' },
    { key: 'jenisDokumen', title: 'Jenis' },
    { key: 'projek', title: 'Projek' },
    { key: 'nilai', title: 'Nilai' },
    { key: 'tanggalDibuat', title: 'Tanggal Dibuat' },
    { key: 'deadline', title: 'Deadline' },
    { key: 'status', title: 'Status' },
    { key: 'aksi', title: 'Aksi' }
  ];

  // Handle detail dokumen
  const handleDetail = (dokumen) => {
    console.log('Lihat detail:', dokumen);
    // Akan diintegrasikan dengan modal detail nanti
    alert(`Detail ${dokumen.noDokumen}\nProjek: ${dokumen.projek}\nStatus: ${dokumen.status}`);
  };

  // Statistik dokumen
  const stats = {
    total: dokumenData.length,
    draft: dokumenData.filter(d => d.status === 'draft').length,
    pending: dokumenData.filter(d => d.status === 'pending').length,
    approved: dokumenData.filter(d => d.status === 'approved').length,
    rejected: dokumenData.filter(d => d.status === 'rejected').length
  };

  if (loading) {
    return <LoadingSpinner text="Memuat dokumen..." />;
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dokumen Saya</h1>
          <p className="text-gray-600">Kelola semua dokumen BAPB dan BAPP Anda</p>
        </div>
        <div className="text-sm text-gray-500">
          Total: <strong>{stats.total}</strong> dokumen
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <div className="bg-white p-4 rounded-lg border border-gray-200 text-center">
          <div className="text-2xl font-bold text-gray-900">{stats.total}</div>
          <div className="text-sm text-gray-500">Total</div>
        </div>
        <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200 text-center">
          <div className="text-2xl font-bold text-yellow-700">{stats.draft}</div>
          <div className="text-sm text-yellow-600">Draft</div>
        </div>
        <div className="bg-blue-50 p-4 rounded-lg border border-blue-200 text-center">
          <div className="text-2xl font-bold text-blue-700">{stats.pending}</div>
          <div className="text-sm text-blue-600">Pending</div>
        </div>
        <div className="bg-green-50 p-4 rounded-lg border border-green-200 text-center">
          <div className="text-2xl font-bold text-green-700">{stats.approved}</div>
          <div className="text-sm text-green-600">Disetujui</div>
        </div>
        <div className="bg-red-50 p-4 rounded-lg border border-red-200 text-center">
          <div className="text-2xl font-bold text-red-700">{stats.rejected}</div>
          <div className="text-sm text-red-600">Ditolak</div>
        </div>
      </div>

      {/* Filter dan Search */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex flex-col md:flex-row gap-4 md:items-center md:justify-between">
          {/* Search Input */}
          <div className="flex-1 max-w-md">
            <div className="relative">
              <input
                type="text"
                placeholder="Cari no dokumen atau projek..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                <span className="text-gray-400">🔍</span>
              </div>
            </div>
          </div>

          {/* Status Filter */}
          <div className="flex items-center space-x-4">
            <label className="text-sm font-medium text-gray-700">Filter Status:</label>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="semua">Semua Status</option>
              <option value="draft">Draft</option>
              <option value="pending">Pending</option>
              <option value="approved">Disetujui</option>
              <option value="rejected">Ditolak</option>
            </select>
          </div>
        </div>

        {/* Data Table */}
        <div className="mt-6">
          {filteredData.length > 0 ? (
            <DataTable
              data={filteredData}
              columns={columns}
              onRowClick={handleDetail}
              pagination={{
                currentPage: 1,
                lastPage: 1,
                from: 1,
                to: filteredData.length,
                total: filteredData.length
              }}
            />
          ) : (
            <EmptyState 
              title="Tidak ada dokumen ditemukan"
              message="Coba ubah filter pencarian atau buat dokumen baru"
              icon="📄"
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default DokumenSaya;