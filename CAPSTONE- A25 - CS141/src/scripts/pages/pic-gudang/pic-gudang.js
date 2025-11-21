class PicGudangSPA {
    constructor() {
        this.currentUser = null;
        this.config = window.APP_CONFIG;
        this.currentPage = this.getCurrentPageFromURL();
        this.isLoading = false;
        
        this.init();
    }

    async init() {
        await this.checkAuth();
        this.initializeApp();
        this.setupEventListeners();
        this.render();
    }

    async checkAuth() {
        this.currentUser = this.getCurrentUser();
        if (!this.currentUser || this.currentUser.role !== 'pic_gudang') {
            this.redirectToLogin();
            return;
        }
    }

    getCurrentUser() {
        try {
            const userData = localStorage.getItem(this.config.STORAGE_KEYS.USER_DATA);
            return userData ? JSON.parse(userData) : null;
        } catch (error) {
            console.error('Error getting user data:', error);
            return null;
        }
    }

    getCurrentPageFromURL() {
        const hash = window.location.hash.substring(1);
        return hash || this.config.ROUTES.DASHBOARD;
    }

    initializeApp() {
        this.setupRouter();
    }

    setupRouter() {
        // Handle browser back/forward buttons
        window.addEventListener('popstate', (event) => {
            this.currentPage = this.getCurrentPageFromURL();
            this.render();
        });

        // Handle initial route
        this.navigate(this.currentPage, false);
    }

    setupEventListeners() {
        // Logout button
        document.getElementById('logout-btn').addEventListener('click', () => {
            this.logout();
        });

        // Global event listeners
        document.addEventListener('click', (e) => {
            // Handle internal navigation
            if (e.target.matches('[data-route]') || e.target.closest('[data-route]')) {
                e.preventDefault();
                const routeElement = e.target.matches('[data-route]') ? e.target : e.target.closest('[data-route]');
                const route = routeElement.getAttribute('data-route');
                this.navigate(route);
            }

            // Handle form submissions
            if (e.target.matches('[data-action]') || e.target.closest('[data-action]')) {
                e.preventDefault();
                const actionElement = e.target.matches('[data-action]') ? e.target : e.target.closest('[data-action]');
                const action = actionElement.getAttribute('data-action');
                const documentId = actionElement.getAttribute('data-document-id');
                this.handleAction(action, documentId);
            }
        });
    }

    navigate(route, updateHistory = true) {
        if (this.isLoading) return;

        this.currentPage = route;
        
        if (updateHistory) {
            window.history.pushState({}, '', `#${route}`);
        }

        this.render();
    }

    async render() {
        this.showLoading();
        
        try {
            // Render sidebar navigation
            this.renderSidebar();
            
            // Render current page content
            await this.renderPage();
            
            // Load page-specific data
            await this.loadPageData();
            
        } catch (error) {
            console.error('Error rendering page:', error);
            this.showError('Gagal memuat halaman');
        } finally {
            this.hideLoading();
        }
    }

    renderSidebar() {
        const sidebarNav = document.getElementById('sidebar-nav');
        const routes = [
            { id: 'dashboard', icon: '📊', label: 'Dashboard' },
            { id: 'approvals', icon: '✅', label: 'Persetujuan BAPB' },
            { id: 'documents', icon: '📄', label: 'Dokumen Overview' },
            { id: 'notifications', icon: '🔔', label: 'Notifikasi', badge: 3 }
        ];

        sidebarNav.innerHTML = routes.map(route => `
            <a href="#${route.id}" class="nav-item ${this.currentPage === route.id ? 'active' : ''}" 
               data-route="${route.id}">
                <span class="nav-icon">${route.icon}</span>
                <span>${route.label}</span>
                ${route.badge ? `<span class="badge">${route.badge}</span>` : ''}
            </a>
        `).join('');

        // Update user info
        document.querySelector('.user-name').textContent = this.currentUser?.nama || 'PIC Gudang';
    }

    async renderPage() {
        const pageContent = document.getElementById('page-content');
        
        switch (this.currentPage) {
            case this.config.ROUTES.DASHBOARD:
                pageContent.innerHTML = this.renderDashboard();
                break;
            case this.config.ROUTES.APPROVALS:
                pageContent.innerHTML = this.renderApprovals();
                break;
            case this.config.ROUTES.DOCUMENTS:
                pageContent.innerHTML = this.renderDocuments();
                break;
            case this.config.ROUTES.NOTIFICATIONS:
                pageContent.innerHTML = this.renderNotifications();
                break;
            default:
                pageContent.innerHTML = this.renderNotFound();
        }
    }

    renderDashboard() {
        return `
            <div class="page-content active">
                <div class="page-header">
                    <h1>Dashboard</h1>
                    <p>Selamat datang di PIC Gudang Dashboard</p>
                </div>
                
                <div class="stats-grid" id="stats-grid">
                    <div class="stat-card">
                        <div class="stat-icon blue">📦</div>
                        <div class="stat-info">
                            <h3>Total BAPB</h3>
                            <p class="stat-value" data-stat="total">0</p>
                            <p class="stat-change positive">+12% dari bulan lalu</p>
                        </div>
                    </div>
                    
                    <div class="stat-card">
                        <div class="stat-icon yellow">⏳</div>
                        <div class="stat-info">
                            <h3>Menunggu Persetujuan</h3>
                            <p class="stat-value" data-stat="pending">0</p>
                            <p class="stat-change">Perlu ditinjau</p>
                        </div>
                    </div>
                    
                    <div class="stat-card">
                        <div class="stat-icon green">✅</div>
                        <div class="stat-info">
                            <h3>Disetujui</h3>
                            <p class="stat-value" data-stat="approved">0</p>
                            <p class="stat-change positive">+8% dari bulan lalu</p>
                        </div>
                    </div>
                    
                    <div class="stat-card">
                        <div class="stat-icon red">❌</div>
                        <div class="stat-info">
                            <h3>Ditolak</h3>
                            <p class="stat-value" data-stat="rejected">0</p>
                            <p class="stat-change negative">-2% dari bulan lalu</p>
                        </div>
                    </div>
                </div>
                
                <div class="content-grid">
                    <div class="card">
                        <h2>BAPB Terbaru</h2>
                        <div class="table-responsive">
                            <table>
                                <thead>
                                    <tr>
                                        <th>No. BAPB</th>
                                        <th>Tanggal</th>
                                        <th>Supplier</th>
                                        <th>Status</th>
                                    </tr>
                                </thead>
                                <tbody id="recent-bapb-table">
                                    <tr>
                                        <td colspan="4" class="text-center">Memuat data...</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                    
                    <div class="card">
                        <h2>Aktivitas Terkini</h2>
                        <div class="activity-list" id="activity-list">
                            <div class="activity-item">
                                <div class="activity-icon blue">⏳</div>
                                <div class="activity-content">
                                    <p>Memuat aktivitas...</p>
                                    <span class="activity-time">-</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    renderApprovals() {
        return `
            <div class="page-content active">
                <div class="page-header">
                    <h1>Persetujuan BAPB</h1>
                    <p>Tinjau dan setujui dokumen BAPB</p>
                </div>
                
                <div class="card">
                    <div class="filter-bar">
                        <input type="text" placeholder="Cari BAPB..." class="search-input" id="search-approvals">
                        <select class="filter-select" id="filter-approvals">
                            <option value="all">Semua Status</option>
                            <option value="pending">Pending</option>
                            <option value="approved">Disetujui</option>
                            <option value="rejected">Ditolak</option>
                        </select>
                    </div>
                    
                    <div class="table-responsive">
                        <table>
                            <thead>
                                <tr>
                                    <th>No. BAPB</th>
                                    <th>Tanggal</th>
                                    <th>Supplier</th>
                                    <th>Total Item</th>
                                    <th>Status</th>
                                    <th>Aksi</th>
                                </tr>
                            </thead>
                            <tbody id="approvals-table">
                                <tr>
                                    <td colspan="6" class="text-center">Memuat data persetujuan...</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        `;
    }

    renderDocuments() {
        return `
            <div class="page-content active">
                <div class="page-header">
                    <h1>Dokumen Overview</h1>
                    <p>Kelola dan lihat semua dokumen BAPB</p>
                </div>
                
                <div class="stats-grid">
                    <div class="stat-card">
                        <div class="stat-icon blue">📄</div>
                        <div class="stat-info">
                            <h3>Total Dokumen</h3>
                            <p class="stat-value" data-stat="total-documents">0</p>
                        </div>
                    </div>
                    
                    <div class="stat-card">
                        <div class="stat-icon green">📊</div>
                        <div class="stat-info">
                            <h3>Dokumen Bulan Ini</h3>
                            <p class="stat-value" data-stat="monthly-documents">0</p>
                        </div>
                    </div>
                </div>
                
                <div class="card">
                    <h2>Daftar Dokumen</h2>
                    <div class="document-grid" id="document-grid">
                        <div class="document-card">
                            <div class="document-icon">⏳</div>
                            <h3>Memuat dokumen...</h3>
                            <p>Tanggal: -</p>
                            <button class="btn btn-sm btn-primary" disabled>Unduh</button>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    renderNotifications() {
        return `
            <div class="page-content active">
                <div class="page-header">
                    <h1>Notifikasi</h1>
                    <p>Lihat semua notifikasi terbaru</p>
                </div>
                
                <div class="card">
                    <div class="notification-list" id="notification-list">
                        <div class="notification-item">
                            <div class="notification-icon blue">⏳</div>
                            <div class="notification-content">
                                <h3>Memuat notifikasi...</h3>
                                <p>Silakan tunggu sebentar</p>
                                <span class="notification-time">-</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    renderNotFound() {
        return `
            <div class="page-content active">
                <div class="page-header">
                    <h1>Halaman Tidak Ditemukan</h1>
                    <p>Halaman yang Anda cari tidak ada.</p>
                </div>
                <div class="card">
                    <p>Kembali ke <a href="#dashboard" data-route="dashboard">Dashboard</a></p>
                </div>
            </div>
        `;
    }

    async loadPageData() {
        switch (this.currentPage) {
            case this.config.ROUTES.DASHBOARD:
                await this.loadDashboardData();
                break;
            case this.config.ROUTES.APPROVALS:
                await this.loadApprovalsData();
                break;
            case this.config.ROUTES.DOCUMENTS:
                await this.loadDocumentsData();
                break;
            case this.config.ROUTES.NOTIFICATIONS:
                await this.loadNotificationsData();
                break;
        }
    }

    async loadDashboardData() {
        try {
            const [stats, recentBAPB, activities] = await Promise.all([
                this.loadDashboardStats(),
                this.loadRecentBAPB(),
                this.loadActivities()
            ]);

            this.updateStatsCards(stats);
            this.updateRecentBAPBTable(recentBAPB);
            this.updateActivitiesList(activities);

        } catch (error) {
            console.error('Error loading dashboard data:', error);
            this.showToast('Gagal memuat data dashboard', 'error');
        }
    }

    async loadDashboardStats() {
        // Mock data
        return {
            total_documents: 156,
            pending_approvals: 23,
            approved_documents: 128,
            rejected_documents: 5
        };
    }

    async loadRecentBAPB() {
        // Mock data
        return [
            { id: "1", nomor_dokumen: "BAPB-2024-001", tanggal_dibuat: "2024-11-21", nama_vendor: "PT Supplier A", status: "pending" },
            { id: "2", nomor_dokumen: "BAPB-2024-002", tanggal_dibuat: "2024-11-20", nama_vendor: "PT Supplier B", status: "approved" },
            { id: "3", nomor_dokumen: "BAPB-2024-003", tanggal_dibuat: "2024-11-19", nama_vendor: "PT Supplier C", status: "approved" }
        ];
    }

    async loadActivities() {
        // Mock data
        return [
            { document_number: "BAPB-2024-001", description: "telah dibuat", type: "document_created", timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString() },
            { document_number: "BAPB-2024-002", description: "telah disetujui", type: "document_approved", timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString() },
            { document_number: "BAPB-2024-003", description: "menunggu verifikasi", type: "approval_required", timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString() }
        ];
    }

    async loadApprovalsData() {
        try {
            const approvals = await this.loadApprovals();
            this.updateApprovalsTable(approvals);
            this.setupApprovalsFilters();
        } catch (error) {
            console.error('Error loading approvals data:', error);
            this.showToast('Gagal memuat data persetujuan', 'error');
        }
    }

    async loadApprovals() {
        // Mock data
        return [
            { id: "1", nomor_dokumen: "BAPB-2024-001", tanggal_dibuat: "2024-11-21", nama_vendor: "PT Supplier A", jumlah_item: 15, status: "pending" },
            { id: "2", nomor_dokumen: "BAPB-2024-002", tanggal_dibuat: "2024-11-20", nama_vendor: "PT Supplier B", jumlah_item: 8, status: "approved" },
            { id: "3", nomor_dokumen: "BAPB-2024-004", tanggal_dibuat: "2024-11-18", nama_vendor: "PT Supplier D", jumlah_item: 22, status: "pending" }
        ];
    }

    async loadDocumentsData() {
        try {
            const documents = await this.loadDocuments();
            this.updateDocumentsStats(documents);
            this.updateDocumentsGrid(documents);
        } catch (error) {
            console.error('Error loading documents data:', error);
            this.showToast('Gagal memuat data dokumen', 'error');
        }
    }

    async loadDocuments() {
        // Mock data
        return [
            { id: "1", nomor_dokumen: "BAPB-2024-001", tanggal_dibuat: "2024-11-21", nama_vendor: "PT Supplier A" },
            { id: "2", nomor_dokumen: "BAPB-2024-002", tanggal_dibuat: "2024-11-20", nama_vendor: "PT Supplier B" },
            { id: "3", nomor_dokumen: "BAPB-2024-003", tanggal_dibuat: "2024-11-19", nama_vendor: "PT Supplier C" }
        ];
    }

    async loadNotificationsData() {
        try {
            const notifications = await this.loadNotifications();
            this.updateNotificationsList(notifications);
        } catch (error) {
            console.error('Error loading notifications:', error);
            this.showToast('Gagal memuat notifikasi', 'error');
        }
    }

    async loadNotifications() {
        // Mock data
        return [
            { id: "1", judul: "BAPB Baru Menunggu Persetujuan", pesan: "BAPB-2024-001 dari PT Supplier A memerlukan persetujuan Anda", tipe: "approval", dibaca: false, timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString() },
            { id: "2", judul: "BAPB Disetujui", pesan: "BAPB-2024-002 telah disetujui oleh Manager", tipe: "system", dibaca: false, timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString() },
            { id: "3", judul: "Pengingat", pesan: "23 BAPB menunggu persetujuan Anda", tipe: "reminder", dibaca: true, timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString() }
        ];
    }

    // Update methods
    updateStatsCards(stats) {
        const statElements = {
            'total': stats.total_documents || 0,
            'pending': stats.pending_approvals || 0,
            'approved': stats.approved_documents || 0,
            'rejected': stats.rejected_documents || 0
        };

        Object.keys(statElements).forEach(stat => {
            const element = document.querySelector(`[data-stat="${stat}"]`);
            if (element) {
                element.textContent = statElements[stat];
            }
        });
    }

    updateRecentBAPBTable(documents) {
        const tableBody = document.getElementById('recent-bapb-table');
        if (!tableBody) return;

        tableBody.innerHTML = documents.map(doc => `
            <tr>
                <td>${doc.nomor_dokumen}</td>
                <td>${this.formatDate(doc.tanggal_dibuat)}</td>
                <td>${doc.nama_vendor}</td>
                <td><span class="status-badge ${doc.status}">${this.getStatusText(doc.status)}</span></td>
            </tr>
        `).join('');
    }

    updateActivitiesList(activities) {
        const activityList = document.getElementById('activity-list');
        if (!activityList) return;

        activityList.innerHTML = activities.map(activity => `
            <div class="activity-item">
                <div class="activity-icon ${this.getActivityIconClass(activity.type)}">${this.getActivityIcon(activity.type)}</div>
                <div class="activity-content">
                    <p><strong>${activity.document_number}</strong> ${activity.description}</p>
                    <span class="activity-time">${this.formatTimeAgo(activity.timestamp)}</span>
                </div>
            </div>
        `).join('');
    }

    updateApprovalsTable(approvals) {
        const tableBody = document.getElementById('approvals-table');
        if (!tableBody) return;

        tableBody.innerHTML = approvals.map(approval => `
            <tr>
                <td>${approval.nomor_dokumen}</td>
                <td>${this.formatDate(approval.tanggal_dibuat)}</td>
                <td>${approval.nama_vendor}</td>
                <td>${approval.jumlah_item} Item</td>
                <td><span class="status-badge ${approval.status}">${this.getStatusText(approval.status)}</span></td>
                <td>
                    <div class="approval-actions">
                        ${approval.status === 'pending' ? `
                            <button class="btn btn-sm btn-success" data-action="approve" data-document-id="${approval.id}">Setujui</button>
                            <button class="btn btn-sm btn-danger" data-action="reject" data-document-id="${approval.id}">Tolak</button>
                        ` : ''}
                        <button class="btn btn-sm btn-secondary" data-action="view" data-document-id="${approval.id}">Detail</button>
                    </div>
                </td>
            </tr>
        `).join('');
    }

    updateDocumentsStats(documents) {
        const totalDocs = documents.length;
        const thisMonth = documents.filter(doc => {
            const docDate = new Date(doc.tanggal_dibuat);
            const now = new Date();
            return docDate.getMonth() === now.getMonth() && docDate.getFullYear() === now.getFullYear();
        }).length;

        const totalElement = document.querySelector('[data-stat="total-documents"]');
        const monthlyElement = document.querySelector('[data-stat="monthly-documents"]');
        
        if (totalElement) totalElement.textContent = totalDocs;
        if (monthlyElement) monthlyElement.textContent = thisMonth;
    }

    updateDocumentsGrid(documents) {
        const documentGrid = document.getElementById('document-grid');
        if (!documentGrid) return;

        documentGrid.innerHTML = documents.map(doc => `
            <div class="document-card">
                <div class="document-icon">📄</div>
                <h3>${doc.nomor_dokumen}.pdf</h3>
                <p>Tanggal: ${this.formatDate(doc.tanggal_dibuat)}</p>
                <p>Vendor: ${doc.nama_vendor}</p>
                <button class="btn btn-sm btn-primary" data-action="download" data-document-id="${doc.id}">Unduh</button>
            </div>
        `).join('');
    }

    updateNotificationsList(notifications) {
        const notificationList = document.getElementById('notification-list');
        if (!notificationList) return;

        notificationList.innerHTML = notifications.map(notif => `
            <div class="notification-item ${notif.dibaca ? '' : 'unread'}" data-action="mark-read" data-notification-id="${notif.id}">
                <div class="notification-icon ${this.getNotificationIconClass(notif.tipe)}">${this.getNotificationIcon(notif.tipe)}</div>
                <div class="notification-content">
                    <h3>${notif.judul}</h3>
                    <p>${notif.pesan}</p>
                    <span class="notification-time">${this.formatTimeAgo(notif.timestamp)}</span>
                </div>
            </div>
        `).join('');
    }

    setupApprovalsFilters() {
        const searchInput = document.getElementById('search-approvals');
        const filterSelect = document.getElementById('filter-approvals');

        if (searchInput) {
            searchInput.addEventListener('input', this.handleSearch.bind(this));
        }

        if (filterSelect) {
            filterSelect.addEventListener('change', this.handleFilter.bind(this));
        }
    }

    // Action handlers
    async handleAction(action, documentId) {
        switch (action) {
            case 'approve':
                await this.approveDocument(documentId);
                break;
            case 'reject':
                await this.rejectDocument(documentId);
                break;
            case 'view':
                this.viewDocument(documentId);
                break;
            case 'download':
                await this.downloadDocument(documentId);
                break;
            case 'mark-read':
                this.markAsRead(documentId);
                break;
        }
    }

    async approveDocument(documentId) {
        try {
            this.showToast('Menyetujui dokumen...', 'info');
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            this.showToast('Dokumen berhasil disetujui', 'success');
            
            // Reload approvals data
            if (this.currentPage === this.config.ROUTES.APPROVALS) {
                await this.loadApprovalsData();
            }
            
        } catch (error) {
            console.error('Error approving document:', error);
            this.showToast('Gagal menyetujui dokumen', 'error');
        }
    }

    async rejectDocument(documentId) {
        try {
            this.showToast('Menolak dokumen...', 'info');
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            this.showToast('Dokumen berhasil ditolak', 'success');
            
            // Reload approvals data
            if (this.currentPage === this.config.ROUTES.APPROVALS) {
                await this.loadApprovalsData();
            }
            
        } catch (error) {
            console.error('Error rejecting document:', error);
            this.showToast('Gagal menolak dokumen', 'error');
        }
    }

    async downloadDocument(documentId) {
        try {
            this.showToast('Memulai unduhan...', 'info');
            // Simulate download
            await new Promise(resolve => setTimeout(resolve, 1000));
            this.showToast('Dokumen berhasil diunduh', 'success');
        } catch (error) {
            console.error('Error downloading document:', error);
            this.showToast('Gagal mengunduh dokumen', 'error');
        }
    }

    viewDocument(documentId) {
        this.showToast(`Membuka detail dokumen ${documentId}`, 'info');
    }

    markAsRead(notificationId) {
        const notification = document.querySelector(`[data-notification-id="${notificationId}"]`);
        if (notification) {
            notification.classList.remove('unread');
            this.showToast('Notifikasi ditandai sudah dibaca', 'success');
        }
    }

    // Utility methods
    handleSearch(e) {
        const searchTerm = e.target.value.toLowerCase();
        const rows = document.querySelectorAll('#approvals-table tr');
        rows.forEach(row => {
            const text = row.textContent.toLowerCase();
            row.style.display = text.includes(searchTerm) ? '' : 'none';
        });
    }

    handleFilter(e) {
        const filterValue = e.target.value;
        const rows = document.querySelectorAll('#approvals-table tr');
        
        rows.forEach(row => {
            const statusBadge = row.querySelector('.status-badge');
            if (statusBadge) {
                const status = statusBadge.textContent.toLowerCase();
                if (filterValue === 'all' || status.includes(filterValue)) {
                    row.style.display = '';
                } else {
                    row.style.display = 'none';
                }
            }
        });
    }

    showLoading() {
        this.isLoading = true;
        document.getElementById('app').classList.add('loading');
    }

    hideLoading() {
        this.isLoading = false;
        document.getElementById('app').classList.remove('loading');
    }

    showError(message) {
        this.showToast(message, 'error');
    }

    showToast(message, type = 'info') {
        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        toast.innerHTML = `
            <div class="toast-content">
                <span class="toast-message">${message}</span>
                <button class="toast-close" onclick="this.parentElement.parentElement.remove()">&times;</button>
            </div>
        `;
        
        document.body.appendChild(toast);
        
        setTimeout(() => {
            if (toast.parentElement) {
                toast.remove();
            }
        }, 4000);
    }

    // Formatting utilities
    formatDate(dateString) {
        try {
            const options = { day: 'numeric', month: 'short', year: 'numeric' };
            return new Date(dateString).toLocaleDateString('id-ID', options);
        } catch (error) {
            return dateString;
        }
    }

    formatTimeAgo(timestamp) {
        try {
            const now = new Date();
            const time = new Date(timestamp);
            const diffInSeconds = Math.floor((now - time) / 1000);

            if (diffInSeconds < 60) return 'baru saja';
            if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} menit yang lalu`;
            if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} jam yang lalu`;
            return `${Math.floor(diffInSeconds / 86400)} hari yang lalu`;
        } catch (error) {
            return 'beberapa waktu lalu';
        }
    }

    getStatusText(status) {
        const statusMap = {
            'pending': 'Pending',
            'approved': 'Disetujui',
            'rejected': 'Ditolak',
            'draft': 'Draft'
        };
        return statusMap[status] || status;
    }

    getActivityIcon(type) {
        const iconMap = {
            'document_created': '📝',
            'document_approved': '✅',
            'document_rejected': '❌',
            'approval_required': '⏳'
        };
        return iconMap[type] || '📋';
    }

    getActivityIconClass(type) {
        const classMap = {
            'document_created': 'blue',
            'document_approved': 'green',
            'document_rejected': 'red',
            'approval_required': 'yellow'
        };
        return classMap[type] || 'blue';
    }

    getNotificationIcon(type) {
        const iconMap = {
            'approval': '📦',
            'reminder': '⏰',
            'system': '🔔',
            'update': '🔄'
        };
        return iconMap[type] || '🔔';
    }

    getNotificationIconClass(type) {
        const classMap = {
            'approval': 'blue',
            'reminder': 'yellow',
            'system': 'green',
            'update': 'purple'
        };
        return classMap[type] || 'blue';
    }

    redirectToLogin() {
        window.location.href = '/src/scripts/pages/login/login.html';
    }

    logout() {
        localStorage.removeItem(this.config.STORAGE_KEYS.USER_DATA);
        localStorage.removeItem(this.config.STORAGE_KEYS.AUTH_TOKEN);
        this.redirectToLogin();
    }
}

// Initialize SPA when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.picDashboard = new PicGudangSPA();
});
