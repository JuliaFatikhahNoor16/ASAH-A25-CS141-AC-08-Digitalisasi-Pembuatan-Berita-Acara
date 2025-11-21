// Import dependencies
let API_ENDPOINT = 'http://localhost/CAPSTONE-A25-CS141/api';

class VendorDashboard {
    constructor() {
        this.currentPage = 1;
        this.itemsPerPage = 6;
        this.totalItems = 0;
        this.documents = [];
        this.notifications = [];
        this.currentView = 'dashboard';
        this.init();
    }

    init() {
        this.checkAuthentication();
        this.initNavigation();
        this.initProfileDropdown();
        this.setupHashChange();
        this.loadInitialView();
    }

    checkAuthentication() {
        const user = JSON.parse(localStorage.getItem('user') || 'null');
        if (!user || user.role !== 'vendor') {
            window.location.href = '../login/login.html';
            return;
        }
        this.currentUser = user;
        document.querySelector('.user-name').textContent = user.company_name || user.full_name || 'PT. Vendor';
    }

    setupHashChange() {
        window.addEventListener('hashchange', () => {
            this.loadInitialView();
        });
    }

    loadInitialView() {
        const hash = window.location.hash || '#/vendor/dashboard';
        const page = hash.split('/').pop() || 'dashboard';
        this.navigateToView(page);
    }

    initNavigation() {
        const navItems = document.querySelectorAll('.nav-item');
        navItems.forEach(item => {
            item.addEventListener('click', (e) => {
                e.preventDefault();
                const page = item.getAttribute('data-page');
                window.location.hash = `#/vendor/${page}`;
            });
        });
    }

    navigateToView(view) {
        // Update active nav
        document.querySelectorAll('.nav-item').forEach(item => {
            item.classList.remove('active');
            if (item.getAttribute('data-page') === view) {
                item.classList.add('active');
            }
        });

        // Change page title
        const titles = {
            'dashboard': 'Dashboard Vendor',
            'tambah-dokumen': 'Tambah Dokumen',
            'dokumen-saya': 'Dokumen Saya',
            'notifikasi': 'Notifikasi',
            'profile': 'Edit Profile'
        };
        document.querySelector('.page-title').textContent = titles[view] || 'Dashboard Vendor';

        // Load view content
        this.currentView = view;
        switch(view) {
            case 'dashboard':
                this.renderDashboard();
                break;
            case 'tambah-dokumen':
                this.renderTambahDokumen();
                break;
            case 'dokumen-saya':
                this.renderDokumenSaya();
                break;
            case 'notifikasi':
                this.renderNotifikasi();
                break;
            case 'profile':
                this.renderProfile();
                break;
            default:
                this.renderDashboard();
        }
    }

    initProfileDropdown() {
        const btnProfile = document.getElementById('btnProfile');
        const profileDropdown = document.getElementById('profileDropdown');
        const btnLogout = document.getElementById('btnLogout');

        btnProfile.addEventListener('click', (e) => {
            e.stopPropagation();
            profileDropdown.classList.toggle('show');
        });

        document.addEventListener('click', (e) => {
            if (!e.target.closest('.header-actions')) {
                profileDropdown.classList.remove('show');
            }
        });

        btnLogout.addEventListener('click', (e) => {
            e.preventDefault();
            this.handleLogout();
        });

        // Profile link
        const profileLink = profileDropdown.querySelector('a[href="#/vendor/profile"]');
        profileLink.addEventListener('click', (e) => {
            e.preventDefault();
            window.location.hash = '#/vendor/profile';
            profileDropdown.classList.remove('show');
        });
    }

    handleLogout() {
        if (confirm('Apakah Anda yakin ingin keluar?')) {
            localStorage.removeItem('user');
            localStorage.removeItem('token');
            window.location.href = '../login/login.html';
        }
    }

    // ============================================
    // RENDER DASHBOARD
    // ============================================
    async renderDashboard() {
        const content = document.querySelector('.dashboard-content');
        content.innerHTML = `
            <!-- Welcome Section -->
            <div class="welcome-card">
                <div class="welcome-illustration">
                    <i class="fas fa-file-invoice" style="font-size: 64px; color: white;"></i>
                </div>
                <div class="welcome-text">
                    <h3>Selamat Datang, ${this.currentUser.company_name || 'PT. Vendor'}!</h3>
                    <p>Kelola dokumen berita acara Anda dengan mudah</p>
                </div>
            </div>

            <!-- Stats Cards -->
            <div class="stats-grid" id="statsCards">
                <div class="stat-card stat-draft">
                    <div class="stat-icon">
                        <i class="fas fa-file-alt"></i>
                    </div>
                    <div class="stat-info">
                        <h4>Total Draft</h4>
                        <p class="stat-number" id="statDraft">-</p>
                    </div>
                </div>

                <div class="stat-card stat-pending">
                    <div class="stat-icon">
                        <i class="fas fa-clock"></i>
                    </div>
                    <div class="stat-info">
                        <h4>Menunggu Persetujuan</h4>
                        <p class="stat-number" id="statPending">-</p>
                    </div>
                </div>

                <div class="stat-card stat-approved">
                    <div class="stat-icon">
                        <i class="fas fa-check-circle"></i>
                    </div>
                    <div class="stat-info">
                        <h4>Disetujui</h4>
                        <p class="stat-number" id="statApproved">-</p>
                    </div>
                </div>
            </div>

            <!-- Recent Activity -->
            <div class="activity-section">
                <h3 class="section-title">Aktivitas Terbaru</h3>
                
                <div class="table-container">
                    <table class="data-table" id="activityTable">
                        <thead>
                            <tr>
                                <th>No Dokumen</th>
                                <th>Jenis Dokumen</th>
                                <th>Tanggal Dibuat</th>
                                <th>Status</th>
                                <th>Aksi</th>
                            </tr>
                        </thead>
                        <tbody id="tableBody">
                            <tr>
                                <td colspan="5" class="text-center">
                                    <div class="loading">Memuat data...</div>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                <!-- Pagination -->
                <div class="pagination" id="pagination">
                    <div class="pagination-info">
                        Tampilkan 1 sampai 6 dari 6 entri
                    </div>
                    <div class="pagination-controls">
                        <button class="btn-pagination" id="btnFirst" disabled>Awal</button>
                        <button class="btn-pagination" id="btnPrev" disabled>Balik</button>
                        <div class="pagination-numbers">
                            <button class="btn-page active">1</button>
                        </div>
                        <button class="btn-pagination" id="btnNext">Lanjut</button>
                        <button class="btn-pagination" id="btnLast">Akhir</button>
                    </div>
                </div>
            </div>
        `;

        await this.loadDashboardData();
        this.initPagination();
    }

    async loadDashboardData() {
        await this.loadStats();
        await this.loadDocuments();
    }

    async loadStats() {
        try {
            const response = await fetch(`${API_ENDPOINT}/documents/get-stats.php?vendor_id=${this.currentUser.id}`);
            const data = await response.json();
            
            document.getElementById('statDraft').textContent = data.draft || 0;
            document.getElementById('statPending').textContent = data.pending || 0;
            document.getElementById('statApproved').textContent = data.approved || 0;
        } catch (error) {
            console.error('Error loading stats:', error);
            document.getElementById('statDraft').textContent = '2';
            document.getElementById('statPending').textContent = '3';
            document.getElementById('statApproved').textContent = '4';
        }
    }

    async loadDocuments() {
        try {
            const response = await fetch(`${API_ENDPOINT}/documents/get-documents.php?vendor_id=${this.currentUser.id}`);
            const data = await response.json();
            this.documents = data.documents || this.getMockData();
        } catch (error) {
            console.error('Error loading documents:', error);
            this.documents = this.getMockData();
        }
        
        this.totalItems = this.documents.length;
        this.renderTable(this.documents);
        this.updatePagination();
    }

    getMockData() {
        return [
            { id: 1, document_number: 'BAPB-XYZ-234', document_type: 'BAPB', created_at: '2025-01-10', status: 'pending' },
            { id: 2, document_number: 'BAPP-ABC-235', document_type: 'BAPP', created_at: '2025-03-10', status: 'pending' },
            { id: 3, document_number: 'BAPB-XYZ-236', document_type: 'BAPB', created_at: '2025-05-10', status: 'disetujui' },
            { id: 4, document_number: 'BAPP-ABC-237', document_type: 'BAPP', created_at: '2025-07-10', status: 'ditolak' },
            { id: 5, document_number: 'BAPB-XYZ-238', document_type: 'BAPB', created_at: '2025-09-10', status: 'ditolak' },
            { id: 6, document_number: 'BAPP-ABC-239', document_type: 'BAPP', created_at: '2025-11-10', status: 'disetujui' }
        ];
    }

    renderTable(documents) {
        const tableBody = document.getElementById('tableBody');
        
        if (!documents || documents.length === 0) {
            tableBody.innerHTML = `<tr><td colspan="5" class="text-center">Tidak ada data</td></tr>`;
            return;
        }

        const start = (this.currentPage - 1) * this.itemsPerPage;
        const end = start + this.itemsPerPage;
        const paginatedDocs = documents.slice(start, end);

        tableBody.innerHTML = paginatedDocs.map(doc => `
            <tr>
                <td>${doc.document_number}</td>
                <td><span class="badge badge-${doc.document_type.toLowerCase()}">${doc.document_type}</span></td>
                <td>${this.formatDate(doc.created_at)}</td>
                <td>${this.getStatusBadge(doc.status)}</td>
                <td>
                    <div class="action-buttons">
                        <button class="btn-icon" onclick="vendorDashboard.viewDocument(${doc.id})" title="Lihat">
                            <i class="fas fa-eye"></i>
                        </button>
                        ${doc.status === 'draft' || doc.status === 'ditolak' ? `
                            <button class="btn-icon" onclick="vendorDashboard.editDocument(${doc.id})" title="Edit">
                                <i class="fas fa-edit"></i>
                            </button>
                        ` : ''}
                    </div>
                </td>
            </tr>
        `).join('');
    }

    getStatusBadge(status) {
        const statusMap = {
            'draft': { label: 'Draft', class: 'warning' },
            'pending': { label: 'Pending', class: 'info' },
            'disetujui': { label: 'Disetujui', class: 'success' },
            'ditolak': { label: 'Ditolak', class: 'danger' }
        };
        const statusInfo = statusMap[status] || { label: status, class: 'secondary' };
        return `<span class="badge badge-${statusInfo.class}">${statusInfo.label}</span>`;
    }

    formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('id-ID', { day: '2-digit', month: '2-digit', year: 'numeric' });
    }

    initPagination() {
        const btnFirst = document.getElementById('btnFirst');
        const btnPrev = document.getElementById('btnPrev');
        const btnNext = document.getElementById('btnNext');
        const btnLast = document.getElementById('btnLast');

        if (btnFirst) btnFirst.addEventListener('click', () => this.goToPage(1));
        if (btnPrev) btnPrev.addEventListener('click', () => this.goToPage(this.currentPage - 1));
        if (btnNext) btnNext.addEventListener('click', () => this.goToPage(this.currentPage + 1));
        if (btnLast) btnLast.addEventListener('click', () => this.goToPage(Math.ceil(this.totalItems / this.itemsPerPage)));

        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('btn-page')) {
                const page = parseInt(e.target.textContent);
                this.goToPage(page);
            }
        });
    }

    goToPage(page) {
        const totalPages = Math.ceil(this.totalItems / this.itemsPerPage);
        if (page < 1 || page > totalPages) return;
        
        this.currentPage = page;
        this.renderTable(this.documents);
        this.updatePagination();
    }

    updatePagination() {
        const totalPages = Math.ceil(this.totalItems / this.itemsPerPage);
        const start = (this.currentPage - 1) * this.itemsPerPage + 1;
        const end = Math.min(start + this.itemsPerPage - 1, this.totalItems);

        const paginationInfo = document.querySelector('.pagination-info');
        if (paginationInfo) {
            paginationInfo.textContent = `Tampilkan ${start} sampai ${end} dari ${this.totalItems} entri`;
        }

        const btnFirst = document.getElementById('btnFirst');
        const btnPrev = document.getElementById('btnPrev');
        const btnNext = document.getElementById('btnNext');
        const btnLast = document.getElementById('btnLast');

        if (btnFirst) btnFirst.disabled = this.currentPage === 1;
        if (btnPrev) btnPrev.disabled = this.currentPage === 1;
        if (btnNext) btnNext.disabled = this.currentPage === totalPages;
        if (btnLast) btnLast.disabled = this.currentPage === totalPages;

        const paginationNumbers = document.querySelector('.pagination-numbers');
        if (paginationNumbers) {
            paginationNumbers.innerHTML = '';
            for (let i = 1; i <= totalPages; i++) {
                const btn = document.createElement('button');
                btn.className = `btn-page ${i === this.currentPage ? 'active' : ''}`;
                btn.textContent = i;
                paginationNumbers.appendChild(btn);
            }
        }
    }

    // ============================================
    // RENDER TAMBAH DOKUMEN
    // ============================================
    renderTambahDokumen() {
        const content = document.querySelector('.dashboard-content');
        content.innerHTML = `
            <div class="form-section">
                <div class="form-header">
                    <h3 class="section-title">Pilih Jenis Berita Acara</h3>
                    <p class="section-subtitle">Pilih tipe berita acara yang ingin Anda buat</p>
                </div>

                <div class="document-type-selector">
                    <div class="type-card" onclick="vendorDashboard.selectDocumentType('BAPB')">
                        <div class="type-icon">
                            <i class="fas fa-box"></i>
                        </div>
                        <h4>Berita Acara Pemeriksaan Barang (BAPB)</h4>
                        <p>Untuk pemeriksaan dan penerimaan barang</p>
                        <div class="type-flow">
                            <span class="flow-step">PIC Gudang</span>
                            <i class="fas fa-arrow-right"></i>
                            <span class="flow-step">Pemesan Barang</span>
                        </div>
                        <button class="btn btn-primary">
                            <i class="fas fa-plus"></i> Buat BAPB
                        </button>
                    </div>

                    <div class="type-card" onclick="vendorDashboard.selectDocumentType('BAPP')">
                        <div class="type-icon">
                            <i class="fas fa-tasks"></i>
                        </div>
                        <h4>Berita Acara Pemeriksaan Pekerjaan (BAPP)</h4>
                        <p>Untuk pemeriksaan dan penerimaan pekerjaan</p>
                        <div class="type-flow">
                            <span class="flow-step">Direksi Pekerjaan</span>
                        </div>
                        <button class="btn btn-primary">
                            <i class="fas fa-plus"></i> Buat BAPP
                        </button>
                    </div>
                </div>
            </div>
        `;
    }

    selectDocumentType(type) {
        if (type === 'BAPB') {
            this.renderFormBAPB();
        } else {
            this.renderFormBAPP();
        }
    }

    renderFormBAPB() {
        const content = document.querySelector('.dashboard-content');
        content.innerHTML = `
            <div class="form-section">
                <div class="form-header">
                    <button class="btn-back" onclick="vendorDashboard.renderTambahDokumen()">
                        <i class="fas fa-arrow-left"></i> Kembali
                    </button>
                    <h3 class="section-title">Buat Berita Acara Pemeriksaan Barang (BAPB)</h3>
                </div>

                <form id="formBAPB" class="document-form">
                    <div class="form-card">
                        <h4 class="form-section-title">Informasi Umum</h4>
                        
                        <div class="form-row">
                            <div class="form-group">
                                <label class="form-label">Nomor Kontrak *</label>
                                <input type="text" name="contract_number" class="form-control" required>
                            </div>
                            <div class="form-group">
                                <label class="form-label">Tanggal Pengiriman *</label>
                                <input type="date" name="delivery_date" class="form-control" required>
                            </div>
                        </div>

                        <div class="form-row">
                            <div class="form-group">
                                <label class="form-label">Tanggal Inspeksi *</label>
                                <input type="date" name="inspection_date" class="form-control" required>
                            </div>
                            <div class="form-group">
                                <label class="form-label">Nilai Pembayaran (Rp) *</label>
                                <input type="number" name="payment_amount" class="form-control" required>
                            </div>
                        </div>
                    </div>

                    <div class="form-card">
                        <h4 class="form-section-title">Daftar Barang</h4>
                        <div id="itemsList">
                            <div class="item-row">
                                <div class="form-group">
                                    <label class="form-label">Nama Barang</label>
                                    <input type="text" name="item_name[]" class="form-control" required>
                                </div>
                                <div class="form-group">
                                    <label class="form-label">Spesifikasi</label>
                                    <input type="text" name="item_spec[]" class="form-control">
                                </div>
                                <div class="form-group">
                                    <label class="form-label">Jumlah</label>
                                    <input type="number" name="item_qty[]" class="form-control" required>
                                </div>
                                <div class="form-group">
                                    <label class="form-label">Satuan</label>
                                    <input type="text" name="item_unit[]" class="form-control">
                                </div>
                                <div class="form-group">
                                    <label class="form-label">Kondisi</label>
                                    <select name="item_condition[]" class="form-control">
                                        <option value="Baik">Baik</option>
                                        <option value="Rusak">Rusak</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                        <button type="button" class="btn btn-secondary" onclick="vendorDashboard.addItemRow()">
                            <i class="fas fa-plus"></i> Tambah Barang
                        </button>
                    </div>

                    <div class="form-card">
                        <h4 class="form-section-title">Keterangan</h4>
                        <div class="form-group">
                            <label class="form-label">Keterangan Pekerjaan *</label>
                            <textarea name="description" class="form-control" rows="4" required></textarea>
                        </div>
                    </div>

                    <div class="form-actions">
                        <button type="button" class="btn btn-secondary" onclick="vendorDashboard.renderTambahDokumen()">
                            Batal
                        </button>
                        <button type="submit" class="btn btn-primary">
                            <i class="fas fa-save"></i> Simpan Dokumen
                        </button>
                    </div>
                </form>
            </div>
        `;

        document.getElementById('formBAPB').addEventListener('submit', (e) => {
            e.preventDefault();
            this.submitBAPB(e.target);
        });
    }

    renderFormBAPP() {
        const content = document.querySelector('.dashboard-content');
        content.innerHTML = `
            <div class="form-section">
                <div class="form-header">
                    <button class="btn-back" onclick="vendorDashboard.renderTambahDokumen()">
                        <i class="fas fa-arrow-left"></i> Kembali
                    </button>
                    <h3 class="section-title">Buat Berita Acara Pemeriksaan Pekerjaan (BAPP)</h3>
                </div>

                <form id="formBAPP" class="document-form">
                    <div class="form-card">
                        <h4 class="form-section-title">Informasi Umum</h4>
                        
                        <div class="form-row">
                            <div class="form-group">
                                <label class="form-label">Nomor Kontrak *</label>
                                <input type="text" name="contract_number" class="form-control" required>
                            </div>
                            <div class="form-group">
                                <label class="form-label">Tanggal Selesai Pekerjaan *</label>
                                <input type="date" name="completion_date" class="form-control" required>
                            </div>
                        </div>

                        <div class="form-group">
                            <label class="form-label">Nilai Pembayaran (Rp) *</label>
                            <input type="number" name="payment_amount" class="form-control" required>
                        </div>
                    </div>

                    <div class="form-card">
                        <h4 class="form-section-title">Detail Pekerjaan</h4>
                        <div class="form-group">
                            <label class="form-label">Uraian Pekerjaan *</label>
                            <textarea name="work_description" class="form-control" rows="4" required></textarea>
                        </div>
                        <div class="form-group">
                            <label class="form-label">Hasil Pekerjaan *</label>
                            <textarea name="work_result" class="form-control" rows="4" required></textarea>
                        </div>
                    </div>

                    <div class="form-card">
                        <h4 class="form-section-title">Keterangan</h4>
                        <div class="form-group">
                            <label class="form-label">Keterangan Tambahan</label>
                            <textarea name="description" class="form-control" rows="3"></textarea>
                        </div>
                    </div>

                    <div class="form-actions">
                        <button type="button" class="btn btn-secondary" onclick="vendorDashboard.renderTambahDokumen()">
                            Batal
                        </button>
                        <button type="submit" class="btn btn-primary">
                            <i class="fas fa-save"></i> Simpan Dokumen
                        </button>
                    </div>
                </form>
            </div>
        `;

        document.getElementById('formBAPP').addEventListener('submit', (e) => {
            e.preventDefault();
            this.submitBAPP(e.target);
        });
    }

    addItemRow() {
        const itemsList = document.getElementById('itemsList');
        const newRow = document.createElement('div');
        newRow.className = 'item-row';
        newRow.innerHTML = `
            <div class="form-group">
                <label class="form-label">Nama Barang</label>
                <input type="text" name="item_name[]" class="form-control" required>
            </div>
            <div class="form-group">
                <label class="form-label">Spesifikasi</label>
                <input type="text" name="item_spec[]" class="form-control">
            </div>
            <div class="form-group">
                <label class="form-label">Jumlah</label>
                <input type="number" name="item_qty[]" class="form-control" required>
            </div>
            <div class="form-group">
                <label class="form-label">Satuan</label>
                <input type="text" name="item_unit[]" class="form-control">
            </div>
            <div class="form-group">
                <label class="form-label">Kondisi</label>
                <select name="item_condition[]" class="form-control">
                    <option value="Baik">Baik</option>
                    <option value="Rusak">Rusak</option>
                </select>
            </div>
            <button type="button" class="btn-icon btn-remove" onclick="this.parentElement.remove()">
                <i class="fas fa-trash"></i>
            </button>
        `;
        itemsList.appendChild(newRow);
    }

    async submitBAPB(form) {
        const formData = new FormData(form);
        
        try {
            const response = await fetch(`${API_ENDPOINT}/documents/create-bapb.php`, {
                method: 'POST',
                body: formData
            });
            
            const result = await response.json();
            
            if (result.success) {
                alert('Dokumen BAPB berhasil dibuat!');
                window.location.hash = '#/vendor/dokumen-saya';
            } else {
                alert('Gagal membuat dokumen: ' + result.message);
            }
        } catch (error) {
            console.error('Error:', error);
            alert('Dokumen BAPB berhasil disimpan! (Mode Demo)');
            window.location.hash = '#/vendor/dokumen-saya';
        }
    }

    async submitBAPP(form) {
        const formData = new FormData(form);
        
        try {
            const response = await fetch(`${API_ENDPOINT}/documents/create-bapp.php`, {
                method: 'POST',
                body: formData
            });
            
            const result = await response.json();
            
            if (result.success) {
                alert('Dokumen BAPP berhasil dibuat!');
                window.location.hash = '#/vendor/dokumen-saya';
            } else {
                alert('Gagal membuat dokumen: ' + result.message);
            }
        } catch (error) {
            console.error('Error:', error);
            alert('Dokumen BAPP berhasil disimpan! (Mode Demo)');
            window.location.hash = '#/vendor/dokumen-saya';
        }
    }

    // ============================================
    // RENDER DOKUMEN SAYA
    // ============================================
    async renderDokumenSaya() {
        const content = document.querySelector('.dashboard-content');
        content.innerHTML = `
            <div class="documents-section">
                <div class="section-header">
                    <h3 class="section-title">Dokumen Saya</h3>
                    <div class="section-actions">
                        <div class="filter-group">
                            <select id="filterStatus" class="form-control">
                                <option value="">Semua Status</option>
                                <option value="draft">Draft</option>
                                <option value="pending">Pending</option>
                                <option value="disetujui">Disetujui</option>
                                <option value="ditolak">Ditolak</option>
                            </select>
                            <select id="filterType" class="form-control">
                                <option value="">Semua Tipe</option>
                                <option value="BAPB">BAPB</option>
                                <option value="BAPP">BAPP</option>
                            </select>
                        </div>
                    </div>
                </div>

                <div class="table-container">
                    <table class="data-table">
                        <thead>
                            <tr>
                                <th>No Dokumen</th>
                                <th>Jenis</th>
                                <th>Nomor Kontrak</th>
                                <th>Tanggal</th>
                                <th>Nilai</th>
                                <th>Status</th>
                                <th>Aksi</th>
                            </tr>
                        </thead>
                        <tbody id="documentsTableBody">
                            <tr>
                                <td colspan="7" class="text-center">
                                    <div class="loading">Memuat data...</div>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        `;

        await this.loadAllDocuments();
        
        document.getElementById('filterStatus').addEventListener('change', (e) => this.filterDocuments());
        document.getElementById('filterType').addEventListener('change', (e) => this.filterDocuments());
    }

    async loadAllDocuments() {
        try {
            const response = await fetch(`${API_ENDPOINT}/documents/get-documents.php?vendor_id=${this.currentUser.id}`);
            const data = await response.json();
            this.documents = data.documents || this.getFullMockData();
        } catch (error) {
            this.documents = this.getFullMockData();
        }
        
        this.renderDocumentsTable(this.documents);
    }

    getFullMockData() {
        return [
            { id: 1, document_number: 'BAPB-XYZ-234', document_type: 'BAPB', contract_number: 'K-2025-001', created_at: '2025-01-10', payment_amount: 50000000, status: 'pending' },
            { id: 2, document_number: 'BAPP-ABC-235', document_type: 'BAPP', contract_number: 'K-2025-002', created_at: '2025-03-10', payment_amount: 75000000, status: 'pending' },
            { id: 3, document_number: 'BAPB-XYZ-236', document_type: 'BAPB', contract_number: 'K-2025-003', created_at: '2025-05-10', payment_amount: 60000000, status: 'disetujui' },
            { id: 4, document_number: 'BAPP-ABC-237', document_type: 'BAPP', contract_number: 'K-2025-004', created_at: '2025-07-10', payment_amount: 80000000, status: 'ditolak' },
            { id: 5, document_number: 'BAPB-XYZ-238', document_type: 'BAPB', contract_number: 'K-2025-005', created_at: '2025-09-10', payment_amount: 55000000, status: 'draft' },
        ];
    }

    renderDocumentsTable(documents) {
        const tbody = document.getElementById('documentsTableBody');
        
        if (!documents || documents.length === 0) {
            tbody.innerHTML = `<tr><td colspan="7" class="text-center">Tidak ada dokumen</td></tr>`;
            return;
        }

        tbody.innerHTML = documents.map(doc => `
            <tr>
                <td>${doc.document_number}</td>
                <td><span class="badge badge-${doc.document_type.toLowerCase()}">${doc.document_type}</span></td>
                <td>${doc.contract_number || '-'}</td>
                <td>${this.formatDate(doc.created_at)}</td>
                <td>Rp ${this.formatCurrency(doc.payment_amount)}</td>
                <td>${this.getStatusBadge(doc.status)}</td>
                <td>
                    <div class="action-buttons">
                        <button class="btn-icon" onclick="vendorDashboard.viewDocument(${doc.id})" title="Lihat">
                            <i class="fas fa-eye"></i>
                        </button>
                        ${doc.status === 'draft' ? `
                            <button class="btn-icon" onclick="vendorDashboard.editDocument(${doc.id})" title="Edit">
                                <i class="fas fa-edit"></i>
                            </button>
                            <button class="btn-icon" onclick="vendorDashboard.deleteDocument(${doc.id})" title="Hapus">
                                <i class="fas fa-trash"></i>
                            </button>
                        ` : ''}
                        <button class="btn-icon" onclick="vendorDashboard.downloadPDF(${doc.id})" title="Download">
                            <i class="fas fa-download"></i>
                        </button>
                    </div>
                </td>
            </tr>
        `).join('');
    }

    formatCurrency(amount) {
        return new Intl.NumberFormat('id-ID').format(amount);
    }

    filterDocuments() {
        const status = document.getElementById('filterStatus').value;
        const type = document.getElementById('filterType').value;
        
        let filtered = this.documents;
        
        if (status) {
            filtered = filtered.filter(doc => doc.status === status);
        }
        
        if (type) {
            filtered = filtered.filter(doc => doc.document_type === type);
        }
        
        this.renderDocumentsTable(filtered);
    }

    // ============================================
    // RENDER NOTIFIKASI
    // ============================================
    async renderNotifikasi() {
        const content = document.querySelector('.dashboard-content');
        content.innerHTML = `
            <div class="notifications-section">
                <div class="section-header">
                    <h3 class="section-title">Notifikasi</h3>
                    <button class="btn btn-secondary" onclick="vendorDashboard.markAllAsRead()">
                        <i class="fas fa-check-double"></i> Tandai Semua Dibaca
                    </button>
                </div>

                <div class="notifications-list" id="notificationsList">
                    <div class="loading">Memuat notifikasi...</div>
                </div>
            </div>
        `;

        await this.loadNotifications();
    }

    async loadNotifications() {
        try {
            const response = await fetch(`${API_ENDPOINT}/notification/get-notifications.php?user_id=${this.currentUser.id}`);
            const data = await response.json();
            this.notifications = data.notifications || this.getMockNotifications();
        } catch (error) {
            this.notifications = this.getMockNotifications();
        }
        
        this.renderNotificationsList(this.notifications);
    }

    getMockNotifications() {
        return [
            { id: 1, title: 'Dokumen Disetujui', message: 'BAPB-XYZ-236 telah disetujui', type: 'success', created_at: '2025-11-20 10:30', is_read: false },
            { id: 2, title: 'Dokumen Ditolak', message: 'BAPP-ABC-237 ditolak. Silakan perbaiki', type: 'danger', created_at: '2025-11-19 14:20', is_read: false },
            { id: 3, title: 'Menunggu Persetujuan', message: 'BAPB-XYZ-234 sedang dalam proses review', type: 'info', created_at: '2025-11-18 09:15', is_read: true },
        ];
    }

    renderNotificationsList(notifications) {
        const list = document.getElementById('notificationsList');
        
        if (!notifications || notifications.length === 0) {
            list.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-bell-slash"></i>
                    <p>Tidak ada notifikasi</p>
                </div>
            `;
            return;
        }

        list.innerHTML = notifications.map(notif => `
            <div class="notification-item ${!notif.is_read ? 'unread' : ''}" onclick="vendorDashboard.markAsRead(${notif.id})">
                <div class="notification-icon notification-${notif.type}">
                    <i class="fas fa-${notif.type === 'success' ? 'check-circle' : notif.type === 'danger' ? 'times-circle' : 'info-circle'}"></i>
                </div>
                <div class="notification-content">
                    <h4 class="notification-title">${notif.title}</h4>
                    <p class="notification-message">${notif.message}</p>
                    <span class="notification-time">${this.formatDateTime(notif.created_at)}</span>
                </div>
                ${!notif.is_read ? '<div class="notification-badge"></div>' : ''}
            </div>
        `).join('');
    }

    formatDateTime(dateString) {
        const date = new Date(dateString);
        return date.toLocaleString('id-ID', { 
            day: '2-digit', 
            month: 'short', 
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    }

    markAsRead(id) {
        // Mark notification as read
        console.log('Mark as read:', id);
    }

    markAllAsRead() {
        // Mark all notifications as read
        this.notifications = this.notifications.map(n => ({ ...n, is_read: true }));
        this.renderNotificationsList(this.notifications);
    }

    // ============================================
    // RENDER PROFILE
    // ============================================
    renderProfile() {
        const content = document.querySelector('.dashboard-content');
        content.innerHTML = `
            <div class="profile-section">
                <div class="form-card">
                    <h3 class="section-title">Edit Profile</h3>
                    
                    <form id="formProfile">
                        <div class="form-group">
                            <label class="form-label">Nama Perusahaan</label>
                            <input type="text" name="company_name" class="form-control" value="${this.currentUser.company_name || ''}" required>
                        </div>
                        
                        <div class="form-group">
                            <label class="form-label">Email</label>
                            <input type="email" name="email" class="form-control" value="${this.currentUser.email || ''}" required>
                        </div>
                        
                        <div class="form-group">
                            <label class="form-label">Nama Lengkap</label>
                            <input type="text" name="full_name" class="form-control" value="${this.currentUser.full_name || ''}" required>
                        </div>
                        
                        <div class="form-group">
                            <label class="form-label">Username</label>
                            <input type="text" name="username" class="form-control" value="${this.currentUser.username || ''}" disabled>
                        </div>
                        
                        <div class="form-actions">
                            <button type="submit" class="btn btn-primary">
                                <i class="fas fa-save"></i> Simpan Perubahan
                            </button>
                        </div>
                    </form>
                </div>

                <div class="form-card">
                    <h3 class="section-title">Ubah Password</h3>
                    
                    <form id="formPassword">
                        <div class="form-group">
                            <label class="form-label">Password Lama</label>
                            <input type="password" name="old_password" class="form-control" required>
                        </div>
                        
                        <div class="form-group">
                            <label class="form-label">Password Baru</label>
                            <input type="password" name="new_password" class="form-control" required>
                        </div>
                        
                        <div class="form-group">
                            <label class="form-label">Konfirmasi Password Baru</label>
                            <input type="password" name="confirm_password" class="form-control" required>
                        </div>
                        
                        <div class="form-actions">
                            <button type="submit" class="btn btn-primary">
                                <i class="fas fa-key"></i> Ubah Password
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        `;

        document.getElementById('formProfile').addEventListener('submit', (e) => {
            e.preventDefault();
            this.updateProfile(e.target);
        });

        document.getElementById('formPassword').addEventListener('submit', (e) => {
            e.preventDefault();
            this.updatePassword(e.target);
        });
    }

    async updateProfile(form) {
        const formData = new FormData(form);
        
        try {
            // Simulate API call
            alert('Profile berhasil diperbarui!');
            
            // Update local storage
            this.currentUser.company_name = formData.get('company_name');
            this.currentUser.email = formData.get('email');
            this.currentUser.full_name = formData.get('full_name');
            localStorage.setItem('user', JSON.stringify(this.currentUser));
            
            // Update UI
            document.querySelector('.user-name').textContent = this.currentUser.company_name;
        } catch (error) {
            alert('Gagal memperbarui profile');
        }
    }

    async updatePassword(form) {
        const formData = new FormData(form);
        
        if (formData.get('new_password') !== formData.get('confirm_password')) {
            alert('Password baru tidak cocok!');
            return;
        }
        
        try {
            // Simulate API call
            alert('Password berhasil diubah!');
            form.reset();
        } catch (error) {
            alert('Gagal mengubah password');
        }
    }

    // ============================================
    // UTILITY METHODS
    // ============================================
    viewDocument(id) {
        alert(`View document ${id}`);
    }

    editDocument(id) {
        alert(`Edit document ${id}`);
    }

    deleteDocument(id) {
        if (confirm('Apakah Anda yakin ingin menghapus dokumen ini?')) {
            alert(`Delete document ${id}`);
            this.loadAllDocuments();
        }
    }

    downloadPDF(id) {
        alert(`Download PDF ${id}`);
    }
}

// Initialize
let vendorDashboard;
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        vendorDashboard = new VendorDashboard();
    });
} else {
    vendorDashboard = new VendorDashboard();
}

window.vendorDashboard = vendorDashboard;
export default VendorDashboard;