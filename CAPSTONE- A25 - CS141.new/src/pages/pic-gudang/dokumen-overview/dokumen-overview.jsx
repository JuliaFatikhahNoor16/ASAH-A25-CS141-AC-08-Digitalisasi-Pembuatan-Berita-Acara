import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, Calendar } from 'lucide-react';

const DokumenOverview = () => {
  const navigate = useNavigate();

  // Mock data dokumen (mix disetujui & ditolak)
  const dokumenList = [
    {
      id: 1,
      noBapb: 'BAPB-2024-064',
      vendor: 'PT. Jaya Abadi',
      totalItems: 10,
      nilai: 'Rp 50.000.000',
      tanggalDisetujui: '14 Nov 2024',
      status: 'Disetujui',
    },
    {
      id: 2,
      noBapb: 'BAPB-2024-063',
      vendor: 'CV. Mandiri',
      totalItems: 7,
      nilai: 'Rp 35.000.000',
      tanggalDisetujui: '13 Nov 2024',
      status: 'Disetujui',
    },
    {
      id: 3,
      noBapb: 'BAPB-2024-062',
      vendor: 'PT. Bangun',
      totalItems: 9,
      nilai: 'Rp 55.000.000',
      tanggalDisetujui: '12 Nov 2024',
      status: 'Ditolak',
    },
    {
      id: 4,
      noBapb: 'BAPB-2024-061',
      vendor: 'PT. Jaya Abadi',
      totalItems: 14,
      nilai: 'Rp 70.000.000',
      tanggalDisetujui: '11 Nov 2024',
      status: 'Disetujui',
    },
    {
      id: 5,
      noBapb: 'BAPB-2024-060',
      vendor: 'Vendor Lain',
      totalItems: 6,
      nilai: 'Rp 30.000.000',
      tanggalDisetujui: '10 Nov 2024',
      status: 'Ditolak',
    }
  ];

  // Navigate to detail page
  const handlePreview = (dokumen) => {
    navigate(`/pic-gudang/dokumen-overview/${dokumen.noBapb}`);
  };

  return (
    <div className="max-w-7xl mx-auto">
      {/* Page Title */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Dokumen Overview</h1>
        <p className="text-gray-500 mt-1">Lihat semua dokumen BAPB yang disetujui dan ditolak</p>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                  No BAPB
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                  Vendor
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                  Items
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                  Nilai
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                  Tanggal Review
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                  Keterangan
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                  Aksi
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {dokumenList.map((dokumen) => (
                <tr key={dokumen.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3 text-sm font-medium text-gray-900">
                    {dokumen.noBapb}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-700">
                    {dokumen.vendor}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-700">
                    {dokumen.totalItems} items
                  </td>
                  <td className="px-4 py-3 text-sm font-medium text-gray-900">
                    {dokumen.nilai}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-700">
                    <div className="flex items-center gap-1">
                      <Calendar size={14} className="text-gray-400" />
                      {dokumen.tanggalDisetujui}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex justify-center">
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${dokumen.status === 'Disetujui'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                        }`}>
                        {dokumen.status}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex justify-center">
                      <button
                        onClick={() => handlePreview(dokumen)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="Preview"
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
    </div>
  );
};

export default DokumenOverview;
