import React from 'react';
import { StatsGrid } from '../../components/common/statcard';
import BapbTable from '../../components/pic-gudang/bapb-table';
import { useNavigate } from 'react-router-dom';

const PicDashboard = () => {
  const navigate = useNavigate();

  // Data BAPB dengan struktur yang lengkap untuk pengecekan barang
  const bapbData = [
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
      noBapb: 'BAPB-ABC-235',
      namaProyek: 'Infrastruktur IT',
      vendor: 'PT. Tech Solutions',
      tanggalPengajuan: '2025-01-14',
      jumlahBarang: 8,
      status: 'Menunggu Persetujuan',
      deskripsi: 'Pengadaan peralatan IT untuk seluruh kantor cabang',
      picProyek: 'Siti Rahayu',
      picVendor: 'Bambang Suryanto',
      barangList: [
        {
          id: 1,
          namaBarang: 'Laptop Core i7 16GB',
          quantity: 20,
          satuan: 'unit',
          spesifikasi: 'Laptop untuk manajemen, RAM 16GB, SSD 512GB'
        },
        {
          id: 2,
          namaBarang: 'Monitor 24 inch',
          quantity: 25,
          satuan: 'unit',
          spesifikasi: 'Monitor Full HD, anti-glare'
        },
        {
          id: 3,
          namaBarang: 'Switch 24 Port',
          quantity: 5,
          satuan: 'unit',
          spesifikasi: 'Switch jaringan managed, 24 port Gigabit'
        }
      ]
    },
    {
      id: 3,
      noBapb: 'BAPB-XYZ-236',
      namaProyek: 'Program Pelatihan',
      vendor: 'PT. Training Center',
      tanggalPengajuan: '2025-01-13',
      jumlahBarang: 3,
      status: 'Menunggu Persetujuan',
      deskripsi: 'Program pelatihan karyawan untuk peningkatan kompetensi',
      picProyek: 'Agus Setiawan',
      picVendor: 'Dewi Lestari',
      barangList: [
        {
          id: 1,
          namaBarang: 'Proyektor LED',
          quantity: 5,
          satuan: 'unit',
          spesifikasi: 'Proyektor Full HD, 3000 lumens'
        },
        {
          id: 2,
          namaBarang: 'Whiteboard Magnetic',
          quantity: 10,
          satuan: 'unit',
          spesifikasi: 'Whiteboard ukuran 120x90cm, magnetic surface'
        },
        {
          id: 3,
          namaBarang: 'Buku Panduan',
          quantity: 50,
          satuan: 'set',
          spesifikasi: 'Buku panduan pelatihan soft skills'
        }
      ]
    },
    {
      id: 4,
      noBapb: 'BAPB-ABC-237',
      namaProyek: 'Ekspansi Cabang',
      vendor: 'PT. Mega Bangunan',
      tanggalPengajuan: '2025-01-12',
      jumlahBarang: 12,
      status: 'Menunggu Persetujuan',
      deskripsi: 'Pembukaan kantor cabang baru di beberapa kota',
      picProyek: 'Joko Widodo',
      picVendor: 'Surya Permana',
      barangList: [
        {
          id: 1,
          namaBarang: 'Meja Kerja',
          quantity: 50,
          satuan: 'unit',
          spesifikasi: 'Meja kerja minimalis, bahan MDF tebal'
        },
        {
          id: 2,
          namaBarang: 'Kursi Ergonomis',
          quantity: 50,
          satuan: 'unit',
          spesifikasi: 'Kursi kantor dengan sandaran ergonomis'
        },
        {
          id: 3,
          namaBarang: 'Filling Cabinet',
          quantity: 10,
          satuan: 'unit',
          spesifikasi: 'Lemari arsip 4 laci, bahan metal'
        }
      ]
    }
  ];

  // Custom handler jika perlu (opsional)
  const handleViewBapb = (dokumen) => {
    navigate(`/pic-gudang/persetujuan-bapb/pengecekan/${dokumen.noBapb}`, {
      state: { dokumen }
    });
  };

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-500 mt-1">Overview Projek & Persetujuan</p>
      </div>

      <div className="mb-8">
        <StatsGrid />
      </div>

      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-6">BAPB Priority List</h2>
        <BapbTable
          data={bapbData}
          onView={handleViewBapb}
        />
      </div>
    </div>
  );
};

export default PicDashboard;
