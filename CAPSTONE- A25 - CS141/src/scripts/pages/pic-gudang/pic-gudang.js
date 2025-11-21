class PicGudangDashboard {
    constructor() {
        this.currentUser = null;
        this.config = window.APP_CONFIG || {
            API_BASE_URL: 'http://localhost:8000/api',
            STORAGE_KEYS: {
                USER_DATA: 'user_data',
                AUTH_TOKEN: 'auth_token'
            }
        };
        this.init();
    }

    async init() {
        await this.checkAuth();
        this.initializeDashboard();
        this.loadDashboardData();
        this.setupEventListeners();
    }

    async checkAuth() {
        this.currentUser = this.getCurrentUser();
        if (!this.currentUser || this.currentUser.role !== 'pic_gudang') {
            window.location.href = '/src/scripts/pages/login/login.html';
            return;
        }
        this.updateUserInfo();
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

    updateUserInfo() {
        const userElements = document.querySelectorAll('.user-name');
        userElements.forEach(element => {
            element.textContent = this.currentUser?.nama || 'PIC Gudang';
        });

        const roleElements = document.querySelectorAll('.user-role');
        roleElements.forEach(element => {
            element.textContent = this.currentUser?.role_display || 'PIC Gudang';
        });
    }

    initializeDashboard() {
        this.initDashboardNav();
    }

    initDashboardNav() {
        const navItems = document.querySelectorAll('.nav-item');
        const pages = document.querySelectorAll('.page-content');

        navItems.forEach((item) => {
            item.addEventListener('click', (e) => {
                e.preventDefault();
                this.switchPage(item, navItems, pages);
            });
        });

        // Set initial active page based on URL hash
        const hash = window.location.hash.substring(1) || 'dashboard';
        const initialNavItem = document.querySelector(`[data-page="${hash}"]`);
        if (initialNavItem) {
            this.switchPage(initialNavItem, navItems, pages);
        }
    }

    switchPage(clickedItem, navItems, pages) {
        const targetPage = clickedItem.getAttribute('data-page');

        // Update URL hash
        window.location.hash = targetPage;

        // Update navigation
        navItems.forEach((nav) => nav.classList.remove('active'));
        clickedItem.classList.add('active');

        // Update page content
        pages.forEach((page) => page.classList.remove('active'));
        
        const targetElement = document.getElementById(`${targetPage}-page`);
        if (targetElement) {
            targetElement.classList.add('active');
            this.loadPageData(targetPage);
        }
    }

    async loadPageData(page) {
        switch(page) {
            case 'dashboard':
                await this.loadDashboardStats();
                break;
            case 'approvals':
                await this.loadApprovalsData();
                break;
            case 'documents':
                await this.loadDocumentsData();
                break;
            case 'notifications':
                await this.loadNotificationsData();
                break;
        }
    }

    async loadDashboardData() {
        try {
            await Promise.all([
                this.loadDashboardStats(),
                this.loadRecentBAPB(),
                this.loadActivities()
            ]);
        } catch (error) {
            console.error('Error loading dashboard data:', error);
            this.showToast('Gagal memuat data dashboard', 'error');
        }
    }

    async loadDashboardStats() {
        try {
            // Gunakan mock data untuk sementara
            const mockStats = {
                total_documents: 156,
                pending_approvals: 23,
                approved_documents: 128,
                rejected_documents: 5
            };
            
            this.updateStatsCards(mockStats);
        } catch (error) {
            console.error('Error loading stats:', error);
            // Fallback ke mock data
            const mockStats = {
                total_documents: 156,
                pending_approvals: 23,
                approved_documents: 128,
                rejected_documents: 5
            };
            this.updateStatsCards(mockStats);
        }
    }

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

    async loadRecentBAPB() {
        try {
            // Mock data untuk sementara
            const mockDocuments = [
                { id: "1", nomor_dokumen: "BAPB-2024-001", tanggal_dibuat: "2024-11-21", nama_vendor: "PT Supplier A", status: "pending" },
                { id: "2", nomor_dokumen: "BAPB-2024-002", tanggal_dibuat: "2024-11-20", nama_vendor: "PT Supplier B", status: "approved" },
                { id: "3", nomor_dokumen: "BAPB-2024-003", tanggal_dibuat: "2024-11-19", nama_vendor: "PT Supplier C", status: "approved" },
                { id: "4", nomor_dokumen: "BAPB-2024-004", tanggal_dibuat: "2024-11-18", nama_vendor: "PT Supplier D", status: "pending" },
                { id: "5", nomor_dokumen: "BAPB-2024-005", tanggal_dibuat: "2024-11-17", nama_vendor: "PT Supplier E", status: "rejected" }
            ];
            
            this.updateRecentBAPBTable(mockDocuments);
        } catch (error) {
            console.error('Error loading recent BAPB:', error);
        }
    }

    updateRecentBAPBTable(documents) {
        const tableBody = document.querySelector('#dashboard-page table tbody');
        if (!tableBody) return;

        if (documents.length === 0) {
            tableBody.innerHTML = `
                <tr>
                    <td colspan="4" class="text-center">Tidak ada data BAPB</td>
                </tr>
            `;
            return;
        }

        tableBody.innerHTML = documents.map(doc => `
            <tr>
                <td>${doc.nomor_dokumen}</td>
                <td>${this.formatDate(doc.tanggal_dibuat)}</td>
                <td>${doc.nama_vendor}</td>
                <td><span class="status-badge ${doc.status}">${this.getStatusText(doc.status)}</span></td>
            </tr>
        `).join('');
    }

    async loadActivities() {
        try {
            // Mock data untuk sementara
            const mockActivities = [
                { document_number: "BAPB-2024-001", description: "telah dibuat", type: "document_created", timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString() },
                { document_number: "BAPB-2024-002", description: "telah disetujui", type: "document_approved", timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString() },
                { document_number: "BAPB-2024-003", description: "menunggu verifikasi", type: "approval_required", timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString() },
                { document_number: "BAPB-2024-004", description: "perlu pengecekan ulang", type: "document_created", timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString() },
                { document_number: "BAPB-2024-005", description: "ditolak oleh sistem", type: "document_rejected", timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString() }
            ];
            
            this.updateActivitiesList(mockActivities);
        } catch (error) {
            console.error('Error loading activities:', error);
        }
    }

    updateActivitiesList(activities) {
        const activityList = document.querySelector('.activity-list');
        if (!activityList) return;

        if (activities.length === 0) {
            activityList.innerHTML = `
                <div class="activity-item">
                    <div class="activity-icon blue">📋</div>
                    <div class="activity-content">
                        <p>Tidak ada aktivitas terbaru</p>
                        <span class="activity-time">-</span>
                    </div>
                </div>
            `;
            return;
        }

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

    async loadApprovalsData() {
        try {
            // Mock data untuk sementara
            const mockApprovals = [
                { id: "1", nomor_dokumen: "BAPB-2024-001", tanggal_dibuat: "2024-11-21", nama_vendor: "PT Supplier A", jumlah_item: 15, status: "pending" },
                { id: "2", nomor_dokumen: "BAPB-2024-002", tanggal_dibuat: "2024-11-20", nama_vendor: "PT Supplier B", jumlah_item: 8, status: "approved" },
                { id: "3", nomor_dokumen: "BAPB-2024-004", tanggal_dibuat: "2024-11-18", nama_vendor: "PT Supplier D", jumlah_item: 22, status: "pending" },
                { id: "4", nomor_dokumen: "BAPB-2024-006", tanggal_dibuat: "2024-11-16", nama_vendor: "PT Supplier F", jumlah_item: 7, status: "pending" }
            ];
            
            this.updateApprovalsTable(mockApprovals);
        } catch (error) {
            console.error('Error loading approvals data:', error);
        }
    }

    updateApprovalsTable(approvals) {
        const tableBody = document.querySelector('#approvals-page table tbody');
        if (!tableBody) return;

        if (approvals.length === 0) {
            tableBody.innerHTML = `
                <tr>
                    <td colspan="6" class="text-center">Tidak ada dokumen menunggu persetujuan</td>
                </tr>
            `;
            return;
        }

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
                            <button class="btn btn-sm btn-success" onclick="picDashboard.approveDocument('${approval.id}')">Setujui</button>
                            <button class="btn btn-sm btn-danger" onclick="picDashboard.rejectDocument('${approval.id}')">Tolak</button>
                        ` : ''}
                        <button class="btn btn-sm btn-secondary" onclick="picDashboard.viewDocument('${approval.id}')">Detail</button>
                    </div>
                </td>
            </tr>
        `).join('');
    }

    async loadDocumentsData() {
        try {
            // Mock data untuk sementara
            const mockDocuments = [
                { id: "1", nomor_dokumen: "BAPB-2024-001", tanggal_dibuat: "2024-11-21", nama_vendor: "PT Supplier A" },
                { id: "2", nomor_dokumen: "BAPB-2024-002", tanggal_dibuat: "2024-11-20", nama_vendor: "PT Supplier B" },
                { id: "3", nomor_dokumen: "BAPB-2024-003", tanggal_dibuat: "2024-11-19", nama_vendor: "PT Supplier C" },
                { id: "4", nomor_dokumen: "BAPB-2024-004", tanggal_dibuat: "2024-11-18", nama_vendor: "PT Supplier D" },
                { id: "5", nomor_dokumen: "BAPB-2024-005", tanggal_dibuat: "2024-11-17", nama_vendor: "PT Supplier E" },
                { id: "6", nomor_dokumen: "BAPB-2024-006", tanggal_dibuat: "2024-11-16", nama_vendor: "PT Supplier F" }
            ];
            
            this.updateDocumentsGrid(mockDocuments);
            this.updateDocumentsStats(mockDocuments);
        } catch (error) {
            console.error('Error loading documents data:', error);
        }
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
        const documentGrid = document.querySelector('.document-grid');
        if (!documentGrid) return;

        if (documents.length === 0) {
            documentGrid.innerHTML = `
                <div class="document-card">
                    <div class="document-icon">📄</div>
                    <h3>Tidak ada dokumen</h3>
                    <p>Belum ada dokumen yang tersedia</p>
                    <button class="btn btn-sm btn-primary" disabled>Unduh</button>
                </div>
            `;
            return;
        }

        documentGrid.innerHTML = documents.map(doc => `
            <div class="document-card">
                <div class="document-icon">📄</div>
                <h3>${doc.nomor_dokumen}.pdf</h3>
                <p>Tanggal: ${this.formatDate(doc.tanggal_dibuat)}</p>
                <p>Vendor: ${doc.nama_vendor}</p>
                <button class="btn btn-sm btn-primary" onclick="picDashboard.downloadDocument('${doc.id}')">Unduh</button>
            </div>
        `).join('');
    }

    async loadNotificationsData() {
        try {
            // Mock data untuk sementara
            const mockNotifications = [
                { id: "1", judul: "BAPB Baru Menunggu Persetujuan", pesan: "BAPB-2024-001 dari PT Supplier A memerlukan persetujuan Anda", tipe: "approval", dibaca: false, timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString() },
                { id: "2", judul: "BAPB Disetujui", pesan: "BAPB-2024-002 telah disetujui oleh Manager", tipe: "system", dibaca: false, timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString() },
                { id: "3", judul: "Pengingat", pesan: "23 BAPB menunggu persetujuan Anda", tipe: "reminder", dibaca: true, timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString() },
                { id: "4", judul: "Update Sistem", pesan: "Sistem akan maintenance pada pukul 00:00 - 02:00", tipe: "system", dibaca: true, timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString() }
            ];
            
            this.updateNotificationsList(mockNotifications);
        } catch (error) {
            console.error('Error loading notifications:', error);
        }
    }

    updateNotificationsList(notifications) {
        const notificationList = document.querySelector('.notification-list');
        if (!notificationList) return;

        if (notifications.length === 0) {
            notificationList.innerHTML = `
                <div class="notification-item">
                    <div class="notification-icon blue">🔔</div>
                    <div class="notification-content">
                        <h3>Tidak ada notifikasi</h3>
                        <p>Semua notifikasi sudah dibaca</p>
                        <span class="notification-time">-</span>
                    </div>
                </div>
            `;
            return;
        }

        notificationList.innerHTML = notifications.map(notif => `
            <div class="notification-item ${notif.dibaca ? '' : 'unread'}" onclick="picDashboard.markAsRead('${notif.id}')">
                <div class="notification-icon ${this.getNotificationIconClass(notif.tipe)}">${this.getNotificationIcon(notif.tipe)}</div>
                <div class="notification-content">
                    <h3>${notif.judul}</h3>
                    <p>${notif.pesan}</p>
                    <span class="notification-time">${this.formatTimeAgo(notif.timestamp)}</span>
                </div>
            </div>
        `).join('');

        // Update badge count
        const unreadCount = notifications.filter(n => !n.dibaca).length;
        const badge = document.querySelector('.nav-item[data-page="notifications"] .badge');
        if (badge) {
            badge.textContent = unreadCount;
            badge.style.display = unreadCount > 0 ? 'flex' : 'none';
        }
    }

    // Action Methods
    async approveDocument(documentId) {
        try {
            console.log('Approving document:', documentId);
            this.showToast('Dokumen berhasil disetujui', 'success');
            
            // Update UI immediately
            const row = document.querySelector(`button[onclick="picDashboard.approveDocument('${documentId}')"]`)?.closest('tr');
            if (row) {
                const statusCell = row.querySelector('.status-badge');
                if (statusCell) {
                    statusCell.className = 'status-badge approved';
                    statusCell.textContent = 'Disetujui';
                }
                
                // Remove action buttons
                const actionCell = row.querySelector('td:last-child');
                if (actionCell) {
                    actionCell.innerHTML = '<button class="btn btn-sm btn-secondary" onclick="picDashboard.viewDocument(\'' + documentId + '\')">Detail</button>';
                }
            }
            
            // Reload data
            await this.loadDashboardStats();
        } catch (error) {
            console.error('Error approving document:', error);
            this.showToast('Gagal menyetujui dokumen', 'error');
        }
    }

    async rejectDocument(documentId) {
        try {
            console.log('Rejecting document:', documentId);
            this.showToast('Dokumen berhasil ditolak', 'success');
            
            // Update UI immediately
            const row = document.querySelector(`button[onclick="picDashboard.rejectDocument('${documentId}')"]`)?.closest('tr');
            if (row) {
                const statusCell = row.querySelector('.status-badge');
                if (statusCell) {
                    statusCell.className = 'status-badge rejected';
                    statusCell.textContent = 'Ditolak';
                }
                
                // Remove action buttons
                const actionCell = row.querySelector('td:last-child');
                if (actionCell) {
                    actionCell.innerHTML = '<button class="btn btn-sm btn-secondary" onclick="picDashboard.viewDocument(\'' + documentId + '\')">Detail</button>';
                }
            }
            
            // Reload data
            await this.loadDashboardStats();
        } catch (error) {
            console.error('Error rejecting document:', error);
            this.showToast('Gagal menolak dokumen', 'error');
        }
    }

    async downloadDocument(documentId) {
        try {
            console.log('Downloading document:', documentId);
            this.showToast('Memulai unduhan dokumen', 'info');
            
            // Simulate download
            setTimeout(() => {
                this.showToast('Dokumen berhasil diunduh', 'success');
            }, 1000);
        } catch (error) {
            console.error('Error downloading document:', error);
            this.showToast('Gagal mengunduh dokumen', 'error');
        }
    }

    viewDocument(documentId) {
        console.log('Viewing document:', documentId);
        this.showToast('Membuka detail dokumen', 'info');
        // Here you can open a modal or redirect to detail page
    }

    markAsRead(notificationId) {
        console.log('Marking notification as read:', notificationId);
        const notification = document.querySelector(`.notification-item[onclick="picDashboard.markAsRead('${notificationId}')"]`);
        if (notification) {
            notification.classList.remove('unread');
            this.showToast('Notifikasi ditandai sudah dibaca', 'success');
        }
    }

    // Utility Methods
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
            if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 86400)} hari yang lalu`;
            return `${Math.floor(diffInSeconds / 2592000)} bulan yang lalu`;
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

    showToast(message, type = 'info') {
        // Create simple toast notification
        const toast = document.createElement('div');
        toast.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 12px 20px;
            border-radius: 8px;
            color: white;
            z-index: 10000;
            background: ${type === 'error' ? '#dc2626' : type === 'success' ? '#16a34a' : '#2563eb'};
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
            font-size: 14px;
            font-weight: 500;
        `;
        toast.textContent = message;
        
        document.body.appendChild(toast);
        
        // Remove toast after 3 seconds
        setTimeout(() => {
            if (toast.parentNode) {
                toast.parentNode.removeChild(toast);
            }
        }, 3000);
    }

    setupEventListeners() {
        // Search functionality
        const searchInput = document.querySelector('.search-input');
        if (searchInput) {
            searchInput.addEventListener('input', this.handleSearch.bind(this));
        }

        // Filter functionality
        const filterSelect = document.querySelector('.filter-select');
        if (filterSelect) {
            filterSelect.addEventListener('change', this.handleFilter.bind(this));
        }

        // Real-time updates
        this.setupRealTimeUpdates();
    }

    handleSearch(e) {
        const searchTerm = e.target.value.toLowerCase();
        console.log('Searching for:', searchTerm);
        
        // Implement search logic here
        const rows = document.querySelectorAll('#approvals-page table tbody tr');
        rows.forEach(row => {
            const text = row.textContent.toLowerCase();
            row.style.display = text.includes(searchTerm) ? '' : 'none';
        });
    }

    handleFilter(e) {
        const filterValue = e.target.value.toLowerCase();
        console.log('Filtering by:', filterValue);
        
        // Implement filter logic here
        const rows = document.querySelectorAll('#approvals-page table tbody tr');
        rows.forEach(row => {
            const statusBadge = row.querySelector('.status-badge');
            if (statusBadge) {
                const status = statusBadge.textContent.toLowerCase();
                if (filterValue === 'semua status' || status.includes(filterValue)) {
                    row.style.display = '';
                } else {
                    row.style.display = 'none';
                }
            }
        });
    }

    setupRealTimeUpdates() {
        // Setup polling for real-time updates
        setInterval(() => {
            this.loadDashboardStats();
            this.loadNotificationsData();
        }, 30000); // Update every 30 seconds
    }

    logout() {
        localStorage.removeItem(this.config.STORAGE_KEYS.USER_DATA);
        localStorage.removeItem(this.config.STORAGE_KEYS.AUTH_TOKEN);
        window.location.href = '/src/scripts/pages/login/login.html';
    }
}

// Initialize dashboard when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.picDashboard = new PicGudangDashboard();
});
