// components/common/DataTable.jsx
import React from 'react';

const DataTable = ({ 
  data, 
  columns, 
  onRowClick,
  pagination,
  onPageChange 
}) => {
  const getStatusBadge = (status) => {
    const statusConfig = {
      pending: { color: 'bg-yellow-100 text-yellow-800', label: 'Pending' },
      approved: { color: 'bg-green-100 text-green-800', label: 'Disetujui' },
      rejected: { color: 'bg-red-100 text-red-800', label: 'Ditolak' },
      draft: { color: 'bg-gray-100 text-gray-800', label: 'Draft' }
    };

    const config = statusConfig[status.toLowerCase()] || statusConfig.draft;
    
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.color}`}>
        {config.label}
      </span>
    );
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              {columns.map((column) => (
                <th
                  key={column.key}
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  {column.title}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {data.map((row, index) => (
              <tr 
                key={index}
                onClick={() => onRowClick && onRowClick(row)}
                className="hover:bg-gray-50 cursor-pointer transition-colors"
              >
                {columns.map((column) => (
                  <td key={column.key} className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {column.key === 'status' ? (
                      getStatusBadge(row[column.key])
                    ) : column.key === 'aksi' ? (
                      <button className="text-blue-600 hover:text-blue-800 font-medium text-sm">
                        Lihat
                      </button>
                    ) : (
                      row[column.key]
                    )}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {pagination && (
        <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 flex items-center justify-between">
          <div className="text-sm text-gray-700">
            Menampilkan {pagination.from} sampai {pagination.to} dari {pagination.total} entri
          </div>
          
          <div className="flex items-center space-x-2">
            <button
              onClick={() => onPageChange('first')}
              disabled={pagination.currentPage === 1}
              className="px-3 py-1 text-sm border border-gray-300 rounded disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Awal
            </button>
            <button
              onClick={() => onPageChange('prev')}
              disabled={pagination.currentPage === 1}
              className="px-3 py-1 text-sm border border-gray-300 rounded disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Balik
            </button>
            
            <span className="px-3 py-1 text-sm bg-blue-600 text-white rounded">
              {pagination.currentPage}
            </span>
            
            <button
              onClick={() => onPageChange('next')}
              disabled={pagination.currentPage === pagination.lastPage}
              className="px-3 py-1 text-sm border border-gray-300 rounded disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Lanjut
            </button>
            <button
              onClick={() => onPageChange('last')}
              disabled={pagination.currentPage === pagination.lastPage}
              className="px-3 py-1 text-sm border border-gray-300 rounded disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Akhir
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DataTable;