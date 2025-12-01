import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, Download } from 'lucide-react';

const DokumenOverview = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [dokumenData, setDokumenData] = useState([]);

  useEffect(() => {
    fetchDokumenData();
  }, []);

  const fetchDokumenData = async () => {
    try {
      setLoading(true);
      
      // Mock data sesuai screenshot - hanya yang sudah disetujui atau ditolak
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

  const getStatusBadge = (status) => {
    if (status === 'approved') {
      return (
        <span className="inline-flex px-4 py-2 rounded-lg text-sm font-medium bg-green-100 text-green-800">
          Disetujui
        </span>
      );
    } else if (status === 'rejected') {
      return (
        <span className="inline-flex px-4 py-2 rounded-lg text-sm font-medium bg-red-100 text-red-800">
          Ditolak
        </span>
      );
    }
  };

  const handleViewDetail = (dokumen) => {
    console.log('View detail:', dokumen);
    navigate(`/direksi/project-overview/${dokumen.noBapp}`);
  };

  const handleDownload = (dokumen) => {
    console.log('Download:', dokumen);
    alert(`Downloading BAPP ${dokumen.noBapp}...`);
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

      {/* Table */}
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
                  Tanggal Review
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
              {dokumenData.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="text-sm font-semibold text-gray-900">{item.noBapp}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm font-semibold text-gray-900">{item.namaProyek}</div>
                    <div className="text-sm text-gray-500 mt-1">{item.deskripsi}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900">{item.vendor}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900">{item.tanggalReview}</div>
                  </td>
                  <td className="px-6 py-4">
                    {getStatusBadge(item.status)}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleViewDetail(item)}
                        className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                        title="View Detail"
                      >
                        <Eye size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

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
