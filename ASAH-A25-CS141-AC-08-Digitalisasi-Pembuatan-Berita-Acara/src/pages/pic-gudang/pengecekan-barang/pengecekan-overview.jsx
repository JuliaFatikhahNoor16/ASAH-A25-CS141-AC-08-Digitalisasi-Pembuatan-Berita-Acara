import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FileText, Clock, CheckCircle } from 'lucide-react';
import { StatsGrid } from "../../../components/common/statcard";
import BapbTable from '../../../components/pic-gudang/bapb-table';


const PengecekanOverview = () => {
    const navigate = useNavigate();

    // Mock data untuk dokumen yang perlu dicek
    const [dokumenList] = useState([
        {
            id: 1,
            noBapb: 'BAPB-XYZ-234',
            namaProyek: 'Renovasi Gedung Kantor Pusat',
            deskripsi: 'Proyek renovasi gedung kantor pusat meliputi perbaikan struktur bangunan, pengecatan ulang, perbaikan sistem listrik dan plumbing, serta pemasangan AC central di seluruh ruangan.',
            vendor: 'PT. Wijaya Konstruksi',
            tanggalPengajuan: '2025-01-15',
            jumlahBarang: 5,
            status: 'Menunggu Pengecekan',
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
            deskripsi: 'Pembangunan gedung baru 5 lantai untuk kantor cabang',
            vendor: 'PT. Mega Bangunan',
            tanggalPengajuan: '2025-01-14',
            jumlahBarang: 8,
            status: 'Menunggu Pengecekan',
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
                }
            ]
        },
        {
            id: 3,
            noBapb: 'BAPB-DEF-890',
            namaProyek: 'Infrastruktur IT Perkantoran',
            deskripsi: 'Pengadaan peralatan IT untuk seluruh kantor cabang',
            vendor: 'PT. Tech Solutions',
            tanggalPengajuan: '2025-01-13',
            jumlahBarang: 6,
            status: 'Menunggu Pengecekan',
            picProyek: 'Agus Setiawan',
            picVendor: 'Dewi Lestari',
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
                }
            ]
        }
    ]);

    const handleMulaiPengecekan = (dokumen) => {
        navigate(`/pic-gudang/pengecekan-barang/${dokumen.noBapb}`, {
            state: { dokumen }
        });
    };

    const totalDokumen = dokumenList.length;
    const menunggu = dokumenList.filter(d => d.status === 'Menunggu Pengecekan').length;
    const sedangDicek = dokumenList.filter(d => d.status === 'Sedang Dicek').length;
    const selesai = dokumenList.filter(d => d.status === 'Selesai Dicek').length;

    return (
        <div className="max-w-7xl mx-auto">
            {/* Page Header */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900">Pengecekan Barang</h1>
                <p className="text-gray-500 mt-1">
                    Daftar dokumen BAPB yang perlu dilakukan pengecekan barang di gudang
                </p>
            </div>

            {/* Statistics Cards */}
            <div className="mb-8">
                <StatsGrid />
            </div>

            {/* Daftar Dokumen Section */}
            <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Daftar Dokumen</h2>
            </div>

            {/* Use BapbTable Component */}
            <BapbTable 
                data={dokumenList} 
                onView={handleMulaiPengecekan}
            />
        </div>
    );
};

export default PengecekanOverview;