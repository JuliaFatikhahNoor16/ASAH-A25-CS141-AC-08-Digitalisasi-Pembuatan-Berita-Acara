import React from 'react';
import { useNavigate } from 'react-router-dom';
import BapbTable from '../../../components/pic-gudang/bapb-table';

const DokumenOverview = () => {
  const navigate = useNavigate();

  const dokumenList = [
    {
      id: 1,
      noBapb: 'BAPB-2024-064',
      namaProyek: 'Renovasi Gedung Kantor Pusat',
      vendor: 'PT. Jaya Abadi',
      tanggalPengajuan: '14 Nov 2024',
      jumlahBarang: 10,
      deskripsi: 'Pengadaan material konstruksi untuk proyek renovasi gedung kantor',
      status: 'Disetujui',
      picProyek: 'Budi Santoso',
      picVendor: 'Ahmad Wijaya',
      nilai: 'Rp 50.000.000',
      barangList: [
        {
          id: 1,
          namaBarang: 'Semen Portland',
          quantity: 100,
          satuan: 'sak',
          spesifikasi: 'Semen berkualitas tinggi untuk konstruksi'
        },
        {
          id: 2,
          namaBarang: 'Besi Beton Ø12mm',
          quantity: 50,
          satuan: 'batang',
          spesifikasi: 'Besi beton standar konstruksi'
        }
      ]
    },
    {
      id: 2,
      noBapb: 'BAPB-2024-063',
      namaProyek: 'Infrastruktur IT',
      vendor: 'CV. Mandiri',
      tanggalPengajuan: '13 Nov 2024',
      jumlahBarang: 7,
      deskripsi: 'Pengadaan peralatan IT untuk kantor cabang',
      status: 'Disetujui',
      picProyek: 'Siti Rahayu',
      picVendor: 'Bambang Suryanto',
      nilai: 'Rp 35.000.000',
      barangList: [
        {
          id: 1,
          namaBarang: 'Laptop Core i7 16GB',
          quantity: 10,
          satuan: 'unit',
          spesifikasi: 'Laptop untuk manajemen, RAM 16GB'
        }
      ]
    },
    {
      id: 3,
      noBapb: 'BAPB-2024-062',
      namaProyek: 'Program Pelatihan',
      vendor: 'PT. Bangun',
      tanggalPengajuan: '12 Nov 2024',
      jumlahBarang: 9,
      deskripsi: 'Program pelatihan karyawan untuk peningkatan kompetensi',
      status: 'Ditolak',
      picProyek: 'Agus Setiawan',
      picVendor: 'Bambang Susanto',
      nilai: 'Rp 55.000.000',
      barangList: [
        {
          id: 1,
          namaBarang: 'Proyektor LED',
          quantity: 5,
          satuan: 'unit',
          spesifikasi: 'Proyektor Full HD, 3000 lumens'
        }
      ]
    },
    {
      id: 4,
      noBapb: 'BAPB-2024-061',
      namaProyek: 'Ekspansi Cabang',
      vendor: 'PT. Jaya Abadi',
      tanggalPengajuan: '11 Nov 2024',
      jumlahBarang: 14,
      deskripsi: 'Pembukaan kantor cabang baru di beberapa kota',
      status: 'Disetujui',
      picProyek: 'Joko Widodo',
      picVendor: 'Ahmad Wijaya',
      nilai: 'Rp 70.000.000',
      barangList: [
        {
          id: 1,
          namaBarang: 'Meja Kerja',
          quantity: 50,
          satuan: 'unit',
          spesifikasi: 'Meja kerja minimalis, bahan MDF tebal'
        }
      ]
    },
    {
      id: 5,
      noBapb: 'BAPB-2024-060',
      namaProyek: 'Pengadaan Kendaraan',
      vendor: 'Vendor Lain',
      tanggalPengajuan: '10 Nov 2024',
      jumlahBarang: 6,
      deskripsi: 'Pengadaan kendaraan operasional perusahaan',
      status: 'Ditolak',
      picProyek: 'Rina Melati',
      picVendor: 'Dewi Lestari',
      nilai: 'Rp 30.000.000',
      barangList: [
        {
          id: 1,
          namaBarang: 'Mobil Pickup',
          quantity: 2,
          satuan: 'unit',
          spesifikasi: 'Kendaraan operasional untuk distribusi'
        }
      ]
    }
  ];

  const handleView = (dokumen) => {
    navigate(`/pic-gudang/dokumen-overview/${dokumen.noBapb}`, {
      state: { dokumen }
    });
  };

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Dokumen Overview</h1>
        <p className="text-gray-500 mt-1">Lihat semua dokumen BAPB yang disetujui dan ditolak</p>
      </div>

      <BapbTable data={dokumenList} onView={handleView} />
    </div>
  );
};

export default DokumenOverview;