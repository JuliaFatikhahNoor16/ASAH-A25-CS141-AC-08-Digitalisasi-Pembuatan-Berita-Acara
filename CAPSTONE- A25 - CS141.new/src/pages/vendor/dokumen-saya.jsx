import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import DataTable from '../../components/common/datatable';

const DokumenSaya = () => {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState({
    jenisDokumen: '',
    status: '',
    search: ''
  });
  const itemsPerPage = 5;

  // Sample data dengan status
  const documents = [
    {
      id: 'BAPB-XYZ-234',
      jenisDokumen: 'BAPB',
      tanggalDibuat: '2025-10-01',
      status: 'Pending',
    },
    {
      id: 'BAPP-ABC-235',
      jenisDokumen: 'BAPP',
      tanggalDibuat: '2025-10-03',
      status: 'Pending',
    },
    {
      id: 'BAPB-XYZ-236',
      jenisDokumen: 'BAPB',
      tanggalDibuat: '2025-10-05',
      status: 'Disetujui',
    },
    {
      id: 'BAPP-ABC-237',
      jenisDokumen: 'BAPP',
      tanggalDibuat: '2025-10-07',
      status: 'Ditolak',
    },
    {
      id: 'BAPB-XYZ-238',
      jenisDokumen: 'BAPB',
      tanggalDibuat: '2025-10-09',
      status: 'Ditolak',
    },
    {
      id: 'BAPP-DEF-239',
      jenisDokumen: 'BAPP',
      tanggalDibuat: '2025-10-11',
      status: 'Disetujui',
    },
    {
      id: 'BAPB-GHI-240',
      jenisDokumen: 'BAPB',
      tanggalDibuat: '2025-10-13',
      status: 'Pending',
    }
  ];

  // Filter data berdasarkan kriteria
  const filteredData = useMemo(() => {
    return documents.filter(doc => {
      const matchesJenis = !filters.jenisDokumen || doc.jenisDokumen === filters.jenisDokumen;
      const matchesStatus = !filters.status || doc.status === filters.status;
      const matchesSearch = !filters.search || 
        doc.id.toLowerCase().includes(filters.search.toLowerCase()) ||
        doc.jenisDokumen.toLowerCase().includes(filters.search.toLowerCase());

      return matchesJenis && matchesStatus && matchesSearch;
    });
  }, [documents, filters]);

  // Columns configuration
  const columns = [
    { key: 'id', title: 'NO DOKUMEN', width: 'w-48' },
    { key: 'jenisDokumen', title: 'JENIS DOKUMEN', width: 'w-32' },
    { key: 'tanggalDibuat', title: 'TANGGAL DIBUAT', width: 'w-40' },
    { key: 'status', title: 'STATUS', width: 'w-32' },
    { key: 'aksi', title: 'AKSI', width: 'w-24' }
  ];

  // Format data for table
  const tableData = filteredData.map(doc => ({
    ...doc,
    tanggalDibuat: new Date(doc.tanggalDibuat).toLocaleDateString('id-ID'),
    aksi: 'Lihat'
  }));

  // Pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = tableData.slice(indexOfFirstItem, indexOfLastItem);

  const handlePageChange = (action) => {
    switch(action) {
      case 'first':
        setCurrentPage(1);
        break;
      case 'prev':
        setCurrentPage(prev => Math.max(prev - 1, 1));
        break;
      case 'next':
        setCurrentPage(prev => Math.min(prev + 1, Math.ceil(tableData.length / itemsPerPage)));
        break;
      case 'last':
        setCurrentPage(Math.ceil(tableData.length / itemsPerPage));
        break;
      default:
        break;
    }
  };

  const handleRowClick = (row) => {
    navigate(`/vendor/dokumen-saya/${row.id}`);
  };

  const handleFilterChange = (filterType, value) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: value
    }));
    setCurrentPage(1); // Reset ke halaman 1 ketika filter berubah
  };

  const clearFilters = () => {
    setFilters({
      jenisDokumen: '',
      status: '',
      search: ''
    });
    setCurrentPage(1);
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'Disetujui': return 'bg-green-100 text-green-800';
      case 'Pending': return 'bg-yellow-100 text-yellow-800';
      case 'Ditolak': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const paginationConfig = {
    currentPage,
    lastPage: Math.ceil(tableData.length / itemsPerPage),
    from: indexOfFirstItem + 1,
    to: Math.min(indexOfLastItem, tableData.length),
    total: tableData.length
  };

  const hasActiveFilters = filters.jenisDokumen || filters.status || filters.search;

  return (
    <div className="max-w-6xl mx-auto space-y-6 px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Dokumen Saya</h1>
            <p className="text-sm sm:text-base text-gray-600 mt-1">Kelola dan pantau berita acara yang telah Anda buat</p>
          </div>
          <button
            onClick={() => navigate('/vendor/tambah-dokumen')}
            className="px-4 py-2 sm:px-6 sm:py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm sm:text-base w-full sm:w-auto text-center"
          >
            + Buat Dokumen Baru
          </button>
        </div>
      </div>

      {/* Filter Section */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
        <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-end">
          {/* Jenis Dokumen Filter */}
          <div className="w-full lg:w-48">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Jenis Dokumen
            </label>
            <select
              value={filters.jenisDokumen}
              onChange={(e) => handleFilterChange('jenisDokumen', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Semua Jenis</option>
              <option value="BAPB">BAPB</option>
              <option value="BAPP">BAPP</option>
            </select>
          </div>

          {/* Status Filter */}
          <div className="w-full lg:w-48">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Status
            </label>
            <select
              value={filters.status}
              onChange={(e) => handleFilterChange('status', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Semua Status</option>
              <option value="Pending">Pending</option>
              <option value="Disetujui">Disetujui</option>
              <option value="Ditolak">Ditolak</option>
            </select>
          </div>

          {/* Clear Filters Button */}
          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm whitespace-nowrap"
            >
              Hapus Filter
            </button>
          )}
        </div>

        {/* Active Filters Badges */}
        {hasActiveFilters && (
          <div className="mt-4 flex flex-wrap gap-2">
            {filters.jenisDokumen && (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                Jenis: {filters.jenisDokumen}
                <button
                  onClick={() => handleFilterChange('jenisDokumen', '')}
                  className="ml-1 hover:text-blue-600"
                >
                  ×
                </button>
              </span>
            )}
            {filters.status && (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                Status: {filters.status}
                <button
                  onClick={() => handleFilterChange('status', '')}
                  className="ml-1 hover:text-blue-600"
                >
                  ×
                </button>
              </span>
            )}
            {filters.search && (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                Pencarian: "{filters.search}"
                <button
                  onClick={() => handleFilterChange('search', '')}
                  className="ml-1 hover:text-blue-600"
                >
                  ×
                </button>
              </span>
            )}
          </div>
        )}
      </div>

      {/* DataTable Component */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        {tableData.length > 0 ? (
          <DataTable
            data={currentItems}
            columns={columns}
            onRowClick={handleRowClick}
            pagination={paginationConfig}
            onPageChange={handlePageChange}
            compact={true}
          />
        ) : (
          <div className="p-8 text-center">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Tidak ada dokumen ditemukan</h3>
            <p className="text-gray-600 mb-4">Coba ubah filter pencarian Anda atau hapus filter untuk melihat semua dokumen.</p>
            {hasActiveFilters && (
              <button
                onClick={clearFilters}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Hapus Semua Filter
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default DokumenSaya;
