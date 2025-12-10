import React, { useState, useEffect } from 'react';
import { User, Mail, Building, Phone, Briefcase, Save, Edit3, X, AlertCircle, CheckCircle } from 'lucide-react';
import { useAuth } from '../../contexts/authcontext';
import SignatureUpload from './signature-upload';

const ProfileSetting = () => {
  const authContext = useAuth();
  const user = authContext?.user;

  const [isEditing, setIsEditing] = useState(true); // Always in edit mode
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState({
    name: 'John Doe',
    email: 'john.doe@example.com',
    phone: '+62 812-3456-7890',
    company: 'PT Example Indonesia',
    position: 'Manager',
    role: 'pic'
  });
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState({ type: '', text: '' });

  // Load data dari auth context atau localStorage
  useEffect(() => {
    console.log('🔍 ProfileSetting mounted');
    console.log('Auth Context:', authContext);
    console.log('User:', user);

    // Priority 1: Cek localStorage dulu
    const savedProfile = localStorage.getItem('userProfile');
    if (savedProfile) {
      try {
        const parsed = JSON.parse(savedProfile);
        console.log('✅ Loaded from localStorage:', parsed);
        setFormData(parsed);
        return;
      } catch (e) {
        console.error('❌ Error parsing localStorage:', e);
      }
    }

    // Priority 2: Cek user dari context
    if (user && user.name) {
      const profileData = {
        name: user.name,
        email: user.email || '',
        phone: user.phone || '',
        company: user.company || '',
        position: user.position || '',
        role: user.role || 'pic'
      };
      console.log('✅ Loaded from context:', profileData);
      setFormData(profileData);
      localStorage.setItem('userProfile', JSON.stringify(profileData));
      return;
    }

    // Priority 3: Use default data (already set in useState)
    console.log('ℹ️ Using default data');
  }, [user, authContext]);


  const handleSignatureUpdate = (signature) => {
    setFormData(prev => ({
      ...prev,
      signature: signature
    }));

    const savedProfile = JSON.parse(localStorage.getItem('userProfile') || '{}');
    savedProfile.signature = signature;
    localStorage.setItem('userProfile', JSON.stringify(savedProfile));
  };

  const handleCancel = () => {
    // Reset form to original data
    const savedProfile = localStorage.getItem('userProfile');
    if (savedProfile) {
      try {
        setFormData(JSON.parse(savedProfile));
      } catch (e) {
        // If error, keep current formData
      }
    }
    setErrors({});
    setMessage({ type: '', text: '' });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name?.trim()) {
      newErrors.name = 'Nama lengkap wajib diisi';
    }

    if (!formData.email?.trim()) {
      newErrors.email = 'Email wajib diisi';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Format email tidak valid';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      setIsSaving(true);

      // Simulasi API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Simpan ke localStorage
      localStorage.setItem('userProfile', JSON.stringify(formData));

      setIsEditing(true); // Stay in edit mode
      setMessage({
        type: 'success',
        text: 'Profil berhasil diperbarui!'
      });

      setTimeout(() => setMessage({ type: '', text: '' }), 3000);

    } catch (error) {
      console.error('Error updating profile:', error);
      setMessage({
        type: 'error',
        text: 'Gagal memperbarui profil. Silakan coba lagi.'
      });
    } finally {
      setIsSaving(false);
    }
  };

  const getRoleDisplayName = (role) => {
    const roleNames = {
      'vendor': 'Vendor',
      'pic': 'PIC Gudang',
      'direksi': 'Direksi',
    };
    return roleNames[role] || role;
  };

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    try {
      return new Date(dateString).toLocaleDateString('id-ID', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch (error) {
      return '-';
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Debug Info - Remove in production */}
      {process.env.NODE_ENV === 'development' && (
        <div className="mb-4 p-3 bg-gray-100 rounded text-xs">
          <strong>Debug:</strong> User exists: {user ? 'Yes' : 'No'} |
          Name: {formData.name} |
          Email: {formData.email}
          Role: {formData.role}
        </div>
      )}

      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Informasi Profil</h2>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Kelola informasi profil dan data pribadi Anda
          </p>
        </div>

        {!isEditing && (
          <button
            onClick={handleEdit}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            <Edit3 size={18} />
            Edit Profil
          </button>
        )}
      </div>

      {/* Message Alert */}
      {message.text && (
        <div className={`p-4 rounded-lg mb-6 flex items-center gap-3 ${message.type === 'success'
          ? 'bg-green-50 border border-green-200 text-green-800'
          : message.type === 'error'
            ? 'bg-red-50 border border-red-200 text-red-800'
            : 'bg-yellow-50 border border-yellow-200 text-yellow-800'
          }`}>
          {message.type === 'success' ? (
            <CheckCircle size={20} />
          ) : (
            <AlertCircle size={20} />
          )}
          {message.text}
        </div>
      )}

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
        {/* Profile Header */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 px-6 py-8 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-6">
            <div className="relative">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                {formData.name?.charAt(0).toUpperCase() || 'U'}
              </div>
            </div>

            <div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                {formData.name}
              </h3>
              <div className="flex items-center gap-4 mt-2">
                <span className="inline-flex items-center gap-2 px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 rounded-full text-sm font-medium">
                  <User size={14} />
                  {getRoleDisplayName(formData.role)}
                </span>
                {formData.signature && (
                  <span className="inline-flex items-center gap-2 px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 rounded-full text-sm font-medium">
                    ✓ Tanda Tangan Tersedia
                  </span>
                )}
                <span className="text-gray-600 dark:text-gray-400 text-sm">
                  Bergabung sejak {formatDate(new Date().toISOString())}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Profile Form */}
        <form onSubmit={handleSubmit} className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Nama Lengkap */}
            <div className="md:col-span-2">
              <label htmlFor="name" className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                <User size={16} />
                Nama Lengkap
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                disabled={!isEditing}
                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${errors.name
                  ? 'border-red-300 bg-red-50'
                  : isEditing
                    ? 'border-gray-300 bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-white'
                    : 'border-gray-200 bg-gray-50 dark:bg-gray-900 dark:border-gray-700 dark:text-gray-300'
                  }`}
                placeholder="Masukkan nama lengkap"
              />
              {errors.name && (
                <p className="text-red-600 text-sm mt-1 flex items-center gap-1">
                  <AlertCircle size={14} />
                  {errors.name}
                </p>
              )}
            </div>

            {/* Email */}
            <div>
              <label htmlFor="email" className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                <Mail size={16} />
                Alamat Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                disabled={!isEditing}
                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${errors.email
                  ? 'border-red-300 bg-red-50'
                  : isEditing
                    ? 'border-gray-300 bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-white'
                    : 'border-gray-200 bg-gray-50 dark:bg-gray-900 dark:border-gray-700 dark:text-gray-300'
                  }`}
                placeholder="nama@perusahaan.com"
              />
              {errors.email && (
                <p className="text-red-600 text-sm mt-1 flex items-center gap-1">
                  <AlertCircle size={14} />
                  {errors.email}
                </p>
              )}
            </div>

            {/* Nomor Telepon */}
            <div>
              <label htmlFor="phone" className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                <Phone size={16} />
                Nomor Telepon
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                disabled={!isEditing}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors disabled:bg-gray-50 disabled:border-gray-200 dark:bg-gray-700 dark:text-white dark:disabled:bg-gray-900"
                placeholder="+62 812-3456-7890"
              />
            </div>

            {/* Perusahaan */}
            <div>
              <label htmlFor="company" className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                <Building size={16} />
                Perusahaan
              </label>
              <input
                type="text"
                id="company"
                name="company"
                value={formData.company}
                onChange={handleChange}
                disabled={!isEditing}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors disabled:bg-gray-50 disabled:border-gray-200 dark:bg-gray-700 dark:text-white dark:disabled:bg-gray-900"
                placeholder="Nama perusahaan"
              />
            </div>

            {/* Posisi/Jabatan */}
            <div>
              <label htmlFor="position" className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                <Briefcase size={16} />
                Posisi/Jabatan
              </label>
              <input
                type="text"
                id="position"
                name="position"
                value={formData.position}
                onChange={handleChange}
                disabled={!isEditing}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors disabled:bg-gray-50 disabled:border-gray-200 dark:bg-gray-700 dark:text-white dark:disabled:bg-gray-900"
                placeholder="Posisi di perusahaan"
              />
            </div>

            {/* Role (Read-only) */}
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                <User size={16} />
                Role
              </label>
              <div className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-700 dark:text-gray-300">
                {getRoleDisplayName(formData.role)}
              </div>
            </div>
          </div>

          {/* Signature Upload Section */}
          <div className="border-t border-gray-200 dark:border-gray-700">
            <SignatureUpload
              userRole={formData.role}
              currentSignature={formData.signature}
              onSignatureUpdate={handleSignatureUpdate}
            />
          </div>

          {/* Action Buttons */}
          {isEditing && (
            <div className="flex gap-3 pt-6 mt-6 border-t border-gray-200 dark:border-gray-700">
              <button
                type="submit"
                disabled={isSaving}
                className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Save size={18} />
                {isSaving ? 'Menyimpan...' : 'Simpan Perubahan'}
              </button>

              <button
                type="button"
                onClick={handleCancel}
                disabled={isSaving}
                className="flex items-center gap-2 px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors font-medium disabled:opacity-50"
              >
                <X size={18} />
                Batal
              </button>
            </div>
          )}
        </form>

      </div>

      {/* Last Updated Info */}
      <div className="mt-4 text-center">
        <p className="text-gray-500 dark:text-gray-400 text-sm">
          Terakhir diperbarui: {formatDate(new Date().toISOString())}
        </p>
      </div>
    </div>
  );
};

export default ProfileSetting;
