// pages/pic-gudang/dokumen-overview/dokumen-overview-detail.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Download, FileText, Calendar, DollarSign, User, CheckCircle, XCircle, Package } from 'lucide-react';

const DokumenOverviewDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [bapbData, setBapbData] = useState(null);

  useEffect(() => {
    fetchBapbDetail();
  }, [id]);

  const fetchBapbDetail = async () => {
    try {
      setLoading(true);


      // Cek status dari ID untuk demo
      const isApproved = !id.includes('062') && !id.includes('060');

      const mockDataApproved = {
        noBapb: id || 'BAPB-2024-064',
        namaPengadaan: 'Pengadaan Material Konstruksi',
        vendor: 'PT. Jaya Abadi',
        nilaiProyek: 'Rp 50.000.000',
        tanggalPengajuan: '2024-11-10',
        tanggalReview: '14 Nov 2024',
        status: 'approved',
        reviewer: 'PIC Gudang',
        catatan: 'Dokumen pengadaan telah disetujui. Semua barang sesuai dengan spesifikasi yang diminta dan harga kompetitif. Silakan lanjutkan proses pengiriman sesuai jadwal yang telah disepakati.',
        deskripsi: 'Pengadaan material konstruksi untuk proyek renovasi gedung kantor meliputi berbagai jenis material berkualitas tinggi sesuai standar yang telah ditetapkan.',
        daftarBarang: [
          { nama: 'Semen Portland', qty: 100, satuan: 'sak', harga: 'Rp 1.200.000' },
          { nama: 'Besi Beton Ø12mm', qty: 50, satuan: 'batang', harga: 'Rp 2.500.000' },
          { nama: 'Pasir Cor', qty: 10, satuan: 'm³', harga: 'Rp 1.500.000' },
          { nama: 'Batu Split', qty: 15, satuan: 'm³', harga: 'Rp 2.250.000' },
          { nama: 'Cat Tembok', qty: 200, satuan: 'kaleng', harga: 'Rp 8.000.000' },
          { nama: 'Keramik 40x40', qty: 500, satuan: 'm²', harga: 'Rp 12.500.000' }
        ],
        dokumenPendukung: [
          { nama: 'Surat_Jalan.pdf', ukuran: '1.2 MB' },
          { nama: 'Invoice.pdf', ukuran: '980 KB' },
          { nama: 'Spesifikasi_Material.pdf', ukuran: '2.5 MB' },
          { nama: 'Surat_Penawaran_Harga.pdf', ukuran: '1.8 MB' },
          { nama: 'Sertifikat_Mutu.pdf', ukuran: '3.2 MB' }
        ],
        picGudang: 'Budi Santoso',
        picVendor: 'Ahmad Wijaya'
      };

      const mockDataRejected = {
        noBapb: id || 'BAPB-2024-062',
        namaPengadaan: 'Pengadaan Material Konstruksi',
        vendor: 'PT. Bangun Jaya',
        nilaiProyek: 'Rp 55.000.000',
        tanggalPengajuan: '2024-11-08',
        tanggalReview: '12 Nov 2024',
        status: 'rejected',
        reviewer: 'PIC Gudang',
        catatan: 'Dokumen pengadaan ditolak karena beberapa alasan: (1) Harga yang ditawarkan melebihi budget yang dialokasikan, (2) Spesifikasi beberapa material tidak sesuai dengan standar yang diminta, (3) Dokumen pendukung kurang lengkap. Mohon untuk melakukan revisi dan pengajuan ulang.',
        deskripsi: 'Pengadaan material konstruksi untuk proyek renovasi gedung kantor meliputi berbagai jenis material berkualitas tinggi sesuai standar yang telah ditetapkan.',
        daftarBarang: [
          { nama: 'Semen Portland', qty: 100, satuan: 'sak', harga: 'Rp 1.500.000' },
          { nama: 'Besi Beton Ø12mm', qty: 50, satuan: 'batang', harga: 'Rp 3.000.000' },
          { nama: 'Pasir Cor', qty: 10, satuan: 'm³', harga: 'Rp 2.000.000' },
          { nama: 'Batu Split', qty: 15, satuan: 'm³', harga: 'Rp 2.750.000' },
          { nama: 'Cat Tembok', qty: 200, satuan: 'kaleng', harga: 'Rp 10.000.000' },
          { nama: 'Keramik 40x40', qty: 500, satuan: 'm²', harga: 'Rp 15.000.000' }
        ],
        dokumenPendukung: [
          { nama: 'Surat_Jalan.pdf', ukuran: '1.2 MB' },
          { nama: 'Invoice.pdf', ukuran: '980 KB' },
          { nama: 'Surat_Penawaran_Harga.pdf', ukuran: '1.8 MB' }
        ],
        picGudang: 'Budi Santoso',
        picVendor: 'Bambang Susanto'
      };

      setBapbData(isApproved ? mockDataApproved : mockDataRejected);
    } catch (error) {
      console.error('Error fetching BAPB detail:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadSurat = () => {
    console.log('Downloading surat BAPB:', bapbData.noBapb);
    alert(`Downloading Surat BAPB ${bapbData.noBapb}...\n\nFile: Surat_BAPB_${bapbData.noBapb}.pdf`);
  };

  const handleDownloadDokumen = (dokumen) => {
    console.log('Downloading:', dokumen);
    alert(`Downloading ${dokumen.nama}...`);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-600"></div>
      </div>
    );
  }

  if (!bapbData) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Data BAPB tidak ditemukan</p>
        <button
          onClick={() => navigate('/pic-gudang/dokumen-overview')}
          className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Kembali ke List
        </button>
      </div>
    );
  }

  const getStatusDisplay = () => {
    if (bapbData.status === 'approved') {
      return {
        icon: <CheckCircle size={24} className="text-green-600" />,
        badge: (
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium bg-green-100 text-green-800">
            <CheckCircle size={18} />
            Disetujui
          </span>
        ),
        color: 'green',
        title: 'BAPB Disetujui',
        bgColor: 'border-green-200'
      };
    } else {
      return {
        icon: <XCircle size={24} className="text-red-600" />,
        badge: (
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium bg-red-100 text-red-800">
            <XCircle size={18} />
            Ditolak
          </span>
        ),
        color: 'red',
        title: 'BAPB Ditolak',
        bgColor: 'border-red-200'
      };
    }
  };

  const statusDisplay = getStatusDisplay();

  return (
    <div className="max-w-7xl mx-auto">
      {/* Back Button */}
      <button
        onClick={() => navigate('/pic-gudang/dokumen-overview')}
        className="flex items-center gap-2 px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-900 mb-6 transition-colors"
      >
        <ArrowLeft size={20} />
        <span>Kembali ke List</span>
      </button>

      {/* Header */}
      <div className="mb-6 flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">{bapbData.noBapb}</h1>
          <p className="text-gray-500 mt-1">Detail lengkap dokumen BAPB</p>
        </div>
        <div>
          {statusDisplay.badge}
        </div>
      </div>

      {/* Info Cards Row */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <FileText size={20} className="text-blue-600" />
            </div>
            <div>
              <p className="text-xs text-gray-500">No. BAPB</p>
              <p className="font-semibold text-gray-900 text-sm">{bapbData.noBapb}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <DollarSign size={20} className="text-green-600" />
            </div>
            <div>
              <p className="text-xs text-gray-500">Nilai Pengadaan</p>
              <p className="font-semibold text-gray-900 text-sm">{bapbData.nilaiProyek}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Calendar size={20} className="text-purple-600" />
            </div>
            <div>
              <p className="text-xs text-gray-500">Tanggal Review</p>
              <p className="font-semibold text-gray-900 text-sm">{bapbData.tanggalReview}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-orange-100 rounded-lg">
              <User size={20} className="text-orange-600" />
            </div>
            <div>
              <p className="text-xs text-gray-500">Vendor</p>
              <p className="font-semibold text-gray-900 text-sm truncate">{bapbData.vendor}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Status & Catatan */}
          <div className={`bg-white rounded-xl shadow-sm border-2 ${statusDisplay.bgColor} p-6`}>
            <div className="flex items-start gap-3 mb-4">
              {statusDisplay.icon}
              <div className="flex-1">
                <h2 className="text-xl font-semibold text-gray-800">
                  {statusDisplay.title}
                </h2>
                <p className="text-sm text-gray-600 mt-1">
                  Direview oleh: <span className="font-medium">{bapbData.reviewer}</span>
                </p>
              </div>
            </div>

            <div className="bg-gray-50 rounded-lg p-4 mt-4">
              <p className="text-sm font-medium text-gray-700 mb-2">Catatan Reviewer:</p>
              <p className="text-sm text-gray-600 leading-relaxed">{bapbData.catatan}</p>
            </div>
          </div>

          {/* Detail Pengadaan */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Detail Pengadaan</h2>

            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-600">Nama Pengadaan</label>
                <p className="text-gray-900 mt-1">{bapbData.namaPengadaan}</p>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-600">Deskripsi</label>
                <p className="text-gray-700 mt-1 leading-relaxed">{bapbData.deskripsi}</p>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-600 mb-3 block">Daftar Barang</label>
                <div className="border border-gray-200 rounded-lg overflow-hidden">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">No</th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">Nama Barang</th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">Qty</th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">Satuan</th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">Harga Total</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {bapbData.daftarBarang.map((barang, index) => (
                        <tr key={index} className="hover:bg-gray-50">
                          <td className="px-4 py-3 text-sm text-gray-900">{index + 1}</td>
                          <td className="px-4 py-3 text-sm text-gray-900">{barang.nama}</td>
                          <td className="px-4 py-3 text-sm text-gray-700">{barang.qty}</td>
                          <td className="px-4 py-3 text-sm text-gray-700">{barang.satuan}</td>
                          <td className="px-4 py-3 text-sm font-medium text-gray-900">{barang.harga}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-2">
                <div>
                  <label className="text-sm font-medium text-gray-600">PIC Gudang</label>
                  <p className="text-gray-900 mt-1">{bapbData.picGudang}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">PIC Vendor</label>
                  <p className="text-gray-900 mt-1">{bapbData.picVendor}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Dokumen Pendukung */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Dokumen Pendukung</h2>

            <div className="space-y-3">
              {bapbData.dokumenPendukung.map((dok, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                  <div className="flex items-center gap-3">
                    <FileText size={20} className="text-blue-600" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">{dok.nama}</p>
                      <p className="text-xs text-gray-500">{dok.ukuran}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleDownloadDokumen(dok)}
                    className="p-2 bg-gray-800 text-white rounded-lg hover:bg-gray-900 transition-colors"
                  >
                    <Download size={18} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar - Info & Download */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 sticky top-6 space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Download Surat</h3>

              <button
                onClick={handleDownloadSurat}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                <Download size={20} />
                <span>Download Surat BAPB</span>
              </button>

              <p className="text-xs text-gray-500 mt-2 text-center">
                File: Surat_BAPB_{bapbData.noBapb}.pdf
              </p>
            </div>

            <div className="pt-4 border-t border-gray-200">
              <h3 className="text-sm font-semibold text-gray-700 mb-3">Informasi</h3>

              <div className="space-y-3">
                <div>
                  <p className="text-xs text-gray-500">Status</p>
                  <div className="mt-1">
                    {statusDisplay.badge}
                  </div>
                </div>

                <div>
                  <p className="text-xs text-gray-500">Tanggal Pengajuan</p>
                  <p className="text-sm text-gray-900 font-medium mt-1">{bapbData.tanggalPengajuan}</p>
                </div>

                <div>
                  <p className="text-xs text-gray-500">Tanggal Review</p>
                  <p className="text-sm text-gray-900 font-medium mt-1">{bapbData.tanggalReview}</p>
                </div>

                <div>
                  <p className="text-xs text-gray-500">Reviewer</p>
                  <p className="text-sm text-gray-900 font-medium mt-1">{bapbData.reviewer}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DokumenOverviewDetail;
