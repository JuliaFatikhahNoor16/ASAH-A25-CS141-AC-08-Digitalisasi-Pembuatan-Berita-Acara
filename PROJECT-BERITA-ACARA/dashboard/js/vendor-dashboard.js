import { loadHeader } from '../../src/scripts/components/header-component.js';
import { loadSidebar } from '../../src/scripts/components/sidebar-component.js';
import documentsAPI from '../../src/scripts/data/api/documents-api.js';
 
class VendorDashboard {
    constructor() {
        this.documents = [];
        this.filteredDocuments = [];
        this.currentFilter = 'all';
        this.notifications = [];
        this.userId = 'vendor_001'; // TODO: Get from auth
        this.init();
    }

    async init() {
        try {
            await this.loadComponents();
            await this.loadData();
            this.setupEventListeners();
            this.render();
            this.startNotificationPolling();
        } catch (error) {
            console.error('Error initializing dashboard:', error);
            this.showError('Gagal memuat dashboard');
        }
    }

    async loadComponents() {
        try {
            // Load header and sidebar components
            await loadHeader('vendor');
            await loadSidebar('vendor');
            
            console.log('Components loaded successfully');
        } catch (error) {
            console.error('Error loading components:', error);
            throw error;
        }
    }

    async loadData() {
        try {
            // Load documents
            await this.loadDocuments();
            
            // Load notifications
            await this.loadNotifications();
        } catch (error) {
            console.error('Error loading data:', error);
            throw error;
        }
    }

    async loadDocuments() {
        try {
            const response = await documentsAPI.getDocuments({
                vendorId: this.userId
            });

            if (response.success) {
                this.documents = response.data;
                this.filteredDocuments = [...this.documents];
                console.log('Documents loaded:', this.documents.length);
            } else {
                throw new Error(response.error);
            }
        } catch (error) {
            console.error('Error loading documents:', error);
            this.showError('Gagal memuat dokumen');
        }
    }

    async loadNotifications() {
        try {
            const response = await notificationsAPI.getNotifications(this.userId, {
                isRead: false
            });

            if (response.success) {
                this.notifications = response.data;
                this.updateNotificationBadge(response.unreadCount);
            }
        } catch (error) {
            console.error('Error loading notifications:', error);
        }
    }

    setupEventListeners() {
        // Stats cards filter
        document.querySelectorAll('.stat-card').forEach(card => {
            card.addEventListener('click', (e) => {
                const status = e.currentTarget.dataset.status;
                this.filterDocuments(status);
            });

            // Keyboard accessibility
            card.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    const status = e.currentTarget.dataset.status;
                    this.filterDocuments(status);
                }
            });
        });

        // Create BA button
        const createBtn = document.getElementById('create-ba-btn');
        if (createBtn) {
            createBtn.addEventListener('click', () => {
                this.showCreateBAOptions();
            });
        }

        // Listen to header search event
        document.addEventListener('headerSearch', (e) => {
            this.handleSearch(e.detail.query);
        });

        // Listen to new notification events
        window.addEventListener('newNotification', (e) => {
            this.handleNewNotification(e.detail);
        });

        // Refresh button (optional)
        this.setupRefreshHandler();
    }

    filterDocuments(status) {
        this.currentFilter = status;
        
        if (status === 'all') {
            this.filteredDocuments = [...this.documents];
        } else {
            this.filteredDocuments = this.documents.filter(doc => doc.status === status);
        }
        
        this.renderDocuments();
        this.updateActiveFilter(status);
    }

    handleSearch(query) {
        const searchTerm = query.toLowerCase().trim();
        
        if (!searchTerm) {
            this.filteredDocuments = this.currentFilter === 'all' 
                ? [...this.documents]
                : this.documents.filter(doc => doc.status === this.currentFilter);
        } else {
            let baseDocuments = this.currentFilter === 'all'
                ? [...this.documents]
                : this.documents.filter(doc => doc.status === this.currentFilter);

            this.filteredDocuments = baseDocuments.filter(doc => 
                doc.documentNo.toLowerCase().includes(searchTerm) ||
                doc.type.toLowerCase().includes(searchTerm) ||
                doc.description.toLowerCase().includes(searchTerm)
            );
        }
        
        this.renderDocuments();
    }

    updateActiveFilter(status) {
        document.querySelectorAll('.stat-card').forEach(card => {
            card.classList.toggle('active', card.dataset.status === status);
        });
    }

    renderDocuments() {
        const tbody = document.getElementById('documents-tbody');
        if (!tbody) return;

        if (this.filteredDocuments.length === 0) {
            tbody.innerHTML = this.getEmptyStateHTML();
            return;
        }

        tbody.innerHTML = this.filteredDocuments.map(doc => `
            <tr data-doc-id="${doc.id}" role="row">
                <td role="cell">
                    <div class="document-number">${doc.documentNo}</div>
                </td>
                <td role="cell">
                    <span class="document-badge ${doc.type.toLowerCase()}">
                        ${doc.type}
                    </span>
                </td>
                <td role="cell">${this.formatDate(doc.createdAt)}</td>
                <td role="cell">
                    <span class="status-badge ${this.getStatusClass(doc.status)}">
                        ${this.getStatusText(doc.status)}
                    </span>
                </td>
                <td role="cell">
                    <div class="action-buttons">
                        <button 
                            class="btn-view" 
                            onclick="vendorDashboard.viewDocument('${doc.id}')"
                            aria-label="Lihat detail ${doc.documentNo}"
                        >
                            Lihat
                        </button>
                        ${doc.status === 'draft' ? `
                        <button 
                            class="btn-edit" 
                            onclick="vendorDashboard.editDocument('${doc.id}')"
                            aria-label="Edit ${doc.documentNo}"
                        >
                            Edit
                        </button>
                        ` : ''}
                    </div>
                </td>
            </tr>
        `).join('');
    }

    getStatusClass(status) {
        const statusMap = {
            'draft': 'badge-draft',
            'pending': 'badge-pending',
            'approved': 'badge-approved',
            'rejected': 'badge-rejected'
        };
        return statusMap[status] || 'badge-draft';
    }

    getStatusText(status) {
        const statusMap = {
            'draft': 'Draft',
            'pending': 'Pending PIC',
            'approved': 'Disetujui',
            'rejected': 'Ditolak'
        };
        return statusMap[status] || status;
    }

    getEmptyStateHTML() {
        return `
            <tr>
                <td colspan="5" class="empty-state">
                    <div class="empty-state-content">
                        <p>Tidak ada dokumen ditemukan</p>
                        ${this.currentFilter !== 'all' ? 
                            '<button class="btn-clear-filter" onclick="vendorDashboard.clearFilters()">Tampilkan semua dokumen</button>' : 
                            ''
                        }
                    </div>
                </td>
            </tr>
        `;
    }

    formatDate(dateString) {
        return new Date(dateString).toLocaleDateString('id-ID', {
            day: 'numeric',
            month: 'short',
            year: 'numeric'
        });
    }

    showCreateBAOptions() {
        // Show modal or dropdown to choose BAPB or BAPP
        const choice = confirm('Pilih jenis Berita Acara:\n\nOK = BAPB (Barang)\nCancel = BAPP (Pekerjaan)');
        
        if (choice) {
            window.location.href = '../forms/buat-bapb.html';
        } else {
            window.location.href = '../forms/buat-bapp.html';
        }
    }

    viewDocument(docId) {
        console.log('View document:', docId);
        // TODO: Navigate to document detail page
        window.location.href = `../dashboard/document-detail.html?id=${docId}`;
    }

    editDocument(docId) {
        console.log('Edit document:', docId);
        const doc = this.documents.find(d => d.id === docId);
        if (!doc) return;

        // Navigate to appropriate edit page
        if (doc.type === 'BAPB') {
            window.location.href = `../forms/edit-bapb.html?id=${docId}`;
        } else {
            window.location.href = `../forms/edit-bapp.html?id=${docId}`;
        }
    }

    clearFilters() {
        this.currentFilter = 'all';
        this.filteredDocuments = [...this.documents];
        this.renderDocuments();
        this.updateActiveFilter('all');
    }

    updateNotificationBadge(count) {
        const badge = document.querySelector('.notification-badge');
        if (badge) {
            badge.textContent = count;
            badge.style.display = count > 0 ? 'block' : 'none';
        }
    }

    handleNewNotification(notification) {
        this.notifications.unshift(notification);
        this.updateNotificationBadge(this.notifications.length);
        
        // Show toast notification (optional)
        this.showToast(notification.title, notification.message);
    }

    showToast(title, message) {
        // Simple toast notification
        console.log(`[NOTIFICATION] ${title}: ${message}`);
        
        // TODO: Implement proper toast UI
        // For now, just log to console
    }

    startNotificationPolling() {
        // Poll for new notifications every 30 seconds
        setInterval(async () => {
            await this.loadNotifications();
        }, 30000);
    }

    setupRefreshHandler() {
        // Add keyboard shortcut for refresh (Ctrl+R or F5 is already browser default)
        // Optional: Add manual refresh button
        document.addEventListener('keydown', (e) => {
            if ((e.ctrlKey || e.metaKey) && e.key === 'r') {
                e.preventDefault();
                this.refresh();
            }
        });
    }

    async refresh() {
        try {
            await this.loadData();
            this.render();
            this.showToast('Berhasil', 'Data berhasil direfresh');
        } catch (error) {
            this.showError('Gagal refresh data');
        }
    }

    showError(message) {
        console.error('Error:', message);
        alert(message); // TODO: Replace with better UI
    }

    render() {
        this.renderDocuments();
        this.updateStats();
    }

    updateStats() {
        const draftCount = this.documents.filter(d => d.status === 'draft').length;
        const pendingCount = this.documents.filter(d => d.status === 'pending').length;
        const approvedCount = this.documents.filter(d => d.status === 'approved').length;

        const draftEl = document.getElementById('draft-count');
        const pendingEl = document.getElementById('pending-count');
        const approvedEl = document.getElementById('approved-count');

        if (draftEl) draftEl.textContent = draftCount;
        if (pendingEl) pendingEl.textContent = pendingCount;
        if (approvedEl) approvedEl.textContent = approvedCount;

        // Update welcome message
        const highlightEl = document.querySelector('.welcome-subtitle .highlight');
        if (highlightEl) {
            highlightEl.textContent = `${pendingCount} dokumen`;
        }
    }
}

// Initialize dashboard when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.vendorDashboard = new VendorDashboard();
});

export default VendorDashboard;