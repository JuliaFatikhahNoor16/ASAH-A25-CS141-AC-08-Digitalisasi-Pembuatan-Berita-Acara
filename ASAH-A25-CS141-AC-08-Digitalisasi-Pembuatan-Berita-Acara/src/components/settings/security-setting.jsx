import React, { useState } from 'react';
import { Eye, EyeOff, Lock, Key, CheckCircle, AlertCircle, Save, Shield } from 'lucide-react';

const SecuritySetting = () => {
  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [showPasswords, setShowPasswords] = useState({
    currentPassword: false,
    newPassword: false,
    confirmPassword: false
  });

  // Password strength calculator
  const calculatePasswordStrength = (password) => {
    if (!password) return 0;
    
    let strength = 0;
    if (password.length >= 8) strength += 25;
    if (/[A-Z]/.test(password)) strength += 25;
    if (/[a-z]/.test(password)) strength += 25;
    if (/[0-9]/.test(password)) strength += 15;
    if (/[^A-Za-z0-9]/.test(password)) strength += 10;
    
    return Math.min(strength, 100);
  };

  const getPasswordStrengthColor = (strength) => {
    if (strength < 40) return 'bg-red-500';
    if (strength < 70) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  const getPasswordStrengthText = (strength) => {
    if (strength === 0) return '';
    if (strength < 40) return 'Lemah';
    if (strength < 70) return 'Cukup';
    return 'Kuat';
  };

  const validateForm = () => {
    const newErrors = {};
    const passwordStrength = calculatePasswordStrength(formData.newPassword);

    // Current password validation
    if (!formData.currentPassword.trim()) {
      newErrors.currentPassword = 'Password saat ini wajib diisi';
    } else if (formData.currentPassword.length < 6) {
      newErrors.currentPassword = 'Password harus minimal 6 karakter';
    }

    // New password validation
    if (!formData.newPassword.trim()) {
      newErrors.newPassword = 'Password baru wajib diisi';
    } else if (formData.newPassword.length < 8) {
      newErrors.newPassword = 'Password baru harus minimal 8 karakter';
    } else if (formData.newPassword === formData.currentPassword) {
      newErrors.newPassword = 'Password baru harus berbeda dengan password lama';
    } else if (passwordStrength < 40) {
      newErrors.newPassword = 'Password terlalu lemah. Gunakan kombinasi huruf besar, kecil, angka, dan simbol';
    }

    // Confirm password validation
    if (!formData.confirmPassword.trim()) {
      newErrors.confirmPassword = 'Konfirmasi password wajib diisi';
    } else if (formData.newPassword !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Konfirmasi password tidak cocok';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }

    // Clear message when user makes changes
    if (message.text) {
      setMessage({ type: '', text: '' });
    }
  };

  const togglePasswordVisibility = (field) => {
    setShowPasswords(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      setIsLoading(true);
      setMessage({ type: '', text: '' });

      const response = await fetch('/api/change-password', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          currentPassword: formData.currentPassword,
          newPassword: formData.newPassword
        })
      });

      const data = await response.json();

      if (response.ok) {
        setMessage({
          type: 'success',
          text: 'Password berhasil diubah!'
        });
        setFormData({
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        });
        setErrors({});
      } else {
        throw new Error(data.message || 'Gagal mengubah password');
      }
    } catch (error) {
      console.error('Error changing password:', error);
      setMessage({
        type: 'error',
        text: error.message || 'Terjadi kesalahan saat mengubah password'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const passwordStrength = calculatePasswordStrength(formData.newPassword);
  const passwordRequirements = [
    { label: 'Minimal 8 karakter', met: formData.newPassword.length >= 8 },
    { label: 'Mengandung huruf besar', met: /[A-Z]/.test(formData.newPassword) },
    { label: 'Mengandung huruf kecil', met: /[a-z]/.test(formData.newPassword) },
    { label: 'Mengandung angka', met: /[0-9]/.test(formData.newPassword) },
    { label: 'Mengandung simbol', met: /[^A-Za-z0-9]/.test(formData.newPassword) }
  ];

  return (
    <div className="max-w-2xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <Shield className="text-blue-600" size={28} />
          <h2 className="text-2xl font-bold text-gray-900">Keamanan Akun</h2>
        </div>
        <p className="text-gray-600">
          Kelola kata sandi dan pengaturan keamanan akun Anda
        </p>
      </div>

      {/* Security Alert */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
        <div className="flex items-start gap-3">
          <Key className="text-blue-600 mt-0.5" size={20} />
          <div>
            <p className="font-medium text-blue-900">Tips Keamanan</p>
            <ul className="text-blue-700 text-sm mt-1 list-disc list-inside space-y-1">
              <li>Gunakan kata sandi yang kuat dan unik</li>
              <li>Jangan gunakan kata sandi yang sama dengan akun lain</li>
              <li>Ubah kata sandi secara berkala</li>
              <li>Jangan bagikan kata sandi Anda kepada siapapun</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Message Alert */}
      {message.text && (
        <div className={`p-4 rounded-lg mb-6 flex items-center gap-3 ${
          message.type === 'success' 
            ? 'bg-green-50 border border-green-200 text-green-800'
            : 'bg-red-50 border border-red-200 text-red-800'
        }`}>
          {message.type === 'success' ? (
            <CheckCircle size={20} />
          ) : (
            <AlertCircle size={20} />
          )}
          {message.text}
        </div>
      )}

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Current Password */}
          <div>
            <label htmlFor="currentPassword" className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
              <Lock size={16} />
              Password Saat Ini
            </label>
            <div className="relative">
              <input
                type={showPasswords.currentPassword ? 'text' : 'password'}
                id="currentPassword"
                name="currentPassword"
                value={formData.currentPassword}
                onChange={handleChange}
                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors pr-12 ${
                  errors.currentPassword 
                    ? 'border-red-300 bg-red-50' 
                    : 'border-gray-300 bg-white'
                }`}
                placeholder="Masukkan password saat ini"
              />
              <button
                type="button"
                onClick={() => togglePasswordVisibility('currentPassword')}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
              >
                {showPasswords.currentPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
            {errors.currentPassword && (
              <p className="text-red-600 text-sm mt-1 flex items-center gap-1">
                <AlertCircle size={14} />
                {errors.currentPassword}
              </p>
            )}
          </div>

          {/* New Password */}
          <div>
            <label htmlFor="newPassword" className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
              <Key size={16} />
              Password Baru
            </label>
            <div className="relative">
              <input
                type={showPasswords.newPassword ? 'text' : 'password'}
                id="newPassword"
                name="newPassword"
                value={formData.newPassword}
                onChange={handleChange}
                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors pr-12 ${
                  errors.newPassword 
                    ? 'border-red-300 bg-red-50' 
                    : 'border-gray-300 bg-white'
                }`}
                placeholder="Masukkan password baru"
              />
              <button
                type="button"
                onClick={() => togglePasswordVisibility('newPassword')}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
              >
                {showPasswords.newPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>

            {/* Password Strength Meter */}
            {formData.newPassword && (
              <div className="mt-3">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-gray-700">Kekuatan Password</span>
                  <span className={`text-sm font-medium ${
                    passwordStrength < 40 ? 'text-red-600' :
                    passwordStrength < 70 ? 'text-yellow-600' : 'text-green-600'
                  }`}>
                    {getPasswordStrengthText(passwordStrength)}
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full transition-all duration-300 ${getPasswordStrengthColor(passwordStrength)}`}
                    style={{ width: `${passwordStrength}%` }}
                  ></div>
                </div>
              </div>
            )}

            {/* Password Requirements */}
            <div className="mt-3">
              <p className="text-sm font-medium text-gray-700 mb-2">Persyaratan Password:</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {passwordRequirements.map((req, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <div className={`w-4 h-4 rounded-full flex items-center justify-center ${
                      req.met ? 'bg-green-500' : 'bg-gray-300'
                    }`}>
                      {req.met && <CheckCircle size={12} className="text-white" />}
                    </div>
                    <span className={`text-sm ${req.met ? 'text-green-600' : 'text-gray-500'}`}>
                      {req.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {errors.newPassword && (
              <p className="text-red-600 text-sm mt-1 flex items-center gap-1">
                <AlertCircle size={14} />
                {errors.newPassword}
              </p>
            )}
          </div>

          {/* Confirm Password */}
          <div>
            <label htmlFor="confirmPassword" className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
              <Lock size={16} />
              Konfirmasi Password Baru
            </label>
            <div className="relative">
              <input
                type={showPasswords.confirmPassword ? 'text' : 'password'}
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors pr-12 ${
                  errors.confirmPassword 
                    ? 'border-red-300 bg-red-50' 
                    : 'border-gray-300 bg-white'
                }`}
                placeholder="Konfirmasi password baru"
              />
              <button
                type="button"
                onClick={() => togglePasswordVisibility('confirmPassword')}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
              >
                {showPasswords.confirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
            {errors.confirmPassword && (
              <p className="text-red-600 text-sm mt-1 flex items-center gap-1">
                <AlertCircle size={14} />
                {errors.confirmPassword}
              </p>
            )}
          </div>

          {/* Submit Button */}
          <div className="flex gap-3 pt-4 border-t border-gray-200">
            <button
              type="submit"
              disabled={isLoading}
              className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Save size={18} />
              {isLoading ? 'Mengubah Password...' : 'Ubah Password'}
            </button>
            
            <button
              type="button"
              onClick={() => {
                setFormData({
                  currentPassword: '',
                  newPassword: '',
                  confirmPassword: ''
                });
                setErrors({});
                setMessage({ type: '', text: '' });
              }}
              disabled={isLoading}
              className="flex items-center gap-2 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium disabled:opacity-50"
            >
              Reset Form
            </button>
          </div>
        </form>
      </div>

      {/* Additional Security Information */}
      <div className="mt-8 bg-yellow-50 border border-yellow-200 rounded-lg p-6">
        <h3 className="font-semibold text-yellow-900 mb-3 flex items-center gap-2">
          <Shield size={20} />
          Perlindungan Akun
        </h3>
        <div className="text-yellow-800 text-sm space-y-2">
          <p>• Pastikan Anda menggunakan koneksi internet yang aman</p>
          <p>• Jangan gunakan password yang mudah ditebak seperti tanggal lahir atau nama</p>
          <p>• Selalu logout setelah menggunakan aplikasi di perangkat bersama</p>
          <p>• Laporkan segera jika ada aktivitas mencurigakan pada akun Anda</p>
        </div>
      </div>
    </div>
  );
};

export default SecuritySetting;