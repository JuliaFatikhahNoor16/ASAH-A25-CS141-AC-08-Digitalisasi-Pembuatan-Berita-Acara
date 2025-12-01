import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Download, FileText, Calendar, DollarSign, User, CheckCircle, XCircle } from 'lucide-react';

const DokumenOverviewDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [bappData, setBappData] = useState(null);

    useEffect(() => {
        fetchBappDetail();
    }, [id]);

    const fetchBappDetail = async () => {
        try {
            setLoading(true);

            // Mock data - nanti ganti dengan API call
            const mockData = {
                noBapp: id || 'BAPP-2024-064',
                namaProyek: 'Renovasi Gedung Kantor Pusat',
                vendor: 'PT. Jaya Abadi',
                nilaiProyek: 'Rp 50.000.000',
                tanggalPengajuan: '2024-11-10',
                tanggalReview: '14 Nov 2024',
                deadline: '2024-12-31',
                status: 'approved', // approved atau rejected
                reviewer: 'Direktur Utama',
                catatan: 'Proyek disetujui dengan catatan untuk memperhatikan kualitas material dan ketepatan waktu pengerjaan.',
                deskripsi: 'Proyek renovasi gedung kantor pusat meliputi perbaikan struktur bangunan, pengecatan ulang, perbaikan sistem listrik dan plumbing, serta pemasangan AC central di seluruh ruangan.',
                ruangLingkup: [
                    'Perbaikan struktur bangunan (fondasi, dinding, atap)',
                    'Pengecatan seluruh interior dan eksterior gedung',
                    'Upgrade sistem kelistrikan dan instalasi',
                    'Perbaikan sistem plumbing dan sanitasi',
                    'Pemasangan AC Central 10 PK',
                    'Renovasi landscape area parkir'
                ],
                dokumenPendukung: [
                    { nama: 'RAB_Renovasi.pdf', ukuran: '2.5 MB' },
                    { nama: 'Desain_Arsitektur.pdf', ukuran: '5.1 MB' },
                    { nama: 'Surat_Penawaran_Vendor.pdf', ukuran: '1.8 MB' },
                    { nama: 'TOR_Proyek.pdf', ukuran: '980 KB' },
                    { nama: 'Surat_Persetujuan_Direksi.pdf', ukuran: '1.2 MB' }
                ],
                timeline: {
                    persiapan: '1 minggu',
                    pelaksanaan: '4 minggu',
                    finishing: '1 minggu'
                },
                picProyek: 'Budi Santoso',
                picVendor: 'Ahmad Wijaya'
            };

            setBappData(mockData);
        } catch (error) {
            console.error('Error fetching BAPP detail:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDownloadSurat = () => {
        console.log('Downloading surat BAPP:', bappData.noBapp);
        alert(`Downloading Surat BAPP ${bappData.noBapp}...\n\nFile: Surat_BAPP_${bappData.noBapp}.pdf\nUkuran: 2.5 MB`);
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

    if (!bappData) {
        return (
            <div className="text-center py-12">
                <p className="text-gray-500">Data BAPP tidak ditemukan</p>
                <button
                    onClick={() => navigate('/direksi/project-overview')}
                    className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                    Kembali ke List
                </button>
            </div>
        );
    }

    const getStatusDisplay = () => {
        if (bappData.status === 'approved') {
            return {
                icon: <CheckCircle size={24} className="text-green-600" />,
                badge: (
                    <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium bg-green-100 text-green-800">
                        <CheckCircle size={18} />
                        Disetujui
                    </span>
                ),
                color: 'green'
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
                color: 'red'
            };
        }
    };

    const statusDisplay = getStatusDisplay();

    return (
        <div className="max-w-7xl mx-auto">
            {/* Back Button */}
            <button
                onClick={() => navigate('/direksi/project-overview')}
                className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 transition-colors"
            >
                <ArrowLeft size={20} />
                <span>Kembali ke List</span>
            </button>

            {/* Header */}
            <div className="mb-8 flex items-start justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-[#1e3a8a]">{bappData.noBapp}</h1>
                    <p className="text-gray-500 mt-1">Detail lengkap dokumen BAPP</p>
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
                            <p className="text-xs text-gray-500">No. BAPP</p>
                            <p className="font-semibold text-gray-900 text-sm">{bappData.noBapp}</p>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-green-100 rounded-lg">
                            <DollarSign size={20} className="text-green-600" />
                        </div>
                        <div>
                            <p className="text-xs text-gray-500">Nilai Proyek</p>
                            <p className="font-semibold text-gray-900 text-sm">{bappData.nilaiProyek}</p>
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
                            <p className="font-semibold text-gray-900 text-sm">{bappData.tanggalReview}</p>
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
                            <p className="font-semibold text-gray-900 text-sm truncate">{bappData.vendor}</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main Content */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Status & Catatan */}
                    <div className={`bg-white rounded-xl shadow-sm border-2 ${bappData.status === 'approved' ? 'border-green-200' : 'border-red-200'
                        } p-6`}>
                        <div className="flex items-start gap-3 mb-4">
                            {statusDisplay.icon}
                            <div className="flex-1">
                                <h2 className="text-xl font-semibold text-gray-800">
                                    {bappData.status === 'approved' ? 'BAPP Disetujui' : 'BAPP Ditolak'}
                                </h2>
                                <p className="text-sm text-gray-600 mt-1">
                                    Direview oleh: <span className="font-medium">{bappData.reviewer}</span>
                                </p>
                            </div>
                        </div>

                        <div className="bg-gray-50 rounded-lg p-4 mt-4">
                            <p className="text-sm font-medium text-gray-700 mb-2">Catatan Reviewer:</p>
                            <p className="text-sm text-gray-600 leading-relaxed">{bappData.catatan}</p>
                        </div>
                    </div>

                    {/* Detail Proyek */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                        <h2 className="text-xl font-semibold text-gray-800 mb-4">Detail Proyek</h2>

                        <div className="space-y-4">
                            <div>
                                <label className="text-sm font-medium text-gray-600">Nama Proyek</label>
                                <p className="text-gray-900 mt-1">{bappData.namaProyek}</p>
                            </div>

                            <div>
                                <label className="text-sm font-medium text-gray-600">Deskripsi</label>
                                <p className="text-gray-700 mt-1 leading-relaxed">{bappData.deskripsi}</p>
                            </div>

                            <div>
                                <label className="text-sm font-medium text-gray-600">Ruang Lingkup Pekerjaan</label>
                                <ul className="mt-2 space-y-2">
                                    {bappData.ruangLingkup.map((item, index) => (
                                        <li key={index} className="flex items-start gap-2">
                                            <span className="text-blue-600 mt-1">•</span>
                                            <span className="text-gray-700">{item}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-sm font-medium text-gray-600">PIC Proyek</label>
                                    <p className="text-gray-900 mt-1">{bappData.picProyek}</p>
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-gray-600">PIC Vendor</label>
                                    <p className="text-gray-900 mt-1">{bappData.picVendor}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Timeline */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                        <h2 className="text-xl font-semibold text-gray-800 mb-4">Timeline Proyek</h2>

                        <div className="space-y-3">
                            <div className="flex items-center justify-between">
                                <span className="text-gray-600">Persiapan</span>
                                <span className="font-medium text-gray-900">{bappData.timeline.persiapan}</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-gray-600">Pelaksanaan</span>
                                <span className="font-medium text-gray-900">{bappData.timeline.pelaksanaan}</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-gray-600">Finishing</span>
                                <span className="font-medium text-gray-900">{bappData.timeline.finishing}</span>
                            </div>
                        </div>
                    </div>

                    {/* Dokumen Pendukung */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                        <h2 className="text-xl font-semibold text-gray-800 mb-4">Dokumen Pendukung</h2>

                        <div className="space-y-3">
                            {bappData.dokumenPendukung.map((dok, index) => (
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
                                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
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
                                <span>Download Surat BAPP</span>
                            </button>

                            <p className="text-xs text-gray-500 mt-2 text-center">
                                File: Surat_BAPP_{bappData.noBapp}.pdf
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
                                    <p className="text-sm text-gray-900 font-medium mt-1">{bappData.tanggalPengajuan}</p>
                                </div>

                                <div>
                                    <p className="text-xs text-gray-500">Tanggal Review</p>
                                    <p className="text-sm text-gray-900 font-medium mt-1">{bappData.tanggalReview}</p>
                                </div>

                                <div>
                                    <p className="text-xs text-gray-500">Reviewer</p>
                                    <p className="text-sm text-gray-900 font-medium mt-1">{bappData.reviewer}</p>
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