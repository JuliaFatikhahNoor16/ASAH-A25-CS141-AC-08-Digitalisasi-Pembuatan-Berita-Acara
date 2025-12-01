import React, { useState, useEffect } from 'react';
import StatCard from '../../components/common/statcard';
import BappPriorityTable from '../../components/direksi/bapp-priority-table';
import { useNavigate } from 'react-router-dom';

const DireksiDashboard = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState({
    bappMenunggu: 0,
    totalProjekAktif: 0,
    nilaiTotal: '',
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
        bappMenunggu: 5,
        totalProjekAktif: 8,
        nilaiTotal: 'Rp 2.5 M',
        rataRataWaktu: '2 hari',
        bappPriorityList: [
          {
            noBapp: 'BAPP-XYZ-234',
            projek: 'Renovasi Kantor Pusat',
            nilai: 'Rp 500 M',
            deadline: '11/11/2025'
          },
          {
            noBapp: 'BAPP-ABC-235',
            projek: 'Infrastruktur IT',
            nilai: 'Rp 200 M',
            deadline: '12/11/2025'
          },
          {
            noBapp: 'BAPP-XYZ-236',
            projek: 'Program Pelatihan',
            nilai: 'Rp 75 M',
            deadline: '13/11/2025'
          },
          {
            noBapp: 'BAPP-ABC-237',
            projek: 'Ekspansi Cabang',
            nilai: 'Rp 100 M',
            deadline: '14/11/2025'
          },
          {
            noBapp: 'BAPP-XYZ-238',
            projek: 'Pengembangan Produk',
            nilai: 'Rp 65 M',
            deadline: '15/11/2025'
          },
          {
            noBapp: 'BAPP-ABC-237',
            projek: 'Ekspansi Cabang',
            nilai: 'Rp 100 M',
            deadline: '14/11/2025'
          },
          {
            noBapp: 'BAPP-ABC-237',
            projek: 'Ekspansi Cabang',
            nilai: 'Rp 100 M',
            deadline: '15/11/2025'
          },
          {
            noBapp: 'BAPP-ABC-237',
            projek: 'Ekspansi Cabang',
            nilai: 'Rp 100 M',
            deadline: '15/11/2025'
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
      {/* Overview Projek & Persetujuan */}
      <section className="mb-8">
        <div>
              <h1 className="text-3xl font-bold text-[#1e3a8a]">Dashboard Direksi</h1>
              <p className="text-gray-500 mt-1">Overview Projek & Persetujuan</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            title="BAPP Menunggu"
            value={dashboardData.bappMenunggu}
            icon="📋"
            bgColor="bg-gradient-to-br from-blue-500 to-purple-600"
          />
          <StatCard
            title="Total Projek Aktif"
            value={dashboardData.totalProjekAktif}
            icon="📊"
            bgColor="bg-gradient-to-br from-pink-500 to-red-500"
          />
          <StatCard
            title="Nilai Total Projek"
            value={dashboardData.nilaiTotal}
            icon="💰"
            bgColor="bg-gradient-to-br from-green-400 to-cyan-500"
          />
          <StatCard
            title="Rata-rata Waktu Approval"
            value={dashboardData.rataRataWaktu}
            icon="⏱️"
            bgColor="bg-gradient-to-br from-yellow-400 to-orange-400"
          />
        </div>
      </section>

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
