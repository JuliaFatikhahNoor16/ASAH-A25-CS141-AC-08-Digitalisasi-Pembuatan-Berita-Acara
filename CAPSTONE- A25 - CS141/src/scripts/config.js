// API Configuration
export const API_ENDPOINT = 'http://localhost/CAPSTONE-A25-CS141/api';

// App Configuration
export const APP_CONFIG = {
    name: 'DigiBA',
    version: '1.0.0',
    itemsPerPage: 6,
    sessionTimeout: 3600000, // 1 hour in milliseconds
};

// Storage Keys
export const STORAGE_KEYS = {
    user: 'user',
    token: 'token',
    theme: 'theme',
};

// Routes
export const ROUTES = {
    login: '#/login',
    register: '#/register',
    vendor: {
        dashboard: '#/vendor/dashboard',
        tambahDokumen: '#/vendor/tambah-dokumen',
        dokumenSaya: '#/vendor/dokumen-saya',
        notifikasi: '#/vendor/notifikasi',
        profile: '#/vendor/profile',
    },
    picGudang: {
        dashboard: '#/pic-gudang/dashboard',
    },
    direksi: {
        dashboard: '#/direksi/dashboard',
    },
};

// Status
export const DOCUMENT_STATUS = {
    draft: 'draft',
    pending: 'pending',
    approved: 'disetujui',
    rejected: 'ditolak',
};

// Document Types
export const DOCUMENT_TYPES = {
    bapb: 'BAPB',
    bapp: 'BAPP',
};