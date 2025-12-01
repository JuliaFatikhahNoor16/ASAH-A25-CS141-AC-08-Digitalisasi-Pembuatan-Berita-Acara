import React from 'react';
import Sidebar from '../../../components/common/sidebar';
import Header from '../../../components/common/header';
import { StatsGrid } from "../../../components/common/statcard";
import BapbTable from '../../../components/pic-gudang/bapb-table';
import { useAuth } from '../../../contexts/authcontext';
import { useNavigate } from 'react-router-dom';

const PersetujuanOverview = () => {
  const { userEmail, logout } = useAuth();
  const navigate = useNavigate();

  // Mock data list dokumen BAPB yang menunggu persetujuan
  const dokumenList = [
    {
      id: 1,
      noBapb: 'BAPB-XYZ-234',
      namaProyek: 'Renovasi Gedung Kantor Pusat',
      vendor: 'PT. Wijaya Konstruksi',
      tanggalPengajuan: '2025-01-15',
      jumlahBarang: 5,
      status: 'Menunggu Persetujuan',
      deskripsi: 'Proyek renovasi gedung kantor pusat meliputi perbaikan struktur bangunan, pengecatan ulang, perbaikan sistem listrik dan plumbing, serta pemasangan AC central di seluruh ruangan.',
      picProyek: 'Budi Santoso',
      picVendor: 'Ahmad Wijaya',
      barangList: [
        {
          id: 1,
          namaBarang: 'Kabel Listrik NYM 3x2.5mm',
          quantity: 500,
          satuan: 'meter',
          spesifikasi: 'Kabel tembaga standar SNI untuk instalasi listrik'
        },
        {
          id: 2,
          namaBarang: 'Cat Tembok Putih Interior',
          quantity: 50,
          satuan: 'kaleng',
          spesifikasi: 'Cat berbasis air, ramah lingkungan, warna putih bersih'
        },
        {
          id: 3,
          namaBarang: 'AC Split 2 PK',
          quantity: 10,
          satuan: 'unit',
          spesifikasi: 'AC inverter, hemat energi, merk ternama dengan garansi 3 tahun'
        },
        {
          id: 4,
          namaBarang: 'Pipa PVC 1 inch',
          quantity: 200,
          satuan: 'batang',
          spesifikasi: 'Pipa PVC AW untuk instalasi air bersih'
        },
        {
          id: 5,
          namaBarang: 'Lampu LED 18 Watt',
          quantity: 100,
          satuan: 'unit',
          spesifikasi: 'Lampu LED putih natural 4000K, hemat energi'
        }
      ]
    },
    {
      id: 2,
      noBapb: 'BAPB-ABC-567',
      namaProyek: 'Pembangunan Gedung Baru Lantai 5',
      vendor: 'PT. Mega Bangunan',
      tanggalPengajuan: '2025-01-14',
      jumlahBarang: 8,
      status: 'Menunggu Persetujuan',
      deskripsi: 'Pembangunan gedung baru 5 lantai untuk kantor cabang',
      picProyek: 'Siti Rahayu',
      picVendor: 'Bambang Suryanto',
      barangList: [
        {
          id: 1,
          namaBarang: 'Semen Portland 50kg',
          quantity: 200,
          satuan: 'sak',
          spesifikasi: 'Semen Portland tipe I untuk konstruksi umum'
        },
        {
          id: 2,
          namaBarang: 'Besi Beton 12mm',
          quantity: 500,
          satuan: 'batang',
          spesifikasi: 'Besi beton ulir diameter 12mm panjang 12m'
        },
        {
          id: 3,
          namaBarang: 'Pasir Beton',
          quantity: 50,
          satuan: 'm³',
          spesifikasi: 'Pasir beton kualitas baik, bersih dari lumpur'
        },
        {
          id: 4,
          namaBarang: 'Keramik Lantai 60x60',
          quantity: 1000,
          satuan: 'm²',
          spesifikasi: 'Keramik granit untuk lantai, warna abu-abu'
        },
        {
          id: 5,
          namaBarang: 'Cat Eksterior',
          quantity: 100,
          satuan: 'kaleng',
          spesifikasi: 'Cat untuk bagian luar bangunan, tahan cuaca'
        },
        {
          id: 6,
          namaBarang: 'Plafon Gypsum',
          quantity: 500,
          satuan: 'lembar',
          spesifikasi: 'Plafon gypsum tebal 9mm ukuran 120x240cm'
        },
        {
          id: 7,
          namaBarang: 'Rangka Plafon',
          quantity: 300,
          satuan: 'batang',
          spesifikasi: 'Rangka hollow galvanis untuk plafon'
        },
        {
          id: 8,
          namaBarang: 'Pintu Aluminium',
          quantity: 50,
          satuan: 'unit',
          spesifikasi: 'Pintu aluminium kaca untuk kantor'
        }
      ]
    }
  ];

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

  // Custom handler jika perlu (opsional)
  const handleReviewDokumen = (dokumen) => {
    navigate(`/pic-gudang/persetujuan-bapb/pengecekan/${dokumen.noBapb}`, {
      state: { dokumen }
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar role="gudang" />
      
      <div className="ml-64">
        <Header user={user} onLogout={handleLogout} />
        
        <main className="p-8">
          <div className="max-w-7xl mx-auto">
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900">Persetujuan BAPB</h1>
              <p className="text-gray-500 mt-1">Daftar dokumen BAPB yang menunggu persetujuan</p>
            </div>
            
            <div className="mb-8">
              <StatsGrid />
            </div>

            {/* Menggunakan Komponen BapbTable */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Daftar Dokumen</h2>
              <BapbTable 
                data={dokumenList}
                onView={handleReviewDokumen} // Opsional: custom handler
              />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default PersetujuanOverview;