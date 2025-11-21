import { loadHeader } from '../../src/scripts/components/header-component.js';
import { loadSidebar } from '../../src/scripts/components/sidebar-component.js';
import documentsAPI from '../../src/scripts/data/api/documents-api.js';
import notificationsAPI from '../../src/scripts/data/api/notifications-api.js';

class PICDashboard {
    constructor() {
        this.documents = [];
        this.filteredDocuments = [];
        this.currentFilter = 'all'; // all, bapb, bapp, verified
        this.notifications = [];
        this.userId = 'pic_001'; // TODO: Get from auth
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
            console.error('Error initializing PIC dashboard:', error);
            this.showError('Gagal memuat dashboard');
        }
    }

    async loadComponents() {
        try {
            // Load header and sidebar with 'pic' role
            await loadHeader('pic');
            await loadSidebar('pic');
            
            console.log('PIC Components loaded successfully');
        } catch (error) {
            console.error('Error loading components:', error);
            throw error;
        }
    }

    async loadData() {
        try {
            // Load pending documents for verification
            await this.loadPendingDocuments();
            
            // Load notifications
            await this.loadNotifications();
        } catch (error) {
            console.error('Error loading data:', error);
            throw error;
        }
    }

    async loadPendingDocuments() {
        try {
            // Get documents that need PIC verification
            const response = await documentsAPI.getDocuments({
                status: 'pending',
                needsPICVerification: true
            });

            if (response.success) {
                this.documents = response.data;
                this.filteredDocuments = [...this.documents];
                console.log('Pending documents loaded:', this.documents.length);
            } else {
                throw new Error(response.error);
            }
        } catch (error) {
            console.error('Error loading pending documents:', error);
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
                documentNo: 'BAPB-2024-001',
                type: 'BAPB',
                vendor: 'PT. Jaya Abadi',
                vendorId: 'vendor_001',
                createdAt: '2024-03-15T10:30:00',
                status: 'pending',
                itemCount: 5,
                totalValue: 15000000
            },
            {
                id: 'doc_002',
                documentNo: 'BAPB-2024-002',
                type: 'BAPB',
                vendor: 'CV. Maju Jaya',
                vendorId: 'vendor_002',
                createdAt: '2024-03-15T11:00:00',
                status: 'pending',
                itemCount: 3,
                totalValue: 8500000
            },
            {
                id: 'doc_003',
                documentNo: 'BAPP-2024-001',
                type: 'BAPP',
                vendor: 'PT. Karya Mandiri',
                vendorId: 'vendor_003',
                createdAt: '2024-03-15T14:20:00',
                status: 'pending',
                workDescription: 'Instalasi Jaringan Gedung A',
                totalValue: 25000000
            },
            {
                id: 'doc_004',
                documentNo: 'BAPB-2024-003',
                type: 'BAPB',
                vendor: 'PT. Sejahtera',
                vendorId: 'vendor_004',
                createdAt: '2024-03-14T16:45:00',
                status: 'pending',
                itemCount: 10,
                totalValue: 32000000
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
        // Stats cards filter
        document.querySelectorAll('.stat-card').forEach(card => {
            card.addEventListener('click', (e) => {
                const type = e.currentTarget.dataset.type;
                this.filterDocuments(type);
            });

            // Keyboard accessibility
            card.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    const type = e.currentTarget.dataset.type;
                    this.filterDocuments(type);
                }
            });
        });

        // Listen to header search event
        document.addEventListener('headerSearch', (e) => {
            this.handleSearch(e.detail.query);
        });

        // Refresh handler
        this.setupRefreshHandler();
    }

    filterDocuments(type) {
        this.currentFilter = type;
        
        if (type === 'all') {
            this.filteredDocuments = [...this.documents];
        } else if (type === 'bapb') {
            this.filteredDocuments = this.documents.filter(doc => doc.type === 'BAPB');
        } else if (type === 'bapp') {
            this.filteredDocuments = this.documents.filter(doc => doc.type === 'BAPP');
        } else if (type === 'verified') {
            this.filteredDocuments = this.documents.filter(doc => doc.status === 'verified');
        }
        
        this.renderDocuments();
        this.updateActiveFilter(type);
    }

    handleSearch(query) {
        const searchTerm = query.toLowerCase().trim();
        
        if (!searchTerm) {
            this.filteredDocuments = this.currentFilter === 'all' 
                ? [...this.documents]
                : this.getFilteredByType(this.currentFilter);
        } else {
            let baseDocuments = this.currentFilter === 'all'
                ? [...this.documents]
                : this.getFilteredByType(this.currentFilter);

            this.filteredDocuments = baseDocuments.filter(doc => 
                doc.documentNo.toLowerCase().includes(searchTerm) ||
                doc.vendor.toLowerCase().includes(searchTerm) ||
                doc.type.toLowerCase().includes(searchTerm)
            );
        }
        
        this.renderDocuments();
    }

    getFilteredByType(type) {
        if (type === 'bapb') {
            return this.documents.filter(doc => doc.type === 'BAPB');
        } else if (type === 'bapp') {
            return this.documents.filter(doc => doc.type === 'BAPP');
        } else if (type === 'verified') {
            return this.documents.filter(doc => doc.status === 'verified');
        }
        return [...this.documents];
    }

    updateActiveFilter(type) {
        document.querySelectorAll('.stat-card').forEach(card => {
            card.classList.toggle('active', card.dataset.type === type);
        });
    }

    renderDocuments() {
        const gridContainer = document.querySelector('.documents-grid');
        if (!gridContainer) return;

        if (this.filteredDocuments.length === 0) {
            gridContainer.innerHTML = this.getEmptyStateHTML();
            return;
        }

        gridContainer.innerHTML = this.filteredDocuments.map(doc => `
            <div class="document-card" data-doc-id="${doc.id}">
                <div class="doc-header">
                    <h3>${doc.documentNo}</h3>
                    <span class="doc-badge ${doc.type.toLowerCase()}-badge">${doc.type}</span>
                </div>
                <p class="doc-vendor">${doc.vendor}</p>
                <p class="doc-date">${this.formatDate(doc.createdAt)}</p>
                <div class="doc-info">
                    ${doc.type === 'BAPB' ? `
                        <p class="doc-meta">📦 ${doc.itemCount} Item</p>
                    ` : `
                        <p class="doc-meta">🔧 ${doc.workDescription}</p>
                    `}
                    <p class="doc-meta">💰 ${this.formatCurrency(doc.totalValue)}</p>
                </div>
                <button 
                    class="btn-verify" 
                    onclick="picDashboard.verifyDocument('${doc.id}')"
                    aria-label="Verifikasi ${doc.documentNo}"
                >
                    Verifikasi
                </button>
            </div>
        `).join('');
    }

    getEmptyStateHTML() {
        return `
            <div class="empty-state">
                <div class="empty-state-content">
                    <p>✓ Tidak ada dokumen yang perlu diverifikasi</p>
                    ${this.currentFilter !== 'all' ? 
                        '<button class="btn-clear-filter" onclick="picDashboard.clearFilters()">Tampilkan semua dokumen</button>' : 
                        ''
                    }
                </div>
            </div>
        `;
    }

    formatDate(dateString) {
        return new Date(dateString).toLocaleDateString('id-ID', {
            day: 'numeric',
            month: 'short',
            year: 'numeric'
        });
    }

    formatCurrency(amount) {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0
        }).format(amount);
    }

    verifyDocument(docId) {
        console.log('Verify document:', docId);
        const doc = this.documents.find(d => d.id === docId);
        if (!doc) return;

        // Navigate to verification page based on document type
        if (doc.type === 'BAPB') {
            window.location.href = `../dashboard/verifikasi-bapb.html?id=${docId}`;
        } else {
            window.location.href = `../dashboard/verifikasi-bapp.html?id=${docId}`;
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

    startNotificationPolling() {
        // Poll for new notifications every 30 seconds
        setInterval(async () => {
            await this.loadNotifications();
            await this.loadPendingDocuments();
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
        const bapbCount = this.documents.filter(d => d.type === 'BAPB').length;
        const bappCount = this.documents.filter(d => d.type === 'BAPP').length;
        const verifiedCount = this.documents.filter(d => d.status === 'verified').length;

        // Update stat cards
        const statCards = document.querySelectorAll('.stat-card');
        statCards.forEach(card => {
            const type = card.dataset.type;
            const numberEl = card.querySelector('.stat-number');
            
            if (numberEl) {
                if (type === 'bapb') {
                    numberEl.textContent = bapbCount;
                } else if (type === 'bapp') {
                    numberEl.textContent = bappCount;
                } else if (type === 'verified') {
                    numberEl.textContent = verifiedCount;
                }
            }
        });

        // Update welcome banner
        const welcomeSubtitle = document.querySelector('.welcome-banner p');
        if (welcomeSubtitle) {
            welcomeSubtitle.innerHTML = `Anda memiliki <span class="highlight">${bapbCount} BAPB</span> dan <span class="highlight">${bappCount} BAPP</span> perlu verifikasi`;
        }
    }
}

// Initialize dashboard when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.picDashboard = new PICDashboard();
});

export default PICDashboard;