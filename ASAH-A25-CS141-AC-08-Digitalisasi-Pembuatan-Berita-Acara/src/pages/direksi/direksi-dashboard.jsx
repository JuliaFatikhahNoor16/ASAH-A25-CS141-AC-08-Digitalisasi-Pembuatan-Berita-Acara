import React, { useState, useEffect } from 'react';
import { StatsGrid } from '../../components/common/statcard';
import BappPriorityTable from '../../components/direksi/bapp-priority-table';
import { useNavigate } from 'react-router-dom';

const DireksiDashboard = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 3; // Menampilkan 3 item per halaman di dashboard
  
  const [dashboardData, setDashboardData] = useState({
    bappMenunggu: 0,
    dokumenDitolak: 0,
    dokumenDisetujui: 0,
    rataRataWaktu: '',
    bappPriorityList: []
  });

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);

      // Mock data - ganti dengan API call sebenarnya
      const mockData = {
        bappMenunggu: 8,
        dokumenDitolak: 5,
        dokumenDisetujui: 25,
        rataRataWaktu: '2 hari',
        bappPriorityList: [
          {
            id: 1,
            noBapp: 'BAPP-XYZ-234',
            namaProyek: 'Renovasi Gedung Kantor Pusat',
            deskripsi: 'Proyek renovasi gedung kantor pusat meliputi perbaikan struktur bangunan, pengecatan ulang, dan sistem listrik',
            vendor: 'PT. Wijaya Konstruksi',
            tanggal: '2025-01-15',
            status: 'Menunggu Persetujuan'
          },
          {
            id: 2,
            noBapp: 'BAPP-ABC-567',
            namaProyek: 'Pembangunan Gedung Baru Lantai 5',
            deskripsi: 'Pembangunan gedung baru 5 lantai untuk ekspansi kantor dengan fasilitas lengkap',
            vendor: 'PT. Mega Bangunan',
            tanggal: '2025-01-14',
            status: 'Menunggu Persetujuan'
          },
          {
            id: 3,
            noBapp: 'BAPP-XYZ-890',
            namaProyek: 'Pengadaan Furniture Kantor',
            deskripsi: 'Pengadaan furniture untuk seluruh kantor termasuk meja, kursi, dan lemari',
            vendor: 'PT. Furniture Indo',
            tanggal: '2025-01-13',
            status: 'Menunggu Persetujuan'
          },
          {
            id: 4,
            noBapp: 'BAPP-DEF-456',
            namaProyek: 'Upgrade Sistem IT',
            deskripsi: 'Upgrade sistem IT perusahaan termasuk server, network, dan software management',
            vendor: 'PT. Tech Solutions',
            tanggal: '2025-01-12',
            status: 'Menunggu Persetujuan'
          },
          {
            id: 5,
            noBapp: 'BAPP-GHI-789',
            namaProyek: 'Renovasi Gudang',
            deskripsi: 'Renovasi gudang untuk meningkatkan kapasitas penyimpanan dan keamanan',
            vendor: 'PT. Konstruksi Jaya',
            tanggal: '2025-01-11',
            status: 'Menunggu Persetujuan'
          }
        ]
      };

      setDashboardData(mockData);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleReview = (bapp) => {
    // Navigate ke halaman persetujuan BAPP dengan data item
    navigate(`/direksi/persetujuan-bapp/${bapp.noBapp}`, { state: { bappData: bapp } });
  };

  // Fungsi untuk pagination
  const handlePageChange = (action) => {
    const totalPages = Math.ceil(dashboardData.bappPriorityList.length / itemsPerPage);
    
    switch (action) {
      case 'first':
        setCurrentPage(1);
        break;
      case 'prev':
        if (currentPage > 1) setCurrentPage(currentPage - 1);
        break;
      case 'next':
        if (currentPage < totalPages) setCurrentPage(currentPage + 1);
        break;
      case 'last':
        setCurrentPage(totalPages);
        break;
      default:
        break;
    }
  };

  // Hitung data yang ditampilkan berdasarkan pagination
  const totalItems = dashboardData.bappPriorityList.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, totalItems);
  const currentData = dashboardData.bappPriorityList.slice(startIndex, endIndex);

  // Konfigurasi pagination
  const paginationConfig = {
    currentPage,
    lastPage: totalPages,
    from: totalItems > 0 ? startIndex + 1 : 0,
    to: endIndex,
    total: totalItems
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[#1e3a8a]">Dashboard Direksi</h1>
        <p className="text-gray-500 mt-1">Overview Projek & Persetujuan</p>
      </div>

      {/* Stats Cards */}
      <div className="mb-8">
        <StatsGrid
          data={{
            bappMenunggu: dashboardData.bappMenunggu,
            dokumenDitolak: dashboardData.dokumenDitolak,
            dokumenDisetujui: dashboardData.dokumenDisetujui,
            rataRataWaktu: dashboardData.rataRataWaktu
          }}
        />
      </div>

      {/* BAPP Priority List */}
      <section>
        <h2 className="text-xl font-semibold text-gray-800 mb-6">
          BAPP Priority List
        </h2>
        <BappPriorityTable
          data={currentData}
          onReview={handleReview}
          pagination={paginationConfig}
          onPageChange={handlePageChange}
        />
      </section>
    </div>
  );
};

export default DireksiDashboard;