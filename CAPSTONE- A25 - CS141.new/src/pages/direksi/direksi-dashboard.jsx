import React, { useState, useEffect } from 'react';
import StatCard from '../../components/common/statcard';
import BappPriorityTable from '../../components/direksi/bapp-priority-table';
import { useNavigate } from 'react-router-dom';

const DireksiDashboard = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
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
      // const response = await documentService.getDireksiDashboard();
      
      // Simulasi data untuk development
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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="BAPP"
          value={dashboardData.bappMenunggu}
          subtitle="Menunggu persetujuan"
          icon="📋"
          color="blue"
        />
        <StatCard
          title="Dokumen Ditolak"
          value={dashboardData.dokumenDitolak}
          subtitle="Total ditolak"
          icon="❌"
          color="red"
        />
        <StatCard
          title="Dokumen Disetujui"
          value={dashboardData.dokumenDisetujui}
          subtitle="Total disetujui"
          icon="✅"
          color="green"
        />
        <StatCard
          title="Rata-rata Waktu"
          value={dashboardData.rataRataWaktu}
          subtitle="Approval time"
          icon="⏱️"
          color="yellow"
        />
      </div>

      {/* BAPP Priority List */}
      <section>
        <h2 className="text-xl font-semibold text-gray-800 mb-6">
          BAPP Priority List
        </h2>
        <BappPriorityTable 
          data={dashboardData.bappPriorityList}
          onReview={handleReview}
        />
      </section>
    </div>
  );
};

export default DireksiDashboard;
