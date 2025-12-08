import React, { useState, useEffect } from 'react';
import { StatsGrid } from "../../../components/common/statcard";
import BapbTable from "../../../components/pic-gudang/bapb-table";
import { useNavigate, useLocation } from 'react-router-dom';
import { CheckCircle } from 'lucide-react';


const PersetujuanOverview = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [showSuccessMessage, setShowSuccessMessage] = useState(false);

    // Mock data list dokumen BAPB yang menunggu persetujuan
    const [dokumenList, setDokumenList] = useState([
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
                    spesifikasi: 'Kabel tembaga standar SNI untuk instalasi listrik',
                    checked: true,
                    catatan: 'Kondisi baik, semua terbungkus rapi'
                },
                {
                    id: 2,
                    namaBarang: 'Cat Tembok Putih Interior',
                    quantity: 50,
                    satuan: 'kaleng',
                    spesifikasi: 'Cat berbasis air, ramah lingkungan, warna putih bersih',
                    checked: true,
                    catatan: 'Kemasan utuh, tidak ada kebocoran'
                },
                {
                    id: 3,
                    namaBarang: 'AC Split 2 PK',
                    quantity: 10,
                    satuan: 'unit',
                    spesifikasi: 'AC inverter, hemat energi, merk ternama dengan garansi 3 tahun',
                    checked: true,
                    catatan: 'Box lengkap dengan aksesoris'
                },
                {
                    id: 4,
                    namaBarang: 'Pipa PVC 1 inch',
                    quantity: 200,
                    satuan: 'batang',
                    spesifikasi: 'Pipa PVC AW untuk instalasi air bersih',
                    checked: true,
                    catatan: 'Tidak ada keretakan atau cacat'
                },
                {
                    id: 5,
                    namaBarang: 'Lampu LED 18 Watt',
                    quantity: 100,
                    satuan: 'unit',
                    spesifikasi: 'Lampu LED putih natural 4000K, hemat energi',
                    checked: true,
                    catatan: 'Semua dalam kondisi baru dan berfungsi'
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
                    spesifikasi: 'Semen Portland tipe I untuk konstruksi umum',
                    checked: true,
                    catatan: 'Kemasan kering dan tidak rusak'
                },
                {
                    id: 2,
                    namaBarang: 'Besi Beton 12mm',
                    quantity: 500,
                    satuan: 'batang',
                    spesifikasi: 'Besi beton ulir diameter 12mm panjang 12m',
                    checked: true,
                    catatan: 'Tidak berkarat, kondisi baik'
                },
                {
                    id: 3,
                    namaBarang: 'Pasir Beton',
                    quantity: 50,
                    satuan: 'm³',
                    spesifikasi: 'Pasir beton kualitas baik, bersih dari lumpur',
                    checked: true,
                    catatan: 'Bersih dan sesuai spesifikasi'
                },
                {
                    id: 4,
                    namaBarang: 'Keramik Lantai 60x60',
                    quantity: 1000,
                    satuan: 'm²',
                    spesifikasi: 'Keramik granit untuk lantai, warna abu-abu',
                    checked: true,
                    catatan: ''
                },
                {
                    id: 5,
                    namaBarang: 'Cat Eksterior',
                    quantity: 100,
                    satuan: 'kaleng',
                    spesifikasi: 'Cat untuk bagian luar bangunan, tahan cuaca',
                    checked: true,
                    catatan: ''
                },
                {
                    id: 6,
                    namaBarang: 'Plafon Gypsum',
                    quantity: 500,
                    satuan: 'lembar',
                    spesifikasi: 'Plafon gypsum tebal 9mm ukuran 120x240cm',
                    checked: true,
                    catatan: ''
                },
                {
                    id: 7,
                    namaBarang: 'Rangka Plafon',
                    quantity: 300,
                    satuan: 'batang',
                    spesifikasi: 'Rangka hollow galvanis untuk plafon',
                    checked: true,
                    catatan: ''
                },
                {
                    id: 8,
                    namaBarang: 'Pintu Aluminium',
                    quantity: 50,
                    satuan: 'unit',
                    spesifikasi: 'Pintu aluminium kaca untuk kantor',
                    checked: true,
                    catatan: ''
                }
            ]
        }
    ]);

    // Check if there's a newly checked document from pengecekan-barang
    useEffect(() => {
        if (location.state?.message && location.state?.updatedDokumen) {
            setShowSuccessMessage(true);
            
            // Hide message after 5 seconds
            setTimeout(() => {
                setShowSuccessMessage(false);
            }, 5000);

            // Add or update the document in the list
            const updatedDoc = location.state.updatedDokumen;
            const barangListWithChecks = location.state.barangList;

            setDokumenList(prevList => {
                const existingIndex = prevList.findIndex(doc => doc.noBapb === updatedDoc.noBapb);
                
                if (existingIndex >= 0) {
                    // Update existing document
                    const newList = [...prevList];
                    newList[existingIndex] = {
                        ...updatedDoc,
                        barangList: barangListWithChecks
                    };
                    return newList;
                } else {
                    // Add new document
                    return [...prevList, {
                        ...updatedDoc,
                        barangList: barangListWithChecks
                    }];
                }
            });

            // Clear the state to prevent showing message on refresh
            window.history.replaceState({}, document.title);
        }
    }, [location]);

    const handleReviewDokumen = (dokumen) => {
        navigate(`/pic-gudang/persetujuan-bapb/${dokumen.noBapb}`, {
            state: { dokumen, barangList: dokumen.barangList }
        });
    };

    return (
        <div className="max-w-7xl mx-auto">
            {/* Success Message */}
            {showSuccessMessage && (
                <div className="mb-6 bg-green-50 border border-green-200 rounded-lg p-4 flex items-start gap-3 animate-fade-in">
                    <CheckCircle className="text-green-600 flex-shrink-0 mt-0.5" size={20} />
                    <div>
                        <p className="font-semibold text-green-900">Pengecekan Berhasil Diselesaikan!</p>
                        <p className="text-sm text-green-700 mt-1">
                            Dokumen telah dipindahkan ke menu Persetujuan BAPB dan siap untuk diproses.
                        </p>
                    </div>
                </div>
            )}

            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900">Persetujuan BAPB</h1>
                <p className="text-gray-500 mt-1">Daftar dokumen BAPB yang menunggu persetujuan</p>
            </div>

            <div className="mb-8">
                <StatsGrid />
            </div>

            <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Daftar Dokumen</h2>
                <BapbTable
                    data={dokumenList}
                    onView={handleReviewDokumen}
                />
            </div>
        </div>
    );
};

export default PersetujuanOverview;