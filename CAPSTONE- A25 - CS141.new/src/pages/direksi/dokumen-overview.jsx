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
      
      // Mock data sesuai screenshot
      const mockData = [
        {
          id: 1,
          noBapp: 'BAPP-2024-064',
          vendor: 'PT. Jaya Abadi',
          items: '10 items',
          nilai: 'Rp 50.000.000',
          tanggalReview: '14 Nov 2024',
          keterangan: 'Disetujui',
          status: 'approved'
        },
        {
          id: 2,
          noBapp: 'BAPP-2024-063',
          vendor: 'CV. Mandiri',
          items: '7 items',
          nilai: 'Rp 35.000.000',
          tanggalReview: '13 Nov 2024',
          keterangan: 'Disetujui',
          status: 'approved'
        },
        {
          id: 3,
          noBapp: 'BAPP-2024-062',
          vendor: 'PT. Bangun',
          items: '9 items',
          nilai: 'Rp 55.000.000',
          tanggalReview: '12 Nov 2024',
          keterangan: 'Ditolak',
          status: 'rejected'
        },
        {
          id: 4,
          noBapp: 'BAPP-2024-061',
          vendor: 'PT. Jaya Abadi',
          items: '14 items',
          nilai: 'Rp 70.000.000',
          tanggalReview: '11 Nov 2024',
          keterangan: 'Disetujui',
          status: 'approved'
        },
        {
          id: 5,
          noBapp: 'BAPP-2024-060',
          vendor: 'Vendor Lain',
          items: '6 items',
          nilai: 'Rp 30.000.000',
          tanggalReview: '10 Nov 2024',
          keterangan: 'Ditolak',
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
        <span className="inline-flex px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
          Disetujui
        </span>
      );
    } else if (status === 'rejected') {
      return (
        <span className="inline-flex px-3 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
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
        <p className="text-gray-500 mt-1">Lihat semua dokumen BAPB yang disetujui dan ditolak</p>
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
                  Vendor
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Items
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Nilai
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Tanggal Review
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Keterangan
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
                    <div className="text-sm font-semibold text-green-700">{item.noBapp}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900">{item.vendor}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-700">{item.items}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm font-medium text-gray-900">{item.nilai}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-700 flex items-center gap-2">
                      <span className="text-green-600">📅</span>
                      {item.tanggalReview}
                    </div>
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
                      <button
                        onClick={() => handleDownload(item)}
                        className="p-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                        title="Download"
                      >
                        <Download size={18} />
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