import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import StatCard from '../../components/common/statcard';
import DataTable from '../../components/common/datatable';
import Modal from '../../components/common/modal';

const VendorDashboard = () => {
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const stats = [
    { title: 'Total Draft', value: '1', icon: '📝', color: 'yellow' },
    { title: 'Menunggu Persetujuan', value: '3', icon: '⏳', color: 'blue' },
    { title: 'Disetujui', value: '4', icon: '✅', color: 'green' },
    { title: 'Ditolak', value: '2', icon: '❌', color: 'red' }
  ];

  const tableData = [
    { 
      id: 'BAPB-XYZ-234', 
      noDokumen: 'BAPB-XYZ-234', 
      jenisDokumen: 'BAPB', 
      tanggalDibuat: '2025-10-01', 
      status: 'Pending',
      aksi: 'Lihat'
    },
    { 
      id: 'BAPP-ABC-235', 
      noDokumen: 'BAPP-ABC-235', 
      jenisDokumen: 'BAPP', 
      tanggalDibuat: '2025-10-03', 
      status: 'Pending',
      aksi: 'Lihat'
    },
    { 
      id: 'BAPB-XYZ-236', 
      noDokumen: 'BAPB-XYZ-236', 
      jenisDokumen: 'BAPB', 
      tanggalDibuat: '2025-10-05', 
      status: 'Disetujui',
      aksi: 'Lihat'
    },
    { 
      id: 'BAPP-ABC-237', 
      noDokumen: 'BAPP-ABC-237', 
      jenisDokumen: 'BAPP', 
      tanggalDibuat: '2025-10-07', 
      status: 'Ditolak',
      aksi: 'Lihat'
    },
    { 
      id: 'BAPB-XYZ-238', 
      noDokumen: 'BAPB-XYZ-238', 
      jenisDokumen: 'BAPB', 
      tanggalDibuat: '2025-10-09', 
      status: 'Ditolak',
      aksi: 'Lihat'
    },
    { 
      id: 'BAPP-ABC-239', 
      noDokumen: 'BAPP-ABC-239', 
      jenisDokumen: 'BAPP', 
      tanggalDibuat: '2025-10-11', 
      status: 'Disetujui',
      aksi: 'Lihat'
    }
  ];

  // Format data for table
  const formattedData = tableData.map(doc => ({
    ...doc,
    tanggalDibuat: new Date(doc.tanggalDibuat).toLocaleDateString('id-ID')
  }));

  // Pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = formattedData.slice(indexOfFirstItem, indexOfLastItem);

  const columns = [
    { key: 'noDokumen', title: 'No Dokumen', width: 'w-48' },
    { key: 'jenisDokumen', title: 'Jenis Dokumen', width: 'w-32' },
    { key: 'tanggalDibuat', title: 'Tanggal Dibuat', width: 'w-40' },
    { 
      key: 'status', 
      title: 'Status', 
      width: 'w-32',
      render: (value) => {
        const getStatusColor = (status) => {
          switch(status) {
            case 'Disetujui': return 'bg-green-100 text-green-800';
            case 'Pending': return 'bg-yellow-100 text-yellow-800';
            case 'Ditolak': return 'bg-red-100 text-red-800';
            default: return 'bg-gray-100 text-gray-800';
          }
        };
        
        return (
          <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(value)}`}>
            {value}
          </span>
        );
      }
    },
    { key: 'aksi', title: 'Aksi', width: 'w-24' }
  ];

  const handlePageChange = (action) => {
    switch(action) {
      case 'first':
        setCurrentPage(1);
        break;
      case 'prev':
        setCurrentPage(prev => Math.max(prev - 1, 1));
        break;
      case 'next':
        setCurrentPage(prev => Math.min(prev + 1, Math.ceil(formattedData.length / itemsPerPage)));
        break;
      case 'last':
        setCurrentPage(Math.ceil(formattedData.length / itemsPerPage));
        break;
      default:
        break;
    }
  };

  const handleRowClick = (row) => {
    navigate(`/vendor/dokumen-saya/${row.id}`);
  };

  const handleTambahDokumen = () => {
    navigate('/vendor/tambah-dokumen');
  };

  const paginationConfig = {
    currentPage,
    lastPage: Math.ceil(formattedData.length / itemsPerPage),
    from: indexOfFirstItem + 1,
    to: Math.min(indexOfLastItem, formattedData.length),
    total: formattedData.length
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6 px-4 sm:px-6 lg:px-8">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl p-6 text-white">
        <h1 className="text-2xl font-bold">Selamat Datang, PT. Vendor!</h1>
        <p className="opacity-90">Kelola dan pantau berita acara Anda dengan mudah</p>
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
            onClick={handleTambahDokumen}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            + Buat Dokumen Baru
          </button>
        </div>
        
        <DataTable
          data={currentItems}
          columns={columns}
          onRowClick={handleRowClick}
          pagination={paginationConfig}
          onPageChange={handlePageChange}
          compact={true}
        />
      </div>

      {/* Modal Tambah Dokumen (Alternatif) */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Tambah Dokumen Baru"
        size="md"
      >
        <div className="space-y-4">
          <p className="text-gray-600">Pilih jenis dokumen yang ingin dibuat:</p>
          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={() => {
                setIsModalOpen(false);
                navigate('/vendor/tambah-dokumen-bapb');
              }}
              className="p-4 border-2 border-blue-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors text-center"
            >
              <div className="text-2xl mb-2">📦</div>
              <div className="font-semibold text-blue-600">BAPB</div>
              <div className="text-sm text-gray-600">Berita Acara Pemeriksaan Barang</div>
            </button>
            <button
              onClick={() => {
                setIsModalOpen(false);
                navigate('/vendor/tambah-dokumen-bapp');
              }}
              className="p-4 border-2 border-green-200 rounded-lg hover:border-green-500 hover:bg-green-50 transition-colors text-center"
            >
              <div className="text-2xl mb-2">🏗️</div>
              <div className="font-semibold text-green-600">BAPP</div>
              <div className="text-sm text-gray-600">Berita Acara Pemeriksaan Pekerjaan</div>
            </button>
          </div>
          <div className="flex justify-end pt-4">
            <button 
              onClick={() => setIsModalOpen(false)}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Batal
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default VendorDashboard;
