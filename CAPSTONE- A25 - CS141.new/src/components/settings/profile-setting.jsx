import React, { useState, useEffect } from 'react';
import { User, Mail, Building, Phone, Briefcase, Save, Edit3, X, AlertCircle, CheckCircle } from 'lucide-react';
import apiService from '../../services/api-service';
import { mockProfile } from '../../services/mock-data';

const ProfileSetting = () => {
  const [profile, setProfile] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState({});
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      setIsLoading(true);
      const data = await apiService.getProfile();
      setProfile(data);
      setFormData(data);
    } catch (error) {
      console.error('Failed to load profile:', error);
      // Fallback to mock data for development
      setProfile(mockProfile);
      setFormData(mockProfile);
      setMessage({
        type: 'warning',
        text: 'Menggunakan data demo. Pastikan backend terhubung untuk data real.'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
    setErrors({});
    setMessage({ type: '', text: '' });
  };

  const handleCancel = () => {
    setIsEditing(false);
    setFormData(profile);
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
      
      // Prepare data for API
      const updateData = {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        company: formData.company,
        position: formData.position
      };

      const updatedProfile = await apiService.updateProfile(updateData);
      
      setProfile(updatedProfile);
      setIsEditing(false);
      setMessage({
        type: 'success',
        text: 'Profil berhasil diperbarui!'
      });
      
      setTimeout(() => setMessage({ type: '', text: '' }), 3000);
      
    } catch (error) {
      console.error('Error updating profile:', error);
      setMessage({
        type: 'error',
        text: 'Gagal memperbarui profil: ' + error.message
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
      'admin': 'Administrator'
    };
    return roleNames[role] || role;
  };

  const formatDate = (dateString) => {
    try {
      return new Date(dateString).toLocaleDateString('id-ID', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch (error) {
      return 'Tanggal tidak valid';
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-12 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <AlertCircle className="mx-auto text-red-500 mb-4" size={48} />
          <h3 className="text-lg font-semibold text-red-800 mb-2">
            Gagal Memuat Data Profil
          </h3>
          <button
            onClick={loadProfile}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            Coba Lagi
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Informasi Profil</h2>
          <p className="text-gray-600 mt-1">
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
        <div className={`p-4 rounded-lg mb-6 flex items-center gap-3 ${
          message.type === 'success' 
            ? 'bg-green-50 border border-green-200 text-green-800'
            : message.type === 'error'
            ? 'bg-red-50 border border-red-200 text-red-800'
            : 'bg-yellow-50 border border-yellow-200 text-yellow-800'
        }`}>
          {message.type === 'success' ? (
            <CheckCircle size={20} />
          ) : message.type === 'error' ? (
            <AlertCircle size={20} />
          ) : (
            <AlertCircle size={20} />
          )}
          {message.text}
        </div>
      )}

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        {/* Profile Header */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 px-6 py-8 border-b border-gray-200">
          <div className="flex items-center gap-6">
            <div className="relative">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                {profile?.name?.charAt(0) || 'U'}
              </div>
            </div>
            
            <div>
              <h3 className="text-2xl font-bold text-gray-900">{profile.name}</h3>
              <div className="flex items-center gap-4 mt-2">
                <span className="inline-flex items-center gap-2 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                  <User size={14} />
                  {getRoleDisplayName(profile.role)}
                </span>
                <span className="text-gray-600 text-sm">
                  Bergabung sejak {formatDate(profile.createdAt)}
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
              <label htmlFor="name" className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                <User size={16} />
                Nama Lengkap
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name || ''}
                onChange={handleChange}
                disabled={!isEditing}
                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${
                  errors.name 
                    ? 'border-red-300 bg-red-50' 
                    : isEditing 
                    ? 'border-gray-300 bg-white' 
                    : 'border-gray-200 bg-gray-50'
                }`}
                placeholder="Masukkan nama lengkap"
              />
              {errors.name && (
                <p className="text-red-600 text-sm mt-1">{errors.name}</p>
              )}
            </div>

            {/* Email */}
            <div>
              <label htmlFor="email" className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                <Mail size={16} />
                Alamat Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email || ''}
                onChange={handleChange}
                disabled={!isEditing}
                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${
                  errors.email 
                    ? 'border-red-300 bg-red-50' 
                    : isEditing 
                    ? 'border-gray-300 bg-white' 
                    : 'border-gray-200 bg-gray-50'
                }`}
                placeholder="nama@perusahaan.com"
              />
              {errors.email && (
                <p className="text-red-600 text-sm mt-1">{errors.email}</p>
              )}
            </div>

            {/* Nomor Telepon */}
            <div>
              <label htmlFor="phone" className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                <Phone size={16} />
                Nomor Telepon
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone || ''}
                onChange={handleChange}
                disabled={!isEditing}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors disabled:bg-gray-50 disabled:border-gray-200"
                placeholder="+62 812-3456-7890"
              />
            </div>

            {/* Perusahaan */}
            {(profile.role === 'vendor' || profile.role === 'pic') && (
              <div>
                <label htmlFor="company" className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                  <Building size={16} />
                  Perusahaan
                </label>
                <input
                  type="text"
                  id="company"
                  name="company"
                  value={formData.company || ''}
                  onChange={handleChange}
                  disabled={!isEditing}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors disabled:bg-gray-50 disabled:border-gray-200"
                  placeholder="Nama perusahaan"
                />
              </div>
            )}

            {/* Posisi/Jabatan */}
            <div>
              <label htmlFor="position" className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                <Briefcase size={16} />
                Posisi/Jabatan
              </label>
              <input
                type="text"
                id="position"
                name="position"
                value={formData.position || ''}
                onChange={handleChange}
                disabled={!isEditing}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors disabled:bg-gray-50 disabled:border-gray-200"
                placeholder="Posisi di perusahaan"
              />
            </div>

            {/* Role (Read-only) */}
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                <User size={16} />
                Role
              </label>
              <div className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-700">
                {getRoleDisplayName(profile.role)}
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          {isEditing && (
            <div className="flex gap-3 pt-6 mt-6 border-t border-gray-200">
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
                className="flex items-center gap-2 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium disabled:opacity-50"
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
        <p className="text-gray-500 text-sm">
          Terakhir diperbarui: {formatDate(profile.updatedAt)}
        </p>
      </div>
    </div>
  );
};

export default ProfileSetting;