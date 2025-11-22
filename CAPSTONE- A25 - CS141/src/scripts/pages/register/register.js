// Register Module
const RegisterModule = (() => {
    // Fungsi validasi email
    function validateEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }

    // Fungsi validasi nomor telepon
    function validatePhone(phone) {
        const re = /^[0-9]{10,13}$/;
        return re.test(phone);
    }

    // Fungsi untuk menampilkan pesan error
    function showError(input, message) {
        input.classList.add('error');
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message show';
        errorDiv.textContent = message;

        const existingError = input.parentElement.querySelector('.error-message');
        if (existingError) {
            existingError.remove();
        }

        input.parentElement.appendChild(errorDiv);
    }

    // Fungsi untuk menghapus pesan error
    function clearError(input) {
        input.classList.remove('error');
        const errorMsg = input.parentElement.querySelector('.error-message');
        if (errorMsg) {
            errorMsg.remove();
        }
    }

    // Fungsi untuk menampilkan pesan sukses
    function showSuccess(form, message) {
        const successDiv = document.createElement('div');
        successDiv.className = 'success-message show';
        successDiv.textContent = message;
        form.insertBefore(successDiv, form.firstChild);

        setTimeout(() => {
            successDiv.remove();
        }, 3000);
    }

    // Initialize register form
    function init() {
        const registerFormSubmit = document.getElementById('registerFormSubmit');

        if (!registerFormSubmit) return;

        // Handle submit
        registerFormSubmit.addEventListener('submit', function (e) {
            e.preventDefault();

            const username = document.getElementById('registerUsername');
            const email = document.getElementById('registerEmail');
            const password = document.getElementById('registerPassword');
            const confirmPassword = document.getElementById('registerConfirmPassword');

            let isValid = true;

            clearError(username);
            clearError(email);
            clearError(password);
            clearError(confirmPassword);

            if (username.value.trim() === '') {
                showError(username, 'Username tidak boleh kosong');
                isValid = false;
            } else if (username.value.length < 4) {
                showError(username, 'Username minimal 4 karakter');
                isValid = false;
            }

            if (email.value.trim() === '') {
                showError(email, 'Email/Phone tidak boleh kosong');
                isValid = false;
            } else if (!validateEmail(email.value) && !validatePhone(email.value)) {
                showError(email, 'Format email atau nomor telepon tidak valid');
                isValid = false;
            }

            if (password.value.trim() === '') {
                showError(password, 'Password tidak boleh kosong');
                isValid = false;
            } else if (password.value.length < 6) {
                showError(password, 'Password minimal 6 karakter');
                isValid = false;
            }

            if (confirmPassword.value.trim() === '') {
                showError(confirmPassword, 'Konfirmasi password tidak boleh kosong');
                isValid = false;
            } else if (password.value !== confirmPassword.value) {
                showError(confirmPassword, 'Password tidak cocok');
                isValid = false;
            }

            if (isValid) {
                console.log('Registrasi berhasil!');
                console.log('Username:', username.value);
                console.log('Email/Phone:', email.value);

                showSuccess(registerFormSubmit, 'Registrasi berhasil! Mengalihkan ke halaman login...');

                setTimeout(() => {
                    registerFormSubmit.reset();
                    window.location.href = "../login/login.html";
                }, 2000);
            }
        });

        // Real-time validation
        registerFormSubmit.querySelectorAll('input').forEach(input => {
            input.addEventListener('input', function () {
                if (this.classList.contains('error')) {
                    clearError(this);
                }
            });
        });
    }

    return {
        init
    };
})();

// Initialize saat DOM ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', RegisterModule.init);
} else {
    RegisterModule.init();
}
