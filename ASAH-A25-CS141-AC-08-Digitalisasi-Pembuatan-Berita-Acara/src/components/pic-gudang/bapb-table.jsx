import React from 'react';
import { Package } from 'lucide-react';

const BapbTable = ({ data = [], onView }) => {
  const handleView = (dokumen) => {
    if (onView && typeof onView === 'function') {
      onView(dokumen);
    }
  };

  // Fungsi untuk badge status yang sama dengan DataTable.jsx
  const getStatusBadge = (status) => {
    const statusConfig = {
      'pending': { color: 'bg-yellow-100 text-yellow-800', label: 'Pending' },
      'approved': { color: 'bg-green-100 text-green-800', label: 'Disetujui' },
      'rejected': { color: 'bg-red-100 text-red-800', label: 'Ditolak' },
      'draft': { color: 'bg-gray-100 text-gray-800', label: 'Draft' },
      'menunggu persetujuan': { color: 'bg-yellow-100 text-yellow-800', label: 'Pending' },
      'disetujui': { color: 'bg-green-100 text-green-800', label: 'Disetujui' },
      'ditolak': { color: 'bg-red-100 text-red-800', label: 'Ditolak' },
      'menunggu pengecekan': { color: 'bg-yellow-100 text-yellow-800', label: 'Pending' }
    };

    const statusLower = status.toLowerCase();
    const config = statusConfig[statusLower] || statusConfig.draft;
    
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.color}`}>
        {config.label}
      </span>
    );
  };

  if (!data || data.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
        <p className="text-gray-500">Tidak ada data BAPB</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                NO BAPB
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                NAMA PROYEK
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                VENDOR
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                TANGGAL
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                JUMLAH BARANG
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                STATUS
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                AKSI
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {data.map((dokumen) => (
              <tr key={dokumen.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  <span className="font-semibold">{dokumen.noBapb}</span>
                </td>
                <td className="px-6 py-4">
                  <div>
                    <p className="text-sm font-medium text-gray-900">{dokumen.namaProyek}</p>
                    <p className="text-xs text-gray-500 mt-0.5 line-clamp-1">{dokumen.deskripsi}</p>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {dokumen.vendor}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {dokumen.tanggalPengajuan}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="inline-flex items-center gap-1 px-2 py-1 bg-blue-50 text-blue-700 rounded-full text-xs font-medium">
                    <Package size={12} />
                    {dokumen.jumlahBarang} item
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {getStatusBadge(dokumen.status)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  <button
                    onClick={() => handleView(dokumen)}
                    className="text-blue-600 hover:text-blue-800 font-medium text-sm"
                  >
                    Lihat
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination - SAMA DENGAN DATATABLE.JSX */}
      {/* Note: Untuk pagination lengkap, Anda perlu menambahkan props pagination dan onPageChange */}
      {/* Saat ini ditampilkan contoh statis, bisa disesuaikan nanti */}
      <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 flex items-center justify-between">
        <div className="text-sm text-gray-700">
          Menampilkan 1 sampai {Math.min(data.length, 10)} dari {data.length} entri
        </div>
        
        <div className="flex items-center space-x-2">
          <button
            disabled={true}
            className="px-3 py-1 text-sm border border-gray-300 rounded disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Awal
          </button>
          <button
            disabled={true}
            className="px-3 py-1 text-sm border border-gray-300 rounded disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Balik
          </button>
          
          <span className="px-3 py-1 text-sm bg-blue-600 text-white rounded">
            1
          </span>
          
          <button
            disabled={data.length <= 10}
            className="px-3 py-1 text-sm border border-gray-300 rounded disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Lanjut
          </button>
          <button
            disabled={data.length <= 10}
            className="px-3 py-1 text-sm border border-gray-300 rounded disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Akhir
          </button>
        </div>
      </div>
    </div>
  );
};

export default BapbTable;