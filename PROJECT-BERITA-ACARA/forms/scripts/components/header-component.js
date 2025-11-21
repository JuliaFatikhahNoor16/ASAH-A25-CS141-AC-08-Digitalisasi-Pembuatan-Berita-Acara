/**
 * Header Component
 * Dynamic header component untuk semua role (Vendor, PIC Gudang, Direksi)
 */

class HeaderComponent {
    constructor(role) {
        this.role = role;
        this.notificationCount = 0;
        this.userName = '';
        this.userInitials = '';
    }

    async init() {
        await this.loadUserData();
        this.render();
        this.setupEventListeners();
    }

    async loadUserData() {
        // Mock user data - replace with actual API call
        const userData = this.getMockUserData();
        this.userName = userData.name;
        this.userInitials = userData.initials;
        this.notificationCount = userData.notificationCount;
    }

    getMockUserData() {
        const userDataMap = {
            'vendor': {
                name: 'PT. Vendor Sukses',
                initials: 'VS',
                notificationCount: 3
            },
            'pic': {
                name: 'Ahmad Wirawan',
                initials: 'AW',
                notificationCount: 5
            },
            'direksi': {
                name: 'Ir. Budi Santoso',
                initials: 'BS',
                notificationCount: 6
            }
        };
        return userDataMap[this.role] || userDataMap['vendor'];
    }

    getTemplate() {
        return `
            <header class="header" role="banner">
                <div class="header-content">
                    <div class="header-left">
                        <button 
                            class="mobile-menu-btn" 
                            id="mobile-menu-btn"
                            aria-label="Toggle menu"
                            aria-expanded="false"
                        >
                            <span class="menu-icon"></span>
                        </button>
                        <h1 class="header-title">Sistem Berita Acara</h1>
                    </div>
                    
                    <div class="header-right">
                        <!-- Search Bar -->
                        <div class="search-container">
                            <svg class="search-icon" width="16" height="16" viewBox="0 0 16 16" fill="none">
                                <path d="M7.333 12.667A5.333 5.333 0 1 0 7.333 2a5.333 5.333 0 0 0 0 10.667ZM14 14l-2.9-2.9" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                            </svg>
                            <input 
                                type="search" 
                                class="search-input" 
                                placeholder="Cari dokumen..."
                                aria-label="Cari dokumen"
                                id="header-search"
                            >
                        </div>

                        <!-- Notifications -->
                        <div class="notification-container">
                            <button 
                                class="notification-btn" 
                                id="notification-btn"
                                aria-label="Notifikasi, ${this.notificationCount} belum dibaca"
                                aria-expanded="false"
                            >
                                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                                    <path d="M15 6.667a5 5 0 1 0-10 0c0 5.833-2.5 7.5-2.5 7.5h15s-2.5-1.667-2.5-7.5ZM11.442 17.5a1.667 1.667 0 0 1-2.884 0" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                                </svg>
                                ${this.notificationCount > 0 ? `
                                    <span class="notification-badge">${this.notificationCount}</span>
                                ` : ''}
                            </button>
                        </div>

                        <!-- User Menu -->
                        <div class="user-menu-container">
                            <button 
                                class="user-menu-btn" 
                                id="user-menu-btn"
                                aria-label="Menu pengguna"
                                aria-expanded="false"
                            >
                                <div class="user-avatar">
                                    <span class="avatar-initials">${this.userInitials}</span>
                                </div>
                                <span class="user-name">${this.userName}</span>
                                <svg class="dropdown-arrow" width="12" height="12" viewBox="0 0 12 12" fill="none">
                                    <path d="M3 4.5 6 7.5l3-3" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>
            </header>
        `;
    }

    render() {
        const container = document.getElementById('header-container');
        if (container) {
            container.innerHTML = this.getTemplate();
        }
    }

    setupEventListeners() {
        // Mobile menu toggle
        const mobileMenuBtn = document.getElementById('mobile-menu-btn');
        if (mobileMenuBtn) {
            mobileMenuBtn.addEventListener('click', () => {
                this.toggleMobileMenu();
            });
        }

        // Notification dropdown
        const notificationBtn = document.getElementById('notification-btn');
        if (notificationBtn) {
            notificationBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                this.toggleNotificationDropdown();
            });
        }

        // User menu dropdown
        const userMenuBtn = document.getElementById('user-menu-btn');
        if (userMenuBtn) {
            userMenuBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                this.toggleUserMenu();
            });
        }

        // Close dropdowns when clicking outside
        document.addEventListener('click', () => {
            this.closeAllDropdowns();
        });

        // Search functionality
        const searchInput = document.getElementById('header-search');
        if (searchInput) {
            searchInput.addEventListener('input', this.debounce((e) => {
                this.handleSearch(e.target.value);
            }, 300));
        }

        // Keyboard navigation
        this.setupKeyboardNavigation();
    }

    toggleMobileMenu() {
        const sidebar = document.querySelector('.sidebar');
        const mobileMenuBtn = document.getElementById('mobile-menu-btn');
        
        if (sidebar) {
            sidebar.classList.toggle('mobile-open');
            const isOpen = sidebar.classList.contains('mobile-open');
            mobileMenuBtn?.setAttribute('aria-expanded', isOpen.toString());
        }
    }

    toggleNotificationDropdown() {
        const dropdown = document.getElementById('notification-dropdown');
        const btn = document.getElementById('notification-btn');
        
        if (dropdown) {
            const isHidden = dropdown.classList.contains('hidden');
            this.closeAllDropdowns();
            
            if (isHidden) {
                dropdown.classList.remove('hidden');
                btn?.setAttribute('aria-expanded', 'true');
            }
        }
    }

    toggleUserMenu() {
        const dropdown = document.getElementById('user-menu-dropdown');
        const btn = document.getElementById('user-menu-btn');
        
        if (dropdown) {
            const isHidden = dropdown.classList.contains('hidden');
            this.closeAllDropdowns();
            
            if (isHidden) {
                dropdown.classList.remove('hidden');
                btn?.setAttribute('aria-expanded', 'true');
            }
        }
    }

    closeAllDropdowns() {
        const dropdowns = document.querySelectorAll('.dropdown');
        dropdowns.forEach(dropdown => {
            dropdown.classList.add('hidden');
        });

        // Reset aria-expanded
        document.getElementById('notification-btn')?.setAttribute('aria-expanded', 'false');
        document.getElementById('user-menu-btn')?.setAttribute('aria-expanded', 'false');
    }

    handleSearch(query) {
        // Dispatch custom event for search
        const searchEvent = new CustomEvent('headerSearch', {
            detail: { query }
        });
        document.dispatchEvent(searchEvent);
    }

    setupKeyboardNavigation() {
        // Escape key to close dropdowns
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.closeAllDropdowns();
            }
        });
    }

    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    updateNotificationCount(count) {
        this.notificationCount = count;
        this.render();
        this.setupEventListeners();
    }
}

// Export function to load header
export async function loadHeader(role = 'vendor') {
    const header = new HeaderComponent(role);
    await header.init();
    return header;
}

export default HeaderComponent;