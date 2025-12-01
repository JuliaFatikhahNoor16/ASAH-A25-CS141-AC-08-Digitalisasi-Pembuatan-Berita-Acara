import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const TambahDokumenBAPB = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  
  // Data form untuk semua tahap
  const [formData, setFormData] = useState({
    // Tahap 1 - Informasi Umum
    nomorDokumen: 'BAPB-' + Math.random().toString(36).substr(2, 6).toUpperCase(),
    namaVendor: 'PT. Midi Utama Indonesia',
    noKontrak: '028/SPK/PBJ/2024',
    tanggalKontrak: '2024-01-25',
    nilaiKontrak: '285000000',
    tanggalPengiriman: '2025-02-14',
    lokasiPengiriman: 'Gudang Pusat, Jl. Sudirman No. 123, Jakarta',
    
    // Tahap 2 - Rincian Barang
    rincianBarang: [
      {
        namaBarang: 'Komputer Desktop - Core i5, RAM 8GB, HDD 1TB, Monitor 21"',
        jumlah: 15,
        satuan: 'unit',
        hargaSatuan: 19000000,
        total: 285000000
      }
    ],
    
    // Tahap 3 - Dokumen Pendukung
    dokumenPendukung: [],
    penerima: '',
    jabatanPenerima: '',
    penyerah: '',
    jabatanPenyerah: '',
    catatan: ''
  });

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleBarangChange = (index, field, value) => {
    const updatedBarang = [...formData.rincianBarang];
    updatedBarang[index] = {
      ...updatedBarang[index],
      [field]: value
    };
    
    if (field === 'jumlah' || field === 'hargaSatuan') {
      const jumlah = field === 'jumlah' ? parseInt(value) || 0 : updatedBarang[index].jumlah;
      const hargaSatuan = field === 'hargaSatuan' ? parseInt(value) || 0 : updatedBarang[index].hargaSatuan;
      updatedBarang[index].total = jumlah * hargaSatuan;
    }
    
    setFormData(prev => ({
      ...prev,
      rincianBarang: updatedBarang
    }));
  };

  const addBarang = () => {
    setFormData(prev => ({
      ...prev,
      rincianBarang: [
        ...prev.rincianBarang,
        {
          namaBarang: '',
          jumlah: 1,
          satuan: 'unit',
          hargaSatuan: 0,
          total: 0
        }
      ]
    }));
  };

  const removeBarang = (index) => {
    if (formData.rincianBarang.length > 1) {
      setFormData(prev => ({
        ...prev,
        rincianBarang: prev.rincianBarang.filter((_, i) => i !== index)
      }));
    }
  };

  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files);
    const newDocuments = files.map(file => ({
      id: Math.random().toString(36).substr(2, 9),
      name: file.name,
      type: file.type,
      size: file.size,
      file: file
    }));

    setFormData(prev => ({
      ...prev,
      dokumenPendukung: [...prev.dokumenPendukung, ...newDocuments]
    }));
  };

  const removeDocument = (id) => {
    setFormData(prev => ({
      ...prev,
      dokumenPendukung: prev.dokumenPendukung.filter(doc => doc.id !== id)
    }));
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const calculateTotalKontrak = () => {
    return formData.rincianBarang.reduce((total, barang) => total + barang.total, 0);
  };

  const handleNextStep = () => {
    setCurrentStep(prev => prev + 1);
  };

  const handlePrevStep = () => {
    setCurrentStep(prev => prev - 1);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Simpan data final
    const finalData = {
      ...formData,
      status: 'draft',
      tanggalDibuat: new Date().toISOString()
    };

    console.log('Final BAPB Data:', finalData);
    alert('Dokumen BAPB berhasil dibuat!');
    navigate('/vendor/dokumen-saya');
  };

  // Render Progress Bar
  const renderProgressBar = () => (
    <div className="mt-6">
      <div className="flex items-center justify-between mb-2">
        <div className="text-sm font-medium text-blue-600">
          {currentStep === 1 && 'Informasi Umum'}
          {currentStep === 2 && 'Rincian Barang'}
          {currentStep === 3 && 'Dokumen Pendukung'}
        </div>
        <div className="text-sm text-gray-500">Tahap {currentStep} dari 3</div>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div 
          className="bg-blue-600 h-2 rounded-full transition-all duration-300"
          style={{ width: `${(currentStep / 3) * 100}%` }}
        ></div>
      </div>
    </div>
  );

  // Tahap 1 - Informasi Umum
  const renderStep1 = () => (
    <form onSubmit={(e) => { e.preventDefault(); handleNextStep(); }}>
      <div className="space-y-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Informasi Umum</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nama Vendor
              </label>
              <input
                type="text"
                value={formData.namaVendor}
                onChange={(e) => handleInputChange('namaVendor', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                No Kontrak
              </label>
              <input
                type="text"
                value={formData.noKontrak}
                onChange={(e) => handleInputChange('noKontrak', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tanggal Kontrak
              </label>
              <input
                type="date"
                value={formData.tanggalKontrak}
                onChange={(e) => handleInputChange('tanggalKontrak', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nilai Kontrak
              </label>
              <input
                type="text"
                value={formatCurrency(parseInt(formData.nilaiKontrak) || 0)}
                onChange={(e) => handleInputChange('nilaiKontrak', e.target.value.replace(/\D/g, ''))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tanggal Pengiriman
              </label>
              <input
                type="date"
                value={formData.tanggalPengiriman}
                onChange={(e) => handleInputChange('tanggalPengiriman', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Lokasi Pengiriman
              </label>
              <textarea
                value={formData.lokasiPengiriman}
                onChange={(e) => handleInputChange('lokasiPengiriman', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                rows="3"
                required
              />
            </div>
          </div>
        </div>

        <div className="flex justify-between gap-3">
          <button
            type="button"
            onClick={() => navigate('/vendor/tambah-dokumen')}
            className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Kembali
          </button>
          <button
            type="submit"
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Lanjut ke Rincian Barang
          </button>
        </div>
      </div>
    </form>
  );

  // Tahap 2 - Rincian Barang
  const renderStep2 = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-gray-900">RINCIAN BARANG</h2>
          <button
            type="button"
            onClick={addBarang}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm"
          >
            + Tambah Barang
          </button>
        </div>

        <div className="space-y-4">
          {formData.rincianBarang.map((barang, index) => (
            <div key={index} className="border border-gray-200 rounded-lg p-4">
              <div className="flex justify-between items-start mb-3">
                <h3 className="font-medium text-gray-900">Barang {index + 1}</h3>
                {formData.rincianBarang.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeBarang(index)}
                    className="text-red-600 hover:text-red-800 text-sm"
                  >
                    Hapus
                  </button>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nama Barang
                  </label>
                  <input
                    type="text"
                    value={barang.namaBarang}
                    onChange={(e) => handleBarangChange(index, 'namaBarang', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Jumlah
                  </label>
                  <input
                    type="number"
                    value={barang.jumlah}
                    onChange={(e) => handleBarangChange(index, 'jumlah', parseInt(e.target.value) || 0)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    min="1"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Satuan
                  </label>
                  <select
                    value={barang.satuan}
                    onChange={(e) => handleBarangChange(index, 'satuan', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="unit">Unit</option>
                    <option value="pcs">Pcs</option>
                    <option value="set">Set</option>
                    <option value="paket">Paket</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Harga Satuan
                  </label>
                  <input
                    type="number"
                    value={barang.hargaSatuan}
                    onChange={(e) => handleBarangChange(index, 'hargaSatuan', parseInt(e.target.value) || 0)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Total
                  </label>
                  <div className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg">
                    <span className="font-semibold text-gray-900">
                      {formatCurrency(barang.total)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Total Kontrak */}
        <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <div className="flex justify-between items-center">
            <span className="font-semibold text-gray-900">TOTAL KONTRAK:</span>
            <span className="text-xl font-bold text-blue-700">
              {formatCurrency(calculateTotalKontrak())}
            </span>
          </div>
        </div>
      </div>

      <div className="flex justify-between gap-3">
        <button
          onClick={handlePrevStep}
          className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
        >
          Kembali ke Informasi Umum
        </button>
        <button
          onClick={handleNextStep}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Lanjut ke Dokumen Pendukung
        </button>
      </div>
    </div>
  );

  // Tahap 3 - Dokumen Pendukung
  const renderStep3 = () => (
    <form onSubmit={handleSubmit}>
      <div className="space-y-6">
        {/* Upload Dokumen Pendukung */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Dokumen Pendukung</h2>
          
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center mb-4">
            <input
              type="file"
              multiple
              onChange={handleFileUpload}
              className="hidden"
              id="file-upload"
            />
            <label
              htmlFor="file-upload"
              className="cursor-pointer block"
            >
              <div className="text-4xl mb-4">📎</div>
              <p className="text-gray-600 mb-2">Klik untuk upload dokumen pendukung</p>
              <p className="text-sm text-gray-500">Surat pesanan, foto barang, invoice, dll.</p>
            </label>
          </div>

          {/* List Dokumen */}
          {formData.dokumenPendukung.length > 0 && (
            <div className="space-y-2">
              <h3 className="font-medium text-gray-900">Dokumen Terupload:</h3>
              {formData.dokumenPendukung.map((doc) => (
                <div key={doc.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <span className="text-blue-600">📄</span>
                    <div>
                      <p className="font-medium text-gray-900">{doc.name}</p>
                      <p className="text-sm text-gray-500">{formatFileSize(doc.size)}</p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeDocument(doc.id)}
                    className="text-red-600 hover:text-red-800"
                  >
                    Hapus
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Informasi Pihak */}

        <div className="flex justify-between gap-3">
          <button
            type="button"
            onClick={handlePrevStep}
            className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Kembali ke Rincian Barang
          </button>
          <button
            type="submit"
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Kirim BAPB
          </button>
        </div>
      </div>
    </form>
  );

  return (
    <div className="w-full">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Buat Berita Acara Pemeriksaan Barang (BAPB)</h1>
            <p className="text-gray-600 mt-1">
              {currentStep === 1 && 'Tahap 1: Informasi Umum'}
              {currentStep === 2 && 'Tahap 2: Rincian Barang'}
              {currentStep === 3 && 'Tahap 3: Dokumen Pendukung'}
            </p>
          </div>
          <div className="text-right">
            <div className="text-sm text-gray-500">Nomor Dokumen</div>
            <div className="font-semibold text-gray-900">{formData.nomorDokumen}</div>
          </div>
        </div>

        {renderProgressBar()}
      </div>

      {/* Render Current Step */}
      {currentStep === 1 && renderStep1()}
      {currentStep === 2 && renderStep2()}
      {currentStep === 3 && renderStep3()}
    </div>
  );
};

export default TambahDokumenBAPB;
