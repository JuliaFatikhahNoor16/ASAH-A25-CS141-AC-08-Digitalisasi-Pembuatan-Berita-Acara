import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FileText } from 'lucide-react';
import BappOverviewCard from '../../components/direksi/bapp-overview-card';

const PersetujuanBappList = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [bappData, setBappData] = useState({
        stats: {
            totalDokumen: 0,
            pending: 0
        },
        list: []
    });

    useEffect(() => {
        fetchBappData();
    }, []);

    const fetchBappData = async () => {
        try {
            setLoading(true);

            // Mock data
            const mockData = {
                stats: {
                    totalDokumen: 3,
                    pending: 3
                },
                list: [
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
                    }
                ]
            };

            setBappData(mockData);
        } catch (error) {
            console.error('Error fetching BAPP data:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleReview = (bapp) => {
        navigate(`/direksi/persetujuan-bapp/${bapp.noBapp}`);
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
                <h1 className="text-3xl font-bold text-[#1e3a8a]">Persetujuan BAPP</h1>
                <p className="text-gray-500 mt-1">Daftar dokumen BAPP yang menunggu persetujuan</p>
            </div>

            {/* Stats Cards - Only 2 cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <BappOverviewCard
                    title="Total Dokumen"
                    value={bappData.stats.totalDokumen}
                    icon="📄"
                    bgColor="bg-gradient-to-br from-blue-500 to-blue-600"
                />
                <BappOverviewCard
                    title="Pending"
                    value={bappData.stats.pending}
                    icon="⏳"
                    bgColor="bg-gradient-to-br from-yellow-400 to-yellow-500"
                />
            </div>

            {/* BAPP List Table - Without Jumlah Barang column */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50 border-b border-gray-200">
                            <tr>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                    No BAPP
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                    Nama Proyek
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                    Vendor
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                    Tanggal
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                    Status
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                    Aksi
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {bappData.list.map((item) => (
                                <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="text-sm font-semibold text-gray-900">{item.noBapp}</div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="text-sm font-medium text-gray-900">{item.namaProyek}</div>
                                        <div className="text-xs text-gray-500 mt-1">{item.deskripsi.substring(0, 60)}...</div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="text-sm text-gray-700">{item.vendor}</div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="text-sm text-gray-700">{item.tanggal}</div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="inline-flex px-3 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                                            {item.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <button
                                            onClick={() => handleReview(item)}
                                            className="px-6 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
                                        >
                                            Review
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Empty State */}
            {bappData.list.length === 0 && (
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
                    <FileText size={48} className="mx-auto text-gray-300 mb-4" />
                    <p className="text-gray-500">Tidak ada BAPP yang menunggu persetujuan</p>
                </div>
            )}
        </div>
    );
};

export default PersetujuanBappList;