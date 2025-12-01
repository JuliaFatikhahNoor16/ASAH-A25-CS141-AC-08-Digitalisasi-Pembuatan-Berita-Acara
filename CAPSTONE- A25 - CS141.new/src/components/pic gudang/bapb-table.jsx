// components/pic-gudang/bapb-table.jsx
import React from 'react';
import { Package } from 'lucide-react';

const BapbTable = ({ data = [], onView }) => {
  // Gunakan onView yang diberikan dari parent component
  const handleView = (dokumen) => {
    if (onView && typeof onView === 'function') {
      onView(dokumen);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                NO BAPB
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                NAMA PROYEK
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                VENDOR
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                TANGGAL
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                JUMLAH BARANG
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                STATUS
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                AKSI
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {data.length > 0 ? (
              data.map((dokumen) => (
                <tr key={dokumen.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <span className="text-sm font-semibold text-gray-900">{dokumen.noBapb}</span>
                  </td>
                  <td className="px-6 py-4">
                    <div>
                      <p className="text-sm font-medium text-gray-900">{dokumen.namaProyek}</p>
                      <p className="text-xs text-gray-500 mt-0.5 line-clamp-1">{dokumen.deskripsi}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-gray-700">{dokumen.vendor}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-gray-700">{dokumen.tanggalPengajuan}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center gap-1 px-2 py-1 bg-blue-50 text-blue-700 rounded-full text-xs font-medium">
                      <Package size={12} />
                      {dokumen.jumlahBarang} item
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center px-2 py-1 bg-yellow-50 text-yellow-700 rounded-full text-xs font-medium">
                      {dokumen.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => handleView(dokumen)}
                      className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      Review
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="px-6 py-8 text-center text-gray-500">
                  Tidak ada data BAPB
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default BapbTable;
