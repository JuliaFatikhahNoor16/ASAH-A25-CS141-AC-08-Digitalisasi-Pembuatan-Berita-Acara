// pages/vendor/VendorDashboard.jsx
import React from 'react';
import StatCard from '../../components/common/StatCard';
import DataTable from '../../components/common/DataTable';

const VendorDashboard = () => {
  const stats = [
    { title: 'Total Draft', value: '1', icon: '📝', color: 'yellow' },
    { title: 'Menunggu Persetujuan', value: '3', icon: '⏳', color: 'blue' },
    { title: 'Disetujui', value: '4', icon: '✅', color: 'green' }
  ];

  const tableData = [
    { noDokumen: 'BAPB-XYZ-234', jenisDokumen: 'BAPB', tanggalDibuat: '01/10/2025', status: 'pending' },
    { noDokumen: 'BAPP-ABC-235', jenisDokumen: 'BAPP', tanggalDibuat: '03/10/2025', status: 'pending' },
    { noDokumen: 'BAPB-XYZ-236', jenisDokumen: 'BAPB', tanggalDibuat: '05/10/2025', status: 'approved' }
  ];

  const columns = [
    { key: 'noDokumen', title: 'No Dokumen' },
    { key: 'jenisDokumen', title: 'Jenis Dokumen' },
    { key: 'tanggalDibuat', title: 'Tanggal Dibuat' },
    { key: 'status', title: 'Status' },
    { key: 'aksi', title: 'Aksi' }
  ];

  return (
    <div className="p-6 space-y-6">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl p-6 text-white">
        <h1 className="text-2xl font-bold">Selamat Datang, PT. Vendor!</h1>
        <p className="opacity-90">Selamat Datang, PT. Vendor!</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat, index) => (
          <StatCard key={index} {...stat} />
        ))}
      </div>

      {/* Recent Activity Table */}
      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Aktivitas Terbaru</h2>
        <DataTable
          data={tableData}
          columns={columns}
          pagination={{
            currentPage: 1,
            lastPage: 1,
            from: 1,
            to: 3,
            total: 3
          }}
        />
      </div>
    </div>
  );
};

export default VendorDashboard;