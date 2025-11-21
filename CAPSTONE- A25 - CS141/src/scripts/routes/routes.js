// Router untuk SPA
class Router {
    constructor() {
        this.routes = {
            'login': 'loginPage',
            'register': 'registerPage'
        };
        this.currentPage = 'login';
        this.init();
    }

    init() {
        // Load initial page dari hash atau default ke login
        const hash = window.location.hash.slice(1) || 'login';
        this.navigate(hash);

        // Listen untuk perubahan hash
        window.addEventListener('hashchange', () => {
            const page = window.location.hash.slice(1);
            this.navigate(page);
        });

        // Handle klik pada link navigasi
        document.addEventListener('click', (e) => {
            if (e.target.matches('[data-page]')) {
                e.preventDefault();
                const page = e.target.getAttribute('data-page');
                this.navigateTo(page);
            }
        });
    }

    navigate(page) {
        // Validasi halaman
        if (!this.routes[page]) {
            page = 'login'; // Default ke login jika halaman tidak valid
        }

        // Hide semua halaman
        document.querySelectorAll('.page').forEach(p => {
            p.classList.remove('active');
        });

        // Show halaman yang diminta
        const targetPage = document.getElementById(this.routes[page]);
        if (targetPage) {
            targetPage.classList.add('active');
            this.currentPage = page;
            
            // Update title
            document.title = `DigiBA - ${page.charAt(0).toUpperCase() + page.slice(1)}`;
        }
    }

    navigateTo(page) {
        window.location.hash = page;
    }

    getCurrentPage() {
        return this.currentPage;
    }
}

// Inisialisasi router
const router = new Router();
