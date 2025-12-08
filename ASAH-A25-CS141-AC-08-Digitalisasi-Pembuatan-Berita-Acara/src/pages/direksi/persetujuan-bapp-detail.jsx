import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, CheckCircle, XCircle, Download, FileText, Calendar, DollarSign, User } from 'lucide-react';

const PersetujuanBappDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [showApprovalModal, setShowApprovalModal] = useState(false);
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [approvalAction, setApprovalAction] = useState(null);
    const [catatan, setCatatan] = useState('');
    const [bappData, setBappData] = useState(null);

    useEffect(() => {
        fetchBappDetail();
    }, [id]);

    const fetchBappDetail = async () => {
        try {
            setLoading(true);

            // Mock data
            const mockData = {
                noBapp: id || 'BAPP-XYZ-234',
                namaProyek: 'Renovasi Gedung Kantor Pusat',
                vendor: 'PT. Bangun Sejahtera Indonesia',
                nilaiProyek: 'Rp 500.000.000',
                tanggalPengajuan: '2025-01-15',
                deadline: '2025-02-28',
                status: 'Menunggu Persetujuan',
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
                    { nama: 'TOR_Proyek.pdf', ukuran: '980 KB' }
                ],
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

    const handleApproval = (action) => {
        setApprovalAction(action);
        setShowApprovalModal(true);
    };

    const submitApproval = () => {
        console.log('Approval submitted:', {
            action: approvalAction,
            noBapp: bappData.noBapp,
            catatan
        });

        setShowApprovalModal(false);
        setShowSuccessModal(true);
    };

    const handleCloseSuccess = () => {
        setShowSuccessModal(false);
        setCatatan('');
        navigate('/direksi/persetujuan-bapp');
    };

    const handleDownload = (dokumen) => {
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
                    onClick={() => navigate('/direksi/persetujuan-bapp')}
                    className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                    Kembali ke List
                </button>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto">
            {/* Back Button */}
            <button
                onClick={() => navigate('/direksi/persetujuan-bapp')}
                className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 transition-colors"
            >
                <ArrowLeft size={20} />
                <span>Kembali ke List</span>
            </button>

            {/* Header */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-[#1e3a8a]">{bappData.noBapp}</h1>
                <p className="text-gray-500 mt-1">Review dan persetujuan BAPP</p>
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
                            <p className="text-xs text-gray-500">Deadline</p>
                            <p className="font-semibold text-gray-900 text-sm">{bappData.deadline}</p>
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
                    {/* Detail Proyek */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                        <h2 className="text-xl font-semibold text-gray-800 mb-4">Overview Dokumen</h2>

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
                                        onClick={() => handleDownload(dok)}
                                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                    >
                                        <Download size={18} />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Sidebar - Action Panel */}
                <div className="lg:col-span-1">
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 sticky top-6">
                        <h3 className="text-lg font-semibold text-gray-800 mb-4">Tindakan</h3>

                        <div className="space-y-3">
                            <button
                                onClick={() => handleApproval('approve')}
                                className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
                            >
                                <CheckCircle size={20} />
                                <span>Setujui BAPP</span>
                            </button>

                            <button
                                onClick={() => handleApproval('reject')}
                                className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
                            >
                                <XCircle size={20} />
                                <span>Tolak BAPP</span>
                            </button>

                            <div className="pt-4 border-t border-gray-200">
                                <p className="text-sm text-gray-600 mb-2">Status Saat Ini</p>
                                <span className="inline-flex px-3 py-1 rounded-full text-sm font-medium bg-yellow-100 text-yellow-800">
                                    {bappData.status}
                                </span>
                            </div>

                            <div className="pt-4">
                                <p className="text-sm text-gray-600 mb-1">Tanggal Pengajuan</p>
                                <p className="text-gray-900 font-medium">{bappData.tanggalPengajuan}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Approval Modal */}
            {showApprovalModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6">
                        <h3 className="text-2xl font-bold text-gray-900 mb-4">
                            {approvalAction === 'approve' ? 'Setujui BAPP' : 'Tolak BAPP'}
                        </h3>

                        <p className="text-gray-600 mb-6">
                            Anda yakin ingin {approvalAction === 'approve' ? 'menyetujui' : 'menolak'} BAPP {bappData.noBapp}?
                        </p>

                        <div className="mb-6">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Catatan {approvalAction === 'reject' ? '(Wajib)' : '(Opsional)'}
                            </label>
                            <textarea
                                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                                rows="4"
                                placeholder="Tambahkan catatan..."
                                value={catatan}
                                onChange={(e) => setCatatan(e.target.value)}
                            />
                        </div>

                        <div className="flex gap-3">
                            <button
                                onClick={() => setShowApprovalModal(false)}
                                className="flex-1 px-6 py-3 bg-gray-800 text-white rounded-xl font-semibold hover:bg-gray-900 transition-colors"
                            >
                                Batal
                            </button>
                            <button
                                onClick={submitApproval}
                                disabled={approvalAction === 'reject' && !catatan.trim()}
                                className={`flex-1 px-6 py-3 rounded-xl font-semibold transition-colors ${
                                    approvalAction === 'approve'
                                        ? 'bg-green-600 text-white hover:bg-green-700'
                                        : 'bg-red-600 text-white hover:bg-red-700'
                                } disabled:opacity-50 disabled:cursor-not-allowed`}
                            >
                                Konfirmasi
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Success Modal */}
            {showSuccessModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 text-center">
                        {/* Success/Reject Icon */}
                        <div className={`mx-auto w-16 h-16 rounded-full flex items-center justify-center mb-4 ${
                            approvalAction === 'approve' ? 'bg-green-100' : 'bg-red-100'
                        }`}>
                            {approvalAction === 'approve' ? (
                                <CheckCircle className="text-green-600" size={32} />
                            ) : (
                                <XCircle className="text-red-600" size={32} />
                            )}
                        </div>

                        {/* Success Message */}
                        <h2 className="text-2xl font-bold text-gray-900 mb-2">
                            BAPP Berhasil {approvalAction === 'approve' ? 'Disetujui' : 'Ditolak'}!
                        </h2>
                        
                        <p className="text-gray-600 mb-1">
                            Dokumen <span className="font-semibold text-gray-900">{bappData.noBapp}</span> telah {approvalAction === 'approve' ? 'disetujui' : 'ditolak'}.
                        </p>

                        {catatan && (
                            <div className="mt-4 p-3 bg-gray-50 rounded-lg text-left">
                                <p className="text-xs font-medium text-gray-500 mb-1">Catatan:</p>
                                <p className="text-sm text-gray-700">{catatan}</p>
                            </div>
                        )}

                        {/* OK Button */}
                        <button
                            onClick={handleCloseSuccess}
                            className={`mt-6 w-full px-6 py-3 rounded-xl font-semibold transition-colors ${
                                approvalAction === 'approve' 
                                    ? 'bg-green-600 hover:bg-green-700' 
                                    : 'bg-red-600 hover:bg-red-700'
                            } text-white`}
                        >
                            OK
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default PersetujuanBappDetail;