import { loadHeader } from '../../src/scripts/components/header-component.js';
import { loadSidebar } from '../../src/scripts/components/sidebar-component.js';
import documentsAPI from '../../src/scripts/data/api/documents-api.js';
import notificationsAPI from '../../src/scripts/data/api/notifications-api.js';

class DireksiDashboard {
    constructor() {
        this.documents = [];
        this.filteredDocuments = [];
        this.currentFilter = 'all'; // all, bapb, bapp, signed
        this.notifications = [];
        this.userId = 'direksi_001'; // TODO: Get from auth
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
            console.error('Error initializing Direksi dashboard:', error);
            this.showError('Gagal memuat dashboard');
        }
    }

    async loadComponents() {
        try {
            // Load header and sidebar with 'direksi' role
            await loadHeader('direksi');
            await loadSidebar('direksi');
            
            console.log('Direksi Components loaded successfully');
        } catch (error) {
            console.error('Error loading components:', error);
            throw error;
        }
    }

    async loadData() {
        try {
            // Load documents that need digital signature
            await this.loadPendingSignatures();
            
            // Load notifications
            await this.loadNotifications();
        } catch (error) {
            console.error('Error loading data:', error);
            throw error;
        }
    }

    async loadPendingSignatures() {
        try {
            // Get BAPP documents that need Direksi signature
            const response = await documentsAPI.getDocuments({
                type: 'BAPP',
                status: 'approved_by_pic', // Approved by PIC, waiting for Direksi signature
                needsSignature: true
            });

            if (response.success) {
                this.documents = response.data;
                this.filteredDocuments = [...this.documents];
                console.log('Pending signatures loaded:', this.documents.length);
            } else {
                throw new Error(response.error);
            }
        } catch (error) {
            console.error('Error loading pending signatures:', error);
            this.showError('Gagal memuat dokumen pending');
            
            // Use mock data for development
            this.documents = this.getMockDocuments();
            this.filteredDocuments = [...this.documents];
        }
    }

    getMockDocuments() {
        return [
            {
                id: 'doc_001',
                documentNo: 'BAPP-2024-001',
                type: 'BAPP',
                vendor: 'PT. Karya Mandiri',
                vendorId: 'vendor_003',
                picName: 'Ahmad Wirawan',
                picId: 'pic_001',
                createdAt: '2024-03-15T10:30:00',
                approvedAt: '2024-03-15T14:00:00',
                status: 'approved_by_pic',
                workDescription: 'Instalasi Jaringan Gedung A',
                totalValue: 25000000,
                needsSignature: true
            },
            {
                id: 'doc_002',
                documentNo: 'BAPP-2024-002',
                type: 'BAPP',
                vendor: 'PT. Build Construction',
                vendorId: 'vendor_004',
                picName: 'Ahmad Wirawan',
                picId: 'pic_001',
                createdAt: '2024-03-14T09:00:00',
                approvedAt: '2024-03-14T16:00:00',
                status: 'approved_by_pic',
                workDescription: 'Renovasi Gedung Kantor',
                totalValue: 150000000,
                needsSignature: true
            },
            {
                id: 'doc_003',
                documentNo: 'BAPP-2024-003',
                type: 'BAPP',
                vendor: 'PT. Sukses Mandiri',
                vendorId: 'vendor_002',
                picName: 'Ahmad Wirawan',
                picId: 'pic_001',
                createdAt: '2024-03-13T11:30:00',
                approvedAt: '2024-03-13T17:00:00',
                status: 'approved_by_pic',
                workDescription: 'Pengadaan Sistem IT',
                totalValue: 75000000,
                needsSignature: true
            },
            {
                id: 'doc_004',
                documentNo: 'BAPP-2024-004',
                type: 'BAPP',
                vendor: 'CV. Teknologi Maju',
                vendorId: 'vendor_005',
                picName: 'Ahmad Wirawan',
                picId: 'pic_001',
                createdAt: '2024-03-12T08:45:00',
                approvedAt: '2024-03-12T15:30:00',
                status: 'approved_by_pic',
                workDescription: 'Maintenance Server Tahunan',
                totalValue: 45000000,
                needsSignature: true
            },
            {
                id: 'doc_005',
                documentNo: 'BAPP-2024-005',
                type: 'BAPP',
                vendor: 'PT. Infrastruktur Prima',
                vendorId: 'vendor_006',
                picName: 'Ahmad Wirawan',
                picId: 'pic_001',
                createdAt: '2024-03-11T13:20:00',
                approvedAt: '2024-03-11T18:00:00',
                status: 'approved_by_pic',
                workDescription: 'Upgrade Network Infrastructure',
                totalValue: 95000000,
                needsSignature: true
            },
            {
                id: 'doc_006',
                documentNo: 'BAPP-2024-006',
                type: 'BAPP',
                vendor: 'PT. Digital Solutions',
                vendorId: 'vendor_007',
                picName: 'Ahmad Wirawan',
                picId: 'pic_001',
                createdAt: '2024-03-10T10:00:00',
                approvedAt: '2024-03-10T16:45:00',
                status: 'approved_by_pic',
                workDescription: 'Implementasi ERP System',
                totalValue: 200000000,
                needsSignature: true
            }
        ];
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
        // Listen to header search event
        document.addEventListener('headerSearch', (e) => {
            this.handleSearch(e.detail.query);
        });

        // Refresh handler
        this.setupRefreshHandler();
    }

    handleSearch(query) {
        const searchTerm = query.toLowerCase().trim();
        
        if (!searchTerm) {
            this.filteredDocuments = [...this.documents];
        } else {
            this.filteredDocuments = this.documents.filter(doc => 
                doc.documentNo.toLowerCase().includes(searchTerm) ||
                doc.vendor.toLowerCase().includes(searchTerm) ||
                doc.workDescription.toLowerCase().includes(searchTerm) ||
                doc.picName.toLowerCase().includes(searchTerm)
            );
        }
        
        this.renderDocuments();
    }

    renderDocuments() {
        const container = document.querySelector('.ttd-documents');
        if (!container) return;

        if (this.filteredDocuments.length === 0) {
            container.innerHTML = this.getEmptyStateHTML();
            return;
        }

        container.innerHTML = this.filteredDocuments.map(doc => `
            <div class="ttd-card" data-doc-id="${doc.id}">
                <div class="ttd-header">
                    <div class="ttd-badge-container">
                        <h3>${doc.documentNo}</h3>
                        <span class="doc-badge bapp-badge">${doc.type}</span>
                    </div>
                    <span class="ttd-date">${this.formatDate(doc.approvedAt)}</span>
                </div>
                
                <div class="ttd-info">
                    <div class="info-row">
                        <span class="info-label">🏢 Vendor:</span>
                        <span class="info-value">${doc.vendor}</span>
                    </div>
                    <div class="info-row">
                        <span class="info-label">👤 PIC Gudang:</span>
                        <span class="info-value">${doc.picName}</span>
                    </div>
                    <div class="info-row">
                        <span class="info-label">🔧 Pekerjaan:</span>
                        <span class="info-value">${doc.workDescription}</span>
                    </div>
                    <div class="info-row">
                        <span class="info-label">💰 Nilai:</span>
                        <span class="info-value">${this.formatCurrency(doc.totalValue)}</span>
                    </div>
                </div>

                <div class="ttd-actions">
                    <button 
                        class="btn-view-detail" 
                        onclick="direksiDashboard.viewDocument('${doc.id}')"
                        aria-label="Lihat detail ${doc.documentNo}"
                    >
                        📄 Lihat Detail
                    </button>
                    <button 
                        class="btn-ttd" 
                        onclick="direksiDashboard.signDocument('${doc.id}')"
                        aria-label="Beri TTD Digital untuk ${doc.documentNo}"
                    >
                        ✍️ TTD Digital
                    </button>
                </div>
            </div>
        `).join('');
    }

    getEmptyStateHTML() {
        return `
            <div class="empty-state">
                <div class="empty-state-content">
                    <div class="empty-state-icon">✓</div>
                    <h3>Tidak Ada Dokumen yang Perlu Ditandatangani</h3>
                    <p>Semua dokumen BAPP telah selesai ditandatangani</p>
                </div>
            </div>
        `;
    }

    formatDate(dateString) {
        return new Date(dateString).toLocaleDateString('id-ID', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    }

    formatCurrency(amount) {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0
        }).format(amount);
    }

    viewDocument(docId) {
        console.log('View document:', docId);
        const doc = this.documents.find(d => d.id === docId);
        if (!doc) return;

        // Navigate to document detail page
        window.location.href = `../dashboard/document-detail.html?id=${docId}`;
    }

    signDocument(docId) {
        console.log('Sign document:', docId);
        const doc = this.documents.find(d => d.id === docId);
        if (!doc) return;

        // Navigate to digital signature page
        window.location.href = `../dashboard/ttd-digital.html?id=${docId}`;
    }

    updateNotificationBadge(count) {
        const badge = document.querySelector('.notification-badge');
        if (badge) {
            badge.textContent = count;
            badge.style.display = count > 0 ? 'block' : 'none';
        }
    }

    startNotificationPolling() {
        // Poll for new notifications every 30 seconds
        setInterval(async () => {
            await this.loadNotifications();
            await this.loadPendingSignatures();
            this.render();
        }, 30000);
    }

    setupRefreshHandler() {
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

    showToast(title, message) {
        console.log(`[NOTIFICATION] ${title}: ${message}`);
        // TODO: Implement proper toast UI
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
        const totalPending = this.documents.length;
        const totalValue = this.documents.reduce((sum, doc) => sum + doc.totalValue, 0);

        // Update welcome banner
        const welcomeSubtitle = document.querySelector('.welcome-banner p');
        if (welcomeSubtitle) {
            welcomeSubtitle.innerHTML = `<span class="highlight">${totalPending} dokumen</span> membutuhkan tanda tangan digital Anda`;
        }

        // Update section title with count
        const sectionTitle = document.querySelector('#ttd-heading');
        if (sectionTitle) {
            sectionTitle.textContent = `Dokumen Butuh TTD Digital (${totalPending})`;
        }

        // Log statistics for monitoring
        console.log('Direksi Dashboard Stats:', {
            totalPending,
            totalValue: this.formatCurrency(totalValue)
        });
    }
}

// Initialize dashboard when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.direksiDashboard = new DireksiDashboard();
});

export default DireksiDashboard;