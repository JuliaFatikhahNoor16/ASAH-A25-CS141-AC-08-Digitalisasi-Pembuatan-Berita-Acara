// Login Module
const LoginModule = (() => {
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

    // Initialize login form
    function init() {
        const loginFormSubmit = document.getElementById('loginFormSubmit');

        if (!loginFormSubmit) return;

        // Handle submit
        loginFormSubmit.addEventListener('submit', function (e) {
            e.preventDefault();

            const role = document.getElementById('loginRole');       // DROPDOWN ROLE
            const email = document.getElementById('loginEmail');
            const password = document.getElementById('loginPassword');

            let isValid = true;

            clearError(role);
            clearError(email);
            clearError(password);

            // Validasi Role
            if (role.value === '') {
                showError(role, 'Silakan pilih role terlebih dahulu');
                isValid = false;
            }

            // Validasi Email / Phone
            if (email.value.trim() === '') {
                showError(email, 'Email/Phone tidak boleh kosong');
                isValid = false;
            } else if (!validateEmail(email.value) && !validatePhone(email.value)) {
                showError(email, 'Format email atau nomor telepon tidak valid');
                isValid = false;
            }

            // Validasi Password
            if (password.value.trim() === '') {
                showError(password, 'Password tidak boleh kosong');
                isValid = false;
            } else if (password.value.length < 6) {
                showError(password, 'Password minimal 6 karakter');
                isValid = false;
            }

            // Jika valid -> redirect
            if (isValid) {
                console.log('Login berhasil!');
                console.log('Role:', role.value);
                console.log('Email/Phone:', email.value);

                showSuccess(loginFormSubmit, 'Login berhasil! Mengalihkan...');

                setTimeout(() => {
                    loginFormSubmit.reset();

                    if (role.value === "gudang") {
                        window.location.href = "../pic-gudang/pic-gudang.html";
                    }

                    else if (role.value === "direksi") {
                        window.location.href = "../direksi/direksi.html";
                    }

                    else if (role.value === "vendor") {
                        window.location.href = "../vendor/vendor.html";
                    }

                }, 2000);
            }
        });

        // Real-time validation (input & select)
        loginFormSubmit.querySelectorAll('input, select').forEach(input => {
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
    document.addEventListener('DOMContentLoaded', LoginModule.init);
} else {
    LoginModule.init();
}
