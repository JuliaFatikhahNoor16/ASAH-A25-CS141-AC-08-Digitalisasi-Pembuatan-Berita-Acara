import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FileText } from 'lucide-react';
import { StatsGrid } from '../../components/common/statcard';
import DataTable from '../../components/common/datatable';

const PersetujuanBappList = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;
    
    const [bappData, setBappData] = useState({
        stats: {
            totalBapp: 0,
            totalDitolak: 0,
            totalDisetujui: 0,
            rataWaktu: '0 hari'
        },
        list: []
    });

    useEffect(() => {
        fetchBappData();
    }, []);

    const fetchBappData = async () => {
        try {
            setLoading(true);

            const mockData = {
                stats: {
                    totalBapp: 8,
                    totalDitolak: 5,
                    totalDisetujui: 25,
                    rataWaktu: '2 hari'
                },
                list: [
                    {
                        id: 1,
                        noBapp: 'BAPP-XYZ-234',
                        namaProyek: 'Renovasi Gedung Kantor Pusat',
                        deskripsi: 'Proyek renovasi gedung kantor pusat meliputi perbaikan struktur bangunan, pengecatan ulang, dan sistem listrik',
                        vendor: 'PT. Wijaya Konstruksi',
                        tanggal: '2025-01-15',
                        status: 'pending'
                    },
                    {
                        id: 2,
                        noBapp: 'BAPP-ABC-567',
                        namaProyek: 'Pembangunan Gedung Baru Lantai 5',
                        deskripsi: 'Pembangunan gedung baru 5 lantai untuk ekspansi kantor dengan fasilitas lengkap',
                        vendor: 'PT. Mega Bangunan',
                        tanggal: '2025-01-14',
                        status: 'pending'
                    },
                    {
                        id: 3,
                        noBapp: 'BAPP-XYZ-890',
                        namaProyek: 'Pengadaan Furniture Kantor',
                        deskripsi: 'Pengadaan furniture untuk seluruh kantor termasuk meja, kursi, dan lemari',
                        vendor: 'PT. Furniture Indo',
                        tanggal: '2025-01-13',
                        status: 'pending'
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

    const handleRowClick = (row) => {
        navigate(`/direksi/persetujuan-bapp/${row.noBapp}`);
    };

    const handlePageChange = (action) => {
        const totalPages = Math.ceil(bappData.list.length / itemsPerPage);
        
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

    const columns = [
        {
            key: 'noBapp',
            title: 'No BAPP'
        },
        {
            key: 'namaProyek',
            title: 'Nama Proyek',
            render: (value, row) => (
                <div>
                    <div className="font-medium text-gray-900">{row.namaProyek}</div>
                    <div className="text-xs text-gray-500 mt-1">
                        {row.deskripsi.substring(0, 60)}...
                    </div>
                </div>
            )
        },
        {
            key: 'vendor',
            title: 'Vendor'
        },
        {
            key: 'tanggal',
            title: 'Tanggal'
        },
        {
            key: 'status',
            title: 'Status'
        },
        {
            key: 'aksi',
            title: 'Aksi',
            render: () => (
                <button className="px-6 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors">
                    Review
                </button>
            )
        }
    ];

    const tableData = bappData.list.map(item => ({
        ...item,
        namaProyek: item.namaProyek
    }));

    const totalItems = bappData.list.length;
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = Math.min(startIndex + itemsPerPage, totalItems);
    
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
                <h1 className="text-3xl font-bold text-[#1e3a8a]">Persetujuan BAPP</h1>
                <p className="text-gray-500 mt-1">Daftar dokumen BAPP yang menunggu persetujuan</p>
            </div>

            {/* Stats Cards */}
            <div className="mb-8">
                <StatsGrid
                    data={{
                        bappMenunggu: bappData.stats.totalBapp,
                        dokumenDitolak: bappData.stats.totalDitolak,
                        dokumenDisetujui: bappData.stats.totalDisetujui,
                        rataRataWaktu: bappData.stats.rataWaktu
                    }}
                />
            </div>

            {/* DataTable dengan Pagination */}
            <DataTable
                data={tableData}
                columns={columns}
                onRowClick={handleRowClick}
                pagination={paginationConfig}
                onPageChange={handlePageChange}
            />

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