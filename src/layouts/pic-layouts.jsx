// layouts/pic-layouts.jsx
import React, { useState } from 'react';
import Sidebar from '../components/common/sidebar';
import Header from '../components/common/header';
import StatCard from '../components/common/statcard';
import DataTable from '../components/common/datatable';
import Modal from '../components/common/modal';

const PicLayout = () => {
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedBapb, setSelectedBapb] = useState(null);
  
  // Mock user data untuk PIC Gudang
  const mockUser = {
    name: 'Ahmad Syahroni',
    role: 'pic'
  };

  // Data statistik untuk PIC Gudang
  const stats = [
    { 
      title: 'BAPB Menunggu', 
      value: '5', 
      icon: '⏳', 
      color: 'blue',
      subtitle: 'Dokumen perlu review'
    },
    { 
      title: 'Dokumen Ditolak', 
      value: '8', 
      icon: '❌', 
      color: 'red',
      subtitle: 'Perlu revisi'
    },
    { 
      title: 'Dokumen Disetujui', 
      value: '25', 
      icon: '✅', 
      color: 'green',
      subtitle: 'Total approved'
    },
    { 
      title: 'Rata-rata Waktu Approval', 
      value: '2 hari', 
      icon: '⏱️', 
      color: 'purple',
      subtitle: 'Waktu respons'
    }
  ];

  // Data untuk BAPB Priority List
  const bapbData = [
    { 
      noBapb: 'BAPB-XYZ-234', 
      projek: 'Renovasi Kantor Pusat', 
      nilai: 'Rp 500 M', 
      deadline: '11/11/2025', 
      status: 'pending' 
    },
    { 
      noBapb: 'BAPB-ABC-235', 
      projek: 'Infrastruktur IT', 
      nilai: 'Rp 200 M', 
      deadline: '12/11/2025', 
      status: 'pending' 
    },
    { 
      noBapb: 'BAPB-XYZ-236', 
      projek: 'Program Pelatihan', 
      nilai: 'Rp 75 M', 
      deadline: '13/11/2025', 
      status: 'pending' 
    },
    { 
      noBapb: 'BAPB-ABC-237', 
      projek: 'Ekspansi Cabang', 
      nilai: 'Rp 100 M', 
      deadline: '14/11/2025', 
      status: 'pending' 
    },
    { 
      noBapb: 'BAPB-XYZ-238', 
      projek: 'Pengembangan Produk', 
      nilai: 'Rp 65 M', 
      deadline: '15/11/2025', 
      status: 'pending' 
    }
  ];

  // Kolom untuk tabel BAPB
  const bapbColumns = [
    { key: 'noBapb', title: 'No BAPB' },
    { key: 'projek', title: 'Projek' },
    { key: 'nilai', title: 'Nilai' },
    { key: 'deadline', title: 'Deadline' },
    { key: 'aksi', title: 'Aksi' }
  ];

  // Handle review BAPB
  const handleReview = (bapb) => {
    setSelectedBapb(bapb);
    setIsModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar untuk PIC Gudang */}
      <Sidebar 
        role="pic" 
        currentPage={currentPage}
        onNavigate={setCurrentPage}
      />
      
      {/* Main Content Area */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <Header 
          user={mockUser}
          onLogout={() => console.log('Logout clicked')}
        />
        
        {/* Dashboard Content */}
        <main className="flex-1 p-6 overflow-auto">
          <div className="max-w-7xl mx-auto space-y-6">
            
            {/* Welcome Section */}
            <div className="bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl p-6 text-white">
              <h1 className="text-2xl font-bold">Dashboard PIC Gudang</h1>
              <p className="opacity-90 mt-2">Overview Projek & Persetujuan</p>
            </div>

            {/* Stats Grid - Overview Projek & Persetujuan */}
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Overview Projek & Persetujuan</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, index) => (
                  <StatCard key={index} {...stat} />
                ))}
              </div>
            </div>

            {/* BAPB Priority List */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900">BAPB Priority List</h2>
                <div className="text-sm text-gray-500">
                  {bapbData.length} dokumen menunggu review
                </div>
              </div>
              
              <DataTable
                data={bapbData}
                columns={bapbColumns}
                onRowClick={handleReview}
                pagination={{
                  currentPage: 1,
                  lastPage: 1,
                  from: 1,
                  to: bapbData.length,
                  total: bapbData.length
                }}
                onPageChange={(action) => console.log('Page action:', action)}
              />
            </div>

            {/* User Info Footer */}
            <div className="text-center text-sm text-gray-500 pt-4 border-t border-gray-200">
              <p><strong>Ahmad Syahroni</strong> - PIC Gudang</p>
            </div>
          </div>
        </main>
      </div>

      {/* Review Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedBapb(null);
        }}
        title={`Review ${selectedBapb?.noBapb}`}
        size="lg"
      >
        {selectedBapb && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">No BAPB</label>
                <p className="mt-1 text-sm text-gray-900">{selectedBapb.noBapb}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Projek</label>
                <p className="mt-1 text-sm text-gray-900">{selectedBapb.projek}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Nilai</label>
                <p className="mt-1 text-sm text-gray-900">{selectedBapb.nilai}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Deadline</label>
                <p className="mt-1 text-sm text-gray-900">{selectedBapb.deadline}</p>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700">Komentar</label>
              <textarea 
                className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                rows="4"
                placeholder="Tambahkan komentar review..."
              />
            </div>
            
            <div className="flex space-x-3 justify-end pt-4">
              <button 
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
              >
                Tutup
              </button>
              <button 
                onClick={() => console.log('Approve:', selectedBapb)}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                Setujui
              </button>
              <button 
                onClick={() => console.log('Reject:', selectedBapb)}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Tolak
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default PicLayout;