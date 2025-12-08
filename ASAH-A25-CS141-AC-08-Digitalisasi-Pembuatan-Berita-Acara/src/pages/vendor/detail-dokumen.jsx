import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const DetailDokumen = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // Sample data berdasarkan ID dokumen
  const documentData = {
    id: id,
    type: id.includes('BAPB') ? 'bapb' : 'bapp',
    judul: 'Renovasi Kantor Pusat - Project A',
    nilai: 'Rp 500.000.000',
    tanggalDibuat: '2024-10-01',
    deadline: '2024-10-15',
    status: 'approved',
    nomorSuratPesanan: 'SP/2024/001',
    picTerakhir: 'Ahmad Wijaya',
    timeline: [
      { step: 1, status: 'completed', action: 'Dibuat oleh Vendor', oleh: 'Anda', tanggal: '2024-10-01 10:30', catatan: '' },
      { step: 2, status: 'completed', action: 'Disetujui PIC Gudang', oleh: 'Budi Santoso', tanggal: '2024-10-02 14:20', catatan: 'Barang sesuai spesifikasi' },
      { step: 3, status: 'completed', action: 'Disetujui Pemesan Barang', oleh: 'Ahmad Wijaya', tanggal: '2024-10-03 09:15', catatan: 'Sudah bisa diproses pembayaran' }
    ],
    lampiran: [
      { nama: 'surat_pesanan.pdf', tipe: 'pdf', ukuran: '2.1 MB' },
      { nama: 'foto_barang_1.jpg', tipe: 'image', ukuran: '1.5 MB' },
      { nama: 'invoice.pdf', tipe: 'pdf', ukuran: '3.2 MB' }
    ]
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'completed': return 'bg-green-100 text-green-800 border-green-200';
      case 'current': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'rejected': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusColorGlobal = (status) => {
    switch(status) {
      case 'approved': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      case 'draft': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusLabel = (status) => {
    switch(status) {
      case 'approved': return 'DISETUJUI';
      case 'pending': return 'PENDING';
      case 'rejected': return 'DITOLAK';
      case 'draft': return 'DRAFT';
      default: return 'UNKNOWN';
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const formatDateTime = (dateTimeString) => {
    return new Date(dateTimeString).toLocaleString('id-ID', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header dengan Breadcrumb */}
        <div className="mb-6">
          <button
            onClick={() => navigate('/vendor/dokumen-saya')}
            className="flex items-center text-blue-600 hover:text-blue-800 font-medium mb-4"
          >
            <span className="mr-2">←</span>
            Kembali ke Dokumen Saya
          </button>
          
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex justify-between items-start">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Detail Dokumen</h1>
                <p className="text-gray-600 mt-1">No. Dokumen: <span className="font-mono">{documentData.id}</span></p>
              </div>
              <div className="text-right">
                <span className={`inline-flex px-3 py-1 rounded-full text-sm font-semibold ${getStatusColorGlobal(documentData.status)}`}>
                  {getStatusLabel(documentData.status)}
                </span>
                <p className="text-sm text-gray-500 mt-1">Terakhir ditangani: {documentData.picTerakhir}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content - FULL WIDTH */}
        <div className="space-y-6">
          
          {/* Informasi Dokumen */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Informasi Dokumen</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Judul Projek</label>
                  <p className="text-gray-900 font-medium">{documentData.judul}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Jenis Dokumen</label>
                  <span className={`inline-flex px-3 py-1 rounded-full text-sm font-medium ${
                    documentData.type === 'bapb' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'
                  }`}>
                    {documentData.type.toUpperCase()}
                  </span>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nilai Kontrak</label>
                  <p className="text-gray-900 font-medium">{documentData.nilai}</p>
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">No. Surat Pesanan</label>
                  <p className="text-gray-900">{documentData.nomorSuratPesanan}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Tanggal Dibuat</label>
                  <p className="text-gray-900">{formatDate(documentData.tanggalDibuat)}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Deadline</label>
                  <p className="text-gray-900">{formatDate(documentData.deadline)}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Timeline Tracking */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Tracking Persetujuan</h2>
            <div className="space-y-4">
              {documentData.timeline.map((step, index) => (
                <div key={index} className={`flex items-start space-x-4 p-4 rounded-lg border ${getStatusColor(step.status)}`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    step.status === 'completed' ? 'bg-green-600 text-white' :
                    step.status === 'current' ? 'bg-blue-600 text-white' :
                    step.status === 'rejected' ? 'bg-red-600 text-white' : 'bg-gray-400 text-white'
                  }`}>
                    {step.status === 'completed' ? '✓' : 
                     step.status === 'current' ? '⋯' :
                     step.status === 'rejected' ? '✕' : index + 1}
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-medium text-gray-900">{step.action}</p>
                        <p className="text-sm text-gray-600">Oleh: {step.oleh}</p>
                      </div>
                      <span className="text-sm text-gray-500">{formatDateTime(step.tanggal)}</span>
                    </div>
                    {step.catatan && (
                      <p className="text-sm text-gray-600 mt-2 bg-white bg-opacity-50 p-2 rounded">
                        <strong>Catatan:</strong> {step.catatan}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Lampiran */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Surat Pendukung</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {documentData.lampiran.map((file, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <span className="text-blue-600 text-xl">
                      {file.tipe === 'pdf' ? '📄' : '🖼️'}
                    </span>
                    <div>
                      <p className="font-medium text-gray-900">{file.nama}</p>
                      <p className="text-sm text-gray-500">{file.ukuran}</p>
                    </div>
                  </div>
                  <button className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors text-sm">
                    Download
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* PREVIEW DOKUMEN */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Preview Dokumen</h2>
            <div className="bg-gray-50 rounded-lg p-8">
              {/* Header Preview */}
              <div className="text-center mb-8 border-b pb-6">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  {documentData.type === 'bapb' ? 'BERITA ACARA PEMERIKSAAN BARANG' : 'BERITA ACARA PEMERIKSAAN PEKERJAAN'}
                </h3>
                <p className="text-gray-600">Nomor: {documentData.id}</p>
              </div>

              {/* Content Preview */}
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="font-semibold text-gray-900">Nama Projek:</p>
                    <p className="text-gray-700">{documentData.judul}</p>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">Nilai Kontrak:</p>
                    <p className="text-gray-700">{documentData.nilai}</p>
                  </div>
                </div>

                <div>
                  <p className="font-semibold text-gray-900 mb-2">Deskripsi:</p>
                  <p className="text-gray-700 leading-relaxed">
                    {documentData.type === 'bapb' 
                      ? 'Berita acara ini dibuat sebagai bukti telah dilakukannya pemeriksaan barang sesuai dengan spesifikasi yang ditentukan dalam surat pesanan. Barang telah diperiksa dan dinyatakan sesuai dengan ketentuan yang berlaku.'
                      : 'Berita acara ini dibuat sebagai bukti telah dilakukannya pemeriksaan pekerjaan sesuai dengan standar yang ditetapkan. Pekerjaan telah selesai dilaksanakan dan memenuhi semua persyaratan teknis.'
                    }
                  </p>
                </div>

                {/* Item Details */}
                <div className="mt-6">
                  <p className="font-semibold text-gray-900 mb-3">Rincian:</p>
                  <div className="bg-white rounded-lg p-4 border">
                    <p className="text-gray-700">
                      {documentData.type === 'bapb' 
                        ? '• Barang telah diperiksa dan sesuai spesifikasi\n• Kondisi barang dalam keadaan baik\n• Kuantitas sesuai dengan yang dipesan'
                        : '• Pekerjaan telah selesai 100%\n• Kualitas pekerjaan memenuhi standar\n• Tidak ada kendala teknis yang signifikan'
                      }
                    </p>
                  </div>
                </div>

                {/* Signature Area */}
                <div className="mt-12 pt-8 border-t">
                  <div className="grid grid-cols-2 gap-8">
                    <div className="text-center">
                      <p className="font-semibold text-gray-900 mb-12">Vendor</p>
                      <p className="text-gray-600">(___________________)</p>
                      <p className="text-sm text-gray-500 mt-2">Nama & Cap Perusahaan</p>
                    </div>
                    <div className="text-center">
                      <p className="font-semibold text-gray-900 mb-12">
                        {documentData.type === 'bapb' ? 'PIC Gudang' : 'Direksi Pekerjaan'}
                      </p>
                      <p className="text-gray-600">(___________________)</p>
                      <p className="text-sm text-gray-500 mt-2">Nama & Tanda Tangan</p>
                    </div>
                  </div>
                </div>

                {/* Date & Place */}
                <div className="text-center mt-8">
                  <p className="text-gray-700">
                    Samarinda, {formatDate(documentData.tanggalDibuat)}
                  </p>
                </div>
              </div>
            </div>

            {/* Action Buttons untuk Preview */}
            <div className="flex justify-center space-x-4 mt-6 pt-6 border-t">
              <button className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium">
                Download PDF
              </button>
              <button className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium">
                Cetak Dokumen
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DetailDokumen;
