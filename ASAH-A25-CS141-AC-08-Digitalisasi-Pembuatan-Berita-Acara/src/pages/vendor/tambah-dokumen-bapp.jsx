import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const TambahDokumenBAPP = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  
  // Data form untuk semua tahap
  const [formData, setFormData] = useState({
    // Tahap 1 - Informasi Umum
    nomorDokumen: 'BAPP-' + Math.random().toString(36).substr(2, 6).toUpperCase(),
    namaVendor: 'PT. Karya Mandiri Konstruksi',
    noKontrak: '045/SPK/DPUTR/2023',
    tanggalKontrak: '2023-08-15',
    nilaiKontrak: '2450000000',
    lokasiPekerjaan: 'Jl. Menteng Raya No. 15, Jakarta Pusat',
    
    // Tahap 2 - Rincian Pekerjaan
    rincianPekerjaan: [
      {
        uraianPekerjaan: 'Pengecatan ulang gedung kantor 5 lantai',
        volume: 1,
        satuan: 'paket',
        hargaSatuan: 2450000000,
        total: 2450000000
      }
    ],
    
    // Tahap 3 - Dokumen Pendukung
    dokumenPendukung: [],
    direksiPekerjaan: '',
    jabatanDireksi: '',
    pelaksana: '',
    jabatanPelaksana: '',
    catatan: ''
  });

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handlePekerjaanChange = (index, field, value) => {
    const updatedPekerjaan = [...formData.rincianPekerjaan];
    updatedPekerjaan[index] = {
      ...updatedPekerjaan[index],
      [field]: value
    };
    
    if (field === 'volume' || field === 'hargaSatuan') {
      const volume = field === 'volume' ? parseInt(value) || 0 : updatedPekerjaan[index].volume;
      const hargaSatuan = field === 'hargaSatuan' ? parseInt(value) || 0 : updatedPekerjaan[index].hargaSatuan;
      updatedPekerjaan[index].total = volume * hargaSatuan;
    }
    
    setFormData(prev => ({
      ...prev,
      rincianPekerjaan: updatedPekerjaan
    }));
  };

  const addPekerjaan = () => {
    setFormData(prev => ({
      ...prev,
      rincianPekerjaan: [
        ...prev.rincianPekerjaan,
        {
          uraianPekerjaan: '',
          volume: 1,
          satuan: 'paket',
          hargaSatuan: 0,
          total: 0
        }
      ]
    }));
  };

  const removePekerjaan = (index) => {
    if (formData.rincianPekerjaan.length > 1) {
      setFormData(prev => ({
        ...prev,
        rincianPekerjaan: prev.rincianPekerjaan.filter((_, i) => i !== index)
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
    return formData.rincianPekerjaan.reduce((total, pekerjaan) => total + pekerjaan.total, 0);
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

    console.log('Final BAPP Data:', finalData);
    alert('Dokumen BAPP berhasil dibuat!');
    navigate('/vendor/dokumen-saya');
  };

  // Render Progress Bar
  const renderProgressBar = () => (
    <div className="mt-6">
      <div className="flex items-center justify-between mb-2">
        <div className="text-sm font-medium text-green-600">
          {currentStep === 1 && 'Informasi Umum'}
          {currentStep === 2 && 'Rincian Pekerjaan'}
          {currentStep === 3 && 'Dokumen Pendukung'}
        </div>
        <div className="text-sm text-gray-500">Tahap {currentStep} dari 3</div>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div 
          className="bg-green-600 h-2 rounded-full transition-all duration-300"
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
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
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
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
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
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
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
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                required
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Lokasi Pekerjaan
              </label>
              <textarea
                value={formData.lokasiPekerjaan}
                onChange={(e) => handleInputChange('lokasiPekerjaan', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
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
            className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            Lanjut ke Rincian Pekerjaan
          </button>
        </div>
      </div>
    </form>
  );

  // Tahap 2 - Rincian Pekerjaan
  const renderStep2 = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-gray-900">RINCIAN PEKERJAAN</h2>
          <button
            type="button"
            onClick={addPekerjaan}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm"
          >
            + Tambah Pekerjaan
          </button>
        </div>

        <div className="space-y-4">
          {formData.rincianPekerjaan.map((pekerjaan, index) => (
            <div key={index} className="border border-gray-200 rounded-lg p-4">
              <div className="flex justify-between items-start mb-3">
                <h3 className="font-medium text-gray-900">Pekerjaan {index + 1}</h3>
                {formData.rincianPekerjaan.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removePekerjaan(index)}
                    className="text-red-600 hover:text-red-800 text-sm"
                  >
                    Hapus
                  </button>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Uraian Pekerjaan
                  </label>
                  <textarea
                    value={pekerjaan.uraianPekerjaan}
                    onChange={(e) => handlePekerjaanChange(index, 'uraianPekerjaan', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    rows="3"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Volume
                  </label>
                  <input
                    type="number"
                    value={pekerjaan.volume}
                    onChange={(e) => handlePekerjaanChange(index, 'volume', parseInt(e.target.value) || 0)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    min="1"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Satuan
                  </label>
                  <select
                    value={pekerjaan.satuan}
                    onChange={(e) => handlePekerjaanChange(index, 'satuan', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  >
                    <option value="paket">Paket</option>
                    <option value="unit">Unit</option>
                    <option value="m2">M²</option>
                    <option value="m3">M³</option>
                    <option value="hari">Hari</option>
                    <option value="bulan">Bulan</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Harga Satuan
                  </label>
                  <input
                    type="number"
                    value={pekerjaan.hargaSatuan}
                    onChange={(e) => handlePekerjaanChange(index, 'hargaSatuan', parseInt(e.target.value) || 0)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Total
                  </label>
                  <div className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg">
                    <span className="font-semibold text-gray-900">
                      {formatCurrency(pekerjaan.total)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Total Kontrak */}
        <div className="mt-6 p-4 bg-green-50 rounded-lg border border-green-200">
          <div className="flex justify-between items-center">
            <span className="font-semibold text-gray-900">TOTAL KONTRAK:</span>
            <span className="text-xl font-bold text-green-700">
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
          className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
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
              <p className="text-sm text-gray-500">Gambar progress pekerjaan, laporan harian, dll.</p>
            </label>
          </div>

          {/* List Dokumen */}
          {formData.dokumenPendukung.length > 0 && (
            <div className="space-y-2">
              <h3 className="font-medium text-gray-900">Dokumen Terupload:</h3>
              {formData.dokumenPendukung.map((doc) => (
                <div key={doc.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <span className="text-green-600">📄</span>
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

        <div className="flex justify-between gap-3">
          <button
            type="button"
            onClick={handlePrevStep}
            className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Kembali ke Rincian Pekerjaan
          </button>
          <button
            type="submit"
            className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            Kirim BAPP
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
            <h1 className="text-2xl font-bold text-gray-900">Buat Berita Acara Pemeriksaan Pekerjaan (BAPP)</h1>
            <p className="text-gray-600 mt-1">
              {currentStep === 1 && 'Tahap 1: Informasi Umum'}
              {currentStep === 2 && 'Tahap 2: Rincian Pekerjaan'}
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

export default TambahDokumenBAPP;
