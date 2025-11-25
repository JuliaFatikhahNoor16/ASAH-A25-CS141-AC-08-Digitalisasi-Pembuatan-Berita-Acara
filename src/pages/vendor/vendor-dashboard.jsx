// pages/vendor/VendorDashboard.jsx
import React, { useState } from 'react';
import StatCard from '../../components/common/statcard';
import DataTable from '../../components/common/datatable';
import Modal from '../../components/common/modal';

const VendorDashboard = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const stats = [
    { title: 'Total Draft', value: '1', icon: '📝', color: 'yellow' },
    { title: 'Menunggu Persetujuan', value: '3', icon: '⏳', color: 'blue' },
    { title: 'Disetujui', value: '4', icon: '✅', color: 'green' },
    { title: 'Ditolak', value: '2', icon: '❌', color: 'red' }
  ];

  const tableData = [
    { noDokumen: 'BAPB-XYZ-234', jenisDokumen: 'BAPB', tanggalDibuat: '01/10/2025', status: 'pending' },
    { noDokumen: 'BAPP-ABC-235', jenisDokumen: 'BAPP', tanggalDibuat: '03/10/2025', status: 'pending' },
    { noDokumen: 'BAPB-XYZ-236', jenisDokumen: 'BAPB', tanggalDibuat: '05/10/2025', status: 'approved' },
    { noDokumen: 'BAPP-ABC-237', jenisDokumen: 'BAPP', tanggalDibuat: '07/10/2025', status: 'rejected' },
    { noDokumen: 'BAPB-XYZ-238', jenisDokumen: 'BAPB', tanggalDibuat: '09/10/2025', status: 'rejected' },
    { noDokumen: 'BAPP-ABC-239', jenisDokumen: 'BAPP', tanggalDibuat: '11/10/2025', status: 'approved' }
  ];

  const columns = [
    { key: 'noDokumen', title: 'No Dokumen' },
    { key: 'jenisDokumen', title: 'Jenis Dokumen' },
    { key: 'tanggalDibuat', title: 'Tanggal Dibuat' },
    { key: 'status', title: 'Status' },
    { key: 'aksi', title: 'Aksi' }
  ];

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl p-6 text-white">
        <h1 className="text-2xl font-bold">Selamat Datang, PT. Vendor!</h1>
        <p className="opacity-90">Selamat Datang, PT. Vendor!</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <StatCard key={index} {...stat} />
        ))}
      </div>

      {/* Recent Activity Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900">Aktivitas Terbaru</h2>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            + Tambah Dokumen
          </button>
        </div>
        
        <DataTable
          data={tableData}
          columns={columns}
          onRowClick={(row) => console.log('Row clicked:', row)}
          pagination={{
            currentPage: 1,
            lastPage: 2,
            from: 1,
            to: 6,
            total: 12
          }}
          onPageChange={(action) => console.log('Page action:', action)}
        />
      </div>

      {/* Modal Tambah Dokumen */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Tambah Dokumen Baru"
        size="md"
      >
        <div className="space-y-4">
          <p>Form tambah dokumen akan diimplementasikan nanti...</p>
          <div className="flex space-x-3 justify-end">
            <button 
              onClick={() => setIsModalOpen(false)}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
            >
              Tutup
            </button>
            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
              Simpan
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default VendorDashboard;