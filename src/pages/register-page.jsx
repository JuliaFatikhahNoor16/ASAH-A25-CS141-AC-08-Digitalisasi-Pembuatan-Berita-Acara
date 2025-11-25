import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  // Fungsi validasi email
  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  // Fungsi validasi nomor telepon
  const validatePhone = (phone) => {
    const re = /^[0-9]{10,13}$/;
    return re.test(phone);
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
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.username.trim()) {
      newErrors.username = 'Username tidak boleh kosong';
    } else if (formData.username.length < 4) {
      newErrors.username = 'Username minimal 4 karakter';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email/Phone tidak boleh kosong';
    } else if (!validateEmail(formData.email) && !validatePhone(formData.email)) {
      newErrors.email = 'Format email atau nomor telepon tidak valid';
    }

    if (!formData.password.trim()) {
      newErrors.password = 'Password tidak boleh kosong';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password minimal 6 karakter';
    }

    if (!formData.confirmPassword.trim()) {
      newErrors.confirmPassword = 'Konfirmasi password tidak boleh kosong';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Password tidak cocok';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      console.log('Registrasi berhasil!');
      console.log('Username:', formData.username);
      console.log('Email/Phone:', formData.email);

      setSuccess(true);
      
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    }
  };

  return (
    <div className="auth-container">
      <div className="form-box">
        <h1>DigiBA</h1>

        {success && (
          <div className="success-message show">
            Registrasi berhasil! Mengalihkan ke halaman login...
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label htmlFor="registerUsername">Username</label>
            <input
              type="text"
              id="registerUsername"
              name="username"
              value={formData.username}
              onChange={handleChange}
              placeholder="Masukkan username"
              className={errors.username ? 'error' : ''}
            />
            {errors.username && <div className="error-message show">{errors.username}</div>}
          </div>

          <div className="input-group">
            <label htmlFor="registerEmail">Email / Phone</label>
            <input
              type="text"
              id="registerEmail"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Masukkan email atau nomor telepon"
              className={errors.email ? 'error' : ''}
            />
            {errors.email && <div className="error-message show">{errors.email}</div>}
          </div>

          <div className="input-group">
            <label htmlFor="registerPassword">Password</label>
            <input
              type="password"
              id="registerPassword"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Masukkan password"
              className={errors.password ? 'error' : ''}
            />
            {errors.password && <div className="error-message show">{errors.password}</div>}
          </div>

          <div className="input-group">
            <label htmlFor="registerConfirmPassword">Confirm Password</label>
            <input
              type="password"
              id="registerConfirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Konfirmasi password"
              className={errors.confirmPassword ? 'error' : ''}
            />
            {errors.confirmPassword && <div className="error-message show">{errors.confirmPassword}</div>}
          </div>

          <button type="submit" className="btn">Register</button>
        </form>

        <div className="switch-form">
          <p>
            Sudah punya akun?
            <Link to="/login">Login disini</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;