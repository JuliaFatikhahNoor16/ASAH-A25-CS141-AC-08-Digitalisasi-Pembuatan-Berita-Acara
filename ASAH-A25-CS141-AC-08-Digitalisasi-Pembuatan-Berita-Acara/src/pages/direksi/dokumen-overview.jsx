import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, Download } from 'lucide-react';
import DataTable from '../../components/common/datatable';

const DokumenOverview = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  
  const [dokumenData, setDokumenData] = useState([]);

  useEffect(() => {
    fetchDokumenData();
  }, []);

  const fetchDokumenData = async () => {
    try {
      setLoading(true);
      
      const mockData = [
        {
          id: 1,
          noBapp: 'BAPP-XYZ-234',
          namaProyek: 'Renovasi Gedung Kantor Pusat',
          deskripsi: 'Proyek renovasi gedung kantor pusat meliputi perbaikan struk...',
          vendor: 'PT. Wijaya Konstruksi',
          tanggalReview: '2025-01-15',
          status: 'approved'
        },
        {
          id: 2,
          noBapp: 'BAPP-ABC-567',
          namaProyek: 'Pembangunan Gedung Baru Lantai 5',
          deskripsi: 'Pembangunan gedung baru 5 lantai untuk ekspansi kantor denga...',
          vendor: 'PT. Mega Bangunan',
          tanggalReview: '2025-01-14',
          status: 'approved'
        },
        {
          id: 3,
          noBapp: 'BAPP-XYZ-890',
          namaProyek: 'Pengadaan Furniture Kantor',
          deskripsi: 'Pengadaan furniture untuk seluruh kantor termasuk meja, kurs...',
          vendor: 'PT. Furniture Indo',
          tanggalReview: '2025-01-13',
          status: 'rejected'
        },
        {
          id: 4,
          noBapp: 'BAPP-DEF-123',
          namaProyek: 'Renovasi Ruang Meeting',
          deskripsi: 'Renovasi dan upgrade ruang meeting lantai 3 dengan teknologi...',
          vendor: 'PT. Interior Jaya',
          tanggalReview: '2025-01-12',
          status: 'approved'
        },
        {
          id: 5,
          noBapp: 'BAPP-GHI-456',
          namaProyek: 'Pengadaan Server Baru',
          deskripsi: 'Pengadaan server dan infrastruktur IT untuk kebutuhan kantor...',
          vendor: 'PT. Tech Solution',
          tanggalReview: '2025-01-11',
          status: 'rejected'
        }
      ];

      setDokumenData(mockData);
    } catch (error) {
      console.error('Error fetching dokumen data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRowClick = (row) => {
    navigate(`/direksi/dokumen-overview/${row.noBapp}`);
  };

  const handleDownload = (e, dokumen) => {
    e.stopPropagation();
    alert(`Downloading BAPP ${dokumen.noBapp}...`);
  };

  const handlePageChange = (action) => {
    const totalPages = Math.ceil(dokumenData.length / itemsPerPage);
    
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
                <div className="text-sm font-semibold text-gray-900">{row.namaProyek}</div>
                <div className="text-sm text-gray-500 mt-1">{row.deskripsi}</div>
            </div>
        )
    },
    {
        key: 'vendor',
        title: 'Vendor'
    },
    {
        key: 'tanggalReview',
        title: 'Tanggal Review'
    },
    {
        key: 'status',
        title: 'Status'
    },
    {
        key: 'aksi',
        title: 'Aksi',
        render: (value, row) => (
            <div className="flex items-center gap-2">
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        handleRowClick(row);
                    }}
                    className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    title="View Detail"
                >
                    <Eye size={18} />
                </button>
                <button
                    onClick={(e) => handleDownload(e, row)}
                    className="p-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                    title="Download"
                >
                    <Download size={18} />
                </button>
            </div>
        )
    }
  ];

  const tableData = dokumenData.map(item => ({
      ...item,
      namaProyek: item.namaProyek
  }));

  const totalItems = dokumenData.length;
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
        <h1 className="text-3xl font-bold text-[#1e3a8a]">Dokumen Overview</h1>
        <p className="text-gray-500 mt-1">Lihat semua dokumen BAPP yang disetujui dan ditolak</p>
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
      {dokumenData.length === 0 && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
          <p className="text-gray-500">Belum ada dokumen yang direview</p>
        </div>
      )}
    </div>
  );
};

export default DokumenOverview;