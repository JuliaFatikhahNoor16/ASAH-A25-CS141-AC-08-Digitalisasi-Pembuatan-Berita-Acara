import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const LoginPage = () => {
  const [formData, setFormData] = useState({
    role: '',
    email: '',
    password: ''
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

    if (!formData.role) {
      newErrors.role = 'Silakan pilih role';
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

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      console.log('Login berhasil!');
      console.log('Role:', formData.role);
      console.log('Email / Phone:', formData.email);

      // SIMPAN SESSION
      localStorage.setItem("isLogin", "true");
      localStorage.setItem("userRole", formData.role);
      localStorage.setItem("userEmail", formData.email);

      setSuccess(true);

      setTimeout(() => {
        if (formData.role === "gudang") {
          navigate("/pic-gudang/dashboard");
        } else if (formData.role === "direksi") {
          navigate("/direksi/dashboard");
        } else if (formData.role === "vendor") {
          navigate("/vendor/dashboard");
        } else {
          alert("Role tidak valid!");
        }
      }, 1500);
    }
  };

  return (
    <div className="auth-container">
      <div className="form-box">
        <h1>DigiBA</h1>

        {success && (
          <div className="success-message show">
            Login berhasil! Mengalihkan...
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label htmlFor="loginRole">Login sebagai</label>
            <select
              id="loginRole"
              name="role"
              value={formData.role}
              onChange={handleChange}
              className={errors.role ? 'error' : ''}
              required
            >
              <option value="">-- Pilih Role --</option>
              <option value="gudang">PIC Gudang</option>
              <option value="direksi">Direksi</option>
              <option value="vendor">Vendor</option>
            </select>
            {errors.role && <div className="error-message show">{errors.role}</div>}
          </div>

          <div className="input-group">
            <label htmlFor="loginEmail">Email / Phone</label>
            <input
              type="text"
              id="loginEmail"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Masukkan email atau nomor telepon"
              className={errors.email ? 'error' : ''}
            />
            {errors.email && <div className="error-message show">{errors.email}</div>}
          </div>

          <div className="input-group">
            <label htmlFor="loginPassword">Password</label>
            <input
              type="password"
              id="loginPassword"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Masukkan password"
              className={errors.password ? 'error' : ''}
            />
            {errors.password && <div className="error-message show">{errors.password}</div>}
          </div>

          <button type="submit" className="btn">Login</button>
        </form>

        <div className="switch-form">
          <p>
            Belum punya akun?
            <Link to="/register">Daftar disini</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;