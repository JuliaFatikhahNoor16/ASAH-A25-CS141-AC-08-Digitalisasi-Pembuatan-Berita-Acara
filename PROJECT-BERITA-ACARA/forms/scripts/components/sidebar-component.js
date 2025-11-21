/**
 * Sidebar Component
 * Dynamic sidebar navigation untuk semua role (Vendor, PIC Gudang, Direksi)
 */

class SidebarComponent {
    constructor(role) {
        this.role = role;
        this.currentPath = window.location.pathname;
        this.userName = '';
        this.userRole = '';
        this.userInitials = '';
    }

    async init() {
        await this.loadUserData();
        this.render();
        this.setupEventListeners();
        this.setActiveNavItem();
    }

    async loadUserData() {
        const userData = this.getMockUserData();
        this.userName = userData.name;
        this.userRole = userData.roleLabel;
        this.userInitials = userData.initials;
    }

    getMockUserData() {
        const userDataMap = {
            'vendor': {
                name: 'PT. Vendor Sukses',
                roleLabel: 'Vendor',
                initials: 'VS'
            },
            'pic': {
                name: 'Ahmad Wirawan',
                roleLabel: 'PIC Gudang',
                initials: 'AW'
            },
            'direksi': {
                name: 'Ir. Budi Santoso',
                roleLabel: 'Direksi',
                initials: 'BS'
            }
        };
        return userDataMap[this.role] || userDataMap['vendor'];
    }

    getNavigationItems() {
        const navigationMap = {
            'vendor': [
                {
                    icon: '🏠',
                    text: 'Dashboard',
                    href: 'vendor-dashboard.html',
                    id: 'nav-dashboard'
                },
                {
                    icon: '📄',
                    text: 'Buat BAPB',
                    href: '../forms/buat-bapb.html',
                    id: 'nav-buat-bapb'
                },
                {
                    icon: '📋',
                    text: 'Buat BAPP',
                    href: '../forms/buat-bapp.html',
                    id: 'nav-buat-bapp'
                },
                {
                    icon: '📁',
                    text: 'Dokumen Saya',
                    href: 'dokumen-saya.html',
                    id: 'nav-dokumen',
                    badge: 5
                },
                {
                    icon: '🔔',
                    text: 'Notifikasi',
                    href: 'notifikasi.html',
                    id: 'nav-notifikasi',
                    badge: 3
                },
                {
                    icon: '👤',
                    text: 'Profile',
                    href: 'profile.html',
                    id: 'nav-profile'
                }
            ],
            'pic': [
                {
                    icon: '🏠',
                    text: 'Dashboard',
                    href: 'pic-dashboard.html',
                    id: 'nav-dashboard'
                },
                {
                    icon: '✔',
                    text: 'Verifikasi BAPB',
                    href: 'verifikasi-bapb.html',
                    id: 'nav-verifikasi-bapb',
                    badge: 8
                },
                {
                    icon: '✔',
                    text: 'Verifikasi BAPP',
                    href: 'verifikasi-bapp.html',
                    id: 'nav-verifikasi-bapp',
                    badge: 3
                },
                {
                    icon: '📊',
                    text: 'Laporan',
                    href: 'laporan.html',
                    id: 'nav-laporan'
                },
                {
                    icon: '🔔',
                    text: 'Notifikasi',
                    href: 'notifikasi.html',
                    id: 'nav-notifikasi',
                    badge: 5
                },
                {
                    icon: '👤',
                    text: 'Profile',
                    href: 'profile.html',
                    id: 'nav-profile'
                }
            ],
            'direksi': [
                {
                    icon: '🏠',
                    text: 'Dashboard',
                    href: 'direksi-dashboard.html',
                    id: 'nav-dashboard'
                },
                {
                    icon: '✍️',
                    text: 'TTD Digital',
                    href: 'ttd-digital.html',
                    id: 'nav-ttd',
                    badge: 6
                },
                {
                    icon: '📈',
                    text: 'Monitoring',
                    href: 'monitoring.html',
                    id: 'nav-monitoring'
                },
                {
                    icon: '📊',
                    text: 'Laporan',
                    href: 'laporan.html',
                    id: 'nav-laporan'
                },
                {
                    icon: '🔔',
                    text: 'Notifikasi',
                    href: 'notifikasi.html',
                    id: 'nav-notifikasi',
                    badge: 6
                },
                {
                    icon: '👤',
                    text: 'Profile',
                    href: 'profile.html',
                    id: 'nav-profile'
                }
            ]
        };

        return navigationMap[this.role] || navigationMap['vendor'];
    }

    getTemplate() {
        const navItems = this.getNavigationItems();

        return `
            <aside class="sidebar" role="navigation" aria-label="Navigasi utama">
                <!-- Sidebar Header -->
                <div class="sidebar-header">
                    <div class="logo">
                        <h2 class="logo-text">BA Digital</h2>
                        <p class="logo-subtitle">Berita Acara System</p>
                    </div>
                </div>

                <!-- Navigation -->
                <nav class="sidebar-nav">
                    <ul class="nav-list" role="list">
                        ${navItems.map(item => `
                            <li class="nav-item" role="listitem">
                                <a 
                                    href="${item.href}" 
                                    class="nav-link" 
                                    id="${item.id}"
                                    aria-label="${item.text}${item.badge ? `, ${item.badge} item baru` : ''}"
                                    style="
                                        display: flex;
                                        align-items: center;
                                        gap: 12px;
                                        padding: 12px 16px;
                                        text-decoration: none;
                                        color: inherit;
                                        border-radius: 8px;
                                        transition: all 0.2s ease;
                                        cursor: pointer;
                                    "
                                >
                                    <span class="nav-icon" aria-hidden="true" style="font-size: 20px;">${item.icon}</span>
                                    <span class="nav-text" style="flex: 1;">${item.text}</span>
                                    ${item.badge ? `
                                        <span class="nav-badge" aria-label="${item.badge} item" style="
                                            background: #ef4444;
                                            color: white;
                                            padding: 2px 8px;
                                            border-radius: 12px;
                                            font-size: 12px;
                                            font-weight: 600;
                                        ">${item.badge}</span>
                                    ` : ''}
                                </a>
                            </li>
                        `).join('')}
                    </ul>
                </nav>

                <!-- Sidebar Footer / User Profile -->
                <div class="sidebar-footer">
                    <div class="user-profile">
                        <div class="profile-avatar">
                            <span class="avatar-initials">${this.userInitials}</span>
                        </div>
                        <div class="profile-info">
                            <p class="profile-name">${this.userName}</p>
                            <p class="profile-role">${this.userRole}</p>
                        </div>
                    </div>
                    <button 
                        class="logout-btn" 
                        id="sidebar-logout-btn"
                        aria-label="Logout dari sistem"
                        style="
                            width: 100%;
                            margin-top: 16px;
                            padding: 12px 16px;
                            background: #ef4444;
                            color: white;
                            border: none;
                            border-radius: 8px;
                            cursor: pointer;
                            font-weight: 600;
                            font-size: 14px;
                            transition: all 0.2s ease;
                        "
                    >
                        🚪 Logout
                    </button>
                </div>
            </aside>
        `;
    }

    render() {
        const container = document.getElementById('sidebar-container');
        if (container) {
            container.innerHTML = this.getTemplate();
        }
    }

    setupEventListeners() {
        // Navigation links - enable clicking with confirmation log
        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            // Add click event
            link.addEventListener('click', (e) => {
                const href = e.currentTarget.getAttribute('href');
                console.log(`🔗 Navigating to: ${href}`);
                
                // Close mobile sidebar if open
                if (window.innerWidth <= 768) {
                    this.closeMobileSidebar();
                }
                
                // Let default navigation happen
            });

            // Add hover effect
            link.addEventListener('mouseenter', (e) => {
                if (!e.currentTarget.classList.contains('active')) {
                    e.currentTarget.style.backgroundColor = 'rgba(59, 130, 246, 0.1)';
                }
            });

            link.addEventListener('mouseleave', (e) => {
                if (!e.currentTarget.classList.contains('active')) {
                    e.currentTarget.style.backgroundColor = '';
                }
            });
        });

        // Logout button
        const logoutBtn = document.getElementById('sidebar-logout-btn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.handleLogout();
            });

            // Hover effect
            logoutBtn.addEventListener('mouseenter', (e) => {
                e.target.style.background = '#dc2626';
                e.target.style.transform = 'scale(1.02)';
            });
            logoutBtn.addEventListener('mouseleave', (e) => {
                e.target.style.background = '#ef4444';
                e.target.style.transform = 'scale(1)';
            });
        }

        // Keyboard navigation
        this.setupKeyboardNavigation();
    }

    setActiveNavItem() {
        const navLinks = document.querySelectorAll('.nav-link');
        const currentPage = this.getCurrentPage();

        navLinks.forEach(link => {
            const linkPage = this.getPageFromHref(link.getAttribute('href'));
            
            if (linkPage === currentPage) {
                link.classList.add('active');
                link.setAttribute('aria-current', 'page');
                link.style.backgroundColor = 'rgba(59, 130, 246, 0.2)';
                link.style.borderLeft = '4px solid #3b82f6';
                link.style.fontWeight = '600';
            } else {
                link.classList.remove('active');
                link.removeAttribute('aria-current');
                link.style.borderLeft = '';
            }
        });
    }

    getCurrentPage() {
        const path = window.location.pathname;
        const parts = path.split('/');
        return parts[parts.length - 1] || 'dashboard.html';
    }

    getPageFromHref(href) {
        if (!href) return '';
        const parts = href.split('/');
        return parts[parts.length - 1];
    }

    closeMobileSidebar() {
        const sidebar = document.querySelector('.sidebar');
        if (sidebar) {
            sidebar.classList.remove('mobile-open');
        }

        const mobileMenuBtn = document.getElementById('mobile-menu-btn');
        if (mobileMenuBtn) {
            mobileMenuBtn.setAttribute('aria-expanded', 'false');
        }
    }

    handleLogout() {
        // Show confirmation
        if (confirm('Apakah Anda yakin ingin logout?')) {
            console.log('🚪 Logging out...');
            
            // Clear session/local storage
            localStorage.clear();
            sessionStorage.clear();
            
            // Show logout message
            alert('Anda telah berhasil logout');

            // Redirect to login page
            setTimeout(() => {
                window.location.href = '../login.html';
            }, 500);
        }
    }

    setupKeyboardNavigation() {
        const navLinks = document.querySelectorAll('.nav-link');
        
        navLinks.forEach((link, index) => {
            link.addEventListener('keydown', (e) => {
                // Arrow key navigation
                if (e.key === 'ArrowDown') {
                    e.preventDefault();
                    const nextLink = navLinks[index + 1];
                    if (nextLink) nextLink.focus();
                } else if (e.key === 'ArrowUp') {
                    e.preventDefault();
                    const prevLink = navLinks[index - 1];
                    if (prevLink) prevLink.focus();
                } else if (e.key === 'Enter' || e.key === ' ') {
                    // Enter or Space key to navigate
                    e.preventDefault();
                    window.location.href = link.getAttribute('href');
                }
            });
        });
    }

    updateBadge(navId, count) {
        const navLink = document.getElementById(navId);
        if (!navLink) return;

        const existingBadge = navLink.querySelector('.nav-badge');
        
        if (count > 0) {
            if (existingBadge) {
                existingBadge.textContent = count;
                existingBadge.setAttribute('aria-label', `${count} item`);
            } else {
                const badge = document.createElement('span');
                badge.className = 'nav-badge';
                badge.textContent = count;
                badge.setAttribute('aria-label', `${count} item`);
                badge.style.cssText = `
                    background: #ef4444;
                    color: white;
                    padding: 2px 8px;
                    border-radius: 12px;
                    font-size: 12px;
                    font-weight: 600;
                `;
                navLink.appendChild(badge);
            }
        } else {
            if (existingBadge) {
                existingBadge.remove();
            }
        }
    }
}

// Export function to load sidebar
export async function loadSidebar(role = 'vendor') {
    const sidebar = new SidebarComponent(role);
    await sidebar.init();
    return sidebar;
}

export default SidebarComponent;